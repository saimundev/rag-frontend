import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginSchema } from './dot/login.dto';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}
  async LogIn(email: string, password: string) {
    const user = loginSchema.safeParse({ email, password });
    if (!user.success) {
      throw new Error(user.error.message);
    }

    const existUser = await this.prisma.user.findUnique({
      where: {
        email: user.data.email,
      },
    });

    if (!existUser) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(
      user.data.password,
      existUser.password,
    );

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    const payload = {
      sub: existUser.id,
      email: existUser.email,
      role: existUser.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  redirectToGoogle() {
    const redirectUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'email profile',
      }).toString();

    return redirectUrl;
  }

  async googleCallback(code: string) {
    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://oauth2.googleapis.com/token',
        params.toString(),
      ),
    );

    const { access_token } = tokenResponse.data;

    const { data: userInfo } = await firstValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        params: {
          access_token,
        },
      }),
    );

    let user = await this.userService.findOne(userInfo.email);
    if (!user) {
      user = await this.userService.signUpWithGoogle(userInfo);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  redirectToFacebook() {
    const redirectUrl =
      'https://www.facebook.com/v14.0/dialog/oauth?' +
      new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        response_type: 'code',
        scope: 'email',
      }).toString();

    return redirectUrl;
  }

  async facebookCallback(code: string) {
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID!,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
      code,
      scope: 'public_profile,email',
      response_type: 'code',
    });
    const tokenRes = await firstValueFrom(
      this.httpService.post(
        'https://graph.facebook.com/v17.0/oauth/access_token',
        params.toString(),
      ),
    );

    const { access_token } = tokenRes.data;

    const { data: userInfoRes } = await firstValueFrom(
      this.httpService.get(
        'https://graph.facebook.com/me?fields=id,name,email,picture,location,gender,birthday',
        {
          params: {
            access_token,
          },
        },
      ),
    );

    if (!userInfoRes.email) {
      throw new Error('Email not found');
    }

    let user = await this.userService.findOne(userInfoRes?.email);
    if (!user) {
      user = await this.userService.signUpWithGoogle(userInfoRes);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.roles,
    };

    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
