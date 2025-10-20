import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionsDto } from './dto/create-permissions.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CurrentUser, Permissions, Roles } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async create(@Body() createPermissionsDto: CreatePermissionsDto, @CurrentUser() user: any) {
    return this.permissionsService.create({ ...createPermissionsDto, createdById: user.userId });
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles(['custom', 'admin', 'moderator'])
  @Permissions(['read:all', 'read:permission'])
  async findAll(@Query() query: any) {
    // Kiểm tra có yêu cầu pagination không
    const { page, limit, sortBy, sortOrder, ...filterQuery } = query;
    
    if (page || limit) {
      return this.permissionsService.findAllWithPagination(filterQuery, {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        sortBy: sortBy || 'createdAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      });
    }
    return this.permissionsService.findAllWithCreatedBy(filterQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles(['custom', 'admin', 'moderator'])
  @Permissions(['read:all', 'read:permission'])
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOneWithCreatedBy(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async update(@Param('id') id: string, @Body() updatePermissionsDto: UpdatePermissionsDto) {
    return this.permissionsService.update(id, updatePermissionsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  // Endpoint mới: Lấy permissions theo role
  @Get('by-role/:role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles(['admin', 'moderator'])
  @Permissions(['read:all'])
  async getPermissionsByRole(@Param('role') role: string) {
    return this.permissionsService.findPermissionsByRole(role);
  }

  // Endpoint mới: Lấy permissions với pagination
  @Get('paginated')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles(['custom', 'admin', 'moderator'])
  @Permissions(['read:all', 'read:permission'])
  async findAllPaginated(@Query() query: any) {
    const { page, limit, sortBy, sortOrder, ...filterQuery } = query;
    
    return this.permissionsService.findAllWithPagination(filterQuery, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
    });
  }
}
