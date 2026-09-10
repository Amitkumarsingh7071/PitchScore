import React, { useEffect, useState } from 'react';
import { matchAPI, playerAPI } from '../services/api';
import MatchCard from '../components/MatchCard';
import { useAuth } from '../context/AuthContext';
import { History, MapPin } from 'lucide-react';

export default function MatchHistory() {
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, pRes] = await Promise.all([
          matchAPI.getAll(),
          playerAPI.getAll()
        ]);
        setMatches(mRes.data);
        setPlayers(pRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMatches = matches.filter((m) => {
    const matchesLoc = m.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    
    let matchesPlayer = true;
    if (selectedPlayer !== 'ALL') {
      const teamAPlayerIds = (m.teamA?.playerIds || []).map(p => p._id || p);
      const teamBPlayerIds = (m.teamB?.playerIds || []).map(p => p._id || p);
      matchesPlayer = teamAPlayerIds.includes(selectedPlayer) || teamBPlayerIds.includes(selectedPlayer);
    }

    return matchesLoc && matchesStatus && matchesPlayer;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <History className="text-emerald-600" size={28} />
          <span>Match History</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Complete archive of all matches played with derived scores and statistics
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Search Location */}
        <div className="relative">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by venue/location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        {/* Filter Player */}
        <div>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
          >
            <option value="ALL">-- All Participating Players --</option>
            {players.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.position})</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
          >
            <option value="ALL">-- All Match Statuses --</option>
            <option value="FINISHED">Finished Matches</option>
            <option value="IN_PROGRESS">In Progress Matches</option>
          </select>
        </div>

      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((m) => (
            <MatchCard key={m._id} match={m} isAdmin={isAdmin} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200 shadow-sm text-sm">
            No matches found. Create a match to start building your history!
          </div>
        )}
      </div>

    </div>
  );
}
