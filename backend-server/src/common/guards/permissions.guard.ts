import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permissions, PermissionsDocument } from 'src/modules/permissions/permissions.schema';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Permissions.name) private permissionsModel: Model<PermissionsDocument>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Bạn không có quyền truy cập');
    }
    if (user.role === 'root') {
      return true;
    }

    if (!requiredRoles && !requiredPermissions) {
      throw new UnauthorizedException('Bạn không có quyền truy cập');
    }

    if (requiredRoles && requiredRoles.length > 0) {
      if (!user.role) {
        throw new ForbiddenException('Tài khoản của bạn không có quyền truy cập');
      }

      if (requiredRoles.includes(user.role) && !requiredPermissions) {
        return true;
      }

      if (requiredRoles.includes('custom') && requiredPermissions) {
        return await this.checkCustomPermissions(user, requiredPermissions);
      }
    }
    throw new ForbiddenException('Tài khoản của bạn không có quyền truy cập');
  }

  private async checkCustomPermissions(user: any, requiredPermissions: string[]): Promise<boolean> {
    try {
      if (!user.permission) {
        throw new ForbiddenException('Tài khoản của bạn không có quyền truy cập');
      }

      const userPermission = await this.permissionsModel.findById(user.permission).exec();

      if (!userPermission || !userPermission.isActive) {
        throw new ForbiddenException('Quyền của bạn đã bị vô hiệu hóa');
      }

      const hasRequiredPermission = requiredPermissions.some(requiredPerm =>
        userPermission.actions.includes(requiredPerm)
      );

      if (!hasRequiredPermission) {
        throw new ForbiddenException('Bạn không có quyền truy cập');
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Không thể xác thực quyền truy cập');
    }
  }
}
