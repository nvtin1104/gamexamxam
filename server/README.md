# Gamexamxam API (Express TypeScript + MongoDB, Module-based)

API Node.js sử dụng Express TypeScript và MongoDB (Mongoose) theo kiến trúc module-based. Hỗ trợ JWT auth, phân quyền admin, validation với Joi, logger, và error handling toàn cục. Code dùng ES Modules.

## Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc cloud)

## Cấu trúc thư mục
```
server/
  package.json
  tsconfig.json
  src/
    app.ts              # khởi tạo express, middleware, auto-load routes modules
    server.ts           # chạy server + kết nối MongoDB
    config/
      env.ts            # đọc biến môi trường
      db.ts             # kết nối Mongoose
    middlewares/
      logger.ts         # morgan logger
      errorHandler.ts   # error handling toàn cục
      auth.ts           # authMiddleware, isAdmin
      validate.ts       # Joi validation middleware
    utils/
      apiError.ts       # lớp ApiError
      catchAsync.ts     # helper bắt async error
      token.ts          # util sinh/verify JWT
    modules/
      auth/
        service.ts
        controller.ts
        routes.ts       # basePath = /api/auth
      user/
        model.ts
        service.ts
        controller.ts
        routes.ts       # basePath = /api/users
      admin/
        routes.ts       # basePath = /api/admin
```

## Cài đặt
```bash
cd server
npm install
```

## Cấu hình môi trường (.env)
Tạo file `.env` trong thư mục `server/` (cùng cấp với `package.json`):
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gamexamxam
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

## Chạy server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Build TypeScript
npm run build

# Lint & Format
npm run lint
npm run format
```

Server sẽ chạy tại: http://localhost:3000
Health check: GET /health

## Endpoints chính

### Auth `/api/auth`
- POST `/register` { name, email, password }
- POST `/login` { email, password }
- POST `/refresh` { refreshToken }

### Users `/api/users`
- GET `/` (cần Bearer accessToken)
- POST `/` { name, email, password, role? }
- PUT `/:id` (cần Bearer) { name?, email?, password?, role? }
- DELETE `/:id` (cần Bearer)

### Admin `/api/admin` (cần Bearer + role=admin)
- GET `/users`
- DELETE `/users/:id`

## Ví dụ sử dụng

### Đăng ký user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Tạo user mới (cần token)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"user"}'
```

## Import Aliases
Dự án hỗ trợ import ngắn gọn với path mapping:
```typescript
// Thay vì
import { env } from '../../../config/env.js';
import { ApiError } from '../../utils/apiError.js';

// Có thể dùng
import { env } from '@/config/env.js';
import { ApiError } from '@/utils/apiError.js';
```

Các alias có sẵn:
- `@/config/*` → `src/config/*`
- `@/middlewares/*` → `src/middlewares/*`
- `@/utils/*` → `src/utils/*`
- `@/modules/*` → `src/modules/*`
- `@/types/*` → `src/types/*`
- `@/*` → `src/*`

## Ghi chú triển khai
- Password được hash bằng bcrypt trong `User.model` (hook `pre('save')`).
- JWT access/refresh tokens; middleware `authMiddleware` bảo vệ route, `isAdmin` kiểm tra quyền.
- Validation sử dụng Joi trên `body/params/query` qua middleware `validate`.
- Logger dùng morgan; error handler toàn cục trả JSON `{ success: false, message }`.
- TypeScript với strict mode tắt để dễ phát triển, có thể bật strict khi cần.
- Path mapping trong `tsconfig.json` để import ngắn gọn và dễ maintain.

## Phát triển thêm
- Thêm test (Jest/Supertest), rate limiting, Swagger/OpenAPI.
- Tách config theo môi trường (`NODE_ENV`).
- Thêm Docker, CI/CD pipeline.
