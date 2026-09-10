import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Play, CheckCircle, KeyRound, Copy, Check } from 'lucide-react';

export default function MatchCard({ match, isAdmin }) {
  const isFinished = match.status === 'FINISHED';
  const [copied, setCopied] = useState(false);

  const copyMatchCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!match.matchCode) return;
    navigator.clipboard.writeText(match.matchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl glass-panel glass-panel-hover overflow-hidden border border-slate-800 p-5 relative group shadow-xl transition-all hover:border-emerald-500/40">
      
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2 font-black text-emerald-400">
          <span>Match #{match.matchNumber || 1}</span>
          <span className="text-slate-600">•</span>
          {match.matchCode && (
            <button
              onClick={copyMatchCode}
              className="bg-slate-900 border border-slate-700/80 text-emerald-400 font-black px-2 py-0.5 rounded-lg text-[10px] tracking-wider uppercase flex items-center space-x-1 hover:border-emerald-500 transition"
              title="Click to copy Match Join Code"
            >
              <KeyRound size={10} />
              <span>{match.matchCode}</span>
              {copied ? <Check size={10} className="text-white" /> : <Copy size={10} className="text-slate-400" />}
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
          <span className="flex items-center font-semibold"><Calendar size={11} className="mr-1 text-emerald-400" /> {new Date(match.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="py-5 flex items-center justify-between">
        
        {/* Team A */}
        <div className="flex-1 text-center pr-2">
          <div className="text-rose-400 font-black text-sm sm:text-base truncate">
            🔴 {match.teamA?.name || 'Team Red'}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-0.5">
            {match.teamA?.playerIds?.length || 0} Players
          </div>
        </div>

        {/* Score Badge */}
        <div className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-center shadow-2xl min-w-[105px]">
          <div className="text-2xl sm:text-3xl font-black tracking-widest text-white font-['Plus_Jakarta_Sans']">
            {match.score ? `${match.score.teamA} - ${match.score.teamB}` : '0 - 0'}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-black mt-0.5 flex items-center justify-center gap-1">
            {isFinished ? (
              <span className="text-emerald-400">FINISHED</span>
            ) : (
              <span className="text-amber-400 flex items-center"><Play size={8} className="mr-0.5 animate-pulse" /> LIVE</span>
            )}
          </div>
        </div>

        {/* Team B */}
        <div className="flex-1 text-center pl-2">
          <div className="text-blue-400 font-black text-sm sm:text-base truncate">
            🔵 {match.teamB?.name || 'Team Blue'}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-0.5">
            {match.teamB?.playerIds?.length || 0} Players
          </div>
        </div>

      </div>

      {/* Venue / Turf Info */}
      <div className="text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1 py-1">
        <MapPin size={12} className="text-emerald-400" />
        <span className="font-semibold">Turf:</span>
        <span className="text-white font-bold">{match.location || 'City Football Turf'}</span>
      </div>

      {/* MOTM Highlight Banner */}
      {isFinished && match.motm && (
        <div className="mt-2 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Trophy size={16} className="text-amber-400" />
            <span className="font-bold text-slate-300">MOTM:</span>
            <span className="font-black text-amber-300">{match.motm.name}</span>
          </div>
          <span className="font-black bg-amber-400 text-black px-2 py-0.5 rounded-lg text-[11px]">
            {match.motm.rating} ⭐
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        {!isFinished ? (
          <Link
            to={`/scoring/${match._id}`}
            className="w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition"
          >
            ⚽ Open Live Match Room
          </Link>
        ) : (
          <Link
            to={`/matches/${match._id}`}
            className="w-full text-center bg-slate-900 hover:bg-slate-800 text-emerald-400 font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition border border-slate-800"
          >
            View Match Details & Ratings →
          </Link>
        )}
      </div>

    </div>
  );
}
