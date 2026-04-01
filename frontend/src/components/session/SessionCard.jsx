import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const statusConfig = {
  PROPOSED:  { label: 'Proposed',  cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  CONFIRMED: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const fmt = (dateString) => {
  if (!dateString) return '';
  const m = dateString.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (m) return `${m[1]} ${m[2]}`;
  const d = new Date(dateString);
  if (Number.isNaN(d.valueOf())) return dateString;
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fmtDate = (dateString) => {
  if (!dateString) return '';
  const m = dateString.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (m) return m[1];
  const d = new Date(dateString);
  if (Number.isNaN(d.valueOf())) return dateString;
  return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric' });
};

const SessionCard = ({ session, onSessionUpdated }) => {
  const { user } = useAuth();
  const { id, user1, user2, startTime, endTime, meetLink, status, proposedSlots } = session;
  const [isLoading, setIsLoading] = useState(false);

  const isPast = endTime && new Date(endTime) < new Date();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await sessionApi.confirmSession(id, 0);
      toast.success('Session confirmed!');
      if (onSessionUpdated) onSessionUpdated();
    } catch { toast.error('Failed to confirm session.'); }
    finally { setIsLoading(false); }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await sessionApi.cancelSession(id);
      toast.success('Session rejected.');
      if (onSessionUpdated) onSessionUpdated();
    } catch { toast.error('Failed to reject session.'); }
    finally { setIsLoading(false); }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await sessionApi.cancelSession(id);
      toast.success('Session cancelled.');
      if (onSessionUpdated) onSessionUpdated();
    } catch { toast.error('Failed to cancel session.'); }
    finally { setIsLoading(false); }
  };

  if (isPast && status === 'COMPLETED') return null;

  const cfg = statusConfig[status] || statusConfig.PROPOSED;
  const peer = user?.id === user1?.id ? user2 : user1;
  const peerInitials = peer?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 hover:border-purple-500/20 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {peerInitials}
          </div>
          <div>
            <h3 className="text-[#E5E7EB] font-semibold text-sm">Session with {peer?.name}</h3>
            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
              {cfg.label}
            </span>
          </div>
        </div>
      </div>

      {status === 'PROPOSED' && proposedSlots && (
        <div className="mb-4 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
          <p className="text-xs font-semibold text-blue-400 mb-1.5 uppercase tracking-wider">Proposed Slots</p>
          {proposedSlots.map((slot, idx) => (
            <div key={idx} className="text-xs text-[#9CA3AF]">
              {fmt(slot.startTime)} — {fmt(slot.endTime)}
            </div>
          ))}
        </div>
      )}

      {status !== 'PROPOSED' && startTime && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Calendar className="h-3.5 w-3.5 text-[#4B5563]" />
            <span>{fmtDate(startTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Clock className="h-3.5 w-3.5 text-[#4B5563]" />
            <span>{fmt(startTime)} — {fmt(endTime)} IST</span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-[#1F2937] flex-wrap">
        {status === 'PROPOSED' && user?.id === user2?.id && (
          <>
            <Button variant="secondary" size="sm" onClick={handleReject} disabled={isLoading}>
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
            <Button size="sm" onClick={handleAccept} disabled={isLoading}>
              <Check className="h-3.5 w-3.5" /> Accept
            </Button>
          </>
        )}
        {status === 'PROPOSED' && user?.id === user1?.id && (
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
            Cancel Request
          </Button>
        )}
        {status === 'CONFIRMED' && (
          <>
            <a
              href={meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
            >
              <Video className="h-3.5 w-3.5" /> Join Meet
            </a>
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
          </>
        )}
        {status === 'COMPLETED' && (
          <Button variant="ghost" size="sm">Rate Session</Button>
        )}
      </div>
    </motion.div>
  );
};

export default SessionCard;
