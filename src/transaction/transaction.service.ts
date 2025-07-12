import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async logTransaction(
    userId: number,
    type: string,
    amount: number,
  ): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        userId,
        type,
        amount,
      },
    });
  }
}
