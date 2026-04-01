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
import { Plus, Link2, Calendar } from 'lucide-react';

const SessionsPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try { setSessions(await sessionApi.getMySessions()); }
    catch { toast.error('Failed to load sessions'); }
    finally { setLoading(false); }
  };

  const handlePropose = async (user2Id, slots) => {
    try {
      const res = await sessionApi.proposeSession({ user2Id, proposedSlots: slots });
      setSessions(p => [res, ...p]);
      toast.success('Session proposed');
    } catch { toast.error('Failed to propose session'); }
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
    <div className="min-h-screen bg-slate-950 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold tracking-wide text-sm uppercase">Schedule</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Sessions</h1>
            <p className="text-slate-400 mt-2">Manage upcoming learning sessions and requests.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!user?.googleConnected && (
              <Button variant="outline" onClick={async () => {
                const { data } = await axiosInstance.get('/oauth2/authorize-url');
                window.location.href = data.url;
              }} className="bg-slate-900 border-slate-700">
                <Link2 className="h-4 w-4 text-emerald-400" /> Sync Calendar
              </Button>
            )}
            <Button onClick={() => setIsModalOpen(true)} className="shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Plus className="h-4 w-4" /> Book Session
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-slate-900/50 border border-dashed border-slate-700">
            <Calendar className="h-10 w-10 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Your calendar is clear</h3>
            <p className="text-slate-400 mt-2 mb-6 max-w-sm mx-auto">You have no upcoming or proposed sessions. Connect with peers to start learning.</p>
            <Button onClick={() => setIsModalOpen(true)}>Propose a time</Button>
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
