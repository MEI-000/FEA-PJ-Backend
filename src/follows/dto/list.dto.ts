import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListQueryDto {
  @IsOptional() @IsString()
  cursor?: string; // ObjectId string

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit = 20;
}
