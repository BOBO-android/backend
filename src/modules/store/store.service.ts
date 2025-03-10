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
import { ResendCodeDto } from './dto/resend-code.dto';
import aqp from 'api-query-params';
import { ROLES, STATUS_STORE } from '@/constant';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private readonly usersService: UsersService, // Inject UsersService
    private readonly mailerService: MailerService,
  ) {}

  async registerStore(createStoreDto: CreateStoreDto, ownerId: Types.ObjectId) {
    const { name, email } = createStoreDto;

    // Check if user exists
    const user = await this.usersService.findOneByIdDocument(
      ownerId.toString(),
    );
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
      owner: new Types.ObjectId(ownerId),
      slug,
      status: STATUS_STORE.PENDING,
      codeId: activationCode,
      codeExpired: dayjs().add(10, 'minutes'),
    });

    user.role = ROLES.shop;
    await user.save();

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

    const hasStore = await this.storeModel.findOne({
      owner: new Types.ObjectId(ownerId),
    });
    if (!hasStore) throw new NotFoundException('Store not found!');
    if (hasStore._id.toString() !== storeId) throw new BadRequestException();
    if (hasStore.isActive) return {};

    if (codeId !== hasStore.codeId)
      throw new BadRequestException('The code invalid or expried!');
    if (!dayjs().isBefore(hasStore.codeExpired))
      throw new BadRequestException('The code invalid or expried!');

    await hasStore.updateOne({ isActive: true, status: STATUS_STORE.ACTIVE });

    return {};
  }

  async resendCode(resendCodeDto: ResendCodeDto, ownerId: Types.ObjectId) {
    const { email } = resendCodeDto;

    const foundUser = await this.usersService.findOneByEmail(email);
    if (!foundUser) throw new BadRequestException();

    const foundStore = await this.storeModel.findOne({ owner: foundUser._id });
    if (!foundStore) throw new BadRequestException();
    if (foundStore.owner.toString() !== ownerId.toString())
      throw new BadRequestException();
    if (foundStore.isActive)
      throw new BadRequestException('Store has been activated!');

    // Generate a 4-digit numeric activation code
    const activationCode = randomInt(1000, 9999).toString(); // Ensures a 4-digit code
    foundStore.codeId = activationCode;
    foundStore.codeExpired = dayjs().add(10, 'minutes').toDate();

    await foundStore.save();

    // Send mail
    this.mailerService.sendMail({
      to: foundUser.email, // List to reciver
      subject: 'Active your store at BoBo', // Subject line
      template: 'register-store',
      context: {
        ownerName:
          foundUser?.fullName ?? foundUser?.username ?? foundUser?.email,
        storeName: foundStore.name,
        activationCode: foundStore.codeId,
        supportLink: '',
      },
    });

    return {};
  }

  async findAll(query: string, curent: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current || filter.current === 0) delete filter.current;
    if (filter.pageSize || filter.pageSize === 0) delete filter.pageSize;

    if (!curent || curent < 1) curent = 1;
    if (!pageSize || pageSize < 1) pageSize = 1;

    const totalItems = (await this.storeModel.find(filter).lean()).length;
    const totalPage = Math.ceil(totalItems / pageSize);
    const skip = (curent - 1) * pageSize;

    const results = await this.storeModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return { results, totalPage, totalItems };
  }

  async updateStatus(
    storeId: string,
    status: 'active' | 'inactive' | 'violation',
  ) {
    const statusUpdates = {
      active: { status, isActive: true, isViolation: false },
      inactive: { status, isActive: false, isViolation: false },
      violation: { status, isActive: false, isViolation: true },
    };

    const update = statusUpdates[status];

    const store = await this.storeModel.findByIdAndUpdate(
      storeId,
      update,
      { new: true, runValidators: true }, // Return updated store
    );
    return store;
  }

  async findByOwnerId(ownerId: string) {
    return await this.storeModel.findOne({
      owner: new Types.ObjectId(ownerId),
    });
  }
}
