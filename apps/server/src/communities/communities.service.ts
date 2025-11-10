import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto, GetCommunitiesQuery, Community } from '@campus-companion/api-types';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetCommunitiesQuery): Promise<Community[]> {
    const where = query.campus ? { campus: query.campus } : {};
    const communities = await this.prisma.community.findMany({
      where,
      include: {
        members: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return communities.map((c) => ({
      id: c.id,
      campus: c.campus,
      name: c.name,
      description: c.description,
      createdByUserId: c.createdByUserId,
      createdAt: c.createdAt,
      memberCount: c.members.length,
    }));
  }

  async findOne(id: string): Promise<Community> {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
    if (!community) {
      throw new NotFoundException('Community not found');
    }
    return {
      id: community.id,
      campus: community.campus,
      name: community.name,
      description: community.description,
      createdByUserId: community.createdByUserId,
      createdAt: community.createdAt,
      memberCount: community.members.length,
    };
  }

  async create(userId: string, createDto: CreateCommunityDto): Promise<Community> {
    const community = await this.prisma.community.create({
      data: {
        ...createDto,
        createdByUserId: userId,
      },
      include: {
        members: true,
      },
    });

    // Add creator as moderator
    await this.prisma.communityMember.create({
      data: {
        communityId: community.id,
        userId: userId,
        role: 'MODERATOR',
      },
    });

    return {
      id: community.id,
      campus: community.campus,
      name: community.name,
      description: community.description,
      createdByUserId: community.createdByUserId,
      createdAt: community.createdAt,
      memberCount: 1,
    };
  }

  async join(communityId: string, userId: string) {
    const community = await this.findOne(communityId);
    const existing = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    });
    if (existing) {
      return { message: 'Already a member' };
    }
    await this.prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: 'MEMBER',
      },
    });
    return { message: 'Joined community' };
  }

  async leave(communityId: string, userId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    });
    if (!member) {
      throw new NotFoundException('Not a member of this community');
    }
    if (member.role === 'MODERATOR') {
      throw new ForbiddenException('Moderators cannot leave. Transfer ownership first.');
    }
    await this.prisma.communityMember.delete({
      where: {
        id: member.id,
      },
    });
    return { message: 'Left community' };
  }
}

