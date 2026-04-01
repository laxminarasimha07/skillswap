import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import { X, Calendar as CalIcon } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 text-sm';

const ProposeSessionModal = ({ isOpen, onClose, onPropose, connectedUsers = [] }) => {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDate(''); setTime('');
      setUserId(connectedUsers[0]?.id ? String(connectedUsers[0].id) : '');
    }
  }, [isOpen, connectedUsers]);

  const submit = () => {
    if (userId && date && time) {
      onPropose(Number(userId), [`${date}T${time}:00`]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <CalIcon className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Propose Session</h2>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Partner</label>
                <select value={userId} onChange={e => setUserId(e.target.value)} className={inputCls}>
                  {connectedUsers.length === 0
                    ? <option value="">No connections yet</option>
                    : connectedUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                  }
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose} className="hover:bg-slate-800">Cancel</Button>
              <Button onClick={submit} disabled={!userId || !date || !time || connectedUsers.length===0} className="px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Send Invite
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposeSessionModal;
