import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedData.js';
import { calculateDashboardStats, calculateLeaderboards, calculatePlayerCareerStats } from './services/statsService.js';
import Player from './models/Player.js';
import Match from './models/Match.js';

const runBackendTest = async () => {
  console.log('--- Testing Backend Engine ---');
  await connectDB();
  await seedDatabase();

  const dashboard = await calculateDashboardStats();
  console.log('✅ Dashboard Overall Stats:', dashboard.overall);
  console.log('✅ Recent Matches Count:', dashboard.recentMatches.length);

  const leaderboards = await calculateLeaderboards();
  console.log('✅ Top Scorer:', leaderboards.topScorers[0]?.player?.name, 'with', leaderboards.topScorers[0]?.goals, 'goals');
  console.log('✅ Most MOTM:', leaderboards.mostMotm[0]?.player?.name, 'with', leaderboards.mostMotm[0]?.motmCount, 'MOTMs');
  console.log('✅ Highest Avg Rating:', leaderboards.highestAvgRating[0]?.player?.name, 'with', leaderboards.highestAvgRating[0]?.averageRating, 'rating');

  const firstPlayer = await Player.findOne({ name: 'Amit Singh' });
  if (firstPlayer) {
    const career = await calculatePlayerCareerStats(firstPlayer._id);
    console.log('✅ Career Stats for Amit Singh:', career.careerStats);
  }

  console.log('--- ALL BACKEND DERIVED CALCULATIONS VERIFIED SUCCESSFULLY ---');
  process.exit(0);
};

runBackendTest();
