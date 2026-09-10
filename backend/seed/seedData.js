import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';

export const seedDatabase = async () => {
  console.log('Seeding initial Football Memory database (Clean State)...');

  await User.deleteMany({});
  await Player.deleteMany({});
  await Match.deleteMany({});
  await MatchEvent.deleteMany({});

  // 1. Create Admin & Player Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const playerPassword = await bcrypt.hash('player123', salt);

  await User.create({
    name: 'Amit Singh (Admin)',
    email: 'admin@footfriend.com',
    password: adminPassword,
    role: 'ADMIN'
  });

  await User.create({
    name: 'Rahul Sharma',
    email: 'player@footfriend.com',
    password: playerPassword,
    role: 'PLAYER'
  });

  // 2. Create Initial Player Profiles
  const playersData = [
    {
      name: 'Amit Singh',
      position: 'Forward',
      jerseyNumber: 10,
      bio: 'Lethal finisher with clinical accuracy and quick footwork.',
      profileImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Rahul Sharma',
      position: 'Midfielder',
      jerseyNumber: 8,
      bio: 'Playmaker with exceptional vision and surgical passing precision.',
      profileImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Rohit Verma',
      position: 'Goalkeeper',
      jerseyNumber: 1,
      bio: 'Brick wall between the posts with lightning reflexes.',
      profileImage: 'https://images.unsplash.com/photo-1543351611-c82399575a20?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Akash Patel',
      position: 'Defender',
      jerseyNumber: 4,
      bio: 'Solid center-back, dominant in aerial duels and key tackles.',
      profileImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Vikram Roy',
      position: 'Forward',
      jerseyNumber: 9,
      bio: 'Speedy winger who cuts inside and unleashes powerful shots.',
      profileImage: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Suresh Kumar',
      position: 'Midfielder',
      jerseyNumber: 6,
      bio: 'Box-to-box engine who covers every blade of grass.',
      profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Devraj Gill',
      position: 'Defender',
      jerseyNumber: 3,
      bio: 'Relentless left-back with pin-point crosses and defensive grit.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: 'Priya Nair',
      position: 'Goalkeeper',
      jerseyNumber: 12,
      bio: 'Agile shot-stopper known for clutch penalty saves.',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400'
    }
  ];

  await Player.insertMany(playersData);

  console.log('Database seeded with clean initial player roster (Zero pre-stored matches)!');
};
