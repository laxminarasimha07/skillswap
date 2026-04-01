import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { messageApi } from '../api/messageApi';
import { connectionApi } from '../api/connectionApi';
import { userApi } from '../api/userApi';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageThread from '../components/chat/MessageThread';
import MessageInput from '../components/chat/MessageInput';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const { user } = useAuth();
  const stompClient = useWebSocket();
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await connectionApi.getConnections();
        const acceptedConnections = data.filter(conn => conn.status === 'ACCEPTED');
        const peers = acceptedConnections.map(conn => {
          const isSender = conn.senderId !== user?.id;
          const peerId = isSender ? conn.senderId : conn.receiverId;
          return { connectionId: conn.id, peerId, status: conn.status };
        });
        const uniquePeerIds = [...new Set(peers.map(p => p.peerId))];
        const peerUsers = await Promise.all(uniquePeerIds.map(id => userApi.getUserById(id).catch(() => null)));
        const userById = Object.fromEntries(uniquePeerIds.map((id, idx) => [id, peerUsers[idx]]));
        const mapped = uniquePeerIds.map(peerId => ({
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
          console.error('Failed to fetch chat history:', error);
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
        setMessages(prev => {
          const idx = prev.findIndex(m =>
            m.id?.toString().startsWith('temp-') &&
            m.senderId === newMessage.senderId &&
            m.receiverId === newMessage.receiverId &&
            m.message === newMessage.message
          );
          if (idx >= 0) { const copy = [...prev]; copy[idx] = newMessage; return copy; }
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      });
      return () => subscription.unsubscribe();
    }
  }, [stompClient, user, activeConnection]);

  const handleSendMessage = (message) => {
    if (stompClient && stompClient.connected && activeConnection) {
      const chatMessage = { receiverId: activeConnection.id, message };
      stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(chatMessage) });
      const tempId = `temp-${Date.now()}`;
      setMessages(prev => [...prev, { ...chatMessage, senderId: user.id, id: tempId }]);
      return true;
    }
    return false;
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-[#0B0F19]">
      <ChatSidebar
        connections={connections}
        activeConnection={activeConnection}
        setActiveConnection={setActiveConnection}
      />
      <div className="flex-1 flex flex-col bg-[#0B0F19]">
        {activeConnection ? (
          <>
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-[#1F2937] bg-[#0D1320] flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {activeConnection.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-[#E5E7EB] text-sm font-semibold">{activeConnection.name}</h2>
                <p className="text-[#4B5563] text-xs">{activeConnection.branch} · {activeConnection.year}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
              </div>
            ) : (
              <MessageThread messages={messages} />
            )}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-purple-400" />
            </div>
            <div>
              <h3 className="text-[#E5E7EB] font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>No chat selected</h3>
              <p className="text-[#4B5563] text-sm mt-1">Pick a connection from the sidebar to start chatting</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
