import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const MongoDBConfig = MongooseModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    autoCreate: true,
    autoIndex: true,
  }),
  inject: [ConfigService],
});
