import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../services/api';
import StatCard from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';
import { Trophy, Target, Award, Star, Users, PlusCircle, Flame, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { overall, recentMatches, leaderboardPreview } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-[#0c1427] to-slate-950 border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            <Flame size={14} />
            <span>Private Turf Match Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            FOOTBALL <span className="text-emerald-400">MEMORY FC</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed font-medium">
            Record raw turf match events. Share Match Codes with friends to join room lineups, automatically calculate player ratings & Man of the Match, and preserve career stats forever!
          </p>
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/join"
              className="bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 transition flex items-center space-x-2 uppercase tracking-wider"
            >
              <KeyRound size={18} />
              <span>Join Match with Code</span>
            </Link>

            <Link
              to="/create-match"
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl text-sm border border-slate-700 transition flex items-center space-x-2 uppercase tracking-wider"
            >
              <PlusCircle size={18} className="text-emerald-400" />
              <span>Create New Match</span>
            </Link>
          </div>
        </div>

        {/* Ambient Turf Grass Graphic */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Overall Group Metrics Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <span>Overall Group Turf Statistics</span>
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <span className="text-xl">⚽</span>
            <span>Recent Turf Matches</span>
          </h2>
          <Link to="/history" className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 uppercase tracking-wider">
            <span>View All Matches</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMatches && recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <MatchCard key={match._id} match={match} isAdmin={isAdmin} />
            ))
          ) : (
            <div className="col-span-full bg-slate-900/50 rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
              No completed turf matches found yet. Create a match to begin!
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard Preview Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Trophy className="text-amber-400" size={20} />
            <span>Leaderboard Preview</span>
          </h2>
          <Link to="/leaderboards" className="text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 uppercase tracking-wider">
            <span>Full Leaderboards</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="text-2xl">⚽</div>
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Top Scorer</div>
              <div className="font-black text-white text-sm truncate">{leaderboardPreview?.topScorer?.player?.name || 'N/A'}</div>
              <div className="text-xs text-emerald-400 font-extrabold">{leaderboardPreview?.topScorer?.goals || 0} Goals</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Top Assists</div>
              <div className="font-black text-white text-sm truncate">{leaderboardPreview?.topAssists?.player?.name || 'N/A'}</div>
              <div className="text-xs text-teal-400 font-extrabold">{leaderboardPreview?.topAssists?.assists || 0} Assists</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Most MOTM</div>
              <div className="font-black text-white text-sm truncate">{leaderboardPreview?.mostMotm?.player?.name || 'N/A'}</div>
              <div className="text-xs text-amber-400 font-extrabold">{leaderboardPreview?.mostMotm?.motmCount || 0} MOTMs</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="text-2xl">⭐</div>
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Highest Rating</div>
              <div className="font-black text-white text-sm truncate">{leaderboardPreview?.highestAvgRating?.player?.name || 'N/A'}</div>
              <div className="text-xs text-amber-400 font-extrabold">{leaderboardPreview?.highestAvgRating?.averageRating || 0} Avg ⭐</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-[10px] uppercase font-black text-slate-400">Most Wins</div>
              <div className="font-black text-white text-sm truncate">{leaderboardPreview?.mostWins?.player?.name || 'N/A'}</div>
              <div className="text-xs text-emerald-400 font-extrabold">{leaderboardPreview?.mostWins?.wins || 0} Wins</div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
