import React, { useState } from 'react';
import { X, Trophy, Sparkles, Heart } from 'lucide-react';

export default function FinishMatchModal({ isOpen, onClose, onFinishMatch }) {
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800');
  const [summary, setSummary] = useState('');
  const [bestMoment, setBestMoment] = useState('');
  const [funnyMoment, setFunnyMoment] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onFinishMatch({
        photoUrl,
        summary,
        bestMoment,
        funnyMoment,
        keyTakeaway
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1628] border border-slate-700 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Finish Match & Archive Memory</h3>
              <p className="text-xs text-slate-400">Calculates scores, player ratings, MOTM & preserves long-term memory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Photo URL */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Memory Summary */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Memory Story / Description</label>
            <textarea
              rows="3"
              placeholder="e.g. We were trailing 4-2 with 10 minutes remaining, but made an unbelievable 6-4 comeback victory..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Best Moment */}
          <div>
            <label className="text-xs font-bold text-emerald-400 uppercase block mb-1 flex items-center gap-1">
              <Sparkles size={12} /> Best Moment
            </label>
            <input
              type="text"
              placeholder="e.g. Amit scored a last-minute hat-trick winner from outside the box!"
              value={bestMoment}
              onChange={(e) => setBestMoment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Funny Moment */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase block mb-1">Funny / Memorable Moment</label>
            <input
              type="text"
              placeholder="e.g. Suresh tried a bicycle kick and hit the corner flag!"
              value={funnyMoment}
              onChange={(e) => setFunnyMoment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Key Takeaway */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Key Takeaway / Note</label>
            <input
              type="text"
              placeholder="e.g. Great sportsmanship and amazing defense from both sides."
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-50 transition"
            >
              {submitting ? 'COMPUTING RATINGS & SAVING...' : '🏁 FINISH MATCH & SAVE MEMORY'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
