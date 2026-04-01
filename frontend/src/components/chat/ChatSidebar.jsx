import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatSidebar = ({ connections, activeConnection, setActiveConnection }) => {
  return (
    <div className="w-80 shrink-0 flex flex-col border-r border-slate-800/60 bg-slate-900/40 h-full backdrop-blur-md">
      <div className="px-6 py-[22px] border-b border-slate-800/60 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-emerald-400" />
        <h2 className="text-xl font-bold font-['Poppins'] text-slate-100 tracking-tight">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {connections.length === 0 ? (
          <div className="px-4 py-8 text-slate-500 text-sm text-center">No active chats</div>
        ) : connections.map(conn => {
          const active = activeConnection?.id === conn.id;
          const initials = conn.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
          return (
            <button
              key={conn.id}
              onClick={() => setActiveConnection(conn)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                active 
                   ? 'bg-slate-800 border border-slate-700/50 shadow-md' 
                   : 'hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className={`h-11 w-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-sm ${
                active 
                  ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white' 
                  : 'bg-slate-800 border border-slate-700 text-slate-300'
              }`}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${active ? 'text-white' : 'text-slate-300'}`}>{conn.name}</p>
                <p className={`text-[11px] truncate mt-0.5 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{conn.branch}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
