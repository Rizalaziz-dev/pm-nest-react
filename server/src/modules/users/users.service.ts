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

  async update(id: string, dto:UpdateUserDto) {
    const data: any = { 
    name: dto.name, 
    email: dto.email, 
    role: dto.role 
  };

  // Only hash and update password if the user actually typed a new one
  if (dto.password && dto.password.length > 0) {
    data.password = await bcrypt.hash(dto.password, 10);
  }

  return this.prisma.user.update({
    where: { id },
    data: data
  });
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
      where: { id:id } 
    })
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} could not be found`)
    }
    
  }
}
