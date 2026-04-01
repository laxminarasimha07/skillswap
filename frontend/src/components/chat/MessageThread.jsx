import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageThread = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-xs text-slate-600">No messages yet. Say hello!</p>
        </div>
      )}
      {messages.map(msg => {
        const mine = msg.senderId === user.id;
        return (
          <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                mine
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm'
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
