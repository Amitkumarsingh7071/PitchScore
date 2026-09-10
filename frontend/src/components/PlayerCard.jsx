import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function PlayerCard({ player, stats }) {
  const getPositionBadge = (pos) => {
    switch (pos) {
      case 'Goalkeeper':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Defender':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Midfielder':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Forward':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const badges = stats?.badges || [];

  return (
    <Link
      to={`/players/${player._id}`}
      className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all group"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'}
              alt={player.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <span className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
              #{player.jerseyNumber || 10}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
              {player.name}
            </h3>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${getPositionBadge(player.position)}`}>
              {player.position}
            </span>
          </div>
        </div>
      </div>

      {/* Badges preview */}
      {badges.length > 0 && (
        <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-slate-100 overflow-x-auto">
          {badges.map(b => (
            <span key={b.id} className="bg-slate-50 border border-slate-200 text-xs px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 truncate" title={b.title}>
              {b.icon} {b.title}
            </span>
          ))}
        </div>
      )}

      {/* Career Metrics Grid */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Matches</div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">{stats?.matchesPlayed || 0}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Goals</div>
          <div className="text-sm font-bold text-emerald-600 mt-0.5">{stats?.goals || 0}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Assists</div>
          <div className="text-sm font-bold text-blue-600 mt-0.5">{stats?.assists || 0}</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="text-[10px] font-medium text-amber-600 uppercase flex items-center justify-center gap-0.5">
            <Star size={9} fill="currentColor" /> Rating
          </div>
          <div className="text-sm font-bold text-amber-600 mt-0.5">
            {stats?.averageRating ? stats.averageRating : 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
}
