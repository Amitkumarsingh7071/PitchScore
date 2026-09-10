import React, { useState } from 'react';
import { X, Activity } from 'lucide-react';

export default function EventLoggerModal({ isOpen, onClose, match, onAddEvent }) {
  const [eventType, setEventType] = useState('goal');
  const [minute, setMinute] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [secondaryPlayerId, setSecondaryPlayerId] = useState('');
  const [value, setValue] = useState(1);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !match) return null;

  const allPlayers = [
    ...(match.teamA?.playerIds || []),
    ...(match.teamB?.playerIds || [])
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerId) return;

    setSubmitting(true);
    try {
      await onAddEvent({
        matchId: match._id,
        type: eventType,
        minute: Number(minute),
        playerId,
        secondaryPlayerId: secondaryPlayerId || null,
        value: Number(value),
        details
      });
      setPlayerId('');
      setSecondaryPlayerId('');
      setDetails('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Activity size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Record Match Event</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Event Category Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Event Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'goal', label: 'Goal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { id: 'save', label: 'Save', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { id: 'yellow_card', label: 'Yellow Card', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { id: 'red_card', label: 'Red Card', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                { id: 'tackle', label: 'Tackle', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { id: 'substitution', label: 'Substitution', color: 'bg-slate-100 text-slate-700 border-slate-200' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEventType(item.id)}
                  className={`py-2 px-3 rounded-lg font-semibold text-xs border text-center transition-all ${
                    eventType === item.id ? `${item.color} ring-2 ring-emerald-600` : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minute Input */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Minute</label>
            <input
              type="number"
              min="1"
              max="120"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          {/* Primary Player Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
              {eventType === 'goal' ? 'Goal Scorer' : eventType === 'substitution' ? 'Player Out' : 'Primary Player'}
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            >
              <option value="">-- Select Player --</option>
              {allPlayers.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Player Selection */}
          {(eventType === 'goal' || eventType === 'substitution') && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">
                {eventType === 'goal' ? 'Assist Provider (Optional)' : 'Player In'}
              </label>
              <select
                value={secondaryPlayerId}
                onChange={(e) => setSecondaryPlayerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="">{eventType === 'goal' ? 'None (Solo Goal)' : '-- Select Player In --'}</option>
                {allPlayers.filter(p => p._id !== playerId).map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.position})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Details / Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Notes / Reason (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Header, Free kick, Tactical foul"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !playerId}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Recording...' : 'Record Match Event'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
