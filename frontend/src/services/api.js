import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    if (window.location.origin !== 'https://pitchscore.onrender.com') {
      return 'https://pitchscore.onrender.com/api';
    }
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('footfriend_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const playerAPI = {
  getAll: () => API.get('/players'),
  getById: (id) => API.get(`/players/${id}`),
  create: (data) => API.post('/players', data),
  update: (id, data) => API.put(`/players/${id}`, data),
  delete: (id) => API.delete(`/players/${id}`),
};

export const matchAPI = {
  getAll: () => API.get('/matches'),
  getById: (id) => API.get(`/matches/${id}`),
  getByCode: (code) => API.get(`/matches/code/${code}`),
  create: (data) => API.post('/matches', data),
  joinByCode: (data) => API.post('/matches/join-code', data),
  update: (id, data) => API.put(`/matches/${id}`, data),
  finish: (id, data) => API.post(`/matches/${id}/finish`, data),
  delete: (id) => API.delete(`/matches/${id}`),
};

export const eventAPI = {
  getByMatch: (matchId) => API.get(`/events/match/${matchId}`),
  add: (data) => API.post('/events', data),
  update: (id, data) => API.put(`/events/${id}`, data),
  delete: (id) => API.delete(`/events/${id}`),
};

export const statsAPI = {
  getDashboard: () => API.get('/stats/dashboard'),
  getLeaderboards: () => API.get('/stats/leaderboards'),
};

export default API;
