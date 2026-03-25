import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageThread = ({ messages }) => {
  const { user } = useAuth();
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex mb-4 ${
            message.senderId === user.id ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-lg p-3 rounded-2xl ${
              message.senderId === user.id
                ? 'bg-indigo-100 text-gray-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.message}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageThread;
