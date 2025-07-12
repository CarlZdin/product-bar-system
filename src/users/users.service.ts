import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updatePassword(email: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { password },
    });
  }

  async updateCredits(userId: number, credits: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { credits },
    });
  }
}
