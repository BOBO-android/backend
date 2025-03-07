import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './schemas/token.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async create({ userId, refreshToken }: CreateTokenDto) {
    const filter = { userId: userId };
    const update = {
      refreshToken,
      refreshTokensUsed: [],
    };
    const options = { upsert: true, new: true };

    const token = await this.tokenModel
      .findOneAndUpdate(filter, update, options)
      .lean();

    return token ? token.refreshToken : null;
  }

  async updateToken({ userId, refreshToken }: CreateTokenDto) {
    const filter = { userId: userId };
    const update = {
      $set: { refreshToken }, // Update refreshToken field
      $push: { refreshTokensUsed: { $each: [refreshToken] } }, // Add refreshToken to the array
    };
    const options = { upsert: true, new: true };

    const token = await this.tokenModel
      .findOneAndUpdate(filter, update, options)
      .lean();

    return token ? token.refreshToken : null;
  }

  async findOneByUserId(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const hasToken = await this.tokenModel.findOne({ userId: objectId });
    if (!hasToken) throw new NotFoundException();

    return hasToken;
  }
}
