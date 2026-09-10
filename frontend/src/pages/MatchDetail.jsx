import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import PitchView from '../components/PitchView';
import MemoryCard from '../components/MemoryCard';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function MatchDetail() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await matchAPI.getById(id);
        setDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!details) return <div className="text-center py-12 text-slate-400">Match details not found</div>;

  const { match, score, playerPerformances, motm, motmPlayerId, events } = details;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back link */}
      <Link to="/history" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-emerald-400">
        <ArrowLeft size={16} />
        <span>Back to Match History</span>
      </Link>

      {/* Main Scoreboard */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-8 text-center shadow-2xl">
        <div className="flex items-center justify-center space-x-3 text-xs text-slate-400 font-bold mb-4">
          <Calendar size={14} className="text-emerald-400" />
          <span>{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <MapPin size={14} className="text-slate-400" />
          <span>{match.location}</span>
        </div>

        <div className="flex items-center justify-around py-6 max-w-3xl mx-auto">
          <div className="flex-1 text-center">
            <div className="text-rose-400 font-black text-2xl sm:text-3xl">🔴 {match.teamA?.name}</div>
          </div>

          <div className="px-8 py-4 bg-slate-950/90 border border-slate-700/80 rounded-3xl shadow-2xl min-w-[160px]">
            <div className="text-4xl sm:text-6xl font-black tracking-widest text-white">
              {score.teamA} - {score.teamB}
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 mt-1">
              FINAL DERIVED SCORE
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-blue-400 font-black text-2xl sm:text-3xl">🔵 {match.teamB?.name}</div>
          </div>
        </div>

        {/* MOTM Highlight Banner */}
        {motm && (
          <div className="mt-6 max-w-xl mx-auto bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow">
                <Trophy size={24} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">MAN OF THE MATCH</span>
                <span className="font-extrabold text-white text-lg">{motm.player.name}</span>
                <span className="text-xs text-slate-400 block">Position: {motm.player.position}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-400">Automated Rating</div>
              <div className="text-2xl font-black text-amber-400">{motm.rating} ⭐</div>
            </div>
          </div>
        )}
      </div>

      {/* Match Memory Story Section */}
      {match.memory && (
        <section className="space-y-4">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <Sparkles className="text-emerald-400" size={20} />
            <span>Preserved Match Memory</span>
          </h2>
          <MemoryCard match={{ ...match, score, motm }} />
        </section>
      )}

      {/* Calculated Player Ratings Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Star className="text-amber-400" size={20} />
          <span>Automatically Calculated Player Ratings</span>
        </h2>

        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 uppercase text-[10px] font-extrabold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Player</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Position</th>
                  <th className="p-4 text-center">Mins</th>
                  <th className="p-4 text-center">Goals</th>
                  <th className="p-4 text-center">Assists</th>
                  <th className="p-4 text-center">Saves</th>
                  <th className="p-4 text-center">Cards</th>
                  <th className="p-4 text-right">Calculated Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {playerPerformances.map((perf) => {
                  const isMotm = motmPlayerId && motmPlayerId.toString() === perf.player._id.toString();

                  return (
                    <tr key={perf.player._id} className={`hover:bg-slate-800/40 transition ${isMotm ? 'bg-amber-500/10' : ''}`}>
                      <td className="p-4 font-bold text-white flex items-center space-x-2">
                        <span>{perf.player.name}</span>
                        {isMotm && <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded text-[9px] font-black uppercase">MOTM</span>}
                      </td>
                      <td className="p-4">
                        <span className={`font-extrabold text-[11px] ${perf.teamId === 'teamA' ? 'text-rose-400' : 'text-blue-400'}`}>
                          {perf.team}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{perf.player.position}</td>
                      <td className="p-4 text-center">{perf.stats.minutesPlayed}'</td>
                      <td className="p-4 text-center font-bold text-rose-400">{perf.stats.goals || '-'}</td>
                      <td className="p-4 text-center font-bold text-teal-400">{perf.stats.assists || '-'}</td>
                      <td className="p-4 text-center font-bold text-amber-400">{perf.stats.saves || '-'}</td>
                      <td className="p-4 text-center">
                        {perf.stats.yellowCards > 0 && <span className="mr-1">🟨</span>}
                        {perf.stats.redCards > 0 && <span>🟥</span>}
                        {perf.stats.yellowCards === 0 && perf.stats.redCards === 0 && '-'}
                      </td>
                      <td className="p-4 text-right font-black text-amber-400 text-sm">
                        {perf.rating} ⭐
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Visual Pitch Lineups */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300">
          Team Formations & Ratings Pitch View
        </h2>
        <PitchView
          teamA={match.teamA}
          teamB={match.teamB}
          playerPerformances={playerPerformances}
          motmPlayerId={motmPlayerId}
        />
      </section>

      {/* Match Events Timeline */}
      <section className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-300">
          Match Event Log ({events.length})
        </h2>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3">
          {events.map((evt) => (
            <div key={evt._id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="bg-slate-950 text-emerald-400 font-black px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                  {evt.minute}'
                </span>
                <span className="font-bold text-white">
                  {evt.type === 'goal' && '⚽ Goal'}
                  {evt.type === 'assist' && '🎯 Assist'}
                  {evt.type === 'save' && '🧤 Save'}
                  {evt.type === 'yellow_card' && '🟨 Yellow Card'}
                  {evt.type === 'red_card' && '🟥 Red Card'}
                  <span className="text-slate-300 font-semibold ml-2">— {evt.playerId?.name}</span>
                </span>
              </div>
              {evt.secondaryPlayerId && (
                <span className="text-[10px] text-teal-400 font-semibold">
                  Assist: {evt.secondaryPlayerId.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
