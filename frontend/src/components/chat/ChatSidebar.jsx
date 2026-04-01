import React from 'react';

const ChatSidebar = ({ connections, activeConnection, setActiveConnection }) => {
  return (
    <div className="w-80 shrink-0 flex flex-col border-r border-[#E5E5E5] bg-[#F9F9F9] h-full">
      <div className="px-6 py-6 border-b border-[#E5E5E5]">
        <h2 className="text-2xl font-bold font-['Manrope'] tracking-tight text-[#111111]">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {connections.length === 0 ? (
          <div className="px-4 py-8 text-[#666666] text-sm text-center">No active chats</div>
        ) : connections.map(conn => {
          const active = activeConnection?.id === conn.id;
          const initials = conn.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <button
              key={conn.id}
              onClick={() => setActiveConnection(conn)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-[16px] text-left transition-all duration-200 ${
                active ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E5E5E5]' : 'hover:bg-[#F2F2F2] border border-transparent'
              }`}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${active ? 'bg-[#111111] text-white' : 'bg-[#E5E5E5] text-[#111111]'}`}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111111] truncate">{conn.name}</p>
                <p className="text-xs text-[#666666] truncate">{conn.branch}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
