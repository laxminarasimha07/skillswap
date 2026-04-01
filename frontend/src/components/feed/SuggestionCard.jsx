import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import SkillBadge from './SkillBadge';
import { Star } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import toast from 'react-hot-toast';

const SuggestionCard = ({ suggestion, index = 0 }) => {
  const { user, score } = suggestion;
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectionApi.sendRequest(user.id);
      setRequested(true);
      toast.success('Request sent');
    } catch {
      toast.error('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const matchPct = typeof score === 'number' ? Math.min(score, 100) : score;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-white border border-[#E5E5E5] rounded-[24px] overflow-hidden hover:border-[#111111] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
    >
      <div className="p-6 flex-1 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#111111] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold font-['Manrope'] text-[#111111] truncate">{user.name}</h3>
            <p className="text-sm text-[#666666] font-medium">{user.branch} · {user.year}</p>
          </div>
          {user.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-[#111111] fill-[#111111]" />
              <span className="text-sm font-bold text-[#111111]">{Number(user.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {user.about && (
          <p className="text-[15px] text-[#333333] line-clamp-2 leading-relaxed">{user.about}</p>
        )}

        {/* Skills Layout */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider mb-2 block">Teaching</span>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} />)}
              {user.skillsOffered?.length > 3 && <span className="text-xs text-[#666666] self-center ml-1">+{user.skillsOffered.length - 3}</span>}
            </div>
          </div>
          <div>
             <span className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider mb-2 block">Learning</span>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} />)}
              {user.skillsWanted?.length > 3 && <span className="text-xs text-[#666666] self-center ml-1">+{user.skillsWanted.length - 3}</span>}
            </div>
          </div>
        </div>

      </div>

      <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F9F9F9] flex items-center justify-between">
        <span className="text-sm font-bold text-[#111111]">{matchPct}% match</span>
        <Button size="sm" variant={requested ? 'outline' : 'primary'} onClick={handleConnect} isLoading={loading} disabled={requested}>
          {requested ? 'Sent' : 'Connect'}
        </Button>
      </div>
    </motion.article>
  );
};

export default SuggestionCard;
