import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB Atlas connection error: ${err.message}`);
      process.exit(1);
    }
  }

  // Fallback for local development if MONGO_URI is not set
  const localUri = 'mongodb://127.0.0.1:27017/pitchscore';

  try {
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`Local MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log('Local MongoDB connection failed. Starting embedded MongoMemoryServer fallback...');
    try {
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.3'
        }
      });
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Embedded MongoDB Memory Server connected at ${memoryUri}`);
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer:', memErr.message);
      process.exit(1);
    }
  }
};
