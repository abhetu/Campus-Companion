import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTipDto, UpdateTipDto, GetTipsQuery, Tip } from '@campus-companion/api-types';

@Controller('tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @Get()
  async findAll(@Query() query: GetTipsQuery): Promise<Tip[]> {
    return this.tipsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tip> {
    return this.tipsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createDto: CreateTipDto): Promise<Tip> {
    return this.tipsService.create(req.user.userId, createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateTipDto
  ): Promise<Tip> {
    return this.tipsService.update(id, req.user.userId, updateDto);
  }
}

