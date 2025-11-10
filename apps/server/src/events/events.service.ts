import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, RsvpEventDto, Event } from '@campus-companion/api-types';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findByCommunity(communityId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { communityId },
      include: {
        rsvps: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return events.map((e) => ({
      id: e.id,
      communityId: e.communityId,
      title: e.title,
      description: e.description,
      startTime: e.startTime,
      endTime: e.endTime,
      locationText: e.locationText,
      capacity: e.capacity,
      createdByUserId: e.createdByUserId,
      createdAt: e.createdAt,
      rsvpCount: e.rsvps.length,
    }));
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        rsvps: true,
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return {
      id: event.id,
      communityId: event.communityId,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      locationText: event.locationText,
      capacity: event.capacity,
      createdByUserId: event.createdByUserId,
      createdAt: event.createdAt,
      rsvpCount: event.rsvps.length,
    };
  }

  async create(communityId: string, userId: string, createDto: CreateEventDto): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        ...createDto,
        communityId,
        createdByUserId: userId,
      },
      include: {
        rsvps: true,
      },
    });

    return {
      id: event.id,
      communityId: event.communityId,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      locationText: event.locationText,
      capacity: event.capacity,
      createdByUserId: event.createdByUserId,
      createdAt: event.createdAt,
      rsvpCount: 0,
    };
  }

  async rsvp(eventId: string, userId: string, rsvpDto: RsvpEventDto) {
    const existing = await this.prisma.eventRsvp.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existing) {
      await this.prisma.eventRsvp.update({
        where: { id: existing.id },
        data: {
          status: rsvpDto.status,
        },
      });
    } else {
      await this.prisma.eventRsvp.create({
        data: {
          eventId,
          userId,
          status: rsvpDto.status,
        },
      });
    }

    return { message: 'RSVP updated' };
  }
}

