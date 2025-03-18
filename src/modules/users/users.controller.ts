import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetEmailByUserNameDto } from './dto/get-email.dto';

@ApiTags('Users') // Grouping in Swagger UI
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto }) // Specify expected request body
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'current', required: false, default: 1, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, default: 10, type: Number })
  findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiParam({ name: 'id', required: true, type: String })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Post('get-email-by-username')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get email by username' })
  @ApiResponse({ status: 200, description: 'Email retrieved successfully' })
  @ApiBody({ type: GetEmailByUserNameDto }) // Specify expected request body
  getEmailByUsername(@Body() getEmailByUsernameDto: GetEmailByUserNameDto) {
    return this.usersService.findEmailByUsername(
      getEmailByUsernameDto.username,
    );
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateUserDto }) // Specify expected request body
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiParam({ name: 'id', required: true, type: String })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
