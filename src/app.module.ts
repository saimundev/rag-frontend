import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HttpGlobalModule } from './common/modules/http-global.module';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { CacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ limit: 3, ttl: seconds(60) }]),
    ScheduleModule.forRoot(),
    HttpGlobalModule,
    CacheModule,
    PrismaModule,
    UserModule,
    AuthModule,
    QueueModule,
    PaymentModule,
    ChatModule,
    ProductModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
