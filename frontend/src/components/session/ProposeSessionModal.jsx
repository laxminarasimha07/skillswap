import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import { X } from 'lucide-react';

const inputCls = 'w-full px-4 py-3 rounded-2xl border border-[#E5E5E5] bg-white text-[#111111] placeholder-[#A3A3A3] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all duration-200 text-sm';

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-full max-w-sm bg-white border border-[#E5E5E5] rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-['Manrope'] text-[#111111]">Set a time</h2>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-[#666666] hover:text-[#111111] hover:bg-[#F9F9F9] rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#666666] mb-1.5">Learning partner</label>
                <select
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {connectedUsers.length === 0
                    ? <option value="">No connections yet</option>
                    : connectedUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)
                  }
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#666666] mb-1.5">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#666666] mb-1.5">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={submit}
                disabled={!userId || !date || !time || connectedUsers.length === 0}
                className="w-full h-12 text-base"
              >
                Send Request
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposeSessionModal;
