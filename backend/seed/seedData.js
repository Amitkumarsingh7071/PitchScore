import User from '../models/User.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';

export const seedDatabase = async () => {
  console.log('Initializing clean PitchScore database state (Zero demo data)...');

  await User.deleteMany({});
  await Player.deleteMany({});
  await Match.deleteMany({});
  await MatchEvent.deleteMany({});

  console.log('Database is 100% clean and ready for real users!');
};
