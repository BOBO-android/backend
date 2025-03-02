/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  let configService: ConfigService;

  const mockUser = {
    _id: 'a-mock-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
    isActive: true,
  };

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    exists: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('user'),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        image: 'image.jpg',
      };

      jest.spyOn(service, 'isUserExist').mockResolvedValue(false);
      jest.spyOn(service, 'isEmailExist').mockResolvedValue(false);
      mockUserModel.create.mockResolvedValue({ _id: 'new-user-id' });

      const result = await service.create(dto);

      expect(result).toEqual({ _id: 'new-user-id' });
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if username exists', async () => {
      const dto: CreateUserDto = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
        image: 'image.jpg',
      };

      jest.spyOn(service, 'isUserExist').mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email exists', async () => {
      const dto: CreateUserDto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
        image: 'image.jpg',
      };

      jest.spyOn(service, 'isUserExist').mockResolvedValue(false);
      jest.spyOn(service, 'isEmailExist').mockResolvedValue(true);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockResults = [mockUser];
      mockUserModel.find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockResults),
        lean: jest.fn().mockResolvedValue(mockResults),
      });

      const result = await service.findAll('', 1, 10);

      expect(result.results).toEqual(mockResults);
      expect(result.totalPage).toBe(1);
      expect(result.totalItems).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('66f04912b69d8c6edc5272a2');

      expect(result).toEqual({
        _id: '66f04912b69d8c6edc5272a2',
        username: 'testuser',
        email: 'test@example.com',
        role: 'rgzbvFXcpKB9R82GJZAcXISKYQZhsKXj3ovSifLI2hZhgDbJF0ECyzmRey0DtOj5',
        isActive: true,
      });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword',
        image: 'newimage.jpg',
        role: 'admin',
      };

      mockUserModel.findOneAndUpdate.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update('a-mock-id', updateDto);

      expect(result).toEqual({
        _id: 'a-mock-id',
        username: 'updateduser',
        email: 'updated@example.com',
        isActive: true,
      });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(
        service.update('invalid-id', {} as UpdateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // Add more tests for other methods as needed
});
