import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/Roles.guard';
import { Roles } from '../user/decorator/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@Body() dto: CreateCategorieDto, @Req() req) {
    return this.categorieService.create(dto, req.user.id);
  }

  @Get('all')
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.categorieService.findAll();
  }

  @Get('my-categories')
  findMyCategories(@Req() req) {
    return this.categorieService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.categorieService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategorieDto,
    @Req() req,
  ) {
    return this.categorieService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.categorieService.remove(id, req.user.id);
  }
}
