import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @UseGuards(JwtAuthGuard) // Protect the route
  @Post('check-in')
  async checkIn(@Req() req: any) {
    const userId = req.user.sub; // Extract user ID from the token
    return this.sessionService.checkIn(userId);
  }

  @UseGuards(JwtAuthGuard) // Protect the route
  @Post('check-out')
  async checkOut(@Req() req: any) {
    const userId = req.user.sub; // Extract user ID from the token
    return this.sessionService.checkOut(userId);
  }
}
