import { IsNotEmpty } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  codeId: string;
}
