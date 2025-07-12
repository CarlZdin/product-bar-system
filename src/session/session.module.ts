import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  controllers: [SessionController],
  providers: [SessionService, PrismaService, JwtService, TransactionService],
})
export class SessionModule {}
