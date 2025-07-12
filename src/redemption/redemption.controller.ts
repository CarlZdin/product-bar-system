import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { RedemptionService } from './redemption.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @UseGuards(JwtAuthGuard) // Protect the route
  @Post('redeem')
  async redeemProduct(@Req() req: any) {
    const userId = req.user.sub; // Extract user ID from the token
    return this.redemptionService.redeemProduct(userId);
  }
}
