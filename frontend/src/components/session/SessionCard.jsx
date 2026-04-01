import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const STATUS = {
  PROPOSED:  { label: 'Proposed',  cls: 'text-amber-400  bg-amber-400/8  ring-amber-400/20' },
  CONFIRMED: { label: 'Confirmed', cls: 'text-emerald-400 bg-emerald-400/8 ring-emerald-400/20' },
  COMPLETED: { label: 'Completed', cls: 'text-blue-400   bg-blue-400/8   ring-blue-400/20' },
  CANCELLED: { label: 'Cancelled', cls: 'text-red-400    bg-red-400/8    ring-red-400/20' },
};

const AVATAR = ['bg-indigo-600','bg-violet-600','bg-blue-600','bg-emerald-600','bg-rose-600'];

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
  const avatarCls = AVATAR[(peer?.id || 0) % AVATAR.length];
  const s = STATUS[status] || STATUS.PROPOSED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-lg ${avatarCls} flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-100 truncate">
              Session with {peer?.name || 'Unknown'}
            </h3>
            <span className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ${s.cls}`}>
              {s.label}
            </span>
          </div>

          {status === 'PROPOSED' && proposedSlots?.length > 0 && (
            <div className="mt-2 p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Proposed slots</p>
              {proposedSlots.map((slot, i) => (
                <p key={i} className="text-xs text-slate-300">{fmt(slot.startTime)} → {fmt(slot.endTime)}</p>
              ))}
            </div>
          )}

          {status !== 'PROPOSED' && (startTime || endTime) && (
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(startTime)}</span>
              {endTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmt(endTime)}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {(status === 'PROPOSED' || status === 'CONFIRMED') && (
        <div className="mt-3 flex justify-end gap-2 pt-3 border-t border-slate-800">
          {status === 'PROPOSED' && user?.id === user2?.id && (
            <>
              <Button variant="ghost" size="xs" onClick={() => run(() => sessionApi.cancelSession(id), 'Rejected')} disabled={loading}>
                <X className="h-3 w-3" /> Reject
              </Button>
              <Button variant="success" size="xs" onClick={() => run(() => sessionApi.confirmSession(id, 0), 'Session confirmed!')} disabled={loading}>
                <Check className="h-3 w-3" /> Accept
              </Button>
            </>
          )}
          {status === 'PROPOSED' && user?.id === user1?.id && (
            <Button variant="ghost" size="xs" onClick={() => run(() => sessionApi.cancelSession(id), 'Cancelled')} disabled={loading}>
              Cancel request
            </Button>
          )}
          {status === 'CONFIRMED' && (
            <>
              <Button variant="ghost" size="xs" onClick={() => run(() => sessionApi.cancelSession(id), 'Cancelled')} disabled={loading}>
                Cancel
              </Button>
              <a
                href={meetLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                <Video className="h-3 w-3" /> Join Meet
              </a>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SessionCard;
