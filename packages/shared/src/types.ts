import type { Role, RankTier, Server, SwipeAction } from './constants';

export type PublicProfile = {
  userId: string;
  bio: string | null;
  server: Server | string;
  rankTier: RankTier | string;
  rankDivision: string | null;
  lp: number;
  primaryRole: Role | string;
  secondaryRole: Role | string | null;
  isMono: boolean;
  mainChampionId: number | null;
  tags: { id: number; name: string }[];
  champions: { id: number; name: string }[];
};

export type MatchRow = {
  id: string;
  createdAt: string;
  otherUserId: string;
};

export type MatchDetail = {
  matchId: string;
  other: PublicProfile & {
    nickname: string;
  };
};

export type SwipeRequest = {
  toUserId: string;
  action: SwipeAction | 'LIKE' | 'DISLIKE';
};
