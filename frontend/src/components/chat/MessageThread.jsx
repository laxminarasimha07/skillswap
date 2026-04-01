import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageThread = ({ messages }) => {
  const { user } = useAuth();
  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-5 overflow-y-auto space-y-3">
      {messages.map(message => {
        const isMine = message.senderId === user.id;
        return (
          <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMine
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-br-sm'
                  : 'bg-[#1F2937] text-[#E5E7EB] rounded-bl-sm'
              }`}
            >
              {message.message}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default MessageThread;
