import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerAPI } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  Trophy, 
  Target, 
  Award, 
  Star, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  MinusCircle,
  ArrowLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';

export default function PlayerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await playerAPI.getById(id);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        Player profile not found.
      </div>
    );
  }

  const { player, careerStats, matchHistory, performanceTrend } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back Link */}
      <Link to="/players" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-emerald-400">
        <ArrowLeft size={16} />
        <span>Back to Players</span>
      </Link>

      {/* Profile Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
              alt={player.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-500/40 shadow-2xl"
            />
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-black font-black text-sm px-2 py-0.5 rounded-lg shadow">
              #{player.jerseyNumber || 10}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white">{player.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                {player.position}
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                {careerStats.matchesPlayed} Matches Played
              </span>
            </div>
            {player.bio && (
              <p className="text-xs text-slate-300 italic mt-3 max-w-md">
                "{player.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Rating & MOTM Quick Highlights */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-center px-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Rating</div>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
              <Star size={18} fill="currentColor" /> {careerStats.averageRating}
            </div>
          </div>
          <div className="h-10 border-r border-slate-800" />
          <div className="text-center px-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase">MOTMs</div>
            <div className="text-2xl font-black text-amber-300 mt-1 flex items-center justify-center gap-1">
              <Trophy size={18} /> {careerStats.motmCount}
            </div>
          </div>
        </div>
      </div>

      {/* Automatically Derived Career Statistics */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <span>Derived Career Statistics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard title="Goals" value={careerStats.goals} icon={Target} color="rose" subtitle={`${careerStats.goalsPerMatch} / match`} />
          <StatCard title="Assists" value={careerStats.assists} icon={Award} color="teal" subtitle={`${careerStats.assistsPerMatch} / match`} />
          <StatCard title="Wins" value={careerStats.wins} icon={CheckCircle} color="emerald" subtitle={`${careerStats.winPercentage}% Win Rate`} />
          <StatCard title="Draws" value={careerStats.draws} icon={MinusCircle} color="blue" />
          <StatCard title="Losses" value={careerStats.losses} icon={XCircle} color="rose" />
          <StatCard title="Best Rating" value={`${careerStats.highestRating} ⭐`} icon={Star} color="amber" />
        </div>
      </section>

      {/* Recharts Performance Charts */}
      {performanceTrend && performanceTrend.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Rating Trend Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Match Rating History</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="matchNumber" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#ratingGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goals & Assists Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Target size={16} className="text-teal-400" />
              <span>Goals & Assists per Match</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="matchNumber" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="goals" fill="#f43f5e" name="Goals" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assists" fill="#14b8a6" name="Assists" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>
      )}

      {/* Match History Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Calendar className="text-emerald-400" size={20} />
          <span>Participated Matches</span>
        </h2>

        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-extrabold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Match</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Teams & Score</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Contribution</th>
                  <th className="p-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {matchHistory.map((m) => (
                  <tr key={m.matchId} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white">Match #{m.matchNumber}</td>
                    <td className="p-4 text-slate-400">{new Date(m.date).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">
                      {m.teamA} <span className="text-emerald-400 font-extrabold">{m.score.teamA} - {m.score.teamB}</span> {m.teamB}
                    </td>
                    <td className="p-4">
                      {m.result === 'WIN' && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">WIN</span>
                      )}
                      {m.result === 'DRAW' && (
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">DRAW</span>
                      )}
                      {m.result === 'LOSS' && (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">LOSS</span>
                      )}
                    </td>
                    <td className="p-4 space-x-2">
                      {m.stats.goals > 0 && <span className="text-rose-400 font-bold">⚽ {m.stats.goals} G</span>}
                      {m.stats.assists > 0 && <span className="text-teal-400 font-bold">🎯 {m.stats.assists} A</span>}
                      {m.isMotm && <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded font-black text-[10px]">🏆 MOTM</span>}
                    </td>
                    <td className="p-4 text-right font-black text-amber-400 text-sm">
                      {m.rating} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
