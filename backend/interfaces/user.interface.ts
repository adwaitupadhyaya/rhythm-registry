export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
}

import { UserRole } from './auth.interfaces';

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
