import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import SkillBadge from './SkillBadge';
import { UserPlus, Star } from 'lucide-react';
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
      toast.success('Connection request sent');
    } catch {
      toast.error('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const matchPct = typeof score === 'number' ? Math.min(score, 100) : score;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-xl hover:shadow-2xl"
    >
      <div className="p-5 flex-1 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0">
              {initials}
            </div>
            <div className="truncate">
              <h3 className="font-semibold text-slate-100 truncate flex items-center gap-2">
                {user.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium truncate">
                {user.branch} • Year {user.year}
              </p>
            </div>
          </div>
          {user.rating != null && (
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-md shrink-0">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-200">{Number(user.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {user.about && (
          <p className="text-[13px] text-slate-300 line-clamp-2 leading-relaxed">{user.about}</p>
        )}

        {/* Skills */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Can Teach</span>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsOffered?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} type="offer" />)}
              {user.skillsOffered?.length > 3 && <span className="text-[10px] text-slate-500 font-medium">+{user.skillsOffered.length - 3}</span>}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Wants to Learn</span>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} type="want" />)}
              {user.skillsWanted?.length > 3 && <span className="text-[10px] text-slate-500 font-medium">+{user.skillsWanted.length - 3}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-2 w-16 bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{ width: `${matchPct}%` }} />
          </div>
          <span className="text-[11px] font-bold text-emerald-400">{matchPct}% match</span>
        </div>
        
        <Button 
          size="sm" 
          variant={requested ? 'secondary' : 'primary'} 
          onClick={handleConnect} 
          isLoading={loading} 
          disabled={requested} 
          className="text-xs h-8 px-4 font-semibold"
        >
          {requested ? 'Request Sent' : <><UserPlus className="h-3.5 w-3.5" /> Connect</>}
        </Button>
      </div>
    </motion.article>
  );
};

export default SuggestionCard;
