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
      className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm flex gap-3"
    >
      <input
        type="text"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        placeholder="Type your message..."
        className="flex-1 h-12 px-5 text-sm bg-slate-800 border-none rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!msg.trim()}
        className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-emerald-500/20"
      >
        <Send className="h-5 w-5 ml-1" />
      </button>
    </form>
  );
};

export default MessageInput;
