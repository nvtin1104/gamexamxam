import { Controller, Get, Post, Put, Delete, Body, Param, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { JwtAuthGuard, RolesGuard, ThrottleGuard } from '../../common/guards';
import { CurrentUser, Permissions, Public, Roles } from '../../common/decorators';

@Controller('users')
@UseGuards(ThrottleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Public()
  async create(@Body() createUsersDto: CreateUsersDto) {
    return await this.usersService.create(createUsersDto);
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin', 'custom'])
  @Permissions(['read:all'])
  async findAll(@Query() query: any, @CurrentUser() user: any) {
    return this.usersService.findAll(query);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.userId);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    if (currentUser.role !== 'admin' && currentUser.userId !== id) {
      throw new BadRequestException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto, @CurrentUser() currentUser: any) {
    if (currentUser.role !== 'admin' && currentUser.userId !== id) {
      throw new BadRequestException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUsersDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  async getAdminStats() {
    const users = await this.usersService.findAll({});
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      googleUsers: users.filter(u => u.isLinkedGoogle).length,
      facebookUsers: users.filter(u => u.isLinkedFacebook).length,
    };
  }
}
