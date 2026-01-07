import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscoverService } from './discover.service';

@UseGuards(AuthGuard('jwt'))
@Controller('discover')
export class DiscoverController {
  constructor(private discover: DiscoverService) {}

  @Get('feed')
  feed(
    @Req() req: any,
    @Query('server') server?: string,
    @Query('role') role?: string,
    @Query('rankTier') rankTier?: string,
    @Query('tagIds') tagIdsCsv?: string,
    @Query('championId') championId?: string,
    @Query('take') take?: string,
  ) {
    const tagIds = tagIdsCsv ? tagIdsCsv.split(',').map(n => Number(n)).filter(Boolean) : undefined;
    return this.discover.feed(req.user.userId, {
      server,
      role,
      rankTier,
      tagIds,
      championId: championId ? Number(championId) : undefined,
      take: take ? Number(take) : undefined,
    });
  }
}
