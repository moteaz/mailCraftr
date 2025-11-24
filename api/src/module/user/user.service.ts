import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRepository } from '../../common/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto) {
    if (await this.userRepository.exists(dto.email)) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      ...(dto.role && { role: dto.role }),
    });

    return {
      message: 'User created successfully',
      user,
    };
  }

  async findAll() {
    return this.userRepository.findAll();
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

    return this.userRepository.delete(id);
  }
}
