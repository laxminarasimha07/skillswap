import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import { X } from 'lucide-react';

const inputCls = 'w-full h-9 px-3 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Propose a session</h2>
                <p className="text-xs text-slate-500 mt-0.5">Schedule a skill exchange</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">With</label>
                <select
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className={inputCls}
                  style={{ colorScheme: 'dark' }}
                >
                  {connectedUsers.length === 0
                    ? <option value="">No connections yet</option>
                    : connectedUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                  }
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                onClick={submit}
                disabled={!userId || !date || !time || connectedUsers.length === 0}
                className="flex-1"
              >
                Propose
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposeSessionModal;
