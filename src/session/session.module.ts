import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { AuthService } from 'src/auth/auth.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { MembershipService } from 'src/membership/membership.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  controllers: [SessionController],
  providers: [
    SessionService,
    PrismaService,
    JwtService,
    TransactionService,
    AuthService,
    SupabaseService,
    MembershipService,
  ],
})
export class SessionModule {}
