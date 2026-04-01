import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { messageApi } from '../api/messageApi';
import { connectionApi } from '../api/connectionApi';
import { userApi } from '../api/userApi';
import ChatSidebar from '../components/chat/ChatSidebar';
import MessageThread from '../components/chat/MessageThread';
import MessageInput from '../components/chat/MessageInput';
import { MessageSquareDashed } from 'lucide-react';

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
      }));
      setConnections(maps);
    });
  }, [user]);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    messageApi.getChatHistory(active.id)
      .then(setMessages)
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
    <div className="h-[calc(100vh-65px)] flex bg-slate-950 font-['Inter']">
      <ChatSidebar connections={connections} activeConnection={active} setActiveConnection={setActive} />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        {active ? (
          <>
            <div className="h-[73px] px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex flex-col justify-center shrink-0 z-10">
              <h2 className="text-lg font-bold font-['Poppins'] text-white tracking-tight">{active.name}</h2>
              <p className="text-xs font-medium text-slate-400">{active.branch}</p>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col z-10">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-emerald-500 animate-ping" />
                </div>
              ) : (
                <MessageThread messages={messages} />
              )}
            </div>
            
            <div className="z-10"><MessageInput onSendMessage={send} /></div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
            <div className="h-16 w-16 mb-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
              <MessageSquareDashed className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Select a conversation</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs">Connecting with your peers enables structured peer-to-peer knowledge transfer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
