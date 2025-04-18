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
import { MongoIdDto } from './dtos/mongo-id.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
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
    await this.userModel.findByIdAndDelete(id);
  }
}
