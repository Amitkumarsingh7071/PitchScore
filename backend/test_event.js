import { connectDB } from './config/db.js';
import Match from './models/Match.js';
import Player from './models/Player.js';
import MatchEvent from './models/MatchEvent.js';
import { calculateMatchDetails } from './services/statsService.js';

const testEvent = async () => {
  await connectDB();
  
  // Find or create a match
  let match = await Match.findOne();
  let players = await Player.find();

  if (!match) {
    match = await Match.create({
      matchNumber: 1,
      matchCode: 'TEST-01',
      date: new Date(),
      location: 'Test Turf',
      teamA: { name: 'Red', playerIds: [players[0]._id, players[1]._id] },
      teamB: { name: 'Blue', playerIds: [players[2]._id, players[3]._id] }
    });
  }

  console.log('Testing adding goal event for match:', match._id);

  try {
    const event = await MatchEvent.create({
      matchId: match._id,
      type: 'goal',
      minute: 10,
      playerId: players[0]._id,
      secondaryPlayerId: players[1]._id
    });
    console.log('Event created:', event._id);

    const details = await calculateMatchDetails(match._id);
    console.log('Calculated score:', details.score);
    console.log('✅ TEST PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ EVENT TEST ERROR:', err);
  }

  process.exit(0);
};

testEvent();
