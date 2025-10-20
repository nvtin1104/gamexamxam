import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreatePermissionsDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  createdById?: string;

  @IsOptional()
  @IsArray()
  actions: string[];


}
