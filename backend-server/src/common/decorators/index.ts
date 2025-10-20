import { SetMetadata } from '@nestjs/common';
const PERMISSIONS_KEY = 'permissions';
const ROLES_KEY = 'roles';
const IS_PUBLIC_KEY = 'isPublic';
const Permissions = (permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
const Roles = (roles: string[]) => SetMetadata(ROLES_KEY, roles);
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export { PERMISSIONS_KEY, ROLES_KEY, Permissions, Roles, Public, IS_PUBLIC_KEY };
export { CurrentUser } from './current-user.decorator';
