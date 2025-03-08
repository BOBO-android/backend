import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './schemas/store.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import slugify from 'slugify';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto';
import { VerifyStoreDto } from './dto/verify-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private usersService: UsersService, // Inject UsersService
    private readonly mailerService: MailerService,
  ) {}

  async registerStore(createStoreDto: CreateStoreDto, ownerId: Types.ObjectId) {
    const { name, email } = createStoreDto;

    // Check if user exists
    const user = await this.usersService.findOneById(ownerId.toString());
    if (!user) throw new NotFoundException('User account not found');
    if (user.email !== email) throw new BadRequestException();

    // Check if the user already owns a store
    const existingStore = await this.storeModel.findOne({ owner: ownerId });
    if (existingStore) {
      throw new ConflictException('User already owns a store');
    }

    // Generate slug from store name
    const slug = slugify(name, { lower: true, strict: true });

    // Generate a 4-digit numeric activation code
    const activationCode = randomInt(1000, 9999).toString(); // Ensures a 4-digit code

    // Save store in the database
    const newStore = await this.storeModel.create({
      ...createStoreDto,
      owner: ownerId,
      slug,
      codeId: activationCode,
      codeExpired: dayjs().add(10, 'minutes'),
    });

    // Send mail
    this.mailerService.sendMail({
      to: user.email, // List to reciver
      subject: 'Active your store at BoBo', // Subject line
      template: 'register-store',
      context: {
        ownerName: user?.fullName ?? user?.username ?? user?.email,
        storeName: newStore.name,
        activationCode: newStore.codeId,
        supportLink: '',
      },
    });

    return { storeId: newStore._id, userId: user._id };
  }

  async verifyStore(verifyDto: VerifyStoreDto, ownerId: Types.ObjectId) {
    const { storeId, codeId } = verifyDto;

    // Check if user exists
    const hasUser = await this.usersService.findOneById(ownerId.toString());
    if (!hasUser) throw new NotFoundException('User account not found!');

    const hasStore = await this.storeModel.findOne({ owner: ownerId });
    if (!hasStore) throw new NotFoundException('Store not found!');
    if (hasStore._id.toString() !== storeId) throw new BadRequestException();
    if (hasStore.isActive) return {};

    if (codeId !== hasStore.codeId)
      throw new BadRequestException('The code invalid or expried!');
    if (!dayjs().isBefore(hasStore.codeExpired))
      throw new BadRequestException('The code invalid or expried!');

    await hasStore.updateOne({ isActive: true });

    return {};
  }
}
