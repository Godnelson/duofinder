export const servers = ['BR'] as const;
export type Server = (typeof servers)[number];

export const roles = ['TOP', 'JG', 'MID', 'ADC', 'SUP'] as const;
export type Role = (typeof roles)[number];

export const swipeActions = ['LIKE', 'DISLIKE'] as const;
export type SwipeAction = (typeof swipeActions)[number];

export const rankTiers = [
  'UNRANKED',
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'EMERALD',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER'
] as const;
export type RankTier = (typeof rankTiers)[number];
