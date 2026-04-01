import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import SkillBadge from './SkillBadge';
import { UserPlus, Check, Star } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import toast from 'react-hot-toast';

// Deterministic avatar color based on user id
const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-violet-600', 'bg-blue-600',
  'bg-emerald-600', 'bg-rose-600', 'bg-amber-600',
];

const SuggestionCard = ({ suggestion, index = 0 }) => {
  const { user, score } = suggestion;
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectionApi.sendRequest(user.id);
      setRequested(true);
      toast.success(`Request sent to ${user.name}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const avatar = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const matchPct = typeof score === 'number' ? Math.min(score, 100) : score;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-200"
    >
      <div className="p-4 flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-lg ${avatar} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-100 truncate leading-tight">{user.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{user.branch} · {user.year}</p>
          </div>
          {user.rating != null && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-slate-400">{Number(user.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* About */}
        {user.about && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{user.about}</p>
        )}

        {/* Skills */}
        <div className="space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Teaches</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsOffered?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} type="offered" />)}
              {user.skillsOffered?.length > 3 && (
                <span className="text-[10px] text-slate-600 self-center">+{user.skillsOffered.length - 3}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Learning</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted?.slice(0, 3).map(s => <SkillBadge key={s} skill={s} type="wanted" />)}
              {user.skillsWanted?.length > 3 && (
                <span className="text-[10px] text-slate-600 self-center">+{user.skillsWanted.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-14 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min(Number(matchPct) || 0, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{matchPct} match</span>
        </div>
        <Button
          size="xs"
          variant={requested ? 'secondary' : 'primary'}
          onClick={handleConnect}
          isLoading={loading}
          disabled={requested}
        >
          {requested ? <><Check className="h-3 w-3" />Sent</> : <><UserPlus className="h-3 w-3" />Connect</>}
        </Button>
      </div>
    </motion.article>
  );
};

export default SuggestionCard;
