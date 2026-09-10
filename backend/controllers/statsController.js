import { calculateDashboardStats, calculateLeaderboards } from '../services/statsService.js';

export const getDashboardData = async (req, res) => {
  try {
    const data = await calculateDashboardStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboardsData = async (req, res) => {
  try {
    const data = await calculateLeaderboards();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
