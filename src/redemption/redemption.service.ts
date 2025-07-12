import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class RedemptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly transactionService: TransactionService,
  ) {}

  async redeemProduct(userId: number): Promise<string> {
    const lastRedemption = await this.prisma.redemption.findFirst({
      where: { userId },
      orderBy: { redeemedAt: 'desc' },
    });

    if (lastRedemption) {
      const timeSinceLastRedemption =
        new Date().getTime() - new Date(lastRedemption.redeemedAt).getTime();
      if (timeSinceLastRedemption < 60 * 1000) {
        throw new BadRequestException(
          'You can redeem only one product every minute.',
        );
      }
    }

    const user = await this.usersService.findUserById(userId);
    const productCost = 2;

    if (user.credits < productCost) {
      throw new BadRequestException('Insufficient credits.');
    }

    await this.prisma.redemption.create({
      data: {
        userId,
        cost: productCost,
      },
    });

    await this.usersService.updateCredits(userId, user.credits - productCost);

    // Log the transaction
    await this.transactionService.logTransaction(
      userId,
      'Product Redemption',
      productCost,
    );

    return 'Product redeemed successfully.';
  }
}
