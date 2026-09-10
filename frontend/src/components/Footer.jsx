import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#080c16] border-t border-slate-800/80 py-8 text-center text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚽</span>
          <span className="font-bold text-slate-200">Football Memory</span>
          <span>— Private Group Match & Stats Tracker</span>
        </div>
        <div className="text-slate-500">
          Derived source-of-truth stats engine • Automated Ratings & MOTM
        </div>
      </div>
    </footer>
  );
}
