import { IsNotEmpty } from 'class-validator';

export class VerifyStoreDto {
  @IsNotEmpty()
  storeId: string;

  @IsNotEmpty()
  codeId: string;
}
