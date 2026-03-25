import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { suggestionApi } from '../api/suggestionApi';
import SuggestionCard from '../components/feed/SuggestionCard';
import Spinner from '../components/shared/Spinner';
import { useSearchParams } from 'react-router-dom';

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
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const filteredSuggestions =
    query.length === 0
      ? suggestions
      : suggestions.filter((s) => {
          const u = s.user;
          const nameMatch = u.name?.toLowerCase().includes(query);
          const offeredMatch = u.skillsOffered?.some((sk) => sk.toLowerCase().includes(query));
          const wantedMatch = u.skillsWanted?.some((sk) => sk.toLowerCase().includes(query));
          return nameMatch || offeredMatch || wantedMatch;
        });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Your Suggestions {query ? <span className="text-sm font-normal text-gray-500">for “{query}”</span> : null}
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center mt-16">
          <Spinner size="lg" />
        </div>
      ) : filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSuggestions.map(suggestion => (
            <SuggestionCard key={suggestion.user.id} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800">No Suggestions Yet</h3>
          <p className="text-gray-500 mt-2">
            {query ? 'No matches found in your suggestions list.' : "We couldn't find any suggestions for you right now. Check back later!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
