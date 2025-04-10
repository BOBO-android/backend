import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class MeService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getProfile(userId: Types.ObjectId) {
    return this.userModel
      .findById(userId)
      .select('username fullName image')
      .lean();
  }

  async getFullProfile(userId: Types.ObjectId) {
    return this.userModel
      .findById(userId)
      .select('fullName email image address phoneNumber')
      .lean();
  }

  async updateProfile(userId: Types.ObjectId, dto: UpdateProfileDto) {
    const updateData: Partial<UpdateProfileDto> = {};

    // Chỉ update nếu field tồn tại và khác null/empty string
    if (dto.fullName && dto.fullName.trim() !== '') {
      updateData.fullName = dto.fullName;
    }

    if (dto.image && dto.image.trim() !== '') {
      updateData.image = dto.image;
    }

    if (dto.address && dto.address.trim() !== '') {
      updateData.address = dto.address;
    }

    if (dto.phoneNumber && dto.phoneNumber.trim() !== '') {
      // Check trùng số điện thoại
      const existing = await this.userModel.findOne({
        phoneNumber: dto.phoneNumber,
        _id: { $ne: userId },
      });

      if (existing) {
        throw new BadRequestException('Phone number is already in use');
      }

      updateData.phoneNumber = dto.phoneNumber;
    }

    // Nếu không có trường nào hợp lệ thì trả về luôn
    if (Object.keys(updateData).length === 0) {
      return { message: 'No valid fields to update' };
    }

    await this.userModel.updateOne({ _id: userId }, { $set: updateData });

    return {};
  }
}
