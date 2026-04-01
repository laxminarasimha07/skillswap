import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { suggestionApi } from '../api/suggestionApi';
import SuggestionCard from '../components/feed/SuggestionCard';
import { useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';

const CardSkeleton = () => (
  <div className="bg-white border border-[#E5E5E5] rounded-[24px] p-6 space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-[#E5E5E5] shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-[#E5E5E5] rounded-full w-2/3" />
        <div className="h-3 bg-[#E5E5E5] rounded-full w-1/3" />
      </div>
    </div>
    <div className="space-y-4 pt-4 border-t border-[#F2F2F2]">
      <div className="h-3 bg-[#E5E5E5] rounded-full w-1/4" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-[#F2F2F2] rounded-full" />
        <div className="h-6 w-20 bg-[#F2F2F2] rounded-full" />
      </div>
    </div>
  </div>
);

const FeedPage = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  useEffect(() => {
    suggestionApi.getSuggestions()
      .then(setSuggestions)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? suggestions.filter(s =>
        s.user.name?.toLowerCase().includes(query) ||
        s.user.skillsOffered?.some(sk => sk.toLowerCase().includes(query)) ||
        s.user.skillsWanted?.some(sk => sk.toLowerCase().includes(query))
      )
    : suggestions;

  return (
    <div className="min-h-screen bg-white pt-10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-['Manrope'] text-[#111111] tracking-tight">
            {query ? `Discovering "${query}"` : 'Your Network.'}
          </h1>
          <p className="text-lg text-[#666666] mt-3">
            {query
              ? `${filtered.length} matching peers found`
              : `Handpicked skill matches for ${user?.name?.split(' ')[0]}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <SuggestionCard key={s.user.id} suggestion={s} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-[#E5E5E5] rounded-[32px] bg-[#F9F9F9]"
          >
            <div className="h-16 w-16 mb-6 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center">
              <Users className="h-6 w-6 text-[#111111]" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] font-['Manrope'] tracking-tight">
              {query ? 'No results found' : 'No matches yet'}
            </h3>
            <p className="text-[#666666] mt-2 mb-6 max-w-sm text-center">
              {query ? 'Try a different search term or check back later.' : 'Update your profile skills to get better peer recommendations.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
