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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from '@/decorator/customize';
import { GetEmailByUserNameDto } from './dto/get-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create user successfully')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage('Get all users successfully')
  findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @ResponseMessage('Get an user successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Public()
  @Post('get-email-by-username')
  @HttpCode(200)
  @ResponseMessage('Get email successfully')
  getEmailByUsername(@Body() getEmailByUsernameDto: GetEmailByUserNameDto) {
    const { username } = getEmailByUsernameDto;
    return this.usersService.findEmailByUsername(username);
  }

  @Patch(':id')
  @ResponseMessage('Update an user successfully')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete an user successfully')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
