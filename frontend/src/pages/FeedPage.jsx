import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { suggestionApi } from '../api/suggestionApi';
import SuggestionCard from '../components/feed/SuggestionCard';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Users } from 'lucide-react';

const CardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 animate-pulse">
    <div className="flex gap-3">
      <div className="h-12 w-12 rounded-xl bg-slate-800 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-800 rounded w-1/3" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-slate-800 rounded w-1/4" />
      <div className="flex gap-2"><div className="h-5 w-16 bg-slate-800 rounded" /><div className="h-5 w-20 bg-slate-800 rounded" /></div>
      <div className="h-3 bg-slate-800 rounded w-1/4 mt-2" />
      <div className="flex gap-2"><div className="h-5 w-14 bg-slate-800 rounded" /><div className="h-5 w-16 bg-slate-800 rounded" /></div>
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
    <div className="min-h-screen bg-slate-950 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold tracking-wide text-sm uppercase">Skill Matches</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {query ? `Results for "${query}"` : `Welcome, ${user?.name?.split(' ')[0]}`}
          </h1>
          <p className="text-slate-400 mt-2">
            {query ? `${filtered.length} peers found based on your search.` : 'Here are peers who can teach what you want to learn, and want what you teach.'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <SuggestionCard key={s.user.id} suggestion={s} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50"
          >
            <div className="h-16 w-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Users className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white">{query ? 'No results found' : 'No matches right now'}</h3>
            <p className="text-slate-400 mt-2 max-w-sm text-center">
              {query ? 'Try expanding your search terms.' : 'Update your profile to get more specific recommendations.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
