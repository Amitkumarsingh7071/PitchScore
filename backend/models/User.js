import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'PLAYER'], default: 'PLAYER' },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
