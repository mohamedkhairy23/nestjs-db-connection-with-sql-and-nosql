import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './users.service';
import { User } from './schema/user.schema';
import { ParseMongoIdPipe } from 'src/mongo/pipes/parse-mongo-id.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Find or search users' })
  @ApiResponse({ status: 200, description: 'User Results' })
  async find(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder = 'desc',
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('country') country?: string,
    @Query('search') search?: string, // <-- New
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safeSortOrder: 'asc' | 'desc' = sortOrder === 'asc' ? 'asc' : 'desc';

    return this.userService.findUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder: safeSortOrder,
      filters: { username, email, country },
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({ status: 200, description: 'User Exist' })
  async findOne(
    @Param('id', ParseMongoIdPipe)
    id: string,
  ): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body()
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
