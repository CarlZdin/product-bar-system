import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import * as crypto from 'crypto';

@Injectable()
export class MembershipService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
  ) {}

  async processPaymentDetails(
    userId: number,
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    name: string,
  ): Promise<boolean> {
    // Simulate successful payment
    const paymentSuccessful = true;

    if (paymentSuccessful) {
      const membershipCredits = 100;

      // Encrypt cardNumber and cvv
      const encryptedCardNumber = this.encryptData(cardNumber);
      const encryptedCVV = this.encryptData(cvv);

      try {
        await this.prisma.cardInformation.create({
          data: {
            cardNumber: encryptedCardNumber,
            expiryDate,
            cvv: encryptedCVV,
            name,
            userId,
          },
        });
        await this.usersService.updateCredits(userId, membershipCredits);

        // Log the transaction
        await this.transactionService.logTransaction(
          userId,
          'Membership Payment',
          membershipCredits,
        );

        return true;
      } catch (error) {
        throw new BadRequestException(
          'Payment failed. Membership not purchased.',
        );
      }
    } else {
      throw new BadRequestException(
        'Payment failed. Membership not purchased.',
      );
    }
  }

  private encryptData(data: string): string {
    try {
      const algorithm = process.env.ENCRYPTION_ALGO1;
      const key = crypto
        .createHash('sha256')
        .update(process.env.JWT_SECRET!)
        .digest();
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Include the IV with the encrypted data for decryption later
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Error during encryption:', error.message);
      throw new BadRequestException('Encryption failed.');
    }
  }
}
