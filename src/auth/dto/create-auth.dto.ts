import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @Length(3, 50)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 50)
  password: string;
}
