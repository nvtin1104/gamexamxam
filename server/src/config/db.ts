// Initialize MongoDB connection using Mongoose
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectMongo() {
  const mongoUri = env.mongoUri;
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

export default connectMongo;
