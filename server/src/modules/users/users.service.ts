import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';
import { UserRole } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsersDto): Promise<User> {
     
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return await this.prisma.user.create({
     data: {
        name:dto.name,
        email:dto.email,
        password: hashedPassword,
        role: dto.role,
     },
    //  select: {
    //    id: true,
    //    name: true,
    //    email: true,
    //  }
    });
    }

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string){
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }

    return user;
  }

  update(id: string, dto:UpdateUserDto) {
    return this.prisma.user.update({
      where: {id},
      data: dto
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
