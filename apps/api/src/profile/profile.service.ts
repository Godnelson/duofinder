import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getMe(me: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: me },
      include: {
        tags: { include: { tag: true } },
        champions: { include: { champ: true } },
        mainChampion: true,
      },
    });

    if (!profile) throw new NotFoundException('Perfil não encontrado');

    return {
      userId: profile.userId,
      bio: profile.bio,
      server: profile.server,
      rankTier: profile.rankTier,
      rankDivision: profile.rankDivision,
      lp: profile.lp,
      primaryRole: profile.primaryRole,
      secondaryRole: profile.secondaryRole,
      nickname: profile.nickname, // dono sempre vê
      isMono: profile.isMono,
      mainChampionId: profile.mainChampionId,
      tags: profile.tags.map(t => ({ id: t.tag.id, name: t.tag.name })),
      champions: profile.champions.map(c => ({ id: c.champ.id, name: c.champ.name })),
    };
  }

  async updateMe(me: string, dto: UpdateProfileDto) {
    await this.prisma.profile.update({
      where: { userId: me },
      data: {
        bio: dto.bio,
        server: dto.server,
        rankTier: dto.rankTier,
        rankDivision: dto.rankDivision === undefined ? undefined : dto.rankDivision,
        lp: dto.lp,
        primaryRole: dto.primaryRole,
        secondaryRole: dto.secondaryRole === undefined ? undefined : dto.secondaryRole,
        nickname: dto.nickname,
        isMono: dto.isMono,
        mainChampionId: dto.mainChampionId === undefined ? undefined : dto.mainChampionId,
      },
    });

    return this.getMe(me);
  }

  async setTags(me: string, tagIds: number[]) {
    await this.prisma.profileTag.deleteMany({ where: { profileUserId: me } });
    if (tagIds.length) {
      await this.prisma.profileTag.createMany({
        data: tagIds.map(tagId => ({ profileUserId: me, tagId })),
        skipDuplicates: true,
      });
    }
    return this.getMe(me);
  }

  async setChampions(me: string, championIds: number[]) {
    await this.prisma.profileChampion.deleteMany({ where: { profileUserId: me } });
    if (championIds.length) {
      await this.prisma.profileChampion.createMany({
        data: championIds.map(championId => ({ profileUserId: me, championId })),
        skipDuplicates: true,
      });
    }
    return this.getMe(me);
  }
}
