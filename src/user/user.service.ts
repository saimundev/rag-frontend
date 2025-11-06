import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CacheService } from 'src/cache/cache.service';
import { EmailProducer } from 'src/queue/email/email.producer';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly emailProducer: EmailProducer,
    private readonly notificationGateway: ChatGateway,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = createUserSchema.safeParse(createUserDto);
    if (!user.success) {
      throw new BadRequestException(user.error.errors[0].message);
    }

    const isUserExist = await this.prisma.user.findUnique({
      where: {
        email: user.data.email,
      },
    });

    if (isUserExist) {
      throw new BadRequestException('User already exist');
    }

    const hashPassword = await bcrypt.hash(user.data.password, 10);
    const userInfo = await this.prisma.user.create({
      data: {
        name: user.data.name,
        email: user.data.email,
        password: hashPassword,
        roles: user.data.role,
      },
    });

    await this.emailProducer.sendWelcomeEmail(userInfo);
    await this.notificationGateway.handleMessage({
      user: userInfo.email,
      text: 'Welcome to the app',
    });
    return userInfo;
  }

  async signUpWithGoogle(userInfo: any) {
    const user = await this.prisma.user.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        password: '',
        roles: 'ADMIN',
      },
    });
    return user;
  }

  async findAll() {
    const cached = await this.cacheService.get('users');
    if (cached) {
      return cached;
    }
    const users = await this.prisma.user.findMany();
    await this.cacheService.set('users', users);
    return users;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called every minute at 45 seconds');
  }
}
