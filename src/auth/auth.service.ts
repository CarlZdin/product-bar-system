import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly supabaseService: SupabaseService,
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

    await this.usersService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return { message: 'Registration successful. You can now log in.' };
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

    return { message: 'Login successful', user };
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
}
