export type UserRole = "super_admin" | "artist_manager" | "artist";
export type Gender = "male" | "female" | "other";

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

export interface Artist {
  id: number;
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}

export interface CreateArtistRequest {
  name: string;
  dob: string;
  gender: Gender;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
}

export interface UpdateArtistRequest {
  name?: string;
  dob?: string;
  gender?: Gender;
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
}

export interface CsvImportResponse {
  success: boolean;
  imported: number;
  failed: number;
  errors?: string[];
}

export type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

export interface Song {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: Genre;
  release_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSongRequest {
  title: string;
  album_name: string;
  genre: Genre;
  release_date: string;
}

export interface UpdateSongRequest {
  title?: string;
  album_name?: string;
  genre?: Genre;
  release_date?: string;
}
