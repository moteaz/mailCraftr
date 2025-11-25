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
import { TemplateService } from './template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@Body() dto: CreateTemplateDto, @Req() req) {
    return this.templateService.create(dto, req.user.id);
  }

  @Get('my-templates')
  findMyTemplates(@Req() req) {
    return this.templateService.findMyTemplates(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.templateService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTemplateDto,
    @Req() req,
  ) {
    return this.templateService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.templateService.remove(id, req.user.id);
  }
}
