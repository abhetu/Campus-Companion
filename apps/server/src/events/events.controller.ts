import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto, RsvpEventDto, Event } from '@campus-companion/api-types';

@Controller('communities/:communityId/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async findByCommunity(@Param('communityId') communityId: string): Promise<Event[]> {
    return this.eventsService.findByCommunity(communityId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('communityId') communityId: string,
    @Request() req,
    @Body() createDto: CreateEventDto
  ): Promise<Event> {
    return this.eventsService.create(communityId, req.user.userId, createDto);
  }
}

@Controller('events')
export class EventsDetailController {
  constructor(private eventsService: EventsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  async rsvp(
    @Param('id') id: string,
    @Request() req,
    @Body() rsvpDto: RsvpEventDto
  ) {
    return this.eventsService.rsvp(id, req.user.userId, rsvpDto);
  }
}

