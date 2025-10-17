import { QueueOptions } from 'bullmq';

export const redisConfig: QueueOptions['connection'] = {
  host: 'stater-project-redis', // same Redis service name from Docker
  port: 6379,
};
