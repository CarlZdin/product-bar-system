import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, SupabaseModule],
})
export class AuthModule {}
