import React, { useEffect, useState } from 'react';
import { statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Trophy, UserCheck, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await statsAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Authorization Required</h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          The Admin Console & User Analytics panel is restricted strictly to Administrator accounts. Please sign in with an Admin account to access system metrics.
        </p>
        <Link to="/" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors">
          Return to Home Dashboard
        </Link>
      </div>
    );
  }

  const { overall, adminAnalytics } = data || {};
  const usersList = adminAnalytics?.recentRegisteredUsers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="text-amber-500" size={24} />
              <span>Admin Console — User Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live platform metrics, user registrations, and match server monitoring
            </p>
          </div>
        </div>

        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
          <Activity size={14} />
          <span>System Healthy</span>
        </span>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total User Accounts</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {adminAnalytics?.totalUserAccounts || overall?.totalUserAccounts || 0}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Registered via Sign Up</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Player Profiles</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {overall?.totalPlayers || 0}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Pitch Profiles Created</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Matches Hosted</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {overall?.totalMatches || 0}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">Completed Turf Matches</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy size={24} />
          </div>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Registered User Accounts ({usersList.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sorted by Sign-Up Date</span>
        </div>

        {usersList.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs italic">
            No registered users yet. Users will appear here automatically when they sign up!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Signed Up On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
