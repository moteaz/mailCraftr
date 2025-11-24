import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class AddUserToProjectDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class DeletUserfromProjectDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
