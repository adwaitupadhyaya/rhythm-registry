import { UserRole } from './auth.interfaces';

export interface AuthenticatedUser {
  id: number;
  role: UserRole;
}
