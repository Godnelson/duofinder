import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function normalizePair(a: string, b: string) {
  return a < b ? { user1Id: a, user2Id: b } : { user1Id: b, user2Id: a };
}

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async listMyMatches(me: string) {
    const matches = await this.prisma.match.findMany({
      where: { OR: [{ user1Id: me }, { user2Id: me }] },
      orderBy: { createdAt: 'desc' },
    });

    return matches.map(m => ({
      id: m.id,
      createdAt: m.createdAt.toISOString(),
      otherUserId: m.user1Id === me ? m.user2Id : m.user1Id,
    }));
  }

  async getMatchDetail(me: string, matchId: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match não existe');
    const isMine = match.user1Id === me || match.user2Id === me;
    if (!isMine) throw new ForbiddenException();

    const otherUserId = match.user1Id === me ? match.user2Id : match.user1Id;

    const otherProfile = await this.prisma.profile.findUnique({
      where: { userId: otherUserId },
      include: {
        tags: { include: { tag: true } },
        champions: { include: { champ: true } },
      },
    });

    if (!otherProfile) throw new NotFoundException('Perfil não existe');

    // nickname liberado por ser match
    return {
      matchId: match.id,
      other: {
        userId: otherUserId,
        nickname: otherProfile.nickname,
        bio: otherProfile.bio,
        server: otherProfile.server,
        rankTier: otherProfile.rankTier,
        rankDivision: otherProfile.rankDivision,
        lp: otherProfile.lp,
        primaryRole: otherProfile.primaryRole,
        secondaryRole: otherProfile.secondaryRole,
        isMono: otherProfile.isMono,
        mainChampionId: otherProfile.mainChampionId,
        tags: otherProfile.tags.map(t => ({ id: t.tag.id, name: t.tag.name })),
        champions: otherProfile.champions.map(c => ({ id: c.champ.id, name: c.champ.name })),
      },
    };
  }

  async hasMatch(a: string, b: string) {
    const { user1Id, user2Id } = normalizePair(a, b);
    const m = await this.prisma.match.findUnique({ where: { user1Id_user2Id: { user1Id, user2Id } } });
    return !!m;
  }
}
