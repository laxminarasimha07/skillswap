import React from 'react';

const ChatSidebar = ({ connections, activeConnection, setActiveConnection }) => {
  return (
    <div className="w-72 shrink-0 bg-[#0D1320] border-r border-[#1F2937] flex flex-col">
      <div className="p-4 border-b border-[#1F2937]">
        <h2 className="text-base font-semibold text-[#E5E7EB]">Messages</h2>
        <p className="text-xs text-[#4B5563] mt-0.5">{connections.length} connection{connections.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {connections.length === 0 ? (
          <div className="p-6 text-center text-[#4B5563] text-sm">No connections yet</div>
        ) : (
          connections.map(connection => {
            const isActive = activeConnection?.id === connection.id;
            const initials = connection.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={connection.id}
                onClick={() => setActiveConnection(connection)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-150 border-l-2 ${
                  isActive
                    ? 'bg-purple-600/10 border-l-purple-500'
                    : 'border-l-transparent hover:bg-[#111827]'
                }`}
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-[#E5E7EB]'}`}>
                    {connection.name}
                  </p>
                  <p className="text-xs text-[#4B5563] truncate">{connection.branch} · {connection.year}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
