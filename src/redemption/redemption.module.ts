import { Module } from '@nestjs/common';
import { RedemptionController } from './redemption.controller';
import { RedemptionService } from './redemption.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { TransactionService } from '../transaction/transaction.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MembershipService } from 'src/membership/membership.service';

@Module({
  imports: [UsersModule],
  controllers: [RedemptionController],
  providers: [
    RedemptionService,
    PrismaService,
    JwtService,
    TransactionService,
    AuthService,
    SupabaseService,
    MembershipService,
  ],
})
export class RedemptionModule {}
