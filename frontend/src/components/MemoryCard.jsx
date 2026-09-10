import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Sparkles, Smile, Quote } from 'lucide-react';

export default function MemoryCard({ match }) {
  const memory = match.memory || {};

  return (
    <div className="rounded-2xl glass-panel overflow-hidden border border-slate-800 flex flex-col md:flex-row hover:border-emerald-500/30 transition-all">
      {/* Memory Photo */}
      <div className="md:w-5/12 relative h-64 md:h-auto min-h-[220px]">
        <img
          src={memory.photoUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'}
          alt="Football memory"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0b101d]" />
        
        {/* Score Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-xl">
          <div className="text-xs font-bold text-slate-300">Match #{match.matchNumber}</div>
          <div className="text-sm font-black text-emerald-400">
            {match.teamA?.name} {match.score?.teamA} - {match.score?.teamB} {match.teamB?.name}
          </div>
        </div>
      </div>

      {/* Memory Content */}
      <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center"><Calendar size={13} className="mr-1 text-emerald-400" /> {new Date(match.date).toLocaleDateString()}</span>
            <span className="flex items-center"><MapPin size={13} className="mr-1 text-slate-400" /> {match.location}</span>
          </div>

          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Quote size={20} className="text-emerald-400 rotate-180" />
            <span>Match Memory</span>
          </h3>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed italic">
            "{memory.summary || 'An unforgetable evening of great football and tight competition.'}"
          </p>

          {/* Highlights */}
          <div className="mt-4 space-y-2">
            {memory.bestMoment && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs flex items-start space-x-2">
                <Sparkles size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-emerald-300 uppercase text-[10px] block">Best Moment</span>
                  <span className="text-slate-200">{memory.bestMoment}</span>
                </div>
              </div>
            )}

            {memory.funnyMoment && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs flex items-start space-x-2">
                <Smile size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-300 uppercase text-[10px] block">Funny Moment</span>
                  <span className="text-slate-200">{memory.funnyMoment}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOTM Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          {match.motm ? (
            <div className="flex items-center space-x-2 text-xs">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-slate-400">MOTM:</span>
              <span className="font-bold text-amber-300">{match.motm.name}</span>
            </div>
          ) : <span />}

          <Link
            to={`/matches/${match._id}`}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1"
          >
            View Match Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
