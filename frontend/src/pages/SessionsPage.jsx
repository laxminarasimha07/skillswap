import React, { useState } from 'react';
import Button from '../components/shared/Button';
import ProposeSessionModal from '../components/session/ProposeSessionModal';
import SessionCard from '../components/session/SessionCard';
import { sessionApi } from '../api/sessionApi';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { connectionApi } from '../api/connectionApi';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import axiosInstance from '../api/axiosInstance';

const SessionsPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const handlePropose = async (user2Id, proposedSlots) => {
    try {
      const proposal = { user2Id, proposedSlots };
      const newSession = await sessionApi.proposeSession(proposal);
      setSessions(prev => [...prev, newSession]);
      toast.success('Session proposed successfully!');
    } catch (error) {
      toast.error('Failed to propose session.');
    }
  };

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionData = await sessionApi.getMySessions();
        setSessions(sessionData);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    const loadConnected = async () => {
      try {
        if (!user) return;
        const conns = await connectionApi.getConnections();
        const accepted = conns.filter((c) => c.status === 'ACCEPTED');
        const peerIds = [
          ...new Set(accepted.map((c) => (c.senderId === user.id ? c.receiverId : c.senderId))),
        ].filter(Boolean);
        const peers = await Promise.all(peerIds.map((id) => userApi.getUserById(id).catch(() => null)));
        setConnectedUsers(peers.filter(Boolean));
      } catch (e) {
        console.error('Failed to fetch connected users', e);
      }
    };
    loadConnected();
  }, [user]);

  const now = new Date();
  const visibleSessions = sessions.filter((session) => {
    if (!session.endTime) return true;
    const end = new Date(session.endTime);
    return !Number.isNaN(end.valueOf()) && end > now;
  }).sort((a, b) => b.id - a.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scheduled Sessions</h1>
        <div className="flex items-center gap-3">
          {!user?.googleConnected && <Button
            variant="outline"
            onClick={async () => {
              try {
                const { data } = await axiosInstance.get('/oauth2/authorize-url');
                // Redirect directly to Google Auth in the main window
                window.location.href = data.url;
              } catch (e) {
                toast.error('Failed to start Google authorization. Please login again.');
              }
            }}
          >
             Connect Google Calendar
          </Button>}
          <Button onClick={() => setIsModalOpen(true)}>Propose Session</Button>
        </div>
      </div>

      <div className="space-y-6">
        {visibleSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming sessions. Propose one to get started!</p>
          </div>
        ) : (
          visibleSessions.map(session => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onSessionUpdated={() => {
                const loadSessions = async () => {
                  try {
                    const sessionData = await sessionApi.getMySessions();
                    setSessions(sessionData);
                  } catch (error) {
                    console.error('Failed to fetch sessions', error);
                  }
                };
                loadSessions();
              }}
            />
          ))
        )}
      </div>

      <ProposeSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPropose={handlePropose} 
        connectedUsers={connectedUsers}
      />
    </div>
  );
};

export default SessionsPage;
