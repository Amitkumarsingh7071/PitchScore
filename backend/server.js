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

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'PitchScore API', time: new Date() });
});

// Serve static frontend in production if built
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) next();
  });
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
    console.log(`⚽ PitchScore Backend API running on port ${PORT}`);
  });
};

startServer();
