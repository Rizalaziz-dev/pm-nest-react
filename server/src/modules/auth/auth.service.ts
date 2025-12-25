import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { LoginDto } from './dto/login';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      console.log('User from DB:', dto.email);
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      // accessToken: this.jwt.sign({
      //   sub: user.id,
      //   role: user.role,
      token: this.jwt.sign({ sub: user.id, role: user.role }),
      user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
      // }),
    }
  }
}

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        role: UserRole.USER,
      },
    });
  }
}import { Prisma } from '@prisma/client';

