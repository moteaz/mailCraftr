import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../../common/repositories/user.repository';
import { RefreshTokenRepository } from '../../common/repositories/refresh-token.repository';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepository.findByEmail(email);

    // Always compare password even if user not found (timing attack prevention)
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$12$invalidhashfortimingatttack');

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    // Generate refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = this.configService.get<string>('jwt.refreshTokenExpiresIn');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenData = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!tokenData || tokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = { sub: tokenData.user.id, email: tokenData.user.email, role: tokenData.user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string) {
    try {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
    } catch (error) {
      // Token might not exist, ignore
    }
  }
}
