export interface ArtistResponse {
  id: number;
  name: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
  first_release_year: number | null;
  no_of_albums_released: number;
  bio: string | null;
  created_at: string;
}

export interface CreateArtistRequest {
  name: string;
  dob?: string;
  gender?: string;
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
  bio?: string;
}

export interface UpdateArtistRequest {
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
  bio?: string;
}
