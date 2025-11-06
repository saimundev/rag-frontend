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
import { ScheduleModule } from '@nestjs/schedule';
import { TournamentModule } from './tournament/tournament.module';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { VenueModule } from './venue/venue.module';
import { PointTableModule } from './point-table/point-table.module';
import { ScoreModule } from './score/score.module';

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
    TournamentModule,
    TeamModule,
    PlayerModule,
    MatchModule,
    VenueModule,
    PointTableModule,
    ScoreModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
