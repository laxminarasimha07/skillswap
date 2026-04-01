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
    <div className="h-[calc(100vh-81px)] flex bg-white font-['Inter']"> {/* Account for 80px sticky header */}
      <ChatSidebar connections={connections} activeConnection={active} setActiveConnection={setActive} />
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
        {active ? (
          <>
            <div className="h-20 px-8 border-b border-[#E5E5E5] flex flex-col justify-center shrink-0">
              <h2 className="text-xl font-bold font-['Manrope'] text-[#111111] tracking-tight">{active.name}</h2>
              <p className="text-[13px] font-medium text-[#666666]">{active.branch}</p>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-[#111111] animate-ping" />
              </div>
            ) : (
              <MessageThread messages={messages} />
            )}
            
            <MessageInput onSendMessage={send} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F9F9F9]">
            <div className="h-16 w-16 mb-6 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-[#111111]" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] font-['Manrope'] tracking-tight">Select a conversation</h3>
            <p className="text-sm font-medium text-[#666666] mt-2 max-w-xs">Connecting with your peers enables structured peer-to-peer knowledge transfer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
