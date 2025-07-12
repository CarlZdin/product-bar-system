import { Module } from '@nestjs/common';
import { RedemptionController } from './redemption.controller';
import { RedemptionService } from './redemption.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { TransactionService } from '../transaction/transaction.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  controllers: [RedemptionController],
  providers: [RedemptionService, PrismaService, JwtService, TransactionService],
})
export class RedemptionModule {}
