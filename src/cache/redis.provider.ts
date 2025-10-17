import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = new Redis({
      host: process.env.REDIS_HOST || 'stater-project-redis',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    client.on('connect', () => console.log('✅ Redis connected'));
    client.on('error', (err) => console.error('❌ Redis error', err));

    return client;
  },
};
