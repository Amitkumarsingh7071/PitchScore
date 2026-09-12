import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerAPI, matchAPI } from '../services/api';
import { PlusCircle, Users, Calendar, ArrowRight, ArrowLeft, Share2, Copy, Check, Activity } from 'lucide-react';

export default function CreateMatch() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('City Football Turf');
  const [matchFormat, setMatchFormat] = useState('11v11');
  const [duration, setDuration] = useState(90);
  const [notes, setNotes] = useState('');

  const [teamAName, setTeamAName] = useState('Team Red');
  const [teamAPlayerIds, setTeamAPlayerIds] = useState([]);

  const [teamBName, setTeamBName] = useState('Team Blue');
  const [teamBPlayerIds, setTeamBPlayerIds] = useState([]);

  const [createdMatch, setCreatedMatch] = useState(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await playerAPI.getAll();
        setPlayers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const toggleTeamAPlayer = (id) => {
    if (teamAPlayerIds.includes(id)) {
      setTeamAPlayerIds(teamAPlayerIds.filter(pid => pid !== id));
    } else {
      if (teamBPlayerIds.includes(id)) {
        setTeamBPlayerIds(teamBPlayerIds.filter(pid => pid !== id));
      }
      setTeamAPlayerIds([...teamAPlayerIds, id]);
    }
  };

  const toggleTeamBPlayer = (id) => {
    if (teamBPlayerIds.includes(id)) {
      setTeamBPlayerIds(teamBPlayerIds.filter(pid => pid !== id));
    } else {
      if (teamAPlayerIds.includes(id)) {
        setTeamAPlayerIds(teamAPlayerIds.filter(pid => pid !== id));
      }
      setTeamBPlayerIds([...teamBPlayerIds, id]);
    }
  };

  const handleCreateMatch = async () => {
    setSubmitting(true);
    try {
      const res = await matchAPI.create({
        date,
        location: location || 'City Football Turf',
        duration: Number(duration),
        notes,
        teamA: { name: teamAName, playerIds: teamAPlayerIds },
        teamB: { name: teamBName, playerIds: teamBPlayerIds }
      });
      setCreatedMatch(res.data);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect to backend server';
      alert(`Could not create match: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (!createdMatch) return;
    const url = `${window.location.origin}/join?code=${createdMatch.matchCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // SUCCESS SCREEN WITH MATCH CODE SHARE CARD
  if (createdMatch) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-6 shadow-sm animate-in zoom-in duration-200">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
            <Activity size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Match Created Successfully!</h2>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Share Match Code With Players</div>
            
            <div className="text-3xl font-bold text-emerald-700 tracking-widest uppercase">
              {createdMatch.matchCode}
            </div>

            <p className="text-xs text-slate-500">
              Players can enter this code on the <span className="text-emerald-700 font-semibold">Join Match</span> page to select their team!
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyShareLink}
                className="w-full sm:w-auto bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2 hover:bg-slate-50"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied!' : 'Copy Match Join Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join our football match at ${createdMatch.location}! Enter Match Code: ${createdMatch.matchCode} at ${window.location.origin}/join?code=${createdMatch.matchCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center justify-center space-x-2"
              >
                <Share2 size={16} />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          <button
            onClick={() => navigate(`/scoring/${createdMatch._id}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg text-xs uppercase tracking-wider shadow-sm transition-colors"
          >
            Open Match Room & Record Events →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 text-center">
        <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
          <PlusCircle size={14} />
          <span>Match Setup Wizard</span>
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Create New Football Match</h1>
        <p className="text-slate-500 text-xs mt-1">Set up match details, generate a Match Code, and assign initial lineups</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 text-xs font-semibold uppercase">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            step === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <span>1. Match Info</span>
        </button>
        <span className="text-slate-300">→</span>
        <button
          onClick={() => setStep(2)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            step === 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <span>2. Select Lineups</span>
        </button>
      </div>

      {/* STEP 1: MATCH INFO */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Calendar className="text-emerald-600" size={18} />
            <span>Step 1 — Match Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Venue / Ground Name</label>
              <input
                type="text"
                placeholder="e.g. City Football Turf"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Format / Team Size</label>
              <select
                value={matchFormat}
                onChange={(e) => setMatchFormat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="5v5">5v5 (Futsal / Turf)</option>
                <option value="7v7">7v7 (Mini Pitch)</option>
                <option value="8v8">8v8 (Medium Field)</option>
                <option value="9v9">9v9 (Youth Ground)</option>
                <option value="11v11">11v11 (Full Pitch Standard)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Match Duration (Minutes)</label>
              <input
                type="number"
                min="30"
                max="120"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Notes / Weather</label>
              <input
                type="text"
                placeholder="e.g. Friendly evening match"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
            >
              <span>Next: Lineup Setup</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT TEAMS */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="text-emerald-600" size={18} />
              <span>Step 2 — Assign Lineups</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Assigned: {teamAPlayerIds.length + teamBPlayerIds.length} Players
            </span>
          </div>

          {/* Team Names */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <label className="text-[10px] font-semibold text-rose-700 uppercase block mb-1">Team A Name</label>
              <input
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-rose-900 font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <label className="text-[10px] font-semibold text-blue-700 uppercase block mb-1">Team B Name</label>
              <input
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-900 font-bold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Roster Assignment List */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase block">Assign registered players:</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {players.map((p) => {
                const isTeamA = teamAPlayerIds.includes(p._id);
                const isTeamB = teamBPlayerIds.includes(p._id);

                return (
                  <div key={p._id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={p.profileImage} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.position} • #{p.jerseyNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => toggleTeamAPlayer(p._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isTeamA ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Team A
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTeamBPlayer(p._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isTeamB ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Team B
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 hover:bg-slate-200"
            >
              <ArrowLeft size={15} />
              <span>Back to Match Info</span>
            </button>

            <button
              type="button"
              onClick={handleCreateMatch}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating Match...' : 'Create Match & Generate Code'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
