import React from 'react';

const ChatSidebar = ({ connections, activeConnection, setActiveConnection }) => {
  const COLORS = ['bg-indigo-600','bg-violet-600','bg-blue-600','bg-emerald-600','bg-rose-600'];

  return (
    <div className="w-64 shrink-0 flex flex-col border-r border-slate-800 bg-slate-950">
      <div className="px-4 py-3.5 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-100">Messages</h2>
        <p className="text-xs text-slate-500 mt-0.5">{connections.length} conversation{connections.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {connections.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-slate-600">No connections yet</p>
          </div>
        ) : connections.map(conn => {
          const active = activeConnection?.id === conn.id;
          const initials = conn.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
          const color = COLORS[conn.id % COLORS.length];
          return (
            <button
              key={conn.id}
              onClick={() => setActiveConnection(conn)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                active ? 'bg-indigo-500/10' : 'hover:bg-slate-900'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${active ? 'text-indigo-300' : 'text-slate-300'}`}>{conn.name}</p>
                <p className="text-xs text-slate-600 truncate">{conn.branch}{conn.year ? ` · ${conn.year}` : ''}</p>
              </div>
              {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
