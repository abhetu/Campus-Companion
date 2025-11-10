import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BuddyService } from './buddy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  OptInBuddyDto,
  CreateBuddyMeetingDto,
  UpdateMeetingStatusDto,
  BuddyMatch,
  BuddyOptInType,
} from '@campus-companion/api-types';

@Controller('buddy')
@UseGuards(JwtAuthGuard)
export class BuddyController {
  constructor(private buddyService: BuddyService) {}

  @Post('optin')
  async optIn(@Request() req, @Body() optInDto: OptInBuddyDto) {
    return this.buddyService.optIn(req.user.userId, optInDto);
  }

  @Post('optout')
  async optOut(@Request() req, @Body() body: { type: BuddyOptInType }) {
    return this.buddyService.optOut(req.user.userId, body.type);
  }

  @Get('match')
  async getCurrentMatch(@Request() req): Promise<BuddyMatch | null> {
    return this.buddyService.getCurrentMatch(req.user.userId);
  }

  @Post('match/:id/meeting')
  async createMeeting(
    @Param('id') matchId: string,
    @Request() req,
    @Body() createDto: CreateBuddyMeetingDto
  ) {
    return this.buddyService.createMeeting(matchId, req.user.userId, createDto);
  }

  @Post('meeting/:id/status')
  async updateMeetingStatus(
    @Param('id') meetingId: string,
    @Request() req,
    @Body() updateDto: UpdateMeetingStatusDto
  ) {
    return this.buddyService.updateMeetingStatus(meetingId, req.user.userId, updateDto);
  }

  @Post('admin/match')
  async runMatching(@Query('campus') campus: string) {
    // TODO: Add admin guard
    if (!campus) {
      return { error: 'Campus parameter required' };
    }
    return this.buddyService.matchMenteesAndBuddies(campus);
  }
}

