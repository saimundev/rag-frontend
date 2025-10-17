import { Global, Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import axiosRetry from 'axios-retry';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  exports: [HttpModule],
})
export class HttpGlobalModule {
  constructor(private readonly httpService: HttpService) {
    axiosRetry(this.httpService.axiosRef, {
      retries: 3,
      retryDelay: (retryCount) => retryCount * 1000,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.code === 'EAI_AGAIN'
        );
      },
    });
  }
}
