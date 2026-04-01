import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const ok = onSendMessage(message);
      if (ok) setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#0D1320] border-t border-[#1F2937] flex items-center gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-[#E5E7EB] placeholder-[#4B5563] text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-purple-500/20"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
};

export default MessageInput;
