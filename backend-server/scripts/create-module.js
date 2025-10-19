#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const moduleName = args[0];

if (!moduleName) {
  console.error('❌ Vui lòng cung cấp tên module!');
  console.log('📖 Cách sử dụng: node scripts/create-module.js <module-name>');
  console.log('📝 Ví dụ: node scripts/create-module.js products');
  process.exit(1);
}

console.log(`🚀 Đang tạo module hoàn chỉnh: ${moduleName}`);
console.log('=' .repeat(50));

try {
  console.log('📝 Bước 1: Tạo module files...');
  execSync(`node scripts/generate-module.js ${moduleName}`, { stdio: 'inherit' });
  
  console.log('\n📝 Bước 2: Import module vào AppModule...');
  execSync(`node scripts/import-module.js ${moduleName}`, { stdio: 'inherit' });
  
  console.log('\n🎉 Hoàn thành! Module đã được tạo và import thành công!');
  console.log('=' .repeat(50));
  console.log('📋 Các bước tiếp theo:');
  console.log('1. Kiểm tra và cập nhật schema theo nhu cầu');
  console.log('2. Cập nhật DTOs theo nhu cầu');
  console.log('3. Thêm validation và error handling nếu cần');
  console.log('4. Test module với API endpoints');
  
} catch (error) {
  console.error('❌ Có lỗi xảy ra:', error.message);
  process.exit(1);
}
