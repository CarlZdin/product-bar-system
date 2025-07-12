import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MembershipController } from './membership.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  providers: [MembershipService],
  exports: [MembershipService],
  controllers: [MembershipController],
})
export class MembershipModule {}
