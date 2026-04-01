import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import { X, Users } from 'lucide-react';

const ProposeSessionModal = ({ isOpen, onClose, onPropose, connectedUsers = [] }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedDate('');
      setSelectedTime('');
      setSelectedUserId(connectedUsers[0]?.id ? String(connectedUsers[0].id) : '');
    }
  }, [isOpen, connectedUsers]);

  const handleSubmit = () => {
    if (selectedUserId && selectedDate && selectedTime) {
      const proposedSlot = `${selectedDate}T${selectedTime}:00`;
      onPropose(Number(selectedUserId), [proposedSlot]);
      onClose();
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#374151] text-[#E5E7EB] text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-md p-6 relative shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-[#4B5563] hover:text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-[#E5E7EB] font-semibold text-base">Propose a Session</h2>
                <p className="text-[#6B7280] text-xs">Schedule a skill exchange session</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">With</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className={inputCls}
                  style={{ colorScheme: 'dark' }}
                >
                  {connectedUsers.length === 0 ? (
                    <option value="">No connections yet</option>
                  ) : (
                    connectedUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Time</label>
                <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedUserId || !selectedDate || !selectedTime || connectedUsers.length === 0}
                className="flex-1"
              >
                Propose Session
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProposeSessionModal;
