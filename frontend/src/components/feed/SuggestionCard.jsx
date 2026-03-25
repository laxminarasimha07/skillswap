import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import SkillBadge from './SkillBadge';
import { User, Star, Plus, Check } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import toast from 'react-hot-toast';

const SuggestionCard = ({ suggestion }) => {
  const { user, score } = suggestion;
  const [isLoading, setIsLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectionApi.sendRequest(user.id);
      setIsRequested(true);
      toast.success(`Connection request sent to ${user.name}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col"
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div
              className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold uppercase mr-4"
              title={user.about || ''}
            >
              {user.name[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.branch} • {user.year}</p>
              {user.about ? (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {user.about}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
            <Star className="h-4 w-4" />
            <span className="font-bold text-sm">{user.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Offers:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.slice(0, 3).map(skill => <SkillBadge key={skill} skill={skill} type="offered" />)}
              {user.skillsOffered.length > 3 && <span className="text-xs text-gray-400 self-center">+{user.skillsOffered.length - 3} more</span>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Wants:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 3).map(skill => <SkillBadge key={skill} skill={skill} type="wanted" />)}
              {user.skillsWanted.length > 3 && <span className="text-xs text-gray-400 self-center">+{user.skillsWanted.length - 3} more</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/70 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-semibold">Match Score: <span className="text-indigo-600 font-bold text-sm">{score}</span></p>
        <Button 
          size="sm"
          onClick={handleConnect}
          isLoading={isLoading}
          disabled={isRequested}
          variant={isRequested ? 'secondary' : 'primary'}
        >
          {isRequested ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
          {isRequested ? 'Requested' : 'Connect'}
        </Button>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
