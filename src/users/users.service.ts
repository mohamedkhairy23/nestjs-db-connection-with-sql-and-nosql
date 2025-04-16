import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Not found user for this ID ${id}`);
    }

    return new UserResponseDto(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const newUser = await this.userRepository.save(createUserDto);
      return new UserResponseDto(newUser);
    } catch (error) {
      // PostgreSQL specific error code for unique violation is "23505".
      // Adjust this code if you are using a different database.
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      }
      // You might log error details here if necessary
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // 1) find user to update
    const userToUpdate = await this.userRepository.findOneBy({ id });

    if (!userToUpdate) {
      throw new NotFoundException(`Not found user for this ID ${id}`);
    }

    // 2) update user
    const updatedUser = { ...userToUpdate, ...updateUserDto };

    const savedUpdatedUser = await this.userRepository.save(updatedUser);

    return new UserResponseDto(savedUpdatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
