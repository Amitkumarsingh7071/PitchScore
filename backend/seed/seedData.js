import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';

export const seedDatabase = async () => {
  console.log('Seeding initial Football Memory database...');

  await User.deleteMany({});
  await Player.deleteMany({});
  await Match.deleteMany({});
  await MatchEvent.deleteMany({});

  // 1. Create Admin & Player Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const playerPassword = await bcrypt.hash('player123', salt);

  const admin = await User.create({
    name: 'Amit Singh (Admin)',
    email: 'admin@footfriend.com',
    password: adminPassword,
    role: 'ADMIN'
  });

  const normalUser = await User.create({
    name: 'Rahul Sharma',
    email: 'player@footfriend.com',
    password: playerPassword,
    role: 'PLAYER'
  });

  // 2. Create Players
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

  const createdPlayers = await Player.insertMany(playersData);
  const p = {};
  createdPlayers.forEach(player => {
    p[player.name] = player._id;
  });

  // 3. Create Completed Match #24
  const match24 = await Match.create({
    matchNumber: 24,
    matchCode: 'FC-9482',
    date: new Date('2026-08-26'),
    location: 'City Football Turf',
    duration: 90,
    teamA: {
      name: 'Team Red',
      playerIds: [p['Amit Singh'], p['Rahul Sharma'], p['Rohit Verma'], p['Devraj Gill']]
    },
    teamB: {
      name: 'Team Blue',
      playerIds: [p['Vikram Roy'], p['Suresh Kumar'], p['Akash Patel'], p['Priya Nair']]
    },
    status: 'FINISHED',
    notes: 'Incredible high-scoring thriller under floodlights at City Football Turf!',
    memory: {
      photoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
      summary: 'Team Red secured a 6-4 victory after trailing 2-4 at half-time.',
      bestMoment: 'Amit Singh scored a hat-trick in the final 15 minutes to turn the game around!',
      funnyMoment: 'Suresh tried a bicycle kick and accidentally hit the corner flag.',
      keyTakeaway: 'Never give up when playing Team Red in the final 15 minutes.'
    },
    completedAt: new Date('2026-08-26T21:00:00')
  });

  const match24Events = [
    { matchId: match24._id, type: 'goal', minute: 12, playerId: p['Amit Singh'], secondaryPlayerId: p['Rahul Sharma'] },
    { matchId: match24._id, type: 'goal', minute: 22, playerId: p['Vikram Roy'], secondaryPlayerId: p['Suresh Kumar'] },
    { matchId: match24._id, type: 'goal', minute: 30, playerId: p['Vikram Roy'], secondaryPlayerId: p['Akash Patel'] },
    { matchId: match24._id, type: 'goal', minute: 40, playerId: p['Suresh Kumar'], secondaryPlayerId: null },
    { matchId: match24._id, type: 'goal', minute: 52, playerId: p['Rahul Sharma'], secondaryPlayerId: p['Amit Singh'] },
    { matchId: match24._id, type: 'goal', minute: 60, playerId: p['Vikram Roy'], secondaryPlayerId: null },
    { matchId: match24._id, type: 'goal', minute: 75, playerId: p['Amit Singh'], secondaryPlayerId: p['Rahul Sharma'] },
    { matchId: match24._id, type: 'goal', minute: 82, playerId: p['Amit Singh'], secondaryPlayerId: p['Devraj Gill'] },
    { matchId: match24._id, type: 'goal', minute: 87, playerId: p['Amit Singh'], secondaryPlayerId: p['Rahul Sharma'] },
    { matchId: match24._id, type: 'goal', minute: 89, playerId: p['Rahul Sharma'], secondaryPlayerId: p['Amit Singh'] },
    { matchId: match24._id, type: 'save', minute: 15, playerId: p['Rohit Verma'], value: 7 },
    { matchId: match24._id, type: 'save', minute: 25, playerId: p['Priya Nair'], value: 5 },
    { matchId: match24._id, type: 'tackle', minute: 45, playerId: p['Akash Patel'], value: 4 },
    { matchId: match24._id, type: 'interception', minute: 50, playerId: p['Devraj Gill'], value: 3 },
    { matchId: match24._id, type: 'yellow_card', minute: 65, playerId: p['Akash Patel'], details: 'Late tackle on Amit' }
  ];

  await MatchEvent.insertMany(match24Events);

  // 4. Create Completed Match #23
  const match23 = await Match.create({
    matchNumber: 23,
    matchCode: 'FC-1102',
    date: new Date('2026-08-19'),
    location: 'Downtown Turf Ground',
    duration: 90,
    teamA: {
      name: 'Team Red',
      playerIds: [p['Amit Singh'], p['Suresh Kumar'], p['Priya Nair'], p['Akash Patel']]
    },
    teamB: {
      name: 'Team Blue',
      playerIds: [p['Rahul Sharma'], p['Vikram Roy'], p['Rohit Verma'], p['Devraj Gill']]
    },
    status: 'FINISHED',
    notes: 'Defensive masterclass ending in a 2-2 draw.',
    memory: {
      photoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800',
      summary: 'Both teams fought bravely to draw 2-2 with impressive Goalkeeping performances.',
      bestMoment: 'Rohit Verma saved a last-minute penalty to hold the draw.',
      funnyMoment: 'Devraj lost his boot while chasing a long ball.',
      keyTakeaway: 'Priya and Rohit were the standout performers of the night.'
    },
    completedAt: new Date('2026-08-19T21:00:00')
  });

  const match23Events = [
    { matchId: match23._id, type: 'goal', minute: 18, playerId: p['Amit Singh'], secondaryPlayerId: p['Suresh Kumar'] },
    { matchId: match23._id, type: 'goal', minute: 34, playerId: p['Vikram Roy'], secondaryPlayerId: p['Rahul Sharma'] },
    { matchId: match23._id, type: 'goal', minute: 68, playerId: p['Rahul Sharma'], secondaryPlayerId: null },
    { matchId: match23._id, type: 'goal', minute: 80, playerId: p['Suresh Kumar'], secondaryPlayerId: p['Amit Singh'] },
    { matchId: match23._id, type: 'save', minute: 30, playerId: p['Rohit Verma'], value: 8 },
    { matchId: match23._id, type: 'save', minute: 40, playerId: p['Priya Nair'], value: 6 },
    { matchId: match23._id, type: 'penalty_save', minute: 88, playerId: p['Rohit Verma'], value: 1 }
  ];

  await MatchEvent.insertMany(match23Events);

  console.log('Seed database completed successfully!');
};
