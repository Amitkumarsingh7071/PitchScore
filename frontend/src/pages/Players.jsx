import React, { useEffect, useState } from 'react';
import { playerAPI, statsAPI } from '../services/api';
import PlayerCard from '../components/PlayerCard';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, X, Search, Filter } from 'lucide-react';

export default function Players() {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Player Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [jerseyNumber, setJerseyNumber] = useState(10);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [playersRes, lbRes] = await Promise.all([
        playerAPI.getAll(),
        statsAPI.getLeaderboards()
      ]);
      setPlayers(playersRes.data);
      setLeaderboards(lbRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await playerAPI.create({
        name,
        position,
        jerseyNumber: Number(jerseyNumber),
        bio,
        profileImage: profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'
      });
      setName('');
      setBio('');
      setProfileImage('');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to find calculated career stats for a player
  const getPlayerStats = (playerId) => {
    if (!leaderboards || !leaderboards.topScorers) return null;
    return leaderboards.topScorers.find(p => p.player._id === playerId) || null;
  };

  const filteredPlayers = players.filter(p => {
    const matchesPos = filterPosition === 'ALL' || p.position === filterPosition;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPos && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-emerald-400" size={32} />
            <span>Player Directory</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Permanent player roster with derived career statistics and performance history
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold px-5 py-3 rounded-2xl text-sm shadow-lg hover:brightness-110 transition flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>Add New Player</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search player name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Position Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'].map((pos) => (
            <button
              key={pos}
              onClick={() => setFilterPosition(pos)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterPosition === pos
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player._id}
            player={player}
            stats={getPlayerStats(player._id)}
          />
        ))}
      </div>

      {/* Add Player Modal (Admin) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1628] border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">Add New Player Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amit Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Forward">Forward</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Jersey #</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Profile Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Short Bio</label>
                <textarea
                  rows="2"
                  placeholder="Playstyle notes or bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold py-3 rounded-xl text-sm uppercase tracking-wider shadow hover:brightness-110 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'CREATE PLAYER PROFILE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
