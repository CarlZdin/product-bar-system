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

    if (user.credits < 25) {
      throw new BadRequestException(
        'Insufficient credits for check-in. You need at least $25 to check in.',
      );
    }

    const existingSession = await this.prisma.session.findFirst({
      where: { userId, checkOutAt: null },
    });

    if (existingSession) {
      throw new BadRequestException('You already have an active session.');
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
    const hourlyRate = 25;

    let hoursEligible = 0;

    const user = await this.usersService.findUserById(userId);

    // Calculate the number of hours the user can afford
    for (let i = 1; i <= durationHours; i++) {
      const costForNextHour = i * hourlyRate;
      if (user.credits >= costForNextHour) {
        hoursEligible = i;
      } else {
        break;
      }
    }

    // Auto checkout if user dont have enough credit for next hours
    const actualDurationHours = hoursEligible;
    const actualCost = actualDurationHours * hourlyRate;

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        checkOutAt: new Date(
          session.checkInAt.getTime() + actualDurationHours * 60 * 60 * 1000,
        ),
        durationMin: actualDurationHours * 60,
        cost: actualCost,
      },
    });

    await this.usersService.updateCredits(userId, user.credits - actualCost);

    // Log the transaction
    await this.transactionService.logTransaction(
      userId,
      'Session Checkout',
      actualCost,
    );

    return `Check-out successful. Duration: ${actualDurationHours} hours. Cost: $${actualCost}.`;
  }
}
