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

const ChatPage = () => {
  const { user } = useAuth();
  const stomp = useWebSocket();
  const [connections, setConnections] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    connectionApi.getConnections().then(async data => {
      const acc = data.filter(c => c.status === 'ACCEPTED');
      const peerIds = [...new Set(acc.map(c => c.senderId === user.id ? c.receiverId : c.senderId))];
      const peers = await Promise.all(peerIds.map(id => userApi.getUserById(id).catch(()=>null)));
      const maps = peerIds.map((id,i) => ({
        id,
        name: peers[i]?.name || `User #${id}`,
        branch: peers[i]?.branch || '',
        year: peers[i]?.year || ''
      }));
      setConnections(maps);
    });
  }, [user]);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    messageApi.getChatHistory(active.id)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [active]);

  useEffect(() => {
    if (!stomp || !user || !active) return;
    const sub = stomp.subscribe('/user/queue/messages', (msg) => {
      const data = JSON.parse(msg.body);
      const isCurrent = (data.senderId === active.id && data.receiverId === user.id) ||
                        (data.senderId === user.id && data.receiverId === active.id);
      if (!isCurrent) return;

      setMessages(p => {
        const i = p.findIndex(m => m.id?.toString().startsWith('temp-') && m.message === data.message);
        if (i >= 0) { const c = [...p]; c[i] = data; return c; }
        if (p.some(m => m.id === data.id)) return p;
        return [...p, data];
      });
    });
    return () => sub.unsubscribe();
  }, [stomp, user, active]);

  const send = (text) => {
    if (!stomp?.connected || !active) return false;
    const msg = { receiverId: active.id, message: text };
    stomp.publish({ destination: '/app/chat.send', body: JSON.stringify(msg) });
    setMessages(p => [...p, { ...msg, senderId: user.id, id: `temp-${Date.now()}` }]);
    return true;
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex bg-slate-950">
      <ChatSidebar
        connections={connections}
        activeConnection={active}
        setActiveConnection={setActive}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {active ? (
          <>
            {/* Header */}
            <div className="h-14 px-5 border-b border-slate-800 flex items-center shrink-0">
              <div>
                <h2 className="text-sm font-medium text-slate-200">{active.name}</h2>
                {active.branch && <p className="text-xs text-slate-500">{active.branch} • {active.year}</p>}
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            ) : (
              <MessageThread messages={messages} />
            )}
            
            <MessageInput onSendMessage={send} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-12 w-12 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5 text-slate-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-300">Your Messages</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Select a conversation from the sidebar or start a new one to chat with your peers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
