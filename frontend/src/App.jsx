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
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-emerald-600 selection:text-white font-['Inter',sans-serif]">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
