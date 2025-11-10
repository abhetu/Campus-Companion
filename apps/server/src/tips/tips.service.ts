import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipDto, UpdateTipDto, GetTipsQuery, Tip } from '@campus-companion/api-types';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: GetTipsQuery): Promise<Tip[]> {
    const where: any = {};
    if (query.campus) {
      where.campus = query.campus;
    }
    if (query.category) {
      where.category = query.category;
    }
    // Only show approved tips to non-staff
    where.approved = true;

    return this.prisma.tip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Tip> {
    const tip = await this.prisma.tip.findUnique({
      where: { id },
    });
    if (!tip) {
      throw new NotFoundException('Tip not found');
    }
    return tip;
  }

  async create(userId: string, createDto: CreateTipDto): Promise<Tip> {
    // Check if user is staff or trusted (for now, allow all authenticated users)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Auto-approve if staff
    const approved = user?.role === 'STAFF';

    return this.prisma.tip.create({
      data: {
        ...createDto,
        createdByUserId: userId,
        approved,
      },
    });
  }

  async update(id: string, userId: string, updateDto: UpdateTipDto): Promise<Tip> {
    const tip = await this.findOne(id);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Only staff can update
    if (user?.role !== 'STAFF') {
      throw new ForbiddenException('Only staff can update tips');
    }

    return this.prisma.tip.update({
      where: { id },
      data: updateDto,
    });
  }
}

