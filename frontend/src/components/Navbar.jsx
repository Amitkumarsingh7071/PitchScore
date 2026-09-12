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
  LogIn,
  Menu,
  X,
  Home,
  Shield
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
          
          {/* PitchScore Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm font-black text-sm tracking-wider group-hover:bg-emerald-700 transition-colors">
              PS
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight block leading-none font-['Inter']">PitchScore</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">Turf Match Scorer</span>
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

            {user && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                title="Admin Console & User Analytics"
              >
                <ShieldAlert size={14} className="text-amber-600" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* User Account / Sign In Status */}
            {user ? (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
                <div className="px-2.5 py-1 text-slate-700 font-medium flex items-center space-x-1.5">
                  <UserCheck size={13} className="text-emerald-600" />
                  <span className="truncate max-w-[100px] font-semibold">{user.name}</span>
                  <span className={`px-1.5 py-0.2 text-[9px] rounded uppercase font-bold ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-2 rounded-lg text-xs transition-colors"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/login"
              className="bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-lg font-semibold flex items-center justify-center text-xs"
            >
              <LogIn size={16} />
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

          <div className="pt-2 flex flex-col space-y-2">
            <Link
              to="/create-match"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-center block text-xs"
            >
              + Create New Match
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg text-center block text-xs border border-slate-200"
            >
              Sign In / Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
