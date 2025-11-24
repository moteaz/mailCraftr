// dto/user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  title: string;

  @IsString()
  description: string;
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
