#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const moduleName = args[0];

if (!moduleName) {
  console.error('❌ Vui lòng cung cấp tên module!');
  console.log('📖 Cách sử dụng: node scripts/import-module.js <module-name>');
  console.log('📝 Ví dụ: node scripts/import-module.js products');
  process.exit(1);
}

const moduleNamePascal = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const appModulePath = path.join(__dirname, '..', 'src', 'app.module.ts');

console.log(`🚀 Đang import module: ${moduleName}`);

let appModuleContent = fs.readFileSync(appModulePath, 'utf8');

if (appModuleContent.includes(`${moduleNamePascal}Module`)) {
  console.log(`⚠️  Module ${moduleNamePascal}Module đã được import rồi!`);
  process.exit(0);
}

const importStatement = `import { ${moduleNamePascal}Module } from './modules/${moduleName}/${moduleName}.module';\n`;

const importRegex = /(import.*from.*;\n)+/;
const importMatch = appModuleContent.match(importRegex);

if (importMatch) {
  appModuleContent = appModuleContent.replace(importRegex, importMatch[0] + importStatement);
} else {
  appModuleContent = importStatement + appModuleContent;
}

appModuleContent = appModuleContent.replace(
  'MongoDBConfig,',
  `MongoDBConfig, \n    ${moduleNamePascal}Module,\n`
);
fs.writeFileSync(appModulePath, appModuleContent);

console.log(`✅ Đã import ${moduleNamePascal}Module vào AppModule`);
console.log(`📝 File đã được cập nhật: ${appModulePath}`);
