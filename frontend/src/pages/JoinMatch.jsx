import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { matchAPI, playerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { KeyRound, CheckCircle2, Share2, Copy, Check, UserPlus, UserCheck } from 'lucide-react';

export default function JoinMatch() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [matchCode, setMatchCode] = useState(initialCode);
  const [matchData, setMatchData] = useState(null);
  const [players, setPlayers] = useState([]);
  
  // Selection mode: 'EXISTING' or 'NEW'
  const [mode, setMode] = useState('EXISTING');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [position, setPosition] = useState('Forward');
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

        // Pre-select logged in user's player profile if available
        if (user && user.playerId) {
          const userPId = typeof user.playerId === 'object' ? user.playerId._id : user.playerId;
          setSelectedPlayerId(userPId);
          setMode('EXISTING');
        } else if (res.data.length > 0) {
          setSelectedPlayerId(res.data[0]._id);
        } else {
          setMode('NEW');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlayers();

    if (initialCode) {
      handleLookupCode(initialCode);
    }
  }, [initialCode, user]);

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
    if (!matchData) return;
    if (mode === 'EXISTING' && !selectedPlayerId) return;
    if (mode === 'NEW' && !newPlayerName.trim()) return;

    setLoading(true);
    try {
      const payload = {
        matchCode: matchData.match.matchCode,
        team: selectedTeam
      };

      if (mode === 'EXISTING') {
        payload.playerId = selectedPlayerId;
      } else {
        payload.newPlayerName = newPlayerName.trim();
        payload.position = position;
      }

      await matchAPI.joinByCode(payload);
      navigate(`/scoring/${matchData.match._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to join match');
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
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto shadow-sm text-white">
          <KeyRound size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Join Match Room</h1>
        <p className="text-slate-500 text-xs">
          Enter the 6-character match code provided by the match host to enter the squad lobby
        </p>
      </div>

      {/* Code Input Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block text-center">
          Enter Match Code
        </label>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="e.g. FC-9482"
            value={matchCode}
            onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-bold tracking-widest text-lg text-emerald-700 uppercase focus:outline-none focus:border-emerald-600 focus:bg-white"
            maxLength={7}
          />
          <button
            type="button"
            onClick={() => handleLookupCode()}
            disabled={searching || !matchCode}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors"
          >
            {searching ? 'Finding...' : 'Find Match'}
          </button>
        </div>

        {errorMsg && (
          <div className="text-rose-600 text-xs font-semibold text-center bg-rose-50 p-3 rounded-lg border border-rose-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Match Found & Player Selection */}
      {matchData && (
        <form onSubmit={handleJoinMatch} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in zoom-in duration-150">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <div className="text-xs font-semibold text-slate-500">Match Found</div>
            <div className="text-base font-bold text-slate-900">
              {matchData.match.teamA?.name} vs {matchData.match.teamB?.name}
            </div>
            <div className="text-xs text-emerald-700 font-semibold">
              Venue: {matchData.match.location}
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center space-x-1"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied!' : 'Copy Code Link'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join our football match! Enter Match Code: ${matchData.match.matchCode} at ${window.location.origin}/join?code=${matchData.match.matchCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
              >
                <Share2 size={14} />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Player Selection Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Player Setup
            </label>
            
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('EXISTING')}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                  mode === 'EXISTING' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <UserCheck size={14} />
                <span>Select Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('NEW')}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                  mode === 'NEW' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                }`}
              >
                <UserPlus size={14} />
                <span>Join as New Player</span>
              </button>
            </div>
          </div>

          {mode === 'EXISTING' ? (
            <div>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              >
                {players.length === 0 ? (
                  <option value="">No player profiles found — Switch to 'Join as New Player'</option>
                ) : (
                  players.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.position}) — #{p.jerseyNumber}
                    </option>
                  ))
                )}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Leo Messi"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="Forward">Forward</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                </select>
              </div>
            </div>
          )}

          {/* Team Choice */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Select Your Team
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTeam('teamA')}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  selectedTeam === 'teamA'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold ring-2 ring-rose-500'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-bold text-sm">{matchData.match.teamA?.name || 'Team Red'}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {(matchData.match.teamA?.playerIds || []).length} Players Assigned
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTeam('teamB')}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  selectedTeam === 'teamB'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold ring-2 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-bold text-sm">{matchData.match.teamB?.name || 'Team Blue'}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {(matchData.match.teamB?.playerIds || []).length} Players Assigned
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (mode === 'EXISTING' && !selectedPlayerId) || (mode === 'NEW' && !newPlayerName.trim())}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle2 size={18} />
            <span>{loading ? 'Joining Room...' : 'Enter Match Room'}</span>
          </button>

        </form>
      )}

    </div>
  );
}
