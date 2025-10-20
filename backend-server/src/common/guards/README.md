# Common Guards & Decorators

Bộ guards và decorators chung cho toàn bộ ứng dụng, được thiết kế để các modules khác có thể sử dụng dễ dàng.

## 🛡️ Guards Available

### Authentication Guards

#### `JwtAuthGuard`
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedEndpoint() {
  return { message: 'This requires JWT token' };
}
```

#### `LocalAuthGuard`
```typescript
@UseGuards(LocalAuthGuard)
@Post('login')
async login(@Request() req) {
  return req.user;
}
```

#### `GoogleAuthGuard`
```typescript
@UseGuards(GoogleAuthGuard)
@Get('google')
async googleAuth() {
  // Redirects to Google OAuth
}
```

### Authorization Guards

#### `RolesGuard`
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@Get('admin-panel')
async adminPanel() {
  // Requires admin or moderator role
}
```

#### `AdminGuard`
```typescript
@UseGuards(AdminGuard)
@Delete('users/:id')
async deleteUser(@Param('id') id: string) {
  // Only admins can access
}
```

### Utility Guards

#### `PublicGuard`
```typescript
@Public()
@Get('public-endpoint')
async publicEndpoint() {
  // No authentication required
}
```

#### `OptionalAuthGuard`
```typescript
@UseGuards(OptionalAuthGuard)
@Get('optional-auth')
async optionalAuth(@CurrentUser() user) {
  if (user) {
    return { message: 'Authenticated', user };
  }
  return { message: 'Anonymous' };
}
```

#### `ThrottleGuard`
```typescript
// Default rate limiting (100 requests per minute)
@UseGuards(ThrottleGuard)
@Get('rate-limited')
async rateLimited() {
  // Rate limited endpoint
}

// Custom rate limiting
@UseGuards(ThrottleGuard.create(10, 60000)) // 10 requests per minute
@Get('custom-rate-limit')
async customRateLimit() {
  // Custom rate limiting
}
```

## 🎯 Decorators

### `@Public()`
```typescript
@Public()
@Get('health')
async healthCheck() {
  return { status: 'ok' };
}
```

### `@Roles(...roles)`
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@Get('admin-only')
async adminOnly() {
  return { message: 'Admin access' };
}
```

### `@CurrentUser()`
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return user;
}

// Lấy specific field
@Get('user-email')
async getUserEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

## 📋 Ví dụ sử dụng

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { 
  JwtAuthGuard, 
  AdminGuard, 
  RolesGuard, 
  ThrottleGuard,
  OptionalAuthGuard 
} from 'src/common/guards';
import { Roles, Public, CurrentUser } from 'src/common/decorators';

@Controller('example')
@UseGuards(ThrottleGuard) // Apply to all endpoints
export class ExampleController {

  @Public()
  @Get('public')
  async publicEndpoint() {
    return { message: 'Anyone can access' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async protectedEndpoint(@CurrentUser() user: any) {
    return { message: 'Authenticated user', user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  @Get('admin-panel')
  async adminPanel(@CurrentUser() user: any) {
    return { message: 'Admin access', user };
  }

  @UseGuards(AdminGuard)
  @Post('admin-only')
  async adminOnly(@CurrentUser() user: any) {
    return { message: 'Only admin', user };
  }

  @UseGuards(OptionalAuthGuard)
  @Get('optional')
  async optionalAuth(@CurrentUser() user: any) {
    return user 
      ? { message: 'Authenticated', user }
      : { message: 'Anonymous' };
  }
}
```

## 🔧 Cấu hình Module

Để sử dụng guards trong module, cần import và provide chúng:

```typescript
import { Module } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, ThrottleGuard } from '../../common/guards';

@Module({
  providers: [
    YourService,
    JwtAuthGuard, 
    RolesGuard, 
    ThrottleGuard
  ],
})
export class YourModule {}
```

## 🚀 Best Practices

1. **Sử dụng `@Public()` cho endpoints không cần authentication**
2. **Kết hợp guards khi cần**: `@UseGuards(JwtAuthGuard, RolesGuard)`
3. **Sử dụng `@CurrentUser()` thay vì `@Request() req`**
4. **Áp dụng rate limiting với `ThrottleGuard`**
5. **Sử dụng `OptionalAuthGuard` cho endpoints hỗ trợ cả authenticated và anonymous users**

## 📦 Import

```typescript
// Import guards
import { 
  JwtAuthGuard, 
  AdminGuard, 
  RolesGuard, 
  ThrottleGuard,
  OptionalAuthGuard 
} from 'src/common/guards';

// Import decorators
import { Roles, Public, CurrentUser } from 'src/common/decorators';
```

## 🔒 User Roles

Hệ thống hỗ trợ các roles sau:
- `user` - Người dùng thông thường (default)
- `moderator` - Người kiểm duyệt
- `admin` - Quản trị viên

Roles được lưu trong Users schema và được sử dụng trong JWT payload.
