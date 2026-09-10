import React from 'react';
import { Star } from 'lucide-react';

export default function PitchView({ teamA, teamB, playerPerformances, motmPlayerId }) {
  const getPlayerRating = (playerId) => {
    if (!playerPerformances) return null;
    const perf = playerPerformances.find(p => p.player._id.toString() === playerId.toString());
    return perf ? perf.rating : null;
  };

  const renderTeamSection = (team, colorTheme) => {
    const players = team?.playerIds || [];
    
    // Group by position
    const gks = players.filter(p => p.position === 'Goalkeeper');
    const defs = players.filter(p => p.position === 'Defender');
    const mids = players.filter(p => p.position === 'Midfielder');
    const fwds = players.filter(p => p.position === 'Forward');

    const lines = [gks, defs, mids, fwds];

    return (
      <div className="space-y-4 py-2">
        <h4 className={`text-center font-extrabold text-sm uppercase tracking-widest ${colorTheme === 'red' ? 'text-rose-400' : 'text-blue-400'}`}>
          {team?.name || 'Team'}
        </h4>

        {lines.map((line, idx) => (
          <div key={idx} className="flex justify-around items-center px-4 min-h-[44px]">
            {line.map(player => {
              const rating = getPlayerRating(player._id);
              const isMotm = motmPlayerId && motmPlayerId.toString() === player._id.toString();

              return (
                <div key={player._id} className="flex flex-col items-center group relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2 shadow-lg transition-transform hover:scale-110 ${
                    colorTheme === 'red'
                      ? 'bg-rose-950 text-rose-200 border-rose-600'
                      : 'bg-blue-950 text-blue-200 border-blue-600'
                  }`}>
                    #{player.jerseyNumber || 10}
                    {isMotm && (
                      <span className="absolute -top-2 -right-1 bg-amber-400 text-black p-0.5 rounded-full shadow">
                        <Star size={10} fill="currentColor" />
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-bold text-white mt-1 max-w-[70px] truncate text-center bg-slate-900/80 px-1 rounded">
                    {player.name}
                  </span>

                  {rating && (
                    <span className="text-[9px] font-extrabold text-emerald-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800 mt-0.5">
                      {rating} ⭐
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-900 border-4 border-emerald-600/40 p-4 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
      {/* Pitch Markings */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-emerald-500/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-500/20 rounded-full pointer-events-none" />

      {/* Team A Pitch Side */}
      {renderTeamSection(teamA, 'red')}

      {/* Center Line Badge */}
      <div className="text-center z-10 py-1">
        <span className="bg-slate-950/90 text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30">
          STADIUM PITCH FORMATION
        </span>
      </div>

      {/* Team B Pitch Side */}
      {renderTeamSection(teamB, 'blue')}
    </div>
  );
}
