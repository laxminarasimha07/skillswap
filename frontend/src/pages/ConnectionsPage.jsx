import React, { useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { userApi } from '../api/userApi';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const ConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peerById, setPeerById] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await connectionApi.getConnections();
      setConnections(data);
      if (user) {
        const peerIds = [...new Set(data.map(c => c.senderId === user.id ? c.receiverId : c.senderId).filter(Boolean))];
        const peers = await Promise.all(peerIds.map(id => userApi.getUserById(id).catch(() => null)));
        setPeerById(Object.fromEntries(peerIds.map((id, i) => [id, peers[i]])));
      }
    } catch { toast.error('Failed to load network'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); fetchData(); }
    catch { toast.error('Action failed'); }
  };

  const connected = connections.filter(c => c.status === 'ACCEPTED').sort((a,b) => b.id - a.id);
  const history = connections.filter(c => c.status !== 'ACCEPTED').sort((a,b) => b.id - a.id);

  const renderItem = (conn, idx) => {
    const peerId = user && conn.senderId === user.id ? conn.receiverId : conn.senderId;
    const isIncoming = conn.status === 'PENDING' && user && conn.receiverId === user.id;
    const peer = peerById[peerId];
    const initials = peer?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

    return (
      <motion.div
        key={conn.id}
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
        className="flex items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="truncate">
            <p className="font-bold text-slate-100 truncate">{peer?.name || `Peer`}</p>
            {peer?.branch && <p className="text-xs text-slate-400 font-medium truncate">{peer.branch}</p>}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isIncoming ? (
            <>
              <Button size="sm" onClick={() => run(()=>connectionApi.acceptRequest(conn.id), 'Accepted')} className="px-3 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Accept</Button>
              <Button size="sm" variant="danger" onClick={() => run(()=>connectionApi.rejectRequest(conn.id), 'Declined')} className="px-3">Decline</Button>
            </>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-slate-800 border border-slate-700 text-slate-300">
              {conn.status}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
             <Users className="h-5 w-5 text-emerald-400" />
             <span className="text-emerald-400 font-semibold tracking-wide text-sm uppercase">Connections</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Network</h1>
          <p className="text-slate-400 mt-2">Manage the peers you exchange skills with.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
             <div className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
             <div className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-10">
            
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Active connections ({connected.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {connected.length === 0 ? (
                  <p className="text-sm text-slate-500 col-span-2">Your network is empty.</p>
                ) : connected.map((c,i) => renderItem(c,i))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-t border-slate-800 pt-8">
                Requests & History ({history.length})
              </h2>
              <div className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-500">No pending requests.</p>
                ) : history.map((c,i) => renderItem(c,i))}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
