import mongoose from 'mongoose';

const playerMinutesSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  minutesPlayed: { type: Number, default: 90 }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  matchNumber: { type: Number },
  matchCode: { type: String, required: true, unique: true, index: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  location: { type: String, required: true, default: 'City Football Turf' }, // Turf / Ground name
  duration: { type: Number, default: 90 }, // in minutes
  teamA: {
    name: { type: String, default: 'Team Red' },
    playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    playerMinutes: [playerMinutesSchema]
  },
  teamB: {
    name: { type: String, default: 'Team Blue' },
    playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    playerMinutes: [playerMinutesSchema]
  },
  status: { 
    type: String, 
    enum: ['SCHEDULED', 'IN_PROGRESS', 'FINISHED'], 
    default: 'IN_PROGRESS' 
  },
  notes: { type: String, default: '' },
  memory: {
    photoUrl: { type: String, default: '' },
    summary: { type: String, default: '' },
    bestMoment: { type: String, default: '' },
    funnyMoment: { type: String, default: '' },
    keyTakeaway: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.model('Match', matchSchema);
