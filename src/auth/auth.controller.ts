import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dot/login.dto';
import { Public } from './public.decorator';
import { Response } from 'express';
import { seconds, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('login')
  logIn(@Body() logInDto: LoginDto) {
    return this.authService.LogIn(logInDto.email, logInDto.password);
  }

  @Public()
  @Get('google-login')
  redirectToGoogle(@Res() res: Response) {
    const redirectUrl = this.authService.redirectToGoogle();
    return res.redirect(redirectUrl);
  }

  @Public()
  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    return this.authService.googleCallback(code);
  }

  @Public()
  @Get('facebook-login')
  redirectToFacebook(@Res() res: Response) {
    const redirectUrl = this.authService.redirectToFacebook();
    return res.redirect(redirectUrl);
  }

  @Public()
  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string) {
    return this.authService.facebookCallback(code);
  }
}
