import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    if (!(await (user as any).comparePassword(password))) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
    return user;
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      permission: user.permission
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h', secret: process.env.JWT_SECRET }),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string, username: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email đã tồn tại');
    }

    const user = await this.usersService.create({
      email,
      password,
      name,
      username,
    });

    const payload = {
      email: user.email,
      sub: (user as any)._id,
      role: user.role,
      permission: user.permission
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h', secret: process.env.JWT_SECRET }),
      user: {
        id: (user as any)._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateGoogleUser(googleUser: any) {
    const user = await this.usersService.findByEmail(googleUser.email);
    if (user) {
      await this.usersService.update((user as any)._id, {
        canLoginGoogle: true,
        isLinkedGoogle: true,
      });
      return this.login(user);
    } else {
      const newUser = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        username: googleUser.email,
        password: crypto.randomBytes(32).toString('hex'),
        canLoginGoogle: true,
        isLinkedGoogle: true,
      });
      return this.login(newUser);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generate2FACode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  async verify2FA(email: string, code: string): Promise<boolean> {
    return /^\d{6}$/.test(code);
  }
}
