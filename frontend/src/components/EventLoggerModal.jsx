import React, { useState } from 'react';
import { X, ShieldAlert, Award, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function EventLoggerModal({ isOpen, onClose, match, onAddEvent }) {
  const [eventType, setEventType] = useState('goal');
  const [minute, setMinute] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [secondaryPlayerId, setSecondaryPlayerId] = useState('');
  const [value, setValue] = useState(1);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !match) return null;

  // Combine all match players
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
      // Reset form
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1628] border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <h3 className="text-lg font-black text-white">Record Match Event</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Quick Select Event Type */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Event Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'goal', label: '⚽ Goal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                { id: 'save', label: '🧤 Save', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
                { id: 'yellow_card', label: '🟨 Yellow', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                { id: 'red_card', label: '🟥 Red', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                { id: 'tackle', label: '🛡️ Tackle', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
                { id: 'substitution', label: '🔄 Sub', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEventType(item.id)}
                  className={`py-2 px-3 rounded-xl font-extrabold text-xs border text-center transition-all ${
                    eventType === item.id ? `${item.color} shadow-lg ring-2 ring-emerald-500` : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minute Input */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Minute</label>
            <input
              type="number"
              min="1"
              max="120"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Primary Player Selection */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
              {eventType === 'goal' ? '⚽ Goal Scorer' : eventType === 'substitution' ? 'Player Out' : 'Primary Player'}
            </label>
            <select
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
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

          {/* Secondary Player Selection for Goal Assist / Sub In */}
          {(eventType === 'goal' || eventType === 'substitution') && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                {eventType === 'goal' ? '🎯 Assist Provider (Optional)' : 'Player In'}
              </label>
              <select
                value={secondaryPlayerId}
                onChange={(e) => setSecondaryPlayerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">{eventType === 'goal' ? 'None (Solo Goal / Unassisted)' : '-- Select Player In --'}</option>
                {allPlayers.filter(p => p._id !== playerId).map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.position})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Details / Reason */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Notes / Reason (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Header, Free-kick, Tactical foul"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting || !playerId}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold py-3 rounded-xl text-sm uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-50 transition"
            >
              {submitting ? 'Recording...' : 'RECORD EVENT'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
