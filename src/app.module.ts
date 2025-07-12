import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, AuthModule, SupabaseModule, PrismaModule],
  // controllers: [AuthController],
  // providers: [SupabaseService],
})
export class AppModule {}
