import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { UserPlus, Activity, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('Forward');
  const [jerseyNumber, setJerseyNumber] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authAPI.register({ 
        name, 
        email, 
        password, 
        role: 'PLAYER', 
        position, 
        jerseyNumber: Number(jerseyNumber) 
      });
      localStorage.setItem('footfriend_token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to register account');
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Player Account</h1>
        <p className="text-slate-500 text-xs">
          Set up your player profile, track match career stats, ratings and leaderboards
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
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. alex@example.com"
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              minLength={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase block mb-1">Jersey #</label>
              <input
                type="number"
                min="1"
                max="99"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center space-x-1.5"
          >
            <UserPlus size={16} />
            <span>{loading ? 'Creating Account...' : 'Create Account & Join PitchScore'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
}
