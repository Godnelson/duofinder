import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';

@UseGuards(AuthGuard('jwt'))
@Controller('matches')
export class MatchesController {
  constructor(private matches: MatchesService) {}

  @Get()
  list(@Req() req: any) {
    return this.matches.listMyMatches(req.user.userId);
  }

  @Get(':id')
  detail(@Req() req: any, @Param('id') id: string) {
    return this.matches.getMatchDetail(req.user.userId, id);
  }
}
