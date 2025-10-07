// Load environment variables and provide a typed, centralized config object
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gamexamxam',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_dev_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev_change_me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
};

export default env;
