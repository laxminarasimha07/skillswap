import React, { useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { userApi } from '../api/userApi';
import { motion } from 'framer-motion';

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
      toast.error('Failed to load network');
    } finally {
      setLoading(false);
    }
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
    const initials = peer?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || '?';

    return (
      <motion.div
        key={conn.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="flex items-center justify-between gap-4 p-5 bg-white border border-[#E5E5E5] rounded-[24px] hover:border-[#111111] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold font-['Manrope'] text-[#111111] truncate">{peer?.name || `Peer`}</p>
            {peer?.branch && <p className="text-sm text-[#666666] font-medium truncate">{peer.branch}</p>}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isIncoming ? (
            <>
              <Button size="sm" onClick={() => run(()=>connectionApi.acceptRequest(conn.id), 'Accepted')}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => run(()=>connectionApi.rejectRequest(conn.id), 'Declined')}>Decline</Button>
            </>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold bg-[#F9F9F9] border border-[#E5E5E5] text-[#111111]">
              {conn.status}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-12">
        
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-['Manrope'] text-[#111111] tracking-tight">Network</h1>
          <p className="text-lg text-[#666666] mt-2">Peers you're learning alongside</p>
        </div>

        {loading ? (
          <div className="space-y-4">
             <div className="h-24 bg-[#F9F9F9] rounded-[24px] animate-pulse" />
             <div className="h-24 bg-[#F9F9F9] rounded-[24px] animate-pulse" />
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Active section */}
            <section>
              <h2 className="text-sm font-bold text-[#A3A3A3] uppercase tracking-wider mb-6 pb-2 border-b border-[#E5E5E5]">
                Active connections ({connected.length})
              </h2>
              <div className="space-y-4">
                {connected.length === 0 ? (
                  <p className="text-[#666666]">Your network is empty.</p>
                ) : connected.map((c,i) => renderItem(c,i))}
              </div>
            </section>

            {/* Pending & History */}
            <section>
              <h2 className="text-sm font-bold text-[#A3A3A3] uppercase tracking-wider mb-6 pb-2 border-b border-[#E5E5E5]">
                Requests & History ({history.length})
              </h2>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-[#666666]">No pending requests.</p>
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
