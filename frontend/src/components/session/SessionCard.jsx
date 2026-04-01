import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const STATUS = {
  PROPOSED:  { label: 'Proposed',  cls: 'bg-[#F9F9F9] border-[#E5E5E5] text-[#111111]' },
  CONFIRMED: { label: 'Confirmed', cls: 'bg-[#111111] border-[#111111] text-white' },
  COMPLETED: { label: 'Completed', cls: 'bg-green-100 border-green-200 text-green-800' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-50 border-red-100 text-red-600' },
};

const fmt = (d) => {
  if (!d) return '';
  const m = d.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (m) return `${m[1]} · ${m[2]}`;
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const SessionCard = ({ session, onSessionUpdated }) => {
  const { user } = useAuth();
  const { id, user1, user2, startTime, endTime, meetLink, status, proposedSlots } = session;
  const [loading, setLoading] = useState(false);

  const run = async (fn, msg) => {
    setLoading(true);
    try { await fn(); toast.success(msg); onSessionUpdated?.(); }
    catch { toast.error('Action failed'); }
    finally { setLoading(false); }
  };

  if (endTime && new Date(endTime) < new Date() && status === 'COMPLETED') return null;

  const peer = user?.id === user1?.id ? user2 : user1;
  const initials = peer?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const s = STATUS[status] || STATUS.PROPOSED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-[#E5E5E5] rounded-[24px] p-6 hover:border-[#111111] transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[#111111] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold font-['Manrope'] text-[#111111]">{peer?.name || 'Peer'}</h3>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${s.cls}`}>
                {s.label}
              </span>
            </div>
            
            {status === 'PROPOSED' && proposedSlots?.length > 0 && (
              <div className="mt-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-4">
                <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-wider mb-2">Requested Times</p>
                <div className="space-y-1">
                  {proposedSlots.map((slot, i) => (
                    <p key={i} className="text-[13px] font-medium text-[#111111]">{fmt(slot.startTime)} → {fmt(slot.endTime)}</p>
                  ))}
                </div>
              </div>
            )}

            {status !== 'PROPOSED' && (startTime || endTime) && (
              <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[#666666]">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#111111]" />{fmt(startTime)}</span>
                {endTime && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#111111]" />{fmt(endTime)}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex sm:flex-col justify-end items-end gap-2 pt-4 sm:pt-0 border-t border-[#E5E5E5] sm:border-0 w-full sm:w-auto">
          {status === 'PROPOSED' && user?.id === user2?.id && (
            <>
              <Button variant="primary" size="sm" onClick={() => run(() => sessionApi.confirmSession(id, 0), 'Confirmed')} disabled={loading} className="w-full sm:w-auto">
                <Check className="h-4 w-4" /> Accept
              </Button>
              <Button variant="outline" size="sm" onClick={() => run(() => sessionApi.cancelSession(id), 'Rejected')} disabled={loading} className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:border-red-200">
                Decline
              </Button>
            </>
          )}
          {status === 'PROPOSED' && user?.id === user1?.id && (
            <Button variant="outline" size="sm" onClick={() => run(() => sessionApi.cancelSession(id), 'Cancelled')} disabled={loading} className="w-full sm:w-auto">
              Retract Request
            </Button>
          )}
          {status === 'CONFIRMED' && (
            <>
              <a
                href={meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-semibold rounded-full bg-[#111111] text-white hover:bg-[#333333] transition-colors"
              >
                <Video className="h-4 w-4" /> Join Video
              </a>
              <Button variant="ghost" size="sm" onClick={() => run(() => sessionApi.cancelSession(id), 'Cancelled')} disabled={loading} className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50">
                Cancel Session
              </Button>
            </>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default SessionCard;
