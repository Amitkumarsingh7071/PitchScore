import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Activity, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, quickLoginAdmin, quickLoginPlayer } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await quickLoginAdmin();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPlayer = async () => {
    setLoading(true);
    try {
      await quickLoginPlayer();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto shadow-sm text-white">
          <Activity size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Your Account</h1>
        <p className="text-slate-500 text-xs">
          Access your football match tracker, player career statistics, and match rooms
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-lg flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. admin@footfriend.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-1.5"
          >
            <LogIn size={16} />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 text-center uppercase">Or One-Click Demo Sign In</div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Host Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoPlayer}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1"
            >
              <UserCheck size={14} className="text-blue-600" />
              <span>Player Demo</span>
            </button>
          </div>
        </div>

        {/* Sign Up Redirect */}
        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Create Account
          </Link>
        </div>

      </div>

    </div>
  );
}
