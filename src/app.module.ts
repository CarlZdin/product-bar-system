import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaModule } from './prisma/prisma.module';
import { MembershipModule } from './membership/membership.module';
import { SessionModule } from './session/session.module';
import { RedemptionModule } from './redemption/redemption.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SupabaseModule,
    PrismaModule,
    MembershipModule,
    SessionModule,
    RedemptionModule,
  ],
  // controllers: [AuthController],
  // providers: [SupabaseService],
})
export class AppModule {}
