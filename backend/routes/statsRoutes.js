import express from 'express';
import { getDashboardData, getLeaderboardsData } from '../controllers/statsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get('/leaderboards', getLeaderboardsData);

export default router;
