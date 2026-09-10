import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchAPI, eventAPI } from '../services/api';
import EventLoggerModal from '../components/EventLoggerModal';
import FinishMatchModal from '../components/FinishMatchModal';
import PitchView from '../components/PitchView';
import { 
  Play, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Award, 
  ShieldAlert,
  Calendar,
  MapPin,
  ArrowLeft,
  KeyRound,
  Share2,
  Copy,
  Check
} from 'lucide-react';

export default function MatchScoring() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchMatchDetails = async () => {
    try {
      const res = await matchAPI.getById(id);
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const handleAddEvent = async (eventData) => {
    try {
      const res = await eventAPI.add(eventData);
      setDetails(res.data.matchDetails);
    } catch (err) {
      console.error(err);
      alert('Failed to record event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const res = await eventAPI.delete(eventId);
      setDetails(res.data.matchDetails);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishMatch = async (memoryData) => {
    try {
      await matchAPI.finish(id, { memory: memoryData });
      navigate(`/matches/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to finish match');
    }
  };

  const copyShareLink = () => {
    if (!details?.match?.matchCode) return;
    const url = `${window.location.origin}/join?code=${details.match.matchCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!details) return <div className="text-center py-12 text-slate-400">Match room not found</div>;

  const { match, score, events, playerPerformances, motmPlayerId } = details;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <button onClick={() => navigate('/history')} className="flex items-center space-x-1 hover:text-white font-bold">
          <ArrowLeft size={16} />
          <span>Match History</span>
        </button>

        {/* Match Code badge */}
        {match.matchCode && (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <KeyRound size={14} className="text-emerald-400" />
            <span className="font-bold text-slate-300">Code:</span>
            <span className="font-black text-emerald-400 tracking-widest">{match.matchCode}</span>
            <button
              onClick={copyShareLink}
              className="text-slate-400 hover:text-white ml-1"
              title="Copy Join Link"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Live Mobile-Optimized Scoreboard Header */}
      <div className="rounded-3xl glass-panel border-2 border-emerald-500/40 p-6 shadow-2xl relative overflow-hidden text-center">
        
        {/* Match Code Banner Share Bar */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-bold">
            <MapPin size={14} className="text-emerald-400" />
            <span>Turf: <strong className="text-white">{match.location || 'City Football Turf'}</strong></span>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Join our football match at ${match.location}! Enter Match Code: ${match.matchCode} at ${window.location.origin}/join?code=${match.matchCode}`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1 uppercase"
          >
            <Share2 size={13} />
            <span>Share Code via WhatsApp</span>
          </a>
        </div>

        {/* Big Live Score */}
        <div className="flex items-center justify-around py-2">
          <div className="flex-1 text-center">
            <div className="text-rose-400 font-black text-lg sm:text-xl truncate">🔴 {match.teamA?.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{(match.teamA?.playerIds || []).length} Players</div>
          </div>

          <div className="px-6 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl shadow-inner min-w-[130px]">
            <div className="text-3xl sm:text-5xl font-black tracking-widest text-emerald-400 font-['Plus_Jakarta_Sans']">
              {score.teamA} - {score.teamB}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Play size={8} className="text-emerald-400 animate-pulse" /> LIVE AUTO SCORE
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-blue-400 font-black text-lg sm:text-xl truncate">🔵 {match.teamB?.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{(match.teamB?.playerIds || []).length} Players</div>
          </div>
        </div>

        {/* Quick Action Button to Record Event */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black py-4 rounded-2xl text-base uppercase tracking-wider shadow-xl hover:brightness-110 flex items-center justify-center space-x-2 transition transform active:scale-95"
          >
            <PlusCircle size={22} />
            <span>RECORD MATCH EVENT (GOAL, CARD, SAVE)</span>
          </button>
        </div>
      </div>

      {/* Real-time Match Event Stream */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Recorded Match Events ({events.length})</span>
          <span className="text-xs text-slate-500 font-normal">Click trash to remove erroneous event</span>
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs italic">
            No events recorded yet. Tap "RECORD MATCH EVENT" above to add goals, assists, saves, or cards.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {events.map((evt) => {
              const player = evt.playerId;
              const secondary = evt.secondaryPlayerId;

              return (
                <div key={evt._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="bg-slate-950 text-emerald-400 font-black px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                      {evt.minute}'
                    </span>

                    <div>
                      <div className="font-extrabold text-white">
                        {evt.type === 'goal' && '⚽ Goal Scored'}
                        {evt.type === 'assist' && '🎯 Assist'}
                        {evt.type === 'save' && '🧤 Goalkeeper Save'}
                        {evt.type === 'yellow_card' && '🟨 Yellow Card'}
                        {evt.type === 'red_card' && '🟥 Red Card'}
                        {evt.type === 'tackle' && '🛡️ Defensive Tackle'}
                        {evt.type === 'substitution' && '🔄 Substitution'}
                        <span className="text-slate-300 font-bold ml-2">— {player?.name}</span>
                      </div>

                      {secondary && (
                        <div className="text-[10px] text-teal-400">
                          {evt.type === 'goal' ? `Assisted by: ${secondary.name}` : `Subbed with: ${secondary.name}`}
                        </div>
                      )}
                      {evt.details && <div className="text-[10px] text-slate-400 italic">{evt.details}</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(evt._id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800"
                    title="Delete event"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dynamic Pitch Formation */}
      <PitchView
        teamA={match.teamA}
        teamB={match.teamB}
        playerPerformances={playerPerformances}
        motmPlayerId={motmPlayerId}
      />

      {/* FINISH MATCH ACTION BUTTON */}
      <div className="pt-4">
        <button
          onClick={() => setIsFinishModalOpen(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black py-4 rounded-2xl text-base uppercase tracking-wider shadow-2xl hover:brightness-110 transition flex items-center justify-center space-x-2"
        >
          <CheckCircle2 size={22} />
          <span>🏁 FINISH MATCH & SAVE MEMORY</span>
        </button>
      </div>

      {/* Event Logger Modal */}
      <EventLoggerModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        match={match}
        onAddEvent={handleAddEvent}
      />

      {/* Finish Match Modal */}
      <FinishMatchModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onFinishMatch={handleFinishMatch}
      />

    </div>
  );
}
