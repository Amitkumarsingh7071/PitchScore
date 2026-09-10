import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white font-black text-[10px] tracking-wider">
            PS
          </div>
          <span className="font-bold text-slate-900">PitchScore</span>
          <span>— Local Football Match Scorer & Career Tracker</span>
        </div>
        <div className="text-slate-400">
          Derived Event Calculations • Live Match Rooms • Dynamic Player Ratings
        </div>
      </div>
    </footer>
  );
}
