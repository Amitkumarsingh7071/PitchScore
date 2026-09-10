import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';
import StatCard from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';
import { Trophy, Target, Award, Star, Users, PlusCircle, ArrowRight, ShieldCheck, KeyRound, Activity } from 'lucide-react';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await statsAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const { overall, recentMatches, leaderboardPreview } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Activity size={14} />
            <span>Private Football Match & Stats Platform</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Track Matches, Calculate Ratings & Build Player History
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Record raw turf match events. Share 6-digit match codes with friends, automatically derive match scores and player ratings, and maintain career leaderboards.
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/join"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs shadow-sm transition-colors flex items-center space-x-2"
            >
              <KeyRound size={16} />
              <span>Join Match with Code</span>
            </Link>

            <Link
              to="/create-match"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-lg text-xs border border-slate-200 transition-colors flex items-center space-x-2"
            >
              <PlusCircle size={16} className="text-emerald-600" />
              <span>Create New Match</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overall Group Metrics Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
          <ShieldCheck className="text-emerald-600" size={16} />
          <span>Overall Group Statistics</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Matches" value={overall?.totalMatches || 0} icon={Trophy} color="emerald" />
          <StatCard title="Active Players" value={overall?.totalPlayers || 0} icon={Users} color="blue" />
          <StatCard title="Total Goals" value={overall?.totalGoals || 0} icon={Target} color="rose" />
          <StatCard title="Total Assists" value={overall?.totalAssists || 0} icon={Award} color="purple" />
          <StatCard title="Total MOTMs" value={overall?.totalMotm || 0} icon={Star} color="amber" />
        </div>
      </section>

      {/* Recent Matches Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
            <Activity size={16} className="text-emerald-600" />
            <span>Recent Matches</span>
          </h2>
          <Link to="/history" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>View All Matches</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentMatches && recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <MatchCard key={match._id} match={match} isAdmin={isAdmin} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200 shadow-sm text-sm">
              No completed matches recorded yet. Click <strong>Create New Match</strong> above to host your first game!
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Preview Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
            <Trophy className="text-amber-600" size={16} />
            <span>Leaderboard Highlights</span>
          </h2>
          <Link to="/leaderboards" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
            <span>Full Leaderboards</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">⚽</div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Top Scorer</div>
              <div className="font-bold text-slate-900 text-sm truncate">{leaderboardPreview?.topScorer?.player?.name || 'N/A'}</div>
              <div className="text-xs text-emerald-600 font-semibold">{leaderboardPreview?.topScorer?.goals || 0} Goals</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">🎯</div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Top Assists</div>
              <div className="font-bold text-slate-900 text-sm truncate">{leaderboardPreview?.topAssists?.player?.name || 'N/A'}</div>
              <div className="text-xs text-blue-600 font-semibold">{leaderboardPreview?.topAssists?.assists || 0} Assists</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">🏆</div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Most MOTM</div>
              <div className="font-bold text-slate-900 text-sm truncate">{leaderboardPreview?.mostMotm?.player?.name || 'N/A'}</div>
              <div className="text-xs text-amber-600 font-semibold">{leaderboardPreview?.mostMotm?.motmCount || 0} MOTMs</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">⭐</div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Highest Rating</div>
              <div className="font-bold text-slate-900 text-sm truncate">{leaderboardPreview?.highestAvgRating?.player?.name || 'N/A'}</div>
              <div className="text-xs text-amber-600 font-semibold">{leaderboardPreview?.highestAvgRating?.averageRating || 0} Avg ⭐</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">✅</div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Most Wins</div>
              <div className="font-bold text-slate-900 text-sm truncate">{leaderboardPreview?.mostWins?.player?.name || 'N/A'}</div>
              <div className="text-xs text-emerald-600 font-semibold">{leaderboardPreview?.mostWins?.wins || 0} Wins</div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
