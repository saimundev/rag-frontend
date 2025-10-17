import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('emailQueue') private readonly emailQueue: Queue) {}

  async sendWelcomeEmail(user: any) {
    await this.emailQueue.add('sendWelcomeEmail', user);
  }
}
