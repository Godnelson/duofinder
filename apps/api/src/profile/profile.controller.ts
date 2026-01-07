import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { SetIdsDto, UpdateProfileDto } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('me/profile')
export class ProfileController {
  constructor(private profiles: ProfileService) {}

  @Get()
  getMe(@Req() req: any) {
    return this.profiles.getMe(req.user.userId);
  }

  @Put()
  updateMe(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profiles.updateMe(req.user.userId, dto);
  }

  @Put('tags')
  setTags(@Req() req: any, @Body() dto: SetIdsDto) {
    return this.profiles.setTags(req.user.userId, dto.ids);
  }

  @Put('champions')
  setChampions(@Req() req: any, @Body() dto: SetIdsDto) {
    return this.profiles.setChampions(req.user.userId, dto.ids);
  }
}
