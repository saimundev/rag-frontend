import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('emailQueue')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<any>) {
    if (job.name === 'sendWelcomeEmail') {
      console.log(`📧 Sending welcome email to ${job.data.email}`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log('✅ Email sent!');
    }
  }
}
