import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, IsArray } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  placeholders?: { key: string; value: string }[];

  @IsInt()
  @IsNotEmpty()
  categorieId: number;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  placeholders?: { key: string; value: string }[];
}
