import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageThread = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
           <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-full shadow-lg">
             <p className="text-sm font-semibold text-slate-400">Say hello to your match ✨</p>
           </div>
        </div>
      )}
      {messages.map((msg, i) => {
        const mine = msg.senderId === user.id;
        const prevMsg = i > 0 ? messages[i - 1] : null;
        const sameAsPrev = prevMsg && prevMsg.senderId === msg.senderId;
        
        return (
          <div key={msg.id || i} className={`flex ${mine ? 'justify-end' : 'justify-start'} ${sameAsPrev ? 'mt-1' : 'mt-4'}`}>
            <div
              className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                mine
                  ? `bg-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.15)] text-white ${sameAsPrev ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tr-sm'}`
                  : `bg-slate-800 border border-slate-700/50 text-slate-200 ${sameAsPrev ? 'rounded-2xl rounded-tl-md' : 'rounded-2xl rounded-tl-sm'}`
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} className="h-2" />
    </div>
  );
};

export default MessageThread;
