export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: 'super_admin' | 'artist_manager' | 'artist';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUserResponse;
}
