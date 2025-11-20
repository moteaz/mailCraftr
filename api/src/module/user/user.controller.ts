import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/Roles.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @Roles(Role.SUPERADMIN) // Only SUPERADMIN can list all users
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPERADMIN) // Only SUPERADMIN can view user details
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPERADMIN) // Only SUPERADMIN can update users
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN) // Only SUPERADMIN can delete users
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
