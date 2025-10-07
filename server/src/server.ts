// Bootstrap server: connect DB then start Express
import { env } from '@/config/env.js';
import { connectMongo } from '@/config/db.js';
import app from './app.js';

async function start() {
  try {
    await connectMongo();
    console.log('MongoDB connected');
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

void start();
