import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../../common/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
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
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      accessToken,
      user: userWithoutPassword,
    };
  }
}
