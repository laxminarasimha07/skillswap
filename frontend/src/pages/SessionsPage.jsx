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
    <div className="min-h-screen bg-white pt-10">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-['Manrope'] text-[#111111] tracking-tight">Schedule</h1>
            <p className="text-lg text-[#666666] mt-2">Coordinate your skill exchanges</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!user?.googleConnected && (
              <Button variant="secondary" onClick={async () => {
                const { data } = await axiosInstance.get('/oauth2/authorize-url');
                window.location.href = data.url;
              }}>
                <Link2 className="h-4 w-4" /> Calendar Sync
              </Button>
            )}
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" /> Book Session
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 rounded-[24px] bg-[#F9F9F9] animate-pulse" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-32 rounded-[32px] bg-[#F9F9F9] border border-[#E5E5E5] border-dashed">
            <h3 className="text-xl font-bold text-[#111111] font-['Manrope'] tracking-tight">Your calendar is empty</h3>
            <p className="text-[#666666] mt-2 mb-8 max-w-sm mx-auto">You have no upcoming or proposed sessions. Connect with peers to start learning.</p>
            <Button onClick={() => setIsModalOpen(true)}>Book your first session</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((s) => (
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
