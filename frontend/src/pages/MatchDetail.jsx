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
  ArrowLeft,
  Sparkles,
  Activity
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!details) return <div className="text-center py-12 text-slate-500">Match details not found</div>;

  const { match, score, playerPerformances, motm, motmPlayerId, events } = details;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back link */}
      <Link to="/history" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-wider">
        <ArrowLeft size={16} />
        <span>Back to Match History</span>
      </Link>

      {/* Main Scoreboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center shadow-sm space-y-6">
        <div className="flex items-center justify-center space-x-3 text-xs text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          <span>{new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <MapPin size={14} className="text-slate-400" />
          <span>{match.location}</span>
        </div>

        <div className="flex items-center justify-around py-4 max-w-2xl mx-auto">
          <div className="flex-1 text-center">
            <div className="text-rose-600 font-bold text-xl sm:text-2xl">{match.teamA?.name}</div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner min-w-[130px]">
            <div className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              {score.teamA} - {score.teamB}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mt-1">
              Final Derived Score
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-blue-600 font-bold text-xl sm:text-2xl">{match.teamB?.name}</div>
          </div>
        </div>

        {/* MOTM Highlight Banner */}
        {motm && (
          <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                <Trophy size={20} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">MAN OF THE MATCH</span>
                <span className="font-bold text-slate-900 text-base">{motm.player.name}</span>
                <span className="text-xs text-slate-500 block">Position: {motm.player.position}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-slate-500">Calculated Rating</div>
              <div className="text-xl font-bold text-amber-600">{motm.rating} ⭐</div>
            </div>
          </div>
        )}
      </div>

      {/* Match Memory Story Section */}
      {match.memory && match.memory.summary && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
            <Sparkles className="text-emerald-600" size={16} />
            <span>Preserved Match Story</span>
          </h2>
          <MemoryCard match={{ ...match, score, motm }} />
        </section>
      )}

      {/* Calculated Player Ratings Table */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
          <Star className="text-amber-600" size={16} />
          <span>Automatically Calculated Player Ratings</span>
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100">
                {playerPerformances.map((perf) => {
                  const isMotm = motmPlayerId && motmPlayerId.toString() === perf.player._id.toString();

                  return (
                    <tr key={perf.player._id} className={`hover:bg-slate-50 transition-colors ${isMotm ? 'bg-amber-50/50' : ''}`}>
                      <td className="p-4 font-semibold text-slate-900 flex items-center space-x-2">
                        <span>{perf.player.name}</span>
                        {isMotm && <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded text-[9px] font-bold uppercase">MOTM</span>}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold text-[11px] ${perf.teamId === 'teamA' ? 'text-rose-600' : 'text-blue-600'}`}>
                          {perf.team}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{perf.player.position}</td>
                      <td className="p-4 text-center">{perf.stats.minutesPlayed}'</td>
                      <td className="p-4 text-center font-bold text-rose-600">{perf.stats.goals || '-'}</td>
                      <td className="p-4 text-center font-bold text-blue-600">{perf.stats.assists || '-'}</td>
                      <td className="p-4 text-center font-bold text-amber-600">{perf.stats.saves || '-'}</td>
                      <td className="p-4 text-center">
                        {perf.stats.yellowCards > 0 && <span className="mr-1">🟨</span>}
                        {perf.stats.redCards > 0 && <span>🟥</span>}
                        {perf.stats.yellowCards === 0 && perf.stats.redCards === 0 && '-'}
                      </td>
                      <td className="p-4 text-right font-bold text-amber-600 text-sm">
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
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Field Lineups & Ratings
        </h2>
        <PitchView
          teamA={match.teamA}
          teamB={match.teamB}
          playerPerformances={playerPerformances}
          motmPlayerId={motmPlayerId}
        />
      </section>

      {/* Match Events Timeline */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Match Event Timeline ({events.length})
        </h2>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          {events.length === 0 ? (
            <div className="text-slate-400 text-xs italic text-center py-4">No events logged for this match.</div>
          ) : (
            events.map((evt) => (
              <div key={evt._id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="bg-white text-emerald-700 font-bold px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    {evt.minute}'
                  </span>
                  <span className="font-semibold text-slate-800">
                    {evt.type === 'goal' && '⚽ Goal'}
                    {evt.type === 'assist' && '🎯 Assist'}
                    {evt.type === 'save' && '🧤 Save'}
                    {evt.type === 'yellow_card' && '🟨 Yellow Card'}
                    {evt.type === 'red_card' && '🟥 Red Card'}
                    <span className="text-slate-600 font-normal ml-2">— {evt.playerId?.name}</span>
                  </span>
                </div>
                {evt.secondaryPlayerId && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Assist: {evt.secondaryPlayerId.name}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
