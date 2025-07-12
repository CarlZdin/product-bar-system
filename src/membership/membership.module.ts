import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MembershipController } from './membership.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    TransactionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [MembershipService],
  exports: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
