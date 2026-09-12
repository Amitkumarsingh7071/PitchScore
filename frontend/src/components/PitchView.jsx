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
    
    const gks = players.filter(p => p.position === 'Goalkeeper');
    const defs = players.filter(p => p.position === 'Defender');
    const mids = players.filter(p => p.position === 'Midfielder');
    const fwds = players.filter(p => p.position === 'Forward');

    const lines = [gks, defs, mids, fwds];

    return (
      <div className="space-y-4 py-2">
        <h4 className={`text-center font-bold text-xs uppercase tracking-wider ${colorTheme === 'red' ? 'text-rose-200' : 'text-blue-200'}`}>
          {team?.name || 'Team'}
        </h4>

        {lines.map((line, idx) => (
          <div key={idx} className="flex flex-wrap justify-center sm:justify-around items-center gap-2 px-2 min-h-[44px]">
            {line.map(player => {
              const rating = getPlayerRating(player._id);
              const isMotm = motmPlayerId && motmPlayerId.toString() === player._id.toString();

              return (
                <div key={player._id} className="flex flex-col items-center group relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-md transition-transform hover:scale-105 ${
                    colorTheme === 'red'
                      ? 'bg-rose-600 text-white border-white'
                      : 'bg-blue-600 text-white border-white'
                  }`}>
                    #{player.jerseyNumber || 10}
                    {isMotm && (
                      <span className="absolute -top-1.5 -right-1 bg-amber-400 text-slate-900 p-0.5 rounded-full shadow">
                        <Star size={9} fill="currentColor" />
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] font-semibold text-white mt-1 max-w-[75px] truncate text-center bg-slate-900/80 px-1.5 py-0.2 rounded">
                    {player.name}
                  </span>

                  {rating && (
                    <span className="text-[9px] font-bold text-emerald-900 bg-white px-1 rounded shadow-sm mt-0.5">
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
    <div className="relative rounded-2xl bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-700 border-4 border-emerald-900/20 p-4 shadow-sm overflow-hidden min-h-[440px] flex flex-col justify-between">
      {/* Field Markings */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-white/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/20 rounded-full pointer-events-none" />

      {/* Team A Pitch Side */}
      {renderTeamSection(teamA, 'red')}

      {/* Center Line Badge */}
      <div className="text-center z-10 py-1">
        <span className="bg-white/90 text-slate-800 font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          Field Formation
        </span>
      </div>

      {/* Team B Pitch Side */}
      {renderTeamSection(teamB, 'blue')}
    </div>
  );
}
