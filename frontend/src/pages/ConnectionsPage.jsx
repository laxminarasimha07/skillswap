import React, { useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import toast from 'react-hot-toast';
import { userApi } from '../api/userApi';
import { motion } from 'framer-motion';
import { Users, Clock, Check, X } from 'lucide-react';

const ConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peerById, setPeerById] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const connectionData = await connectionApi.getConnections();
      setConnections(connectionData);
      if (user) {
        const peerIds = [
          ...new Set(connectionData.map((c) => (c.senderId === user.id ? c.receiverId : c.senderId)).filter(Boolean)),
        ];
        const peers = await Promise.all(peerIds.map((id) => userApi.getUserById(id).catch(() => null)));
        setPeerById(Object.fromEntries(peerIds.map((id, idx) => [id, peers[idx]])));
      }
    } catch (error) {
      console.error('Error loading connections', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (connectionId) => {
    try {
      await connectionApi.acceptRequest(connectionId);
      toast.success('Request accepted');
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await connectionApi.rejectRequest(connectionId);
      toast.success('Request rejected');
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const connected = connections.filter(c => c.status === 'ACCEPTED').sort((a, b) => b.id - a.id);
  const history = connections.filter(c => c.status !== 'ACCEPTED').sort((a, b) => b.id - a.id);

  const gradients = [
    'from-purple-600 to-cyan-500',
    'from-cyan-500 to-emerald-500',
    'from-emerald-500 to-purple-600',
    'from-pink-500 to-purple-600',
  ];

  const renderItem = (connection, idx) => {
    const peerId = user && connection.senderId === user.id ? connection.receiverId : connection.senderId;
    const isIncomingPending = connection.status === 'PENDING' && user && connection.receiverId === user.id;
    const peer = peerById[peerId];
    const grad = gradients[peerId % gradients.length] || gradients[0];
    const initials = peer?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

    const statusColors = {
      ACCEPTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
      BLOCKED: 'bg-[#1F2937] text-[#6B7280] border-[#374151]',
    };

    return (
      <motion.li
        key={connection.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.05 }}
        className="flex items-center justify-between gap-3 bg-[#0D1320] border border-[#1F2937] rounded-xl p-4 hover:border-purple-500/20 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {initials}
          </div>
          <div>
            <p className="text-[#E5E7EB] text-sm font-medium">{peer?.name || `User #${peerId}`}</p>
            <p className="text-[#4B5563] text-xs">{peer?.branch ? `${peer.branch} · ${peer.year}` : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isIncomingPending ? (
            <>
              <Button size="sm" onClick={() => handleAccept(connection.id)}>
                <Check className="h-3.5 w-3.5" /> Accept
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleReject(connection.id)}>
                <X className="h-3.5 w-3.5" /> Reject
              </Button>
            </>
          ) : (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[connection.status] || statusColors.BLOCKED}`}>
              {connection.status}
            </span>
          )}
        </div>
      </motion.li>
    );
  };

  const SkeletonItem = () => (
    <div className="flex items-center gap-3 bg-[#0D1320] border border-[#1F2937] rounded-xl p-4 animate-pulse">
      <div className="h-9 w-9 rounded-xl bg-[#1F2937] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#1F2937] rounded-full w-1/3" />
        <div className="h-2.5 bg-[#1F2937] rounded-full w-1/4" />
      </div>
      <div className="h-6 w-16 bg-[#1F2937] rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Network</span>
          </div>
          <h1 className="text-2xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>My Connections</h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map(col => (
              <div key={col} className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-3">
                <div className="h-4 w-24 bg-[#1F2937] rounded-full animate-pulse mb-4" />
                {[0, 1, 2].map(i => <SkeletonItem key={i} />)}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connected */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <h2 className="text-[#E5E7EB] font-semibold text-sm">Connected</h2>
                <span className="ml-auto text-xs text-[#4B5563] bg-[#1F2937] px-2 py-0.5 rounded-full">{connected.length}</span>
              </div>
              {connected.length === 0 ? (
                <p className="text-[#4B5563] text-sm py-4 text-center">No active connections yet.</p>
              ) : (
                <ul className="space-y-2">{connected.map((c, i) => renderItem(c, i))}</ul>
              )}
            </div>

            {/* History */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                <h2 className="text-[#E5E7EB] font-semibold text-sm">History</h2>
                <span className="ml-auto text-xs text-[#4B5563] bg-[#1F2937] px-2 py-0.5 rounded-full">{history.length}</span>
              </div>
              {history.length === 0 ? (
                <p className="text-[#4B5563] text-sm py-4 text-center">No pending or past requests.</p>
              ) : (
                <ul className="space-y-2">{history.map((c, i) => renderItem(c, i))}</ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
