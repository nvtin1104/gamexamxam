#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const moduleName = args[0];

if (!moduleName) {
  console.error('❌ Vui lòng cung cấp tên module!');
  console.log('📖 Cách sử dụng: node scripts/generate-module.js <module-name>');
  console.log('📝 Ví dụ: node scripts/generate-module.js products');
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(moduleName)) {
  console.error('❌ Tên module chỉ được chứa chữ thường, số và dấu gạch ngang!');
  process.exit(1);
}

const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);
const moduleNamePascal = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

console.log(`🚀 Đang tạo module: ${moduleName}`);
console.log(`📁 Thư mục: ${moduleDir}`);

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
  console.log(`✅ Đã tạo thư mục: ${moduleDir}`);
} else {
  console.log(`⚠️  Thư mục đã tồn tại: ${moduleDir}`);
}

const moduleTemplate = `import { Module } from '@nestjs/common';
import { ${moduleNamePascal}Controller } from './${moduleName}.controller';
import { ${moduleNamePascal}Service } from './${moduleName}.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ${moduleNamePascal}Schema } from './${moduleName}.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ${moduleNamePascal}, schema: ${moduleNamePascal}Schema }])
  ],
  controllers: [${moduleNamePascal}Controller],
  providers: [${moduleNamePascal}Service],
  exports: [${moduleNamePascal}Service]
})
export class ${moduleNamePascal}Module {}
`;

const controllerTemplate = `import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ${moduleNamePascal}Service } from './${moduleName}.service';
import { Create${moduleNamePascal}Dto } from './dto/create-${moduleName}.dto';
import { Update${moduleNamePascal}Dto } from './dto/update-${moduleName}.dto';

@Controller('${moduleName}')
export class ${moduleNamePascal}Controller {
  constructor(private readonly ${moduleName}Service: ${moduleNamePascal}Service) {}

  @Post()
  async create(@Body() create${moduleNamePascal}Dto: Create${moduleNamePascal}Dto) {
    return this.${moduleName}Service.create(create${moduleNamePascal}Dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.${moduleName}Service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.${moduleName}Service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() update${moduleNamePascal}Dto: Update${moduleNamePascal}Dto) {
    return this.${moduleName}Service.update(id, update${moduleNamePascal}Dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.${moduleName}Service.remove(id);
  }
}
`;

const serviceTemplate = `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${moduleNamePascal}, ${moduleNamePascal}Document } from './${moduleName}.schema';
import { Create${moduleNamePascal}Dto } from './dto/create-${moduleName}.dto';
import { Update${moduleNamePascal}Dto } from './dto/update-${moduleName}.dto';

@Injectable()
export class ${moduleNamePascal}Service {
  constructor(
    @InjectModel(${moduleNamePascal}.name) private ${moduleName}Model: Model<${moduleNamePascal}Document>,
  ) {}

  async create(create${moduleNamePascal}Dto: Create${moduleNamePascal}Dto): Promise<${moduleNamePascal}> {
    const created${moduleNamePascal} = new this.${moduleName}Model(create${moduleNamePascal}Dto);
    return created${moduleNamePascal}.save();
  }

  async findAll(query: any = {}): Promise<${moduleNamePascal}[]> {
    return this.${moduleName}Model.find(query).exec();
  }

  async findOne(id: string): Promise<${moduleNamePascal}> {
    const ${moduleName} = await this.${moduleName}Model.findById(id).exec();
    if (!${moduleName}) {
      throw new NotFoundException(\`${moduleNamePascal} với ID \${id} không tồn tại\`);
    }
    return ${moduleName};
  }

  async update(id: string, update${moduleNamePascal}Dto: Update${moduleNamePascal}Dto): Promise<${moduleNamePascal}> {
    const updated${moduleNamePascal} = await this.${moduleName}Model
      .findByIdAndUpdate(id, update${moduleNamePascal}Dto, { new: true })
      .exec();
    
    if (!updated${moduleNamePascal}) {
      throw new NotFoundException(\`${moduleNamePascal} với ID \${id} không tồn tại\`);
    }
    
    return updated${moduleNamePascal};
  }

  async remove(id: string): Promise<void> {
    const result = await this.${moduleName}Model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(\`${moduleNamePascal} với ID \${id} không tồn tại\`);
    }
  }
}
`;

const schemaTemplate = `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ${moduleNamePascal}Document = ${moduleNamePascal} & Document;

@Schema({ timestamps: true })
export class ${moduleNamePascal} {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ${moduleNamePascal}Schema = SchemaFactory.createForClass(${moduleNamePascal});
`;

const createDtoTemplate = `import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class Create${moduleNamePascal}Dto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
`;

const updateDtoTemplate = `import { PartialType } from 'nestjs-mapped-types';
import { Create${moduleNamePascal}Dto } from './create-${moduleName}.dto';

export class Update${moduleNamePascal}Dto extends PartialType(Create${moduleNamePascal}Dto) {}
`;

const files = [
  { name: `${moduleName}.module.ts`, content: moduleTemplate },
  { name: `${moduleName}.controller.ts`, content: controllerTemplate },
  { name: `${moduleName}.service.ts`, content: serviceTemplate },
  { name: `${moduleName}.schema.ts`, content: schemaTemplate }
];

const dtoDir = path.join(moduleDir, 'dto');
if (!fs.existsSync(dtoDir)) {
  fs.mkdirSync(dtoDir, { recursive: true });
  console.log(`✅ Đã tạo thư mục dto: ${dtoDir}`);
}

const dtoFiles = [
  { name: `create-${moduleName}.dto.ts`, content: createDtoTemplate },
  { name: `update-${moduleName}.dto.ts`, content: updateDtoTemplate }
];

files.forEach(file => {
  const filePath = path.join(moduleDir, file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Đã tạo file: ${file.name}`);
  } else {
    console.log(`⚠️  File đã tồn tại: ${file.name}`);
  }
});

dtoFiles.forEach(file => {
  const filePath = path.join(dtoDir, file.name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Đã tạo file: ${file.name}`);
  } else {
    console.log(`⚠️  File đã tồn tại: ${file.name}`);
  }
});

console.log(`\n🎉 Hoàn thành tạo module: ${moduleName}`);
console.log(`📝 Các file đã tạo:`);
console.log(`   - ${moduleName}.module.ts`);
console.log(`   - ${moduleName}.controller.ts`);
console.log(`   - ${moduleName}.service.ts`);
console.log(`   - ${moduleName}.schema.ts`);
console.log(`   - dto/create-${moduleName}.dto.ts`);
console.log(`   - dto/update-${moduleName}.dto.ts`);

console.log(`\n📋 Bước tiếp theo:`);
console.log(`1. Import ${moduleNamePascal}Module vào AppModule`);
console.log(`2. Cập nhật schema theo nhu cầu`);
console.log(`3. Cập nhật DTOs theo nhu cầu`);
console.log(`4. Thêm validation và error handling nếu cần`);
