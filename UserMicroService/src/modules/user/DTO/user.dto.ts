import { Trim } from 'class-sanitizer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  surname: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  username: string;

  @IsString({ message: 'birthdate must be in format YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthdate must be in the format YYYY-MM-DD',
  })
  birthdate: string;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Age cannot be less than 1' })
  age?: number;
}
