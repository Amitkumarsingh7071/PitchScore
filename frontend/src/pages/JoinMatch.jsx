import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { matchAPI, playerAPI } from '../services/api';
import { KeyRound, Users, CheckCircle2, Shield, ArrowRight, Share2, Copy, Check } from 'lucide-react';

export default function JoinMatch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [matchCode, setMatchCode] = useState(initialCode);
  const [matchData, setMatchData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('teamA');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await playerAPI.getAll();
        setPlayers(res.data);
        if (res.data.length > 0) setSelectedPlayerId(res.data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlayers();

    if (initialCode) {
      handleLookupCode(initialCode);
    }
  }, [initialCode]);

  const handleLookupCode = async (codeToSearch) => {
    const code = codeToSearch || matchCode;
    if (!code) return;

    setSearching(true);
    setErrorMsg('');
    try {
      const res = await matchAPI.getByCode(code.trim());
      setMatchData(res.data);
    } catch (err) {
      setMatchData(null);
      setErrorMsg('Invalid or expired Match Code. Please verify with the match host.');
    } finally {
      setSearching(false);
    }
  };

  const handleJoinMatch = async (e) => {
    e.preventDefault();
    if (!selectedPlayerId || !matchData) return;

    setLoading(true);
    try {
      const res = await matchAPI.joinByCode({
        matchCode: matchData.match.matchCode,
        playerId: selectedPlayerId,
        team: selectedTeam
      });
      // Navigate to match scoring/details view
      navigate(`/scoring/${matchData.match._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to join match');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!matchData) return;
    const url = `${window.location.origin}/join?code=${matchData.match.matchCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Sporty Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 text-black">
          <KeyRound size={32} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">JOIN MATCH ROOM</h1>
        <p className="text-slate-400 text-xs">
          Enter the 6-character match code sent by your match host to enter the turf lobby
        </p>
      </div>

      {/* Code Input Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
          Enter Match Code
        </label>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="e.g. FC-9482"
            value={matchCode}
            onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 text-center font-black tracking-widest text-xl text-emerald-400 uppercase focus:outline-none focus:border-emerald-500 shadow-inner"
            maxLength={7}
          />
          <button
            type="button"
            onClick={() => handleLookupCode()}
            disabled={searching || !matchCode}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 transition"
          >
            {searching ? 'Finding...' : 'FIND MATCH'}
          </button>
        </div>

        {errorMsg && (
          <div className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Match Lobby Preview & Team Selection */}
      {matchData && (
        <form onSubmit={handleJoinMatch} className="glass-panel p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
          
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400">Match Found</div>
            <div className="text-lg font-black text-white">
              🔴 {matchData.match.teamA?.name} vs {matchData.match.teamB?.name} 🔵
            </div>
            <div className="text-xs text-emerald-400 font-bold">
              📍 Turf: {matchData.match.location}
            </div>

            {/* Share Code bar */}
            <div className="pt-2 flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 hover:text-white font-bold flex items-center space-x-1"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied!' : 'Copy Code Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join our football match on Football Memory! Enter Match Code: ${matchData.match.matchCode} at ${window.location.origin}/join?code=${matchData.match.matchCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1"
              >
                <Share2 size={14} />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Select Player Profile */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Select Your Player Profile
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              required
            >
              {players.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.position}) — #{p.jerseyNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Choose Team Red or Team Blue */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Select Your Side / Team
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTeam('teamA')}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  selectedTeam === 'teamA'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xl mb-1">🔴</div>
                <div className="font-black text-sm text-white">{matchData.match.teamA?.name || 'Team Red'}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {(matchData.match.teamA?.playerIds || []).length} Players Assigned
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTeam('teamB')}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  selectedTeam === 'teamB'
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300 ring-2 ring-blue-500 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-xl mb-1">🔵</div>
                <div className="font-black text-sm text-white">{matchData.match.teamB?.name || 'Team Blue'}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {(matchData.match.teamB?.playerIds || []).length} Players Assigned
                </div>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || !selectedPlayerId}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl hover:brightness-110 disabled:opacity-50 transition flex items-center justify-center space-x-2"
          >
            <CheckCircle2 size={20} />
            <span>{loading ? 'Joining Room...' : 'ENTER MATCH ROOM & PLAY'}</span>
          </button>

        </form>
      )}

    </div>
  );
}
