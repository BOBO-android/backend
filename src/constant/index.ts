import { config } from 'dotenv';
config();

export const ROLES = {
  user: process.env.ROLE_USER || 'User',
  shop: process.env.ROLE_SHOP || 'Shop',
  admin: process.env.ROLE_ADMIN || 'Admin',
};

export const STATUS_POST = {
  public: 'public',
  draft: 'draft',
  deleted: 'deleted',
};

export const STATUS_STORE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  VIOLATION: 'violation',
};
