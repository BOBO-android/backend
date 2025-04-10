import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model, Types } from 'mongoose';

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
      .select('fullName email image address')
      .lean();
  }
}
