import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const STATUS = {
  PROPOSED:  { label: 'Proposed',  cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  COMPLETED: { label: 'Completed', cls: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
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
  const initials = peer?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const s = STATUS[status] || STATUS.PROPOSED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-100">{peer?.name || 'Peer'}</h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.cls}`}>
                {s.label}
              </span>
            </div>

            {status === 'PROPOSED' && proposedSlots?.length > 0 && (
              <div className="mt-3 bg-slate-950/50 border border-slate-800 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Requested Times</p>
                <div className="space-y-1">
                  {proposedSlots.map((slot, i) => (
                    <p key={i} className="text-xs font-medium text-slate-300 flex items-center gap-1.5 before:h-1 before:w-1 before:bg-amber-400 before:rounded-full">
                      {fmt(slot.startTime)} → {fmt(slot.endTime)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {status !== 'PROPOSED' && (startTime || endTime) && (
              <div className="mt-3 flex items-center gap-4 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-emerald-400" />{fmt(startTime)}</span>
                {endTime && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-cyan-400" />{fmt(endTime)}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex sm:flex-col justify-end items-end gap-2 pt-4 sm:pt-0 border-t border-slate-800 sm:border-0 w-full sm:w-auto">
          {status === 'PROPOSED' && user?.id === user2?.id && (
            <>
              <Button size="sm" onClick={() => run(()=>sessionApi.confirmSession(id,0),'Confirmed')} disabled={loading} className="w-full sm:w-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Check className="h-4 w-4" /> Accept
              </Button>
              <Button variant="danger" size="sm" onClick={() => run(()=>sessionApi.cancelSession(id),'Rejected')} disabled={loading} className="w-full sm:w-auto">
                <X className="h-4 w-4" /> Decline
              </Button>
            </>
          )}
          {status === 'PROPOSED' && user?.id === user1?.id && (
            <Button variant="danger" size="sm" onClick={() => run(()=>sessionApi.cancelSession(id),'Cancelled')} disabled={loading} className="w-full sm:w-auto">
              Retract
            </Button>
          )}
          {status === 'CONFIRMED' && (
            <>
              <a
                href={meetLink} target="_blank" rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
              >
                <Video className="h-4 w-4" /> Join Video
              </a>
              <Button variant="danger" size="sm" onClick={() => run(()=>sessionApi.cancelSession(id),'Cancelled')} disabled={loading} className="w-full sm:w-auto bg-transparent border-transparent">
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;
