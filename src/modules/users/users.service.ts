import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from '@/helpers';
import { ConfigService } from '@nestjs/config';
import aqp from 'api-query-params';
import { getInfo, isValidObjectId } from '@/utils';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { ROLES } from '@/constant';
import { MailerService } from '@nestjs-modules/mailer';
import { ResendCodeDto } from '@/auth/dto/resend-code.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async findById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async findByIdLean(_id: string) {
    return await this.userModel.findById(_id).lean();
  }

  async findByEmail({ email }: { email: string }) {
    return await this.userModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async findEmailByUsername(username: string) {
    const foundUser = await this.userModel.findOne({ username }).lean();
    if (!foundUser) throw new BadRequestException('Username not found!');

    return { email: foundUser.email };
  }

  async isUserExist(username: string) {
    const hasUser = await this.userModel.exists({ username });
    if (hasUser) return true;

    return false;
  }

  async isEmailExist(email: string) {
    const hasEmail = await this.userModel.exists({ email });
    if (hasEmail) return true;

    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, image } = createUserDto;

    // Check username has exist?
    const isUserExist = await this.isUserExist(username);
    if (isUserExist) {
      throw new BadRequestException(
        'Username already exists. Please use another username',
      );
    }

    // Check email has exist?
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email`,
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      role: this.configService.get<string>('ROLE_USER'),
      image,
    });

    return { _id: newUser._id };
  }

  async findAll(query: string, curent: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current || filter.current === 0) delete filter.current;
    if (filter.pageSize || filter.pageSize === 0) delete filter.pageSize;

    if (!curent || curent < 1) curent = 1;
    if (!pageSize || pageSize < 1) pageSize = 1;

    const totalItems = (await this.userModel.find(filter).lean()).length;
    const totalPage = Math.ceil(totalItems / pageSize);
    const skip = (curent - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return { results, totalPage, totalItems };
  }

  async findOneById(_id: string) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException();
    }

    const result = await this.userModel.findOne({ _id });

    return getInfo({
      object: result,
      fields: ['_id', 'username', 'email', 'role', 'isActive'],
    });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException();
    }

    const { username, email, password, image, role } = updateUserDto;

    // Hash password
    const hashedPassword = await hashPassword(password);

    const filter = { _id };
    const update = { username, email, password: hashedPassword, image, role };
    const options = { new: true };

    const result = await this.userModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    return getInfo({
      object: result,
      fields: ['_id', 'username', 'email', 'isActive'],
    });
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException();
    }

    const hasUser = await this.userModel.findById(id);

    if (!hasUser) {
      throw new NotFoundException('User not found!');
    }

    return hasUser.deleteOne();
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { username, email, password } = registerDto;

    // Check username has exist?
    const isUsernameExist = await this.isUserExist(username);
    if (isUsernameExist) {
      throw new BadRequestException(
        'Username already exists. Please user another username!',
      );
    }

    // Check email has exist?
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email!`,
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      isActive: false,
      role: ROLES.user,
      codeId: uuidv4(),
      codeExpired: dayjs().add(5, 'minutes'),
    });

    // Send mail
    this.mailerService.sendMail({
      to: user.email, // List to reciver
      subject: 'Active your account at SIC', // Subject line
      template: 'register',
      context: {
        name: user?.username ?? user?.email,
        activationCode: user.codeId,
      },
    });

    return { _id: user._id };
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    const { email } = resendCodeDto;

    const foundUser = await this.userModel.findOne({ email });
    if (!foundUser) throw new BadRequestException();

    foundUser.codeId = uuidv4();
    foundUser.codeExpired = dayjs().add(5, 'minutes').toDate();

    await foundUser.save();

    // Send mail
    this.mailerService.sendMail({
      to: foundUser.email, // List to reciver
      subject: 'Active your account at SIC', // Subject line
      template: 'register',
      context: {
        name: foundUser?.username ?? foundUser?.email,
        activationCode: foundUser.codeId,
      },
    });

    return {};
  }
}
