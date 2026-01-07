import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoverService {
  constructor(private prisma: PrismaService) {}

  async feed(me: string, params: {
    server?: string;
    role?: string;
    rankTier?: string;
    tagIds?: number[];
    championId?: number;
    take?: number;
  }) {
    const take = Math.min(params.take ?? 20, 50);

    const swiped = await this.prisma.swipe.findMany({
      where: { fromUserId: me },
      select: { toUserId: true },
    });
    const swipedIds = swiped.map(s => s.toUserId);

    const profiles = await this.prisma.profile.findMany({
      where: {
        userId: { not: me, notIn: swipedIds },
        ...(params.server ? { server: params.server } : {}),
        ...(params.role ? { OR: [{ primaryRole: params.role }, { secondaryRole: params.role }] } : {}),
        ...(params.rankTier ? { rankTier: params.rankTier } : {}),
        ...(params.tagIds?.length ? { tags: { some: { tagId: { in: params.tagIds } } } } : {}),
        ...(params.championId
          ? {
              OR: [
                { mainChampionId: params.championId },
                { champions: { some: { championId: params.championId } } },
              ],
            }
          : {}),
      },
      include: {
        tags: { include: { tag: true } },
        champions: { include: { champ: true } },
      },
      take,
      orderBy: { updatedAt: 'desc' },
    });

    return profiles.map(p => ({
      userId: p.userId,
      bio: p.bio,
      server: p.server,
      rankTier: p.rankTier,
      rankDivision: p.rankDivision,
      lp: p.lp,
      primaryRole: p.primaryRole,
      secondaryRole: p.secondaryRole,
      isMono: p.isMono,
      mainChampionId: p.mainChampionId,
      tags: p.tags.map(t => ({ id: t.tag.id, name: t.tag.name })),
      champions: p.champions.map(c => ({ id: c.champ.id, name: c.champ.name })),
      // nickname NUNCA no feed
    }));
  }
}
