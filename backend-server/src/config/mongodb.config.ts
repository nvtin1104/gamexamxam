import { MongooseModule } from '@nestjs/mongoose';

export const MongoDBConfig = MongooseModule.forRoot(
  process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/gamexamxam',
  {
    autoCreate: true,
    autoIndex: true,
  },
);
