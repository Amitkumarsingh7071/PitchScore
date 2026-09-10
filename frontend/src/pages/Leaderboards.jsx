import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';
import { Trophy } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const { topScorers, goldenGlove, topAssists, mostMotm, highestAvgRating, mostWins } = data || {};

  const tabs = [
    { id: 'scorers', label: 'Top Scorers', data: topScorers, keyName: 'Goals', keyVal: (p) => `${p.goals} Goals` },
    { id: 'glove', label: 'Goalkeepers', data: goldenGlove, keyName: 'Saves', keyVal: (p) => `${p.saves} Saves` },
    { id: 'assists', label: 'Top Assists', data: topAssists, keyName: 'Assists', keyVal: (p) => `${p.assists} Assists` },
    { id: 'motm', label: 'Most MOTM', data: mostMotm, keyName: 'MOTMs', keyVal: (p) => `${p.motmCount} MOTMs` },
    { id: 'rating', label: 'Highest Rating', data: highestAvgRating, keyName: 'Avg Rating', keyVal: (p) => `${p.averageRating} ⭐` },
    { id: 'wins', label: 'Most Wins', data: mostWins, keyName: 'Wins', keyVal: (p) => `${p.wins} Wins (${p.winPercentage}%)` },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Trophy className="text-amber-600" size={28} />
          <span>Group Leaderboards</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Automatically ranked player statistics calculated from all completed match events
        </p>
      </div>

      {/* Leaderboard Category Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Display */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-center">Matches Played</th>
                <th className="p-4 text-right font-bold text-emerald-700">{currentTab?.keyName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentTab?.data?.map((p, idx) => {
                const rank = idx + 1;

                return (
                  <tr key={p.player._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center font-bold">
                      {rank === 1 && <span className="text-base">🥇</span>}
                      {rank === 2 && <span className="text-base">🥈</span>}
                      {rank === 3 && <span className="text-base">🥉</span>}
                      {rank > 3 && <span className="text-slate-400 text-xs">#{rank}</span>}
                    </td>

                    <td className="p-4">
                      <Link to={`/players/${p.player._id}`} className="flex items-center space-x-3 group">
                        <img
                          src={p.player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
                          alt={p.player.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 group-hover:border-emerald-600 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm">
                            {p.player.name}
                          </div>
                          <div className="text-[10px] text-slate-400">#{p.player.jerseyNumber || 10}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="p-4 font-medium text-slate-500">{p.player.position}</td>
                    <td className="p-4 text-center font-semibold">{p.matchesPlayed}</td>
                    <td className="p-4 text-right font-bold text-amber-600 text-sm">
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
