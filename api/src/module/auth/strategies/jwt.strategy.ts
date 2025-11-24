import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../../common/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string; role: Role }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
