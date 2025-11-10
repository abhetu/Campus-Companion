import { Module } from '@nestjs/common';
import { BuddyService } from './buddy.service';
import { BuddyController } from './buddy.controller';

@Module({
  providers: [BuddyService],
  controllers: [BuddyController],
})
export class BuddyModule {}
