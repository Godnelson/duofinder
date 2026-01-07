import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SwipesService } from './swipes.service';
import { SwipeDto } from './dto';
import { SwipeAction } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class SwipesController {
  constructor(private swipes: SwipesService) {}

  @Post('swipes')
  swipe(@Req() req: any, @Body() dto: SwipeDto) {
    return this.swipes.swipe(req.user.userId, dto.toUserId, dto.action as SwipeAction);
  }

  @Get('likes/received')
  likesReceived(@Req() req: any) {
    return this.swipes.likesReceived(req.user.userId);
  }
}
