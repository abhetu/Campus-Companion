import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UpdateUserDto,
  UpdateInterestsDto,
  UpdateAvailabilityDto,
  UserWithInterests,
} from '@campus-companion/api-types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req): Promise<UserWithInterests> {
    return this.usersService.findOneWithInterests(req.user.userId);
  }

  @Put('me')
  async updateMe(@Request() req, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateDto);
  }

  @Put('me/interests')
  async updateInterests(
    @Request() req,
    @Body() updateDto: UpdateInterestsDto
  ): Promise<UserWithInterests> {
    return this.usersService.updateInterests(req.user.userId, updateDto);
  }

  @Put('me/availability')
  async updateAvailability(
    @Request() req,
    @Body() updateDto: UpdateAvailabilityDto
  ): Promise<UserWithInterests> {
    return this.usersService.updateAvailability(req.user.userId, updateDto);
  }
}
