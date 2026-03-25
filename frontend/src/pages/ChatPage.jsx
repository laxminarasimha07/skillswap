import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { messageApi } from '../api/messageApi';
import { connectionApi } from '../api/connectionApi';
import { userApi } from '../api/userApi';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageThread from '../components/chat/MessageThread';
import MessageInput from '../components/chat/MessageInput';
import Spinner from '../components/shared/Spinner';

const ChatPage = () => {
  const { user } = useAuth();
  const stompClient = useWebSocket();
  const [connections, setConnections] = useState([]); // This would be fetched from a connection API
  const [activeConnection, setActiveConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionApi.getConnections();
        // Only get ACCEPTED connections to avoid unconnected members
        const acceptedConnections = data.filter((conn) => conn.status === 'ACCEPTED');
        
        const peers = acceptedConnections.map((conn) => {
          const isSender = conn.senderId !== user?.id;
          const peerId = isSender ? conn.senderId : conn.receiverId;
          return { connectionId: conn.id, peerId, status: conn.status };
        });

        // Get unique peer IDs to avoid duplicates
        const uniquePeerIds = [...new Set(peers.map((p) => p.peerId))];
        const peerUsers = await Promise.all(
          uniquePeerIds.map((id) => userApi.getUserById(id).catch(() => null))
        );

        const userById = Object.fromEntries(
          uniquePeerIds.map((id, idx) => [id, peerUsers[idx]])
        );

        // Map to final connections with unique IDs
        const mapped = uniquePeerIds.map((peerId) => ({
          id: peerId,
          name: userById[peerId]?.name || `User #${peerId}`,
          branch: userById[peerId]?.branch || '',
          year: userById[peerId]?.year || '',
          status: 'ACCEPTED',
        }));

        setConnections(mapped);
      } catch (error) {
        console.error('Failed to load connections:', error);
      }
    };

    if (user) fetchConnections();
  }, [user]);

  useEffect(() => {
    if (activeConnection) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const history = await messageApi.getChatHistory(activeConnection.id);
          setMessages(history);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    }
  }, [activeConnection]);

  useEffect(() => {
    if (stompClient && user) {
      const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        if (!activeConnection) return;

        const isForActiveThread =
          (newMessage.senderId === activeConnection.id && newMessage.receiverId === user.id) ||
          (newMessage.senderId === user.id && newMessage.receiverId === activeConnection.id);

        if (!isForActiveThread) return;

        setMessages((prevMessages) => {
          // If we previously added an optimistic temp message, replace it with the saved one.
          const idx = prevMessages.findIndex(
            (m) =>
              m.id?.toString().startsWith('temp-') &&
              m.senderId === newMessage.senderId &&
              m.receiverId === newMessage.receiverId &&
              m.message === newMessage.message
          );

          if (idx >= 0) {
            const copy = [...prevMessages];
            copy[idx] = newMessage;
            return copy;
          }

          // De-dupe exact same DB message id.
          if (prevMessages.some((m) => m.id === newMessage.id)) return prevMessages;

          return [...prevMessages, newMessage];
        });
      });

      return () => subscription.unsubscribe();
    }
  }, [stompClient, user, activeConnection]);

  const handleSendMessage = (message) => {
    if (stompClient && stompClient.connected && activeConnection) {
      const chatMessage = {
        receiverId: activeConnection.id,
        message,
      };
      stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
      // Optimistic UI: show immediately, then replace when server echoes persisted MessageDTO.
      const tempId = `temp-${Date.now()}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...chatMessage, senderId: user.id, id: tempId },
      ]);
      return true;
    }
    return false;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      <ChatSidebar 
        connections={connections} 
        activeConnection={activeConnection} 
        setActiveConnection={setActiveConnection} 
      />
      <div className="flex-1 flex flex-col">
        {activeConnection ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{activeConnection.name}</h2>
            </div>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <MessageThread messages={messages} />
            )}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
            Select a connection to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
