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
  Query,
  UnauthorizedException,
  MessageEvent,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDeliveryService } from '../../common/services/webhook-delivery.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/Roles.guard';
import { Roles } from '../user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../common/repositories/user.repository';

@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly webhookDeliveryService: WebhookDeliveryService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateWebhookDto, @Req() req) {
    return this.webhookService.create(dto, req.user.id);
  }

  @Get('my-webhooks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findMyWebhooks(@Req() req) {
    return this.webhookService.findMyWebhooks(req.user.id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.webhookService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const isSuperAdmin = req.user.role === Role.SUPERADMIN;
    return this.webhookService.findOne(id, req.user.id, isSuperAdmin);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWebhookDto,
    @Req() req,
  ) {
    const isSuperAdmin = req.user.role === Role.SUPERADMIN;
    return this.webhookService.update(id, dto, req.user.id, isSuperAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const isSuperAdmin = req.user.role === Role.SUPERADMIN;
    return this.webhookService.remove(id, req.user.id, isSuperAdmin);
  }

  @Get('events/stream')
  async streamEvents(@Query('token') token: string, @Req() req) {
    console.log(
      'SSE connection attempt, token:',
      token ? 'present' : 'missing',
    );

    if (!token) {
      console.log('No token provided');
      throw new UnauthorizedException('Token required');
    }

    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findById(payload.sub);

      if (!user || user.role !== Role.SUPERADMIN) {
        console.log('User is not SUPERADMIN');
        throw new UnauthorizedException('SUPERADMIN only');
      }

      console.log('User authorized for SSE');
    } catch (error) {
      console.log('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }

    const res = req.res;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Send initial comment to keep connection alive
    res.write(': connected\n\n');

    this.webhookDeliveryService.addSseClient(res);

    req.on('close', () => {
      this.webhookDeliveryService.removeSseClient(res);
    });

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
    });

    // Return empty promise to keep connection open
    return new Promise(() => {});
  }
}
