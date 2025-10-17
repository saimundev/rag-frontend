import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redisConfig } from './queue.config';
import { EmailProcessor } from './email/email.processor';
import { EmailProducer } from './email/email.producer';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
      connection: redisConfig,
    }),
  ],
  providers: [EmailProcessor, EmailProducer],
  exports: [EmailProducer],
})
export class QueueModule {}
