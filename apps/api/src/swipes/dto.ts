import { IsEnum, IsString } from 'class-validator';

export enum SwipeActionDto {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export class SwipeDto {
  @IsString() toUserId!: string;
  @IsEnum(SwipeActionDto) action!: SwipeActionDto;
}
