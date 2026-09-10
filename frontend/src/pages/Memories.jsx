import React, { useEffect, useState } from 'react';
import { matchAPI } from '../services/api';
import MemoryCard from '../components/MemoryCard';
import { Heart } from 'lucide-react';

export default function Memories() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await matchAPI.getAll();
        const memoryMatches = res.data.filter(m => m.memory && m.memory.summary);
        setMatches(memoryMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Heart className="text-rose-600 fill-current" size={28} />
          <span>Match Memories</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Preserving every match as a long-term football memory with photos, best moments, and funny stories
        </p>
      </div>

      {/* Memories Feed */}
      <div className="space-y-6">
        {matches.length > 0 ? (
          matches.map((m) => (
            <MemoryCard key={m._id} match={m} />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm text-sm">
            No match stories saved yet. Complete a match to archive its memory!
          </div>
        )}
      </div>

    </div>
  );
}
