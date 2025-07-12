import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MembershipService } from '../membership/membership.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();
  constructor(
    private readonly usersService: UsersService,
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
    private readonly membershipService: MembershipService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw new BadRequestException(error.message);

    const user = await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Registration successful. Please Proceed to payment.',
      userId: user.id,
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: { id: user.id, name: user.name, credits: user.credits },
      token,
    };
  }

  async resetPassword(email: string) {
    const { error } =
      await this.supabaseService.client.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      });
    if (error) throw new BadRequestException(error.message);
    return { message: 'Password reset email sent.' };
  }

  async resetPasswordConfirm(
    access_token: string,
    refresh_token: string,
    new_password: string,
  ) {
    await this.supabaseService.client.auth.setSession({
      access_token,
      refresh_token,
    });
    const { data, error } = await this.supabaseService.client.auth.updateUser({
      password: new_password,
    });
    if (error) throw new BadRequestException(error.message);
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const userEmail = data.user.email;
    await this.usersService.updatePassword(userEmail, hashedPassword);

    return { message: 'Password has been reset.', user: data.user };
  }

  async logout(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Token is required for logout.');
    }

    this.tokenBlacklist.add(token); // Add the token to the blacklist

    return { message: 'Logout successful. Token invalidated.' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token); // Check if the token is blacklisted
  }
}
