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
  Activity
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold">
              <Activity size={20} />
            </div>
            <div>
              <span className="font-bold text-base text-slate-800 tracking-tight block leading-none">FOOTBALL</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">TRACKER</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/create-match"
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors"
            >
              <PlusCircle size={15} />
              <span>Create Match</span>
            </Link>

            {/* Quick Role Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs">
              <button
                onClick={quickLoginAdmin}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                  isAdmin ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to Host role"
              >
                <ShieldAlert size={12} />
                <span>Host</span>
              </button>
              <button
                onClick={quickLoginPlayer}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${
                  !isAdmin && user ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to Player role"
              >
                <UserCheck size={12} />
                <span>Player</span>
              </button>
            </div>

            {user && (
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/join"
              className="bg-emerald-600 text-white p-2 rounded-lg font-semibold flex items-center justify-center"
            >
              <KeyRound size={16} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-center block text-xs"
            >
              + Create New Match
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
