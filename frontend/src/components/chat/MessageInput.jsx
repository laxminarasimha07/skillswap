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
      className="flex items-center gap-2 px-4 py-3 border-t border-slate-800 bg-slate-950"
    >
      <input
        type="text"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        placeholder="Message…"
        className="flex-1 h-9 px-3.5 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
      <button
        type="submit"
        disabled={!msg.trim()}
        className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </form>
  );
};

export default MessageInput;
