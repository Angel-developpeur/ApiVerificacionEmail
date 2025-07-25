
import { IsEmail, IsString, Length } from 'class-validator';

export class ValidateCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;

  @IsString()
  apiToken: string;
}
