import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerAPI, matchAPI } from '../services/api';
import { PlusCircle, Users, Calendar, MapPin, Clock, ArrowRight, ArrowLeft, KeyRound, Share2, Copy, Check } from 'lucide-react';

export default function CreateMatch() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('City Football Turf');
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
      alert('Failed to create match');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // SUCCESS SCREEN WITH MATCH CODE SHARE CARD
  if (createdMatch) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/50 text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-black flex items-center justify-center mx-auto text-3xl font-black shadow-xl">
            ⚽
          </div>

          <h2 className="text-2xl font-black text-white uppercase">MATCH CREATED SUCCESSFULLY!</h2>
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share Match Code With Players</div>
            
            <div className="text-4xl font-black text-emerald-400 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
              {createdMatch.matchCode}
            </div>

            <p className="text-xs text-slate-400">
              Players can enter this code on the <span className="text-emerald-400 font-bold">Join Match</span> page to select their team!
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyShareLink}
                className="w-full sm:w-auto bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 hover:bg-slate-800"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied!' : 'Copy Match Join Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join our football match at ${createdMatch.location}! Enter Match Code: ${createdMatch.matchCode} at ${window.location.origin}/join?code=${createdMatch.matchCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2"
              >
                <Share2 size={16} />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          <button
            onClick={() => navigate(`/scoring/${createdMatch._id}`)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl hover:brightness-110"
          >
            OPEN MATCH ROOM & RECORD EVENTS →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center">
        <span className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black uppercase">
          <PlusCircle size={14} />
          <span>Match Setup Wizard</span>
        </span>
        <h1 className="text-3xl font-black text-white mt-2">Create New Football Match</h1>
        <p className="text-slate-400 text-xs mt-1">Set up venue details, generate a Match Join Code, and assign initial lineups</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 text-xs font-black uppercase">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            step === 1 ? 'bg-emerald-500 text-black shadow' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <span>1. Match Info</span>
        </button>
        <span className="text-slate-600">→</span>
        <button
          onClick={() => setStep(2)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            step === 2 ? 'bg-emerald-500 text-black shadow' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <span>2. Select Lineups</span>
        </button>
      </div>

      {/* STEP 1: MATCH INFO */}
      {step === 1 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-black text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Calendar className="text-emerald-400" size={20} />
            <span>Step 1 — Match Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Turf / Ground Name</label>
              <input
                type="text"
                placeholder="e.g. City Football Turf"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Duration (Minutes)</label>
              <input
                type="number"
                min="30"
                max="120"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Pre-Match Notes / Weather</label>
              <input
                type="text"
                placeholder="e.g. Wet pitch evening match"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-emerald-500 text-black font-extrabold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider hover:brightness-110 flex items-center space-x-2"
            >
              <span>Next: Lineup Setup</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT TEAMS */}
      {step === 2 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <Users className="text-emerald-400" size={20} />
              <span>Step 2 — Assign Initial Player Lineups</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              Assigned: {teamAPlayerIds.length + teamBPlayerIds.length} Players
            </span>
          </div>

          {/* Team Names Customization */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-2xl">
              <label className="text-[10px] font-bold text-rose-400 uppercase block mb-1">Team A Name</label>
              <input
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-rose-300 font-extrabold text-sm focus:outline-none"
              />
            </div>

            <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-2xl">
              <label className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Team B Name</label>
              <input
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="w-full bg-slate-900 border border-blue-500/40 rounded-xl px-3 py-2 text-blue-300 font-extrabold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Roster Assignment List */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase block">Select team for each player (or players can join using Match Code):</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {players.map((p) => {
                const isTeamA = teamAPlayerIds.includes(p._id);
                const isTeamB = teamBPlayerIds.includes(p._id);

                return (
                  <div key={p._id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={p.profileImage} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.position} • #{p.jerseyNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => toggleTeamAPlayer(p._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                          isTeamA ? 'bg-rose-500 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Team A
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTeamBPlayer(p._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                          isTeamB ? 'bg-blue-500 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
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

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Match Info</span>
            </button>

            <button
              type="button"
              onClick={handleCreateMatch}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? 'Creating Match...' : '⚽ CREATE MATCH & GENERATE CODE'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
