import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Users, 
  PlusCircle, 
  History, 
  Heart, 
  KeyRound, 
  ShieldAlert, 
  UserCheck, 
  LogOut,
  Menu,
  X,
  Home,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout, quickLoginAdmin, quickLoginPlayer } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/join', label: 'Join Match', icon: KeyRound },
    { path: '/players', label: 'Players', icon: Users },
    { path: '/history', label: 'Matches', icon: History },
    { path: '/memories', label: 'Memories', icon: Heart },
    { path: '/leaderboards', label: 'Leaderboards', icon: Trophy },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#080d1a]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <span className="font-black text-lg text-white tracking-wider block leading-none font-['Plus_Jakarta_Sans']">FOOTBALL</span>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest leading-tight block">MEMORY FC</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-md shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/create-match"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle size={16} />
              <span>Create Match</span>
            </Link>

            {/* Role indicator */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={quickLoginAdmin}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  isAdmin ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Host/Admin mode"
              >
                <ShieldAlert size={12} />
                <span>Host</span>
              </button>
              <button
                onClick={quickLoginPlayer}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  !isAdmin && user ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Player mode"
              >
                <UserCheck size={12} />
                <span>Player</span>
              </button>
            </div>

            {user && (
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/join"
              className="bg-emerald-500 text-black p-2 rounded-xl font-bold flex items-center justify-center"
            >
              <KeyRound size={18} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1324] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider ${
                  isActive(link.path)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to="/create-match"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-emerald-500 text-black font-black py-3 rounded-2xl text-center block text-xs uppercase tracking-wider shadow"
            >
              + CREATE NEW MATCH
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
