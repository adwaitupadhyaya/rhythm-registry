export interface Song {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  release_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSongRequest {
  title: string;
  album_name: string;
  genre: "rnb" | "country" | "classic" | "rock" | "jazz";
  release_date: string;
}

export interface UpdateSongRequest {
  title?: string;
  album_name?: string;
  genre?: "rnb" | "country" | "classic" | "rock" | "jazz";
  release_date?: string;
}

export interface SongRow {
  id: number;
  artist_id: number;
  title: string;
  album_name: string;
  genre: string;
  release_date: string;
  created_at: string;
  updated_at: string;
}
