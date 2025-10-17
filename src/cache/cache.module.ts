import { Global, Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [redisProvider, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
