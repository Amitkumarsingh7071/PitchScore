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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!details) return <div className="text-center py-12 text-slate-500">Match room not found</div>;

  const { match, score, events, playerPerformances, motmPlayerId } = details;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button onClick={() => navigate('/history')} className="flex items-center space-x-1 hover:text-slate-900 font-medium">
          <ArrowLeft size={16} />
          <span>Match History</span>
        </button>

        {match.matchCode && (
          <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
            <KeyRound size={13} className="text-emerald-600" />
            <span className="font-medium text-slate-600">Code:</span>
            <span className="font-bold text-slate-900 tracking-wider">{match.matchCode}</span>
            <button
              onClick={copyShareLink}
              className="text-slate-400 hover:text-slate-700 ml-1"
              title="Copy Join Link"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>

      {/* Live Scoreboard Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden text-center space-y-4">
        
        {/* Match Code Share Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-600 font-medium">
            <MapPin size={14} className="text-slate-400" />
            <span>Venue: <strong className="text-slate-900">{match.location || 'City Turf'}</strong></span>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Join our football match at ${match.location}! Enter Match Code: ${match.matchCode} at ${window.location.origin}/join?code=${match.matchCode}`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1 uppercase"
          >
            <Share2 size={13} />
            <span>Share Code via WhatsApp</span>
          </a>
        </div>

        {/* Big Live Score */}
        <div className="flex items-center justify-around py-2">
          <div className="flex-1 text-center">
            <div className="text-rose-600 font-bold text-lg sm:text-xl truncate">{match.teamA?.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{(match.teamA?.playerIds || []).length} Players</div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner min-w-[120px]">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {score.teamA} - {score.teamB}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mt-1 flex items-center justify-center gap-1">
              <Play size={8} className="fill-current" /> Live Score
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-blue-600 font-bold text-lg sm:text-xl truncate">{match.teamB?.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{(match.teamB?.playerIds || []).length} Players</div>
          </div>
        </div>

        {/* Record Event Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsEventModalOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <PlusCircle size={18} />
            <span>Record Match Event (Goal, Card, Save)</span>
          </button>
        </div>
      </div>

      {/* Real-time Match Event Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Recorded Match Events ({events.length})</span>
          <span className="text-[11px] text-slate-400 font-normal">Tap trash icon to delete incorrect event</span>
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No events recorded yet. Click "Record Match Event" above to log goals, assists, saves, or cards.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {events.map((evt) => {
              const player = evt.playerId;
              const secondary = evt.secondaryPlayerId;

              return (
                <div key={evt._id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white text-emerald-700 font-bold px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                      {evt.minute}'
                    </span>

                    <div>
                      <div className="font-semibold text-slate-900">
                        {evt.type === 'goal' && '⚽ Goal Scored'}
                        {evt.type === 'assist' && '🎯 Assist'}
                        {evt.type === 'save' && '🧤 Save'}
                        {evt.type === 'yellow_card' && '🟨 Yellow Card'}
                        {evt.type === 'red_card' && '🟥 Red Card'}
                        {evt.type === 'tackle' && '🛡️ Tackle'}
                        {evt.type === 'substitution' && '🔄 Substitution'}
                        <span className="text-slate-700 font-bold ml-2">— {player?.name}</span>
                      </div>

                      {secondary && (
                        <div className="text-[10px] text-emerald-700 font-medium">
                          {evt.type === 'goal' ? `Assisted by: ${secondary.name}` : `Subbed with: ${secondary.name}`}
                        </div>
                      )}
                      {evt.details && <div className="text-[10px] text-slate-500 italic">{evt.details}</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(evt._id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100"
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
      <div className="pt-2">
        <button
          onClick={() => setIsFinishModalOpen(true)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-2"
        >
          <CheckCircle2 size={18} />
          <span>Finish Match & Save Memory</span>
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
