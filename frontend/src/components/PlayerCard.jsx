import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Target, Shield, User } from 'lucide-react';

export default function PlayerCard({ player, stats }) {
  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Goalkeeper':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Defender':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Midfielder':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Forward':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Link
      to={`/players/${player._id}`}
      className="block glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 p-5 relative group"
    >
      {/* Top Header info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
              alt={player.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors"
            />
            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-slate-200 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-700">
              #{player.jerseyNumber || 10}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition-colors">
              {player.name}
            </h3>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPositionBadge(player.position)}`}>
              {player.position}
            </span>
          </div>
        </div>
      </div>

      {/* Bio preview */}
      {player.bio && (
        <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic">
          "{player.bio}"
        </p>
      )}

      {/* Dynamic Statistics Grid */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Matches</div>
          <div className="text-base font-black text-white mt-0.5">{stats?.matchesPlayed || 0}</div>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Goals</div>
          <div className="text-base font-black text-emerald-400 mt-0.5">{stats?.goals || 0}</div>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Assists</div>
          <div className="text-base font-black text-teal-400 mt-0.5">{stats?.assists || 0}</div>
        </div>
        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center justify-center gap-0.5">
            <Star size={10} /> Rating
          </div>
          <div className="text-base font-black text-amber-400 mt-0.5">
            {stats?.averageRating ? stats.averageRating : 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
}
