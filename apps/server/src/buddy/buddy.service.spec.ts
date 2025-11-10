import { Test, TestingModule } from '@nestjs/testing';
import { BuddyService } from './buddy.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BuddyService', () => {
  let service: BuddyService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
    },
    buddyMatch: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    buddyOptIn: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    buddyMeeting: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuddyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BuddyService>(BuddyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('matchMenteesAndBuddies', () => {
    it('should match mentees with buddies based on score', async () => {
      const campus = 'Test Campus';
      const mentee = {
        id: 'mentee-1',
        campus,
        interests: [{ interestKey: 'coding' }, { interestKey: 'soccer' }],
        availability: [
          { dayOfWeek: 1, startMinutes: 600, endMinutes: 1200 },
        ],
        countryOrRegion: 'India',
        menteeMatches: [],
      };

      const buddy = {
        id: 'buddy-1',
        campus,
        interests: [{ interestKey: 'coding' }, { interestKey: 'photography' }],
        availability: [
          { dayOfWeek: 1, startMinutes: 600, endMinutes: 1200 },
        ],
        countryOrRegion: 'USA',
        buddyMatches: [],
      };

      mockPrismaService.user.findMany
        .mockResolvedValueOnce([mentee]) // mentees
        .mockResolvedValueOnce([buddy]); // buddies

      mockPrismaService.buddyMatch.create.mockResolvedValue({
        id: 'match-1',
        menteeId: mentee.id,
        buddyId: buddy.id,
        campus,
        status: 'ACTIVE',
      });

      const result = await service.matchMenteesAndBuddies(campus);

      expect(result.matches).toHaveLength(1);
      expect(mockPrismaService.buddyMatch.create).toHaveBeenCalledWith({
        data: {
          menteeId: mentee.id,
          buddyId: buddy.id,
          campus,
          status: 'ACTIVE',
        },
      });
    });
  });
});

