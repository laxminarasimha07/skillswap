import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import SkillBadge from './SkillBadge';
import { Star, UserPlus, Check } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import toast from 'react-hot-toast';

const SuggestionCard = ({ suggestion, index = 0 }) => {
  const { user, score } = suggestion;
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectionApi.sendRequest(user.id);
      setIsRequested(true);
      toast.success(`Request sent to ${user.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const gradients = [
    'from-purple-600 to-cyan-500',
    'from-cyan-500 to-emerald-500',
    'from-emerald-500 to-purple-600',
    'from-pink-500 to-purple-600',
    'from-orange-500 to-pink-500',
  ];
  const grad = gradients[user.id % gradients.length] || gradients[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(139,92,246,0.15)' }}
      className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden flex flex-col cursor-default transition-all duration-300 hover:border-purple-500/30"
    >
      {/* Card body */}
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-[#E5E7EB] font-semibold text-sm leading-tight truncate">{user.name}</h3>
              <p className="text-[#6B7280] text-xs mt-0.5">{user.branch} · {user.year}</p>
              {user.about && (
                <p className="text-[#6B7280] text-xs mt-1 line-clamp-1">{user.about}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-full shrink-0">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">{user.rating?.toFixed(1)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <div>
            <p className="text-[#4B5563] text-xs font-medium uppercase tracking-wider mb-1.5">Offers</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsOffered?.slice(0, 3).map(skill => (
                <SkillBadge key={skill} skill={skill} type="offered" />
              ))}
              {user.skillsOffered?.length > 3 && (
                <span className="text-[#4B5563] text-xs self-center">+{user.skillsOffered.length - 3}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[#4B5563] text-xs font-medium uppercase tracking-wider mb-1.5">Wants</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted?.slice(0, 3).map(skill => (
                <SkillBadge key={skill} skill={skill} type="wanted" />
              ))}
              {user.skillsWanted?.length > 3 && (
                <span className="text-[#4B5563] text-xs self-center">+{user.skillsWanted.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-[#1F2937] flex items-center justify-between bg-[#0F1724]">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[#6B7280] text-xs">Match </span>
          <span className="text-emerald-400 text-xs font-bold">{score}</span>
        </div>
        <Button
          size="sm"
          onClick={handleConnect}
          isLoading={isLoading}
          disabled={isRequested}
          variant={isRequested ? 'secondary' : 'primary'}
          className={isRequested ? 'text-xs' : 'text-xs'}
        >
          {isRequested ? (
            <><Check className="h-3 w-3" /> Requested</>
          ) : (
            <><UserPlus className="h-3 w-3" /> Connect</>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
