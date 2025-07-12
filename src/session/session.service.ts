import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly transactionService: TransactionService,
  ) {}

  async checkIn(userId: number): Promise<string> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    await this.prisma.session.create({
      data: {
        userId,
        checkInAt: new Date(),
      },
    });

    return 'Check-in successful.';
  }
  async checkOut(userId: number): Promise<string> {
    const session = await this.prisma.session.findFirst({
      where: { userId, checkOutAt: null },
    });

    if (!session) {
      throw new BadRequestException('No active session found.');
    }

    const checkOutAt = new Date();
    const durationMs = checkOutAt.getTime() - session.checkInAt.getTime();
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round to nearest hour
    const cost = durationHours * 25;

    const user = await this.usersService.findUserById(userId);
    if (user.credits < cost) {
      throw new BadRequestException('Insufficient credits.');
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { checkOutAt, durationMin: durationHours * 60, cost },
    });

    await this.usersService.updateCredits(userId, user.credits - cost);

    // Log the transaction
    await this.transactionService.logTransaction(
      userId,
      'Session Checkout',
      cost,
    );

    return `Check-out successful. Duration: ${durationHours} hours. Cost: $${cost}.`;
  }
}
