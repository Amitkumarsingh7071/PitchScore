import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'emerald', subtitle }) {
  const colorStyles = {
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/20',
    blue: 'from-blue-500/20 to-cyan-500/5 text-blue-400 border-blue-500/20',
    purple: 'from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/20',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20',
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style} border p-5 glass-panel transition-transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-800">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
