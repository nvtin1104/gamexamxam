# Scripts Tạo Module NestJS

Bộ script này giúp tự động tạo các module NestJS với cấu trúc hoàn chỉnh.

## Các Scripts Có Sẵn

### 1. `generate-module.js`
Tạo module với các file cần thiết:
- `{module-name}.module.ts` - Module chính
- `{module-name}.controller.ts` - Controller với CRUD operations
- `{module-name}.service.ts` - Service với business logic
- `{module-name}.schema.ts` - Mongoose schema
- `dto/create-{module-name}.dto.ts` - DTO cho create operation
- `dto/update-{module-name}.dto.ts` - DTO cho update operation

### 2. `import-module.js`
Tự động import module vào `AppModule`

### 3. `create-module.js`
Script tổng hợp: tạo module + import vào AppModule

## Cách Sử Dụng

### Tạo Module Hoàn Chỉnh (Khuyến nghị)
```bash
npm run create:module <module-name>
```

Ví dụ:
```bash
npm run create:module products
npm run create:module user-profiles
npm run create:module order-items
```

### Tạo Chỉ Module Files
```bash
npm run generate:module <module-name>
```

### Import Module Vào AppModule
```bash
npm run import:module <module-name>
```

## Cấu Trúc Module Được Tạo

```
src/modules/{module-name}/
├── {module-name}.module.ts      # Module chính
├── {module-name}.controller.ts  # Controller với CRUD
├── {module-name}.service.ts     # Service với business logic
├── {module-name}.schema.ts      # Mongoose schema
└── dto/
    ├── create-{module-name}.dto.ts  # Create DTO
    └── update-{module-name}.dto.ts  # Update DTO
```

## Template Code

### Module Template
- Import MongooseModule với schema
- Export service để sử dụng ở module khác

### Controller Template
- CRUD operations: GET, POST, PUT, DELETE
- Validation với DTOs
- Error handling cơ bản

### Service Template
- CRUD operations với Mongoose
- Error handling với NotFoundException
- TypeScript types đầy đủ

### Schema Template
- Mongoose schema với timestamps
- Các field cơ bản: name, description, isActive
- Có thể tùy chỉnh theo nhu cầu

## Lưu Ý

1. **Tên Module**: Chỉ sử dụng chữ thường, số và dấu gạch ngang
2. **Tự Động Import**: Script sẽ tự động import module vào AppModule
3. **Tùy Chỉnh**: Sau khi tạo, cần cập nhật schema và DTOs theo nhu cầu
4. **Validation**: Cần thêm class-validator decorators nếu cần validation phức tạp

## Ví Dụ Thực Tế

### Tạo Module Products
```bash
npm run create:module products
```

Sẽ tạo:
- `ProductsModule` với CRUD operations
- Schema với fields: name, description, isActive
- DTOs cho create/update operations
- Tự động import vào AppModule

### Tạo Module User Profiles
```bash
npm run create:module user-profiles
```

Sẽ tạo:
- `UserProfilesModule` với CRUD operations
- Schema với fields: name, description, isActive
- DTOs cho create/update operations
- Tự động import vào AppModule

## Troubleshooting

### Module đã tồn tại
Script sẽ báo cảnh báo và không ghi đè file hiện tại.

### Lỗi import vào AppModule
Kiểm tra cú pháp trong `app.module.ts` và chạy lại script import.

### Lỗi validation
Cần cài đặt `class-validator` và `class-transformer`:
```bash
npm install class-validator class-transformer
```
