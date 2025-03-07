import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  refreshToken: string;
}
