import React from 'react';

const ChatSidebar = ({ connections, activeConnection, setActiveConnection }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {connections.map(connection => (
          <div
            key={connection.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              activeConnection?.id === connection.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => setActiveConnection(connection)}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold uppercase mr-3">
                {connection.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{connection.name}</h3>
                <p className="text-sm text-gray-500">{connection.branch} • {connection.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
