import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FindUsersOptions } from './interfaces/interfaces';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUsers(options: FindUsersOptions): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit, sortBy, sortOrder, filters, search } = options;

    const query: any = {};

    // Filters
    if (filters.username) {
      query['username'] = { $regex: filters.username, $options: 'i' };
    }
    if (filters.email) {
      query['email'] = { $regex: filters.email, $options: 'i' };
    }
    if (filters.country) {
      query['country'] = filters.country;
    }

    // Search across multiple fields
    if (search) {
      query['$or'] = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.userModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    if (totalPages > 0 && page > totalPages) {
      throw new NotFoundException(
        `Page ${page} exceeds total pages ${totalPages}`,
      );
    }

    const users = await this.userModel
      .find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (users.length === 0) {
      throw new NotFoundException('No users found on this page');
    }

    return {
      data: users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Not found user ${id}`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createUser = await this.userModel.create(createUserDto);
      return createUser;
    } catch (error) {
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyPattern).join(', ');
        throw new ConflictException(
          `Duplicate value for field(s): ${duplicatedField}`,
        );
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true, runValidators: true }, // Ensure Mongoose runs schema validators
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyPattern).join(', ');
        throw new ConflictException(
          `Duplicate value for field(s): ${duplicatedField}`,
        );
      }

      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);

      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
