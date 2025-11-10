import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create a dummy campus
  const campus = 'Main Campus';

  // Create some sample users
  const internationalStudent = await prisma.user.create({
    data: {
      email: 'student@example.com',
      passwordHash: hashedPassword,
      name: 'John Student',
      campus: campus,
      role: UserRole.INTERNATIONAL,
      countryOrRegion: 'India',
      degreeLevel: 'Undergraduate',
    },
  });

  const buddy = await prisma.user.create({
    data: {
      email: 'buddy@example.com',
      passwordHash: hashedPassword,
      name: 'Jane Buddy',
      campus: campus,
      role: UserRole.BUDDY,
      countryOrRegion: 'USA',
      degreeLevel: 'Graduate',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      passwordHash: hashedPassword,
      name: 'Admin Staff',
      campus: campus,
      role: UserRole.STAFF,
      countryOrRegion: 'USA',
      degreeLevel: null,
    },
  });

  // Create some interests
  const interests = [
    'soccer',
    'movies_kdrama',
    'coding_interview',
    'photography',
    'cooking',
    'hiking',
  ];

  // Add interests to users
  for (const interest of interests.slice(0, 3)) {
    await prisma.userInterest.create({
      data: {
        userId: internationalStudent.id,
        interestKey: interest,
      },
    });
  }

  for (const interest of interests.slice(0, 2)) {
    await prisma.userInterest.create({
      data: {
        userId: buddy.id,
        interestKey: interest,
      },
    });
  }

  // Create sample availability
  await prisma.userAvailability.createMany({
    data: [
      {
        userId: internationalStudent.id,
        dayOfWeek: 1, // Monday
        startMinutes: 600, // 10:00 AM
        endMinutes: 1200, // 8:00 PM
      },
      {
        userId: internationalStudent.id,
        dayOfWeek: 3, // Wednesday
        startMinutes: 600,
        endMinutes: 1200,
      },
      {
        userId: buddy.id,
        dayOfWeek: 1, // Monday
        startMinutes: 600,
        endMinutes: 1200,
      },
      {
        userId: buddy.id,
        dayOfWeek: 3, // Wednesday
        startMinutes: 600,
        endMinutes: 1200,
      },
    ],
  });

  // Create a sample community
  const community = await prisma.community.create({
    data: {
      campus: campus,
      name: 'Tech Enthusiasts',
      description: 'A community for students interested in technology and coding.',
      createdByUserId: staff.id,
    },
  });

  // Add members to community
  await prisma.communityMember.createMany({
    data: [
      {
        communityId: community.id,
        userId: internationalStudent.id,
        role: 'MEMBER',
      },
      {
        communityId: community.id,
        userId: buddy.id,
        role: 'MEMBER',
      },
    ],
  });

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      communityId: community.id,
      title: 'Coding Workshop',
      description: 'Learn the basics of TypeScript and Next.js',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2 hours
      locationText: 'Room 101, Tech Building',
      capacity: 30,
      createdByUserId: staff.id,
    },
  });

  // Create a sample tip
  await prisma.tip.create({
    data: {
      campus: campus,
      category: 'BANKING',
      title: 'Opening a Bank Account',
      content: 'To open a bank account, you will need your passport, student ID, and proof of address. Most banks offer student accounts with no monthly fees.',
      createdByUserId: staff.id,
      approved: true,
    },
  });

  console.log('Seed data created successfully!');
  console.log('Sample users:');
  console.log(`  International Student: ${internationalStudent.email} / password123`);
  console.log(`  Buddy: ${buddy.email} / password123`);
  console.log(`  Staff: ${staff.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

