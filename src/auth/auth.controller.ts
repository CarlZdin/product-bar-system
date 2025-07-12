import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string }) {
    return this.authService.resetPassword(body.email);
  }

  @Post('reset-password/confirm')
  async resetPasswordConfirm(
    @Body()
    body: {
      access_token: string;
      refresh_token: string;
      new_password: string;
    },
  ) {
    return this.authService.resetPasswordConfirm(
      body.access_token,
      body.refresh_token,
      body.new_password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: any) {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Bearer token is required for logout.');
    }

    const token = authorization.split(' ')[1];
    return this.authService.logout(token);
  }
}
