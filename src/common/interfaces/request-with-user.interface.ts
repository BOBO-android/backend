import { UserType } from '@/auth/auth';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: UserType;
}
