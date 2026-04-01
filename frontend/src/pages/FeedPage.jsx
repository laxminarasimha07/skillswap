import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { suggestionApi } from '../api/suggestionApi';
import SuggestionCard from '../components/feed/SuggestionCard';
import { useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';

const CardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-3 bg-slate-800 rounded w-2/3" />
        <div className="h-2.5 bg-slate-800 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-slate-800 rounded w-1/4" />
      <div className="flex gap-1.5">
        <div className="h-5 w-12 bg-slate-800 rounded-md" />
        <div className="h-5 w-16 bg-slate-800 rounded-md" />
        <div className="h-5 w-10 bg-slate-800 rounded-md" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-slate-800 rounded w-1/4" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-slate-800 rounded-md" />
        <div className="h-5 w-10 bg-slate-800 rounded-md" />
      </div>
    </div>
    <div className="pt-2 border-t border-slate-800 flex justify-between">
      <div className="h-3 w-20 bg-slate-800 rounded" />
      <div className="h-6 w-16 bg-slate-800 rounded-lg" />
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
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
            {query ? `Results for "${query}"` : 'Discover'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {query
              ? `${filtered.length} student${filtered.length !== 1 ? 's' : ''} matched`
              : `Skill matches personalized for you, ${user?.name?.split(' ')[0]}`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <SuggestionCard key={s.user.id} suggestion={s} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              {query ? 'No matches found' : 'No suggestions yet'}
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              {query ? `Try a different search term.` : 'Update your skills in your profile to see personalized matches.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
