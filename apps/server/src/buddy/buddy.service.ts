import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  OptInBuddyDto,
  CreateBuddyMeetingDto,
  UpdateMeetingStatusDto,
  BuddyMatch,
  BuddyOptInType,
} from '@campus-companion/api-types';

@Injectable()
export class BuddyService {
  constructor(private prisma: PrismaService) {}

  async optIn(userId: string, optInDto: OptInBuddyDto) {
    const existing = await this.prisma.buddyOptIn.findUnique({
      where: {
        userId_type: {
          userId,
          type: optInDto.type,
        },
      },
    });

    if (existing) {
      await this.prisma.buddyOptIn.update({
        where: { id: existing.id },
        data: { active: true },
      });
    } else {
      await this.prisma.buddyOptIn.create({
        data: {
          userId,
          type: optInDto.type,
          active: true,
        },
      });
    }

    return { message: 'Opted in successfully' };
  }

  async optOut(userId: string, type: BuddyOptInType) {
    const existing = await this.prisma.buddyOptIn.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Opt-in not found');
    }

    await this.prisma.buddyOptIn.update({
      where: { id: existing.id },
      data: { active: false },
    });

    return { message: 'Opted out successfully' };
  }

  async getCurrentMatch(userId: string): Promise<BuddyMatch | null> {
    const match = await this.prisma.buddyMatch.findFirst({
      where: {
        OR: [{ menteeId: userId }, { buddyId: userId }],
        status: 'ACTIVE',
      },
      include: {
        mentee: true,
        buddy: true,
      },
    });

    if (!match) {
      return null;
    }

    return {
      id: match.id,
      menteeId: match.menteeId,
      buddyId: match.buddyId,
      campus: match.campus,
      status: match.status,
      createdAt: match.createdAt,
      lastMeetingAt: match.lastMeetingAt,
      mentee: {
        id: match.mentee.id,
        email: match.mentee.email,
        name: match.mentee.name,
        campus: match.mentee.campus,
        role: match.mentee.role,
        countryOrRegion: match.mentee.countryOrRegion,
        degreeLevel: match.mentee.degreeLevel,
        createdAt: match.mentee.createdAt,
      },
      buddy: {
        id: match.buddy.id,
        email: match.buddy.email,
        name: match.buddy.name,
        campus: match.buddy.campus,
        role: match.buddy.role,
        countryOrRegion: match.buddy.countryOrRegion,
        degreeLevel: match.buddy.degreeLevel,
        createdAt: match.buddy.createdAt,
      },
    };
  }

  async createMeeting(matchId: string, userId: string, createDto: CreateBuddyMeetingDto) {
    const match = await this.prisma.buddyMatch.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.menteeId !== userId && match.buddyId !== userId) {
      throw new NotFoundException('Not authorized for this match');
    }

    const meeting = await this.prisma.buddyMeeting.create({
      data: {
        matchId,
        plannedTime: createDto.plannedTime,
        status: 'SCHEDULED',
      },
    });

    return meeting;
  }

  async updateMeetingStatus(meetingId: string, userId: string, updateDto: UpdateMeetingStatusDto) {
    const meeting = await this.prisma.buddyMeeting.findUnique({
      where: { id: meetingId },
      include: { match: true },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    if (meeting.match.menteeId !== userId && meeting.match.buddyId !== userId) {
      throw new NotFoundException('Not authorized for this meeting');
    }

    const updated = await this.prisma.buddyMeeting.update({
      where: { id: meetingId },
      data: { status: updateDto.status },
    });

    // Update lastMeetingAt if completed
    if (updateDto.status === 'COMPLETED') {
      await this.prisma.buddyMatch.update({
        where: { id: meeting.matchId },
        data: { lastMeetingAt: new Date() },
      });
    }

    return updated;
  }

  async matchMenteesAndBuddies(campus: string) {
    // Get all active mentees and buddies for this campus
    const mentees = await this.prisma.user.findMany({
      where: {
        campus,
        buddyOptIns: {
          some: {
            type: 'MENTEE',
            active: true,
          },
        },
      },
      include: {
        interests: true,
        availability: true,
        menteeMatches: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    const buddies = await this.prisma.user.findMany({
      where: {
        campus,
        buddyOptIns: {
          some: {
            type: 'BUDDY',
            active: true,
          },
        },
      },
      include: {
        interests: true,
        availability: true,
        buddyMatches: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    const matches: Array<{ menteeId: string; buddyId: string; score: number }> = [];

    for (const mentee of mentees) {
      // Skip if already matched
      if (mentee.menteeMatches.length > 0) {
        continue;
      }

      let bestMatch: { buddyId: string; score: number } | null = null;

      for (const buddy of buddies) {
        // Skip if buddy already has too many mentees (penalty)
        const activeMenteeCount = buddy.buddyMatches.length;
        if (activeMenteeCount >= 5) {
          continue; // Skip buddies with 5+ active mentees
        }

        let score = 0;

        // +2 for each overlapping interest
        const menteeInterests = new Set(mentee.interests.map((i) => i.interestKey));
        const buddyInterests = new Set(buddy.interests.map((i) => i.interestKey));
        const commonInterests = [...menteeInterests].filter((i) => buddyInterests.has(i));
        score += commonInterests.length * 2;

        // +1 for overlapping availability
        const menteeAvail = mentee.availability;
        const buddyAvail = buddy.availability;
        for (const mAvail of menteeAvail) {
          for (const bAvail of buddyAvail) {
            if (mAvail.dayOfWeek === bAvail.dayOfWeek) {
              const overlapStart = Math.max(mAvail.startMinutes, bAvail.startMinutes);
              const overlapEnd = Math.min(mAvail.endMinutes, bAvail.endMinutes);
              if (overlapEnd > overlapStart) {
                score += 1;
                break; // Count once per day
              }
            }
          }
        }

        // +1 if country matches
        if (mentee.countryOrRegion === buddy.countryOrRegion) {
          score += 1;
        }

        // Small penalty for existing mentees
        score -= activeMenteeCount * 0.5;

        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { buddyId: buddy.id, score };
        }
      }

      if (bestMatch && bestMatch.score > 0) {
        matches.push({
          menteeId: mentee.id,
          buddyId: bestMatch.buddyId,
          score: bestMatch.score,
        });
      }
    }

    // Sort by score descending and create matches
    matches.sort((a, b) => b.score - a.score);

    const createdMatches = [];
    for (const match of matches) {
      // Check if buddy still has capacity
      const buddy = buddies.find((b) => b.id === match.buddyId);
      if (buddy && buddy.buddyMatches.length < 5) {
        const created = await this.prisma.buddyMatch.create({
          data: {
            menteeId: match.menteeId,
            buddyId: match.buddyId,
            campus,
            status: 'ACTIVE',
          },
        });
        createdMatches.push(created);
        // Update buddy's match count in our local array
        buddy.buddyMatches.push(created as any);
      }
    }

    return {
      message: `Created ${createdMatches.length} matches`,
      matches: createdMatches,
    };
  }
}
