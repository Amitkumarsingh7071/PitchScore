import React, { useEffect, useState } from 'react';
import { matchAPI } from '../services/api';
import MemoryCard from '../components/MemoryCard';
import { Heart, Sparkles } from 'lucide-react';

export default function Memories() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await matchAPI.getAll();
        // Filter matches that have a memory summary
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Heart className="text-rose-500 fill-current" size={32} />
          <span>Football Memories</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Preserving every match as a long-term football memory with photos, best moments, and funny stories
        </p>
      </div>

      {/* Memories Feed */}
      <div className="space-y-8">
        {matches.length > 0 ? (
          matches.map((m) => (
            <MemoryCard key={m._id} match={m} />
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
            No football memories archived yet. Finish a match to add a memory!
          </div>
        )}
      </div>

    </div>
  );
}
