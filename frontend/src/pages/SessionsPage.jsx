import React, { useState, useEffect } from 'react';
import Button from '../components/shared/Button';
import ProposeSessionModal from '../components/session/ProposeSessionModal';
import SessionCard from '../components/session/SessionCard';
import { sessionApi } from '../api/sessionApi';
import toast from 'react-hot-toast';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { Calendar, Plus, Link2 } from 'lucide-react';

const SessionsPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const sessionData = await sessionApi.getMySessions();
      setSessions(sessionData);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropose = async (user2Id, proposedSlots) => {
    try {
      const newSession = await sessionApi.proposeSession({ user2Id, proposedSlots });
      setSessions(prev => [newSession, ...prev]);
      toast.success('Session proposed!');
    } catch {
      toast.error('Failed to propose session.');
    }
  };

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    const loadConnected = async () => {
      try {
        if (!user) return;
        const conns = await connectionApi.getConnections();
        const accepted = conns.filter(c => c.status === 'ACCEPTED');
        const peerIds = [...new Set(accepted.map(c => c.senderId === user.id ? c.receiverId : c.senderId))].filter(Boolean);
        const peers = await Promise.all(peerIds.map(id => userApi.getUserById(id).catch(() => null)));
        setConnectedUsers(peers.filter(Boolean));
      } catch (e) {
        console.error('Failed to fetch connected users', e);
      }
    };
    loadConnected();
  }, [user]);

  const now = new Date();
  const visibleSessions = sessions
    .filter(session => {
      if (!session.endTime) return true;
      const end = new Date(session.endTime);
      return !Number.isNaN(end.valueOf()) && end > now;
    })
    .sort((a, b) => b.id - a.id);

  const SkeletonCard = () => (
    <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-[#1F2937]" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-[#1F2937] rounded-full w-1/3" />
          <div className="h-5 w-20 bg-[#1F2937] rounded-full" />
        </div>
      </div>
      <div className="h-px bg-[#1F2937] my-4" />
      <div className="flex justify-end gap-2">
        <div className="h-8 w-20 bg-[#1F2937] rounded-xl" />
        <div className="h-8 w-24 bg-[#1F2937] rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Schedule</span>
            </div>
            <h1 className="text-2xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>Sessions</h1>
          </div>

          <div className="flex items-center gap-3">
            {!user?.googleConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { data } = await axiosInstance.get('/oauth2/authorize-url');
                    window.location.href = data.url;
                  } catch {
                    toast.error('Failed to start Google authorization.');
                  }
                }}
              >
                <Link2 className="h-3.5 w-3.5" />
                Connect Google
              </Button>
            )}
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Propose Session
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : visibleSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-[#1F2937] rounded-2xl bg-[#111827]"
          >
            <div className="h-14 w-14 rounded-2xl bg-[#1F2937] flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-[#4B5563]" />
            </div>
            <h3 className="text-[#E5E7EB] font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>No upcoming sessions</h3>
            <p className="text-[#6B7280] text-sm mt-2">Propose a session with one of your connections to get started.</p>
            <Button className="mt-6" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Propose Session
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {visibleSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
              >
                <SessionCard session={session} onSessionUpdated={loadSessions} />
              </motion.div>
            ))}
          </div>
        )}

        <ProposeSessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPropose={handlePropose}
          connectedUsers={connectedUsers}
        />
      </div>
    </div>
  );
};

export default SessionsPage;
