import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SwipeAction } from '@prisma/client';

function normalizePair(a: string, b: string) {
  return a < b ? { user1Id: a, user2Id: b } : { user1Id: b, user2Id: a };
}

@Injectable()
export class SwipesService {
  constructor(private prisma: PrismaService) {}

  async swipe(me: string, toUserId: string, action: SwipeAction) {
    if (me === toUserId) throw new BadRequestException('Não pode dar swipe em si mesmo');

    return this.prisma.$transaction(async (tx) => {
      await tx.swipe.upsert({
        where: { fromUserId_toUserId: { fromUserId: me, toUserId } },
        create: { fromUserId: me, toUserId, action },
        update: { action },
      });

      if (action !== SwipeAction.LIKE) return { matched: false };

      const inverse = await tx.swipe.findUnique({
        where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: me } },
      });

      if (inverse?.action !== SwipeAction.LIKE) return { matched: false };

      const { user1Id, user2Id } = normalizePair(me, toUserId);
      await tx.match.upsert({
        where: { user1Id_user2Id: { user1Id, user2Id } },
        create: { user1Id, user2Id },
        update: {},
      });

      return { matched: true };
    });
  }

  async likesReceived(me: string) {
    const rows = await this.prisma.swipe.findMany({
      where: { toUserId: me, action: SwipeAction.LIKE },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { fromUserId: true },
    });

    const userIds = rows.map(r => r.fromUserId);

    const profiles = await this.prisma.profile.findMany({
      where: { userId: { in: userIds } },
      include: {
        tags: { include: { tag: true } },
        champions: { include: { champ: true } },
      },
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
      // nickname NUNCA aqui
    }));
  }
}
