import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { seedDatabase } from './seed/seedData.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Football Memory API', time: new Date() });
});

// Start Server & Connect DB
const startServer = async () => {
  await connectDB();

  // Auto-seed if database has no users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`⚽ Football Memory Backend API running on port ${PORT}`);
  });
};

startServer();
