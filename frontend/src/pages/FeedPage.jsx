import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { suggestionApi } from '../api/suggestionApi';
import SuggestionCard from '../components/feed/SuggestionCard';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';

// Skeleton card that matches SuggestionCard layout
const SkeletonCard = () => (
  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <div className="h-11 w-11 rounded-xl bg-[#1F2937]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-[#1F2937] rounded-full w-2/3" />
        <div className="h-3 bg-[#1F2937] rounded-full w-1/3" />
      </div>
      <div className="h-6 w-10 bg-[#1F2937] rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="h-2.5 bg-[#1F2937] rounded-full w-1/4" />
        <div className="flex gap-1.5">
          <div className="h-5 w-14 bg-[#1F2937] rounded-full" />
          <div className="h-5 w-16 bg-[#1F2937] rounded-full" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 bg-[#1F2937] rounded-full w-1/4" />
        <div className="flex gap-1.5">
          <div className="h-5 w-12 bg-[#1F2937] rounded-full" />
          <div className="h-5 w-14 bg-[#1F2937] rounded-full" />
        </div>
      </div>
    </div>
    <div className="mt-4 pt-3 border-t border-[#1F2937] flex justify-between">
      <div className="h-3 w-16 bg-[#1F2937] rounded-full" />
      <div className="h-6 w-20 bg-[#1F2937] rounded-xl" />
    </div>
  </div>
);

const FeedPage = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await suggestionApi.getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const filteredSuggestions = query.length === 0
    ? suggestions
    : suggestions.filter((s) => {
        const u = s.user;
        return (
          u.name?.toLowerCase().includes(query) ||
          u.skillsOffered?.some(sk => sk.toLowerCase().includes(query)) ||
          u.skillsWanted?.some(sk => sk.toLowerCase().includes(query))
        );
      });

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Skill Matches</span>
          </div>
          <h1 className="text-2xl font-bold text-[#E5E7EB] font-[Poppins]">
            {query ? (
              <>Results for <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">"{query}"</span></>
            ) : (
              <>
                Hey {user?.name?.split(' ')[0]} 👋,{' '}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  here's who you can learn from
                </span>
              </>
            )}
          </h1>
          {!query && (
            <p className="text-[#6B7280] text-sm mt-1">
              Matched based on your skills — connect to start exchanging
            </p>
          )}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredSuggestions.map((suggestion, index) => (
                <SuggestionCard key={suggestion.user.id} suggestion={suggestion} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-[#1F2937] rounded-2xl bg-[#111827]"
          >
            <div className="h-16 w-16 rounded-2xl bg-[#1F2937] flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-[#4B5563]" />
            </div>
            <h3 className="text-[#E5E7EB] font-semibold text-lg font-[Poppins]">No matches found</h3>
            <p className="text-[#6B7280] text-sm mt-2 max-w-xs mx-auto">
              {query ? `No results for "${query}". Try a different keyword.` : "Complete your profile with skills to get matched."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
