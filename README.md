# Gamexamxam API (Express + MongoDB, Module-based)

API Node.js sử dụng Express và MongoDB (Mongoose) theo kiến trúc module-based. Hỗ trợ JWT auth, phân quyền admin, validation với Joi, logger, và error handling toàn cục. Code dùng ES Modules.

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc cloud)

### Cấu trúc thư mục
```
project-root/
  serve/
    package.json
    scripts/
      create-module.mjs   # script tạo module mặc định
    src/
      app.js              # khởi tạo express, middleware, auto-load routes modules
      server.js           # chạy server + kết nối MongoDB
      config/
        env.js            # đọc biến môi trường
        db.js             # kết nối Mongoose
      middlewares/
        logger.js         # morgan logger
        errorHandler.js   # error handling toàn cục
        auth.js           # authMiddleware, isAdmin
        validate.js       # Joi validation middleware
      utils/
        apiError.js       # lớp ApiError
        catchAsync.js     # helper bắt async error
        token.js          # util sinh/verify JWT
      modules/
        auth/
          service.js
          controller.js
          routes.js       # basePath = /api/auth
        user/
          model.js
          service.js
          controller.js
          routes.js       # basePath = /api/users
        admin/
          routes.js       # basePath = /api/admin
```

Lưu ý: Nếu bạn dùng script tạo module mặc định, module sẽ được sinh vào `serve/src/modules/<ten-module>/` (hoặc theo cấu hình script hiện tại).

### Cài đặt
```bash
cd serve
npm install
```

### Cấu hình môi trường (.env)
Tạo file `.env` trong thư mục `serve/` (cùng cấp với `package.json`):
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gamexamxam
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

### Chạy server
```bash
npm start
# Server: http://localhost:3000
# Health check: GET /health
```

### Endpoints chính
- Auth `/api/auth`
  - POST `/register` { name, email, password }
  - POST `/login` { email, password }
  - POST `/refresh` { refreshToken }

- Users `/api/users`
  - GET `/` (cần Bearer accessToken)
  - POST `/` { name, email, password, role? }
  - PUT `/:id` (cần Bearer) { name?, email?, password?, role? }
  - DELETE `/:id` (cần Bearer)

- Admin `/api/admin` (cần Bearer + role=admin)
  - GET `/users`
  - DELETE `/users/:id`

### Script tạo module mặc định
- Tạo nhanh module skeleton gồm `model.js`, `service.js`, `controller.js`, `routes.js`.
- Cách dùng (từ thư mục `serve/`):
```bash
npm run gen:module -- <ten-module>

# ví dụ
npm run gen:module -- blog
```
- Script không ghi đè file đã tồn tại.
- Mặc định, `routes.js` có `export const basePath = '/api/<ten-module>'` để `app.js` auto-mount khi khởi động.

### Ghi chú triển khai
- Password được hash bằng bcrypt trong `User.model` (hook `pre('save')`).
- JWT access/refresh tokens; middleware `authMiddleware` bảo vệ route, `isAdmin` kiểm tra quyền.
- Validation sử dụng Joi trên `body/params/query` qua middleware `validate`.
- Logger dùng morgan; error handler toàn cục trả JSON `{ success: false, message }`.

### Phát triển thêm
- Thêm test (Jest/Supertest), rate limiting, Swagger/OpenAPI.
- Tách config theo môi trường (`NODE_ENV`).
