import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  profileImage: { type: String, default: '' },
  position: { 
    type: String, 
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], 
    default: 'Forward'
  },
  jerseyNumber: { type: Number, default: 10 },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Player', playerSchema);
