import { UserRole } from "./auth.interfaces";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
}

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

export type UserRow = Omit<User, "password_hash">;
