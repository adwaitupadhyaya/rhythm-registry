export type UserRole = "super_admin" | "artist_manager" | "artist";

export interface User {
  name: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
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

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface GetUsersResponse {
  users: User[];
}

export interface Route {
  path: string;
  component: () => Promise<void>;
  requiresAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectIfAuth?: string;
}
