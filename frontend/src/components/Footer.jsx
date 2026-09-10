import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 py-8 text-center text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚽</span>
          <span className="font-black text-white tracking-wider text-sm">FootHeroes</span>
          <span className="text-slate-500">• Your Local Football Career & Turf Match Scorer</span>
        </div>
        <div className="text-slate-500 font-semibold">
          Derived Event Scoring • Match Codes • Player Career Badges
        </div>
      </div>
    </footer>
  );
}
