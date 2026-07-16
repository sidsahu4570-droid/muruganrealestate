import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';

    // Check if we should fallback to memory server
    if (process.env.USE_MEMORY_DB === 'true' || !process.env.MONGO_URI) {
      console.log('Spinning up transient in-memory MongoDB server...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('In-memory MongoDB started at:', mongoUri);
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.log('Fallback to in-memory MongoDB server due to local connection error:', (error as Error).message);
    try {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('Mongoose connected to transient in-memory DB:', mongoUri);
    } catch (err) {
      console.error('In-memory database startup failed:', err);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
