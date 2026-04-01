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
import { Plus, Link2 } from 'lucide-react';

const SessionsPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const data = await sessionApi.getMySessions();
      setSessions(data);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handlePropose = async (user2Id, slots) => {
    try {
      const res = await sessionApi.proposeSession({ user2Id, proposedSlots: slots });
      setSessions(p => [res, ...p]);
      toast.success('Session proposed');
    } catch {
      toast.error('Failed to propose session');
    }
  };

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (!user) return;
    connectionApi.getConnections().then(conns => {
      const accepted = conns.filter(c => c.status === 'ACCEPTED');
      const pIds = [...new Set(accepted.map(c => c.senderId === user.id ? c.receiverId : c.senderId).filter(Boolean))];
      Promise.all(pIds.map(id => userApi.getUserById(id).catch(()=>null))).then(res => setConnectedUsers(res.filter(Boolean)));
    });
  }, [user]);

  const now = new Date();
  const visible = sessions.filter(s => {
    if (!s.endTime) return true;
    const end = new Date(s.endTime);
    return !isNaN(end) && end > now;
  }).sort((a,b) => b.id - a.id);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Sessions</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your upcoming skill exchanges</p>
          </div>
          <div className="flex gap-2">
            {!user?.googleConnected && (
              <Button variant="secondary" size="sm" onClick={async () => {
                const { data } = await axiosInstance.get('/oauth2/authorize-url');
                window.location.href = data.url;
              }}>
                <Link2 className="h-3.5 w-3.5" /> Sync Calendar
              </Button>
            )}
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Propose
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 border border-slate-800 border-dashed rounded-2xl">
            <p className="text-sm font-medium text-slate-300">No active sessions</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">You have no upcoming or proposed sessions.</p>
            <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(true)}>
              Propose session
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((s,i) => (
              <SessionCard key={s.id} session={s} onSessionUpdated={loadSessions} />
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
