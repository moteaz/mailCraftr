import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepository } from '../../common/repositories/user.repository';
import { EmailService } from '../../common/services/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateUserDto) {
    if (await this.userRepository.exists(dto.email)) {
      throw new ConflictException('Email already in use');
    }

    const plainPassword = dto.password;
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    let user;
    try {
      await this.emailService.sendCredentials(dto.email, plainPassword);

      user = await this.userRepository.create({
        email: dto.email,
        password: hashedPassword,
        ...(dto.role && { role: dto.role }),
      });
    } catch (error) {
      throw new ConflictException(
        'Failed to send credentials email. User not created.',
      );
    }

    return {
      message: 'User created successfully and credentials sent via email',
      user,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [users, total] = await Promise.all([
      this.userRepository.findAll(page, limit),
      this.userRepository.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPERADMIN') {
      throw new ConflictException('Cannot modify SUPERADMIN user');
    }

    const updateData: any = { ...dto };

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 12);
    }

    return this.userRepository.update(id, updateData);
  }

  async remove(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'SUPERADMIN') {
      throw new ConflictException('Cannot delete SUPERADMIN user');
    }

    try {
      return this.userRepository.delete(id);
    } catch (error) {
      throw new ConflictException(
        'Cannot delete user with associated projects or categories. Remove them first.',
      );
    }
  }
}
