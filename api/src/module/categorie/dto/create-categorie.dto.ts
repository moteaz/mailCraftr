import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
} from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;
}
