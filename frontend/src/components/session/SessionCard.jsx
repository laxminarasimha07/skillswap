import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi';
import toast from 'react-hot-toast';

const SessionCard = ({ session, onSessionUpdated }) => {
  const { id, user1, user2, startTime, endTime, meetLink, status, proposedSlots } = session;
  const [isLoading, setIsLoading] = useState(false);

  const statusStyles = {
    PROPOSED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };

  // Format time in IST (Indian Standard Time)
  const formatLocalDateTime = (dateString) => {
    if (!dateString) return '';

    // If already in an ISO-like format, preserve local input
    const localMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:?\d{2})?/);
    if (localMatch) {
      const [_, datePart, timePart] = localMatch;
      return `${datePart} ${timePart}`;
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.valueOf())) return dateString;

    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLocalDate = (dateString) => {
    if (!dateString) return '';

    const localMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})T/);
    if (localMatch) return localMatch[1];

    const date = new Date(dateString);
    if (Number.isNaN(date.valueOf())) return dateString;

    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if session is in the past
  const isPast = new Date(endTime) < new Date();

  // Handle accept session
  const handleAccept = async (slotIndex) => {
    setIsLoading(true);
    try {
      await sessionApi.confirmSession(id, slotIndex);
      toast.success('Session accepted successfully!');
      if (onSessionUpdated) onSessionUpdated();
    } catch (error) {
      toast.error('Failed to accept session.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject session
  const handleReject = async () => {
    setIsLoading(true);
    try {
      await sessionApi.cancelSession(id);
      toast.success('Session rejected.');
      if (onSessionUpdated) onSessionUpdated();
    } catch (error) {
      toast.error('Failed to reject session.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel session
  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await sessionApi.cancelSession(id);
      toast.success('Session cancelled.');
      if (onSessionUpdated) onSessionUpdated();
    } catch (error) {
      toast.error('Failed to cancel session.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show past sessions
  if (isPast && status === 'COMPLETED') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Session with {user2.name}</h3>
          <p className={`text-sm font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-block mt-2 ${statusStyles[status]}`}>
            {status}
          </p>
        </div>
        <div className="flex -space-x-2">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase border-2 border-white">
            {user1.name[0]}
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold uppercase border-2 border-white">
            {user2.name[0]}
          </div>
        </div>
      </div>

      {status === 'PROPOSED' && proposedSlots && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">Proposed Time Slots:</p>
          {proposedSlots.map((slot, idx) => (
            <div key={idx} className="text-sm text-blue-800 mb-1">
              {formatLocalDateTime(slot.startTime)} - {formatLocalDateTime(slot.endTime)}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 text-sm text-gray-600">
        {status !== 'PROPOSED' && (
          <>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatLocalDate(startTime)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatLocalDateTime(startTime)} IST - {formatLocalDateTime(endTime)} IST</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end space-x-3 flex-wrap gap-3">
        {status === 'PROPOSED' && (
          <>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleReject()}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1"/>Reject
            </Button>
            <Button 
              size="sm"
              onClick={() => handleAccept(0)}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 mr-1"/>Accept
            </Button>
          </>
        )}
        {status === 'CONFIRMED' && (
          <>
            <Button as="a" href={meetLink} target="_blank" size="sm">
              <Video className="h-4 w-4 mr-1"/>Join Meet
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCancel()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        )}
        {status === 'COMPLETED' && (
          <Button variant="outline" size="sm">Rate Session</Button>
        )}
      </div>
    </motion.div>
  );
};

export default SessionCard;
