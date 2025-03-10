import { IsEnum } from 'class-validator';

export class UpdateStoreStatusDto {
  @IsEnum(['active', 'inactive', 'violation'], { message: 'Invalid status' })
  status: 'active' | 'inactive' | 'violation';
}
