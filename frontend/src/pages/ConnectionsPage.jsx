import React, { useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { userApi } from '../api/userApi';
import { motion } from 'framer-motion';
import { Check, X, Clock, Users } from 'lucide-react';

const AVATAR = ['bg-indigo-600','bg-violet-600','bg-blue-600','bg-emerald-600','bg-rose-600'];

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
    } catch {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const run = async (fn, msg) => {
    try { await fn(); toast.success(msg); fetchData(); }
    catch (e) { toast.error(e.response?.data?.message || 'Action failed'); }
  };

  const connected = connections.filter(c => c.status === 'ACCEPTED').sort((a,b) => b.id - a.id);
  const history = connections.filter(c => c.status !== 'ACCEPTED').sort((a,b) => b.id - a.id);

  const renderItem = (conn, idx) => {
    const peerId = user && conn.senderId === user.id ? conn.receiverId : conn.senderId;
    const isIncoming = conn.status === 'PENDING' && user && conn.receiverId === user.id;
    const peer = peerById[peerId];
    const initials = peer?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || '?';
    const avatar = AVATAR[peerId % AVATAR.length];

    const statusMap = {
      ACCEPTED: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
      PENDING:  'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
      REJECTED: 'bg-slate-800 text-slate-400 ring-1 ring-slate-700',
      BLOCKED:  'bg-slate-800 text-slate-500 ring-1 ring-slate-700',
    };

    return (
      <motion.div
        key={conn.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="flex items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg ${avatar} text-white flex items-center justify-center text-xs font-semibold shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{peer?.name || `User #${peerId}`}</p>
            {peer?.branch && <p className="text-xs text-slate-500 truncate">{peer.branch} • {peer.year}</p>}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isIncoming ? (
            <>
              <Button size="xs" variant="success" onClick={() => run(()=>connectionApi.acceptRequest(conn.id), 'Accepted')}>
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="xs" variant="ghost" onClick={() => run(()=>connectionApi.rejectRequest(conn.id), 'Rejected')}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold ${statusMap[conn.status]}`}>
              {conn.status}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Connections</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your network and requests</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
            <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Active */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-medium text-slate-200">Connected Peers</h2>
                <span className="ml-auto text-xs bg-slate-800 text-slate-400 px-2 rounded-full">{connected.length}</span>
              </div>
              <div className="space-y-2">
                {connected.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No active connections yet.</p>
                ) : connected.map((c,i) => renderItem(c,i))}
              </div>
            </div>

            {/* History */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <h2 className="text-sm font-medium text-slate-200">History & Pending</h2>
                <span className="ml-auto text-xs bg-slate-800 text-slate-400 px-2 rounded-full">{history.length}</span>
              </div>
              <div className="space-y-2">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No past or pending requests.</p>
                ) : history.map((c,i) => renderItem(c,i))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
