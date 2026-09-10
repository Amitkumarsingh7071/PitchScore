import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Play, CheckCircle, KeyRound, Copy, Check, ArrowRight } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
      
      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 font-semibold text-slate-700">
            <span>Match #{match.matchNumber || 1}</span>
            <span className="text-slate-300">•</span>
            {match.matchCode && (
              <button
                onClick={copyMatchCode}
                className="bg-slate-50 border border-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px] flex items-center space-x-1 hover:border-slate-300 transition-colors"
                title="Copy Match Code"
              >
                <KeyRound size={11} className="text-emerald-600" />
                <span>{match.matchCode}</span>
                {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-slate-400" />}
              </button>
            )}
          </div>
          
          <div>
            {isFinished ? (
              <span className="inline-flex items-center text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                Finished
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                <Play size={8} className="mr-1 fill-current" /> Live
              </span>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="py-5 flex items-center justify-between">
          
          {/* Team A */}
          <div className="flex-1 text-center pr-2">
            <div className="text-rose-600 font-bold text-sm truncate">
              {match.teamA?.name || 'Team Red'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {match.teamA?.playerIds?.length || 0} Players
            </div>
          </div>

          {/* Score Badge */}
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[95px]">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {match.score ? `${match.score.teamA} - ${match.score.teamB}` : '0 - 0'}
            </div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">
              {match.duration || 90} MINS
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center pl-2">
            <div className="text-blue-600 font-bold text-sm truncate">
              {match.teamB?.name || 'Team Blue'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {match.teamB?.playerIds?.length || 0} Players
            </div>
          </div>

        </div>

        {/* Venue Info */}
        <div className="text-xs text-slate-500 text-center flex items-center justify-center space-x-1 py-1">
          <MapPin size={13} className="text-slate-400" />
          <span>{match.location || 'City Turf'}</span>
          <span className="text-slate-300">•</span>
          <Calendar size={13} className="text-slate-400" />
          <span>{new Date(match.date).toLocaleDateString()}</span>
        </div>

        {/* MOTM Banner */}
        {isFinished && match.motm && (
          <div className="mt-3 bg-amber-50 border border-amber-200/60 rounded-lg p-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <Trophy size={14} className="text-amber-600" />
              <span className="font-medium text-slate-600">MOTM:</span>
              <span className="font-bold text-slate-900">{match.motm.name}</span>
            </div>
            <span className="font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[11px]">
              {match.motm.rating} ⭐
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {!isFinished ? (
          <Link
            to={`/scoring/${match._id}`}
            className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors block"
          >
            Open Live Match Room
          </Link>
        ) : (
          <Link
            to={`/matches/${match._id}`}
            className="w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1 border border-slate-200"
          >
            <span>View Match Details</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

    </div>
  );
}
