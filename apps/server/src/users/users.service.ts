import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  SignupDto,
  UpdateUserDto,
  UpdateInterestsDto,
  UpdateAvailabilityDto,
  UserWithInterests,
} from '@campus-companion/api-types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(signupDto: SignupDto) {
    const passwordHash = await bcrypt.hash(signupDto.password, 10);
    return this.prisma.user.create({
      data: {
        email: signupDto.email,
        passwordHash,
        name: signupDto.name,
        campus: signupDto.campus,
        role: signupDto.role,
        countryOrRegion: signupDto.countryOrRegion,
        degreeLevel: signupDto.degreeLevel,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneWithInterests(id: string): Promise<UserWithInterests> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        interests: true,
        availability: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      campus: user.campus,
      role: user.role,
      countryOrRegion: user.countryOrRegion,
      degreeLevel: user.degreeLevel,
      createdAt: user.createdAt,
      interests: user.interests.map((i) => i.interestKey),
      availability: user.availability.map((a) => ({
        id: a.id,
        dayOfWeek: a.dayOfWeek,
        startMinutes: a.startMinutes,
        endMinutes: a.endMinutes,
      })),
    };
  }

  async update(id: string, updateDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateInterests(id: string, updateDto: UpdateInterestsDto) {
    // Delete existing interests
    await this.prisma.userInterest.deleteMany({
      where: { userId: id },
    });

    // Create new interests
    if (updateDto.interests.length > 0) {
      await this.prisma.userInterest.createMany({
        data: updateDto.interests.map((interest) => ({
          userId: id,
          interestKey: interest,
        })),
      });
    }

    return this.findOneWithInterests(id);
  }

  async updateAvailability(id: string, updateDto: UpdateAvailabilityDto) {
    // Delete existing availability
    await this.prisma.userAvailability.deleteMany({
      where: { userId: id },
    });

    // Create new availability
    if (updateDto.availability.length > 0) {
      await this.prisma.userAvailability.createMany({
        data: updateDto.availability.map((avail) => ({
          userId: id,
          dayOfWeek: avail.dayOfWeek,
          startMinutes: avail.startMinutes,
          endMinutes: avail.endMinutes,
        })),
      });
    }

    return this.findOneWithInterests(id);
  }
}

