import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
  @IsOptional() @IsString() server?: string;
  @IsOptional() @IsString() rankTier?: string;
  @IsOptional() @IsString() rankDivision?: string | null;
  @IsOptional() @IsInt() @Min(0) lp?: number;
  @IsOptional() @IsString() primaryRole?: string;
  @IsOptional() @IsString() secondaryRole?: string | null;

  @IsOptional() @IsString() nickname?: string;
  @IsOptional() @IsBoolean() isMono?: boolean;
  @IsOptional() @IsInt() mainChampionId?: number | null;
}

export class SetIdsDto {
  @IsArray() @IsInt({ each: true }) ids!: number[];
}
