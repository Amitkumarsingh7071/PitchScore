import React, { useState } from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Finish Match & Save Memory</h3>
              <p className="text-xs text-slate-500">Calculates scores, ratings & Man of the Match</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Photo URL</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Story / Summary</label>
            <textarea
              rows="3"
              placeholder="e.g. A thrilling comeback victory in the final minutes..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-emerald-700 uppercase block mb-1 flex items-center gap-1">
              <Sparkles size={12} /> Best Moment
            </label>
            <input
              type="text"
              placeholder="e.g. Scored a last-minute hat-trick winner!"
              value={bestMoment}
              onChange={(e) => setBestMoment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-amber-700 uppercase block mb-1">Funny / Memorable Moment</label>
            <input
              type="text"
              placeholder="e.g. Goalkeeper accidentally kicked his shoe into the net!"
              value={funnyMoment}
              onChange={(e) => setFunnyMoment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Key Takeaway / Note</label>
            <input
              type="text"
              placeholder="e.g. Great sportsmanship from both teams."
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Computing Ratings & Saving...' : 'Finish Match & Archive Memory'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
