import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Sparkles, Smile, Quote, ArrowRight } from 'lucide-react';

export default function MemoryCard({ match }) {
  const memory = match.memory || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-slate-300 transition-all">
      {/* Memory Photo */}
      <div className="md:w-5/12 relative h-56 md:h-auto min-h-[200px]">
        <img
          src={memory.photoUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'}
          alt="Football memory"
          className="w-full h-full object-cover"
        />
        
        {/* Score Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <div className="text-[10px] font-semibold text-slate-500">Match #{match.matchNumber}</div>
          <div className="text-xs font-bold text-slate-800">
            {match.teamA?.name} {match.score?.teamA} - {match.score?.teamB} {match.teamB?.name}
          </div>
        </div>
      </div>

      {/* Memory Content */}
      <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center"><Calendar size={13} className="mr-1 text-slate-400" /> {new Date(match.date).toLocaleDateString()}</span>
            <span className="flex items-center"><MapPin size={13} className="mr-1 text-slate-400" /> {match.location}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Quote size={16} className="text-emerald-600 rotate-180" />
            <span>Match Story</span>
          </h3>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed italic">
            "{memory.summary || 'An unforgettable evening of local football.'}"
          </p>

          {/* Highlights */}
          <div className="mt-4 space-y-2">
            {memory.bestMoment && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-xs flex items-start space-x-2">
                <Sparkles size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-800 uppercase text-[10px] block">Best Moment</span>
                  <span className="text-slate-700">{memory.bestMoment}</span>
                </div>
              </div>
            )}

            {memory.funnyMoment && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-xs flex items-start space-x-2">
                <Smile size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-800 uppercase text-[10px] block">Funny Moment</span>
                  <span className="text-slate-700">{memory.funnyMoment}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOTM Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {match.motm ? (
            <div className="flex items-center space-x-1.5 text-xs">
              <Trophy size={14} className="text-amber-600" />
              <span className="text-slate-500">MOTM:</span>
              <span className="font-bold text-slate-800">{match.motm.name}</span>
            </div>
          ) : <span />}

          <Link
            to={`/matches/${match._id}`}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-1"
          >
            <span>Match Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
