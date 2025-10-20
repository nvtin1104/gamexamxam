import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsSchema } from './permissions.schema';
import { UsersSchema } from 'src/modules/users/users.schema';
import { GuardsModule } from 'src/common/guards/guards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Permissions', schema: PermissionsSchema },
      { name: 'Users', schema: UsersSchema }
    ]),
    GuardsModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule {}
