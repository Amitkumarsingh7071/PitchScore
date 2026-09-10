import mongoose from 'mongoose';

const matchEventSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  type: {
    type: String,
    enum: [
      'goal',
      'assist',
      'tackle',
      'interception',
      'key_pass',
      'save',
      'penalty_save',
      'yellow_card',
      'red_card',
      'substitution'
    ],
    required: true
  },
  minute: { type: Number, default: 0 },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  secondaryPlayerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }, // e.g. assister or sub in
  value: { type: Number, default: 1 }, // e.g. saves count or passes
  details: { type: String, default: '' }, // e.g. card reason, goal type
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MatchEvent', matchEventSchema);
