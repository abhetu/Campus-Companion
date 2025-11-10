import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@campus-companion/api-types';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsString()
  campus: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  countryOrRegion: string;

  @IsOptional()
  @IsString()
  degreeLevel?: string;
}

