import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageThread = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm font-medium text-[#A3A3A3]">Start the conversation</p>
        </div>
      )}
      {messages.map(msg => {
        const mine = msg.senderId === user.id;
        return (
          <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] px-5 py-3 rounded-[24px] text-[15px] leading-relaxed font-medium ${
                mine
                  ? 'bg-[#111111] text-white rounded-br-sm'
                  : 'bg-[#F2F2F2] text-[#111111] rounded-bl-sm border border-[#E5E5E5]'
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageThread;
