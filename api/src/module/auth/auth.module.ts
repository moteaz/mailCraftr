import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UserRepository } from '../../common/repositories/user.repository';
import { RefreshTokenRepository } from '../../common/repositories/refresh-token.repository';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('jwt.secret') || 'fallback-secret',
        signOptions: { expiresIn: (config.get<string>('jwt.accessTokenExpiresIn') || '1h') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, UserRepository, RefreshTokenRepository],
  exports: [AuthService],
})
export class AuthModule {}
