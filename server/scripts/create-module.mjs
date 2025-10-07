#!/usr/bin/env node
// Script tạo module mới theo kiến trúc class-based
// Cách dùng: npm run gen:module -- <ten-module>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper functions
function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toLowerCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toPlural(str) {
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch')) {
    return str + 'es';
  }
  return str + 's';
}

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

function writeIfMissing(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Template generators
function generateModel(name, ModuleName) {
  return `// ${ModuleName} model
import mongoose from 'mongoose';

const ${toCamelCase(ModuleName)}Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const ${ModuleName} = mongoose.model('${ModuleName}', ${toCamelCase(ModuleName)}Schema);

export default ${ModuleName};
`;
}

function generateService(name, ModuleName) {
  return `// ${ModuleName} service - Business logic
import ${ModuleName} from './model.js';
import { ApiError } from '@/utils/apiError.js';

export class ${ModuleName}Service {
  // Lấy danh sách ${name}
  async list() {
    return ${ModuleName}.find({ isDeleted: false });
  }

  // Lấy theo ID
  async getById(id) {
    const item = await ${ModuleName}.findOne({ _id: id, isDeleted: false });
    if (!item) throw new ApiError(404, '${ModuleName} not found');
    return item;
  }

  // Tạo mới
  async create(data) {
    const item = await ${ModuleName}.create(data);
    return item;
  }

  // Cập nhật
  async update(id, data) {
    const item = await ${ModuleName}.findOne({ _id: id, isDeleted: false });
    if (!item) throw new ApiError(404, '${ModuleName} not found');
    
    Object.assign(item, data);
    await item.save();
    return item;
  }

  // Xóa (soft delete)
  async delete(id) {
    const item = await ${ModuleName}.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, isActive: false },
      { new: true }
    );
    if (!item) throw new ApiError(404, '${ModuleName} not found');
    return item;
  }
}

export default new ${ModuleName}Service();
`;
}

function generateController(name, ModuleName) {
  return `// ${ModuleName} controller using class-based approach
import { Request, Response } from 'express';
import ${toCamelCase(name)}Service from './service.js';
import catchAsync from '@/utils/catchAsync.js';

export class ${ModuleName}Controller {
  // GET /api/${name} - Lấy danh sách ${name}
  get${ModuleName}s = catchAsync(async (req: Request, res: Response) => {
    const items = await ${toCamelCase(name)}Service.list();
    res.json({ success: true, data: items });
  });

  // GET /api/${name}/:id - Lấy ${name} theo ID
  get${ModuleName}ById = catchAsync(async (req: Request, res: Response) => {
    const item = await ${toCamelCase(name)}Service.getById(req.params.id);
    res.json({ success: true, data: item });
  });

  // POST /api/${name} - Tạo ${name} mới
  create${ModuleName} = catchAsync(async (req: Request, res: Response) => {
    const item = await ${toCamelCase(name)}Service.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  // PUT /api/${name}/:id - Cập nhật ${name}
  update${ModuleName} = catchAsync(async (req: Request, res: Response) => {
    const item = await ${toCamelCase(name)}Service.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  });

  // DELETE /api/${name}/:id - Xóa ${name} (soft delete)
  remove${ModuleName} = catchAsync(async (req: Request, res: Response) => {
    const item = await ${toCamelCase(name)}Service.delete(req.params.id);
    res.json({ success: true, data: item });
  });
}

// Export instance
export default new ${ModuleName}Controller();
`;
}

function generateRoutes(name, ModuleName) {
  return `// ${ModuleName} routes under /api/${name}
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.js';
import { validate } from '@/middlewares/validate.js';
import ${toCamelCase(name)}Controller from './controller.js';
import Joi from 'joi';

export const basePath = '/api/${name}';
const router = Router();

// Validation schemas
const createSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
  }),
};

const updateSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
  }).min(1),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().hex().length(24).required() })
};

// Routes
router.get('/', authMiddleware, ${toCamelCase(name)}Controller.get${ModuleName}s);
router.get('/:id', authMiddleware, validate(idParamSchema), ${toCamelCase(name)}Controller.get${ModuleName}ById);
router.post('/', authMiddleware, validate(createSchema), ${toCamelCase(name)}Controller.create${ModuleName});
router.put('/:id', authMiddleware, validate(updateSchema), ${toCamelCase(name)}Controller.update${ModuleName});
router.delete('/:id', authMiddleware, validate(idParamSchema), ${toCamelCase(name)}Controller.remove${ModuleName});

export default router;
`;
}

function generateIndex(name, ModuleName) {
  return `// ${ModuleName} module - Main export file
export { default as ${ModuleName}Model } from './model.js';
export { default as ${ModuleName}Service } from './service.js';
export { default as ${ModuleName}Controller } from './controller.js';
export { default as ${ModuleName}Routes } from './routes.js';
`;
}

// Main function
function main() {
  const argNameIndex = process.argv.findIndex((a) => a === '--');
  const nameArg = argNameIndex !== -1 ? process.argv[argNameIndex + 1] : process.argv[2];
  
  if (!nameArg) {
    console.error('❌ Usage: npm run gen:module -- <module-name>');
    console.error('📝 Example: npm run gen:module -- product');
    process.exit(1);
  }

  const moduleName = nameArg.toLowerCase();
  const ModuleName = toPascalCase(moduleName);
  const modulesDir = path.resolve(projectRoot, 'src', 'modules');
  const moduleDir = path.join(modulesDir, moduleName);

  console.log(`🚀 Creating module: ${moduleName}`);
  console.log(`📁 Directory: ${moduleDir}`);

  // Create module directory
  ensureDir(moduleDir);

  // Generate files
  const created = [];
  
  if (writeIfMissing(path.join(moduleDir, 'model.ts'), generateModel(moduleName, ModuleName))) {
    created.push('model.ts');
  }
  
  if (writeIfMissing(path.join(moduleDir, 'service.ts'), generateService(moduleName, ModuleName))) {
    created.push('service.ts');
  }
  
  if (writeIfMissing(path.join(moduleDir, 'controller.ts'), generateController(moduleName, ModuleName))) {
    created.push('controller.ts');
  }
  
  if (writeIfMissing(path.join(moduleDir, 'routes.ts'), generateRoutes(moduleName, ModuleName))) {
    created.push('routes.ts');
  }
  
  if (writeIfMissing(path.join(moduleDir, 'index.ts'), generateIndex(moduleName, ModuleName))) {
    created.push('index.ts');
  }

  if (created.length === 0) {
    console.log(`⚠️  Module "${moduleName}" already exists (no files overwritten)`);
  } else {
    console.log(`✅ Created module "${moduleName}" with files: ${created.join(', ')}`);
    console.log(`📋 Generated endpoints:`);
    console.log(`   GET    /api/${moduleName}           - List all`);
    console.log(`   GET    /api/${moduleName}/:id       - Get by ID`);
    console.log(`   POST   /api/${moduleName}           - Create new`);
    console.log(`   PUT    /api/${moduleName}/:id       - Update`);
    console.log(`   DELETE /api/${moduleName}/:id       - Delete (soft)`);
    console.log(`\n🔧 Next steps:`);
    console.log(`   1. Customize the model schema in model.ts`);
    console.log(`   2. Add business logic in service.ts`);
    console.log(`   3. Restart server: npm run dev`);
  }
}

main();
