import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtService } from '@nestjs/jwt';

@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('payment')
  async processPayment(
    @Headers('authorization') authorization: string,
    @Body()
    body: {
      userId: number;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      name: string;
    },
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const token = authorization.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (decodedToken.sub !== body.userId) {
      throw new UnauthorizedException('Token does not match the user');
    }

    try {
      const paymentResult = await this.membershipService.processPaymentDetails(
        body.userId,
        body.cardNumber,
        body.expiryDate,
        body.cvv,
        body.name,
      );

      if (paymentResult) {
        return {
          message:
            'Registration successful. Membership purchased, and $100 credits assigned.',
        };
      }
    } catch (error) {
      throw new BadRequestException('Payment failed. Please try again.');
    }
  }
}
