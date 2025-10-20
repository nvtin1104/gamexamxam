import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsSchema } from '../../modules/permissions/permissions.schema';
import { PermissionsGuard } from './permissions.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ThrottleGuard } from './throttle.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Permissions', schema: PermissionsSchema }])
  ],
  providers: [PermissionsGuard, JwtAuthGuard, RolesGuard, ThrottleGuard],
  exports: [PermissionsGuard, JwtAuthGuard, RolesGuard, ThrottleGuard]
})
export class GuardsModule {}
