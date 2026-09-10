import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Target, Shield, User, Award } from 'lucide-react';

export default function PlayerCard({ player, stats }) {
  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Goalkeeper':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'Defender':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      case 'Midfielder':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'Forward':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/40';
    }
  };

  const badges = stats?.badges || [];

  return (
    <Link
      to={`/players/${player._id}`}
      className="block glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-slate-800 p-5 relative group shadow-xl transition-all hover:border-emerald-500/40"
    >
      {/* Top Header info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
              alt={player.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
              #{player.jerseyNumber || 10}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition-colors font-['Plus_Jakarta_Sans']">
              {player.name}
            </h3>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getPositionBadge(player.position)}`}>
              {player.position}
            </span>
          </div>
        </div>
      </div>

      {/* CricHeroes Achievement Badges */}
      {badges.length > 0 && (
        <div className="flex items-center space-x-1.5 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto">
          {badges.map(b => (
            <span key={b.id} className="bg-slate-900 border border-slate-700 text-xs px-2 py-0.5 rounded-lg flex items-center space-x-1" title={b.title}>
              <span>{b.icon}</span>
              <span className="text-[10px] font-bold text-slate-300 truncate max-w-[80px]">{b.title}</span>
            </span>
          ))}
        </div>
      )}

      {/* Dynamic Statistics Grid */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="text-[9px] font-black text-slate-400 uppercase">Matches</div>
          <div className="text-base font-black text-white mt-0.5">{stats?.matchesPlayed || 0}</div>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="text-[9px] font-black text-slate-400 uppercase">Goals</div>
          <div className="text-base font-black text-rose-400 mt-0.5">{stats?.goals || 0}</div>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="text-[9px] font-black text-slate-400 uppercase">Assists</div>
          <div className="text-base font-black text-teal-400 mt-0.5">{stats?.assists || 0}</div>
        </div>
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="text-[9px] font-black text-amber-400 uppercase flex items-center justify-center gap-0.5">
            <Star size={9} fill="currentColor" /> Rating
          </div>
          <div className="text-base font-black text-amber-400 mt-0.5">
            {stats?.averageRating ? stats.averageRating : 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
}
