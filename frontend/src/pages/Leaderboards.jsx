import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';
import { Trophy, Target, Award, Star, CheckCircle, Flame, Shield } from 'lucide-react';

export default function Leaderboards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scorers');

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const res = await statsAPI.getLeaderboards();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { topScorers, goldenGlove, topAssists, mostMotm, highestAvgRating, mostWins } = data || {};

  const tabs = [
    { id: 'scorers', label: '⚽ Golden Boot', data: topScorers, keyName: 'Goals', keyVal: (p) => `${p.goals} Goals` },
    { id: 'glove', label: '🧤 Golden Glove', data: goldenGlove, keyName: 'Saves', keyVal: (p) => `${p.saves} Saves` },
    { id: 'assists', label: '🎯 Master Playmaker', data: topAssists, keyName: 'Assists', keyVal: (p) => `${p.assists} Assists` },
    { id: 'motm', label: '🏆 Turf MVP', data: mostMotm, keyName: 'MOTMs', keyVal: (p) => `${p.motmCount} MOTMs` },
    { id: 'rating', label: '⭐ Highest Rating', data: highestAvgRating, keyName: 'Avg Rating', keyVal: (p) => `${p.averageRating} ⭐` },
    { id: 'wins', label: '✅ Most Turf Wins', data: mostWins, keyName: 'Wins', keyVal: (p) => `${p.wins} Wins (${p.winPercentage}%)` },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 font-['Plus_Jakarta_Sans']">
          <Trophy className="text-amber-400" size={32} />
          <span>FootHeroes Turf Leaderboards</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Automatically ranked player statistics calculated from all completed turf match events
        </p>
      </div>

      {/* Leaderboard Category Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Display */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 uppercase text-[10px] font-black text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-center">Matches Played</th>
                <th className="p-4 text-right font-black text-emerald-400">{currentTab?.keyName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentTab?.data?.map((p, idx) => {
                const rank = idx + 1;

                return (
                  <tr key={p.player._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 text-center font-black">
                      {rank === 1 && <span className="text-xl">🥇</span>}
                      {rank === 2 && <span className="text-xl">🥈</span>}
                      {rank === 3 && <span className="text-xl">🥉</span>}
                      {rank > 3 && <span className="text-slate-500 text-xs">#{rank}</span>}
                    </td>

                    <td className="p-4">
                      <Link to={`/players/${p.player._id}`} className="flex items-center space-x-3 group">
                        <img
                          src={p.player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
                          alt={p.player.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-500 transition"
                        />
                        <div>
                          <div className="font-black text-white group-hover:text-emerald-400 transition text-sm">
                            {p.player.name}
                          </div>
                          <div className="text-[10px] text-slate-400">#{p.player.jerseyNumber || 10}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="p-4 font-semibold text-slate-400">{p.player.position}</td>
                    <td className="p-4 text-center font-bold">{p.matchesPlayed}</td>
                    <td className="p-4 text-right font-black text-amber-400 text-base">
                      {currentTab.keyVal(p)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
