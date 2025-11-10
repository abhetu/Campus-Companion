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
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateCommunityDto,
  GetCommunitiesQuery,
  Community,
} from '@campus-companion/api-types';

@Controller('communities')
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @Get()
  async findAll(@Query() query: GetCommunitiesQuery): Promise<Community[]> {
    return this.communitiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Community> {
    return this.communitiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createDto: CreateCommunityDto
  ): Promise<Community> {
    return this.communitiesService.create(req.user.userId, createDto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async join(@Param('id') id: string, @Request() req) {
    return this.communitiesService.join(id, req.user.userId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leave(@Param('id') id: string, @Request() req) {
    return this.communitiesService.leave(id, req.user.userId);
  }
}

