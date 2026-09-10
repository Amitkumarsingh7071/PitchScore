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
  Calendar, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Sparkles
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Player profile not found.
      </div>
    );
  }

  const { player, careerStats, matchHistory, performanceTrend } = data;
  const badges = careerStats.badges || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <Link to="/players" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider">
        <ArrowLeft size={16} />
        <span>Back to Players Directory</span>
      </Link>

      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
              alt={player.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <span className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-bold text-xs px-2 py-0.5 rounded shadow">
              #{player.jerseyNumber || 10}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{player.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase">
                {player.position}
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                {careerStats.matchesPlayed} Matches Played
              </span>
            </div>
            {player.bio && (
              <p className="text-xs text-slate-500 italic mt-3 max-w-md">
                "{player.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Rating & MOTM Quick Highlights */}
        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-center px-4">
            <div className="text-[10px] font-semibold text-slate-500 uppercase">Avg Rating</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center justify-center gap-1">
              <Star size={18} fill="currentColor" /> {careerStats.averageRating}
            </div>
          </div>
          <div className="h-10 border-r border-slate-200" />
          <div className="text-center px-4">
            <div className="text-[10px] font-semibold text-slate-500 uppercase">MOTMs</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center justify-center gap-1">
              <Trophy size={18} /> {careerStats.motmCount}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      {badges.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
            <Sparkles className="text-amber-600" size={16} />
            <span>Unlocked Player Badges ({badges.length})</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {badges.map(badge => (
              <div key={badge.id} className="bg-white border border-slate-200 p-3 rounded-xl text-center space-y-1 shadow-sm">
                <div className="text-2xl">{badge.icon}</div>
                <div className="font-bold text-slate-900 text-xs">{badge.title}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{badge.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Derived Career Statistics */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
          <ShieldCheck className="text-emerald-600" size={16} />
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Rating Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Match Rating History</span>
            </h3>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="matchNumber" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="rating" stroke="#16A34A" strokeWidth={2.5} fillOpacity={1} fill="url(#ratingGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goals & Assists Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <Target size={16} className="text-blue-600" />
              <span>Goals & Assists per Match</span>
            </h3>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="matchNumber" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="goals" fill="#E11D48" name="Goals" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assists" fill="#2563EB" name="Assists" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>
      )}

      {/* Match History Table */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
          <Calendar className="text-emerald-600" size={16} />
          <span>Participated Matches</span>
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Match</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Teams & Score</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Contribution</th>
                  <th className="p-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                      No played matches logged yet.
                    </td>
                  </tr>
                ) : (
                  matchHistory.map((m) => (
                    <tr key={m.matchId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">Match #{m.matchNumber} ({m.matchCode})</td>
                      <td className="p-4 text-slate-500">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">
                        {m.teamA} <span className="text-emerald-600 font-bold">{m.score.teamA} - {m.score.teamB}</span> {m.teamB}
                      </td>
                      <td className="p-4">
                        {m.result === 'WIN' && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">WIN</span>
                        )}
                        {m.result === 'DRAW' && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">DRAW</span>
                        )}
                        {m.result === 'LOSS' && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">LOSS</span>
                        )}
                      </td>
                      <td className="p-4 space-x-2">
                        {m.stats.goals > 0 && <span className="text-rose-600 font-semibold">⚽ {m.stats.goals} G</span>}
                        {m.stats.assists > 0 && <span className="text-blue-600 font-semibold">🎯 {m.stats.assists} A</span>}
                        {m.isMotm && <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold text-[10px]">MOTM</span>}
                      </td>
                      <td className="p-4 text-right font-bold text-amber-600 text-sm">
                        {m.rating} ⭐
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
