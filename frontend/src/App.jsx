import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import PlayerProfile from './pages/PlayerProfile';
import CreateMatch from './pages/CreateMatch';
import JoinMatch from './pages/JoinMatch';
import MatchScoring from './pages/MatchScoring';
import MatchDetail from './pages/MatchDetail';
import MatchHistory from './pages/MatchHistory';
import Memories from './pages/Memories';
import Leaderboards from './pages/Leaderboards';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-emerald-500 selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/join" element={<JoinMatch />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerProfile />} />
              <Route path="/create-match" element={<CreateMatch />} />
              <Route path="/scoring/:id" element={<MatchScoring />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
              <Route path="/history" element={<MatchHistory />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
