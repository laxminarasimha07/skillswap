import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [msg, setMsg] = useState('');

  const send = (e) => {
    e?.preventDefault();
    if (!msg.trim()) return;
    if (onSendMessage(msg)) setMsg('');
  };

  return (
    <form
      onSubmit={send}
      className="px-8 py-6 border-t border-[#E5E5E5] bg-white flex gap-3"
    >
      <input
        type="text"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        placeholder="Type a message..."
        className="flex-1 h-12 px-5 text-[15px] font-medium bg-[#F9F9F9] border border-[#E5E5E5] rounded-full text-[#111111] placeholder-[#A3A3A3] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all"
      />
      <button
        type="submit"
        disabled={!msg.trim()}
        className="h-12 w-12 rounded-full bg-[#111111] flex items-center justify-center text-white hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
      >
        <Send className="h-5 w-5 ml-0.5" />
      </button>
    </form>
  );
};

export default MessageInput;
