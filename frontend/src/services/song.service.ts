import { http } from "./http";
import type {
  Song,
  CreateSongRequest,
  UpdateSongRequest,
  PaginationParams,
} from "@/types";

class SongService {
  async getAll(artistId: number, params: PaginationParams): Promise<Song[]> {
    const queryParams = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    });

    const response = await http.get<{
      songs: Song[];
      limit: number;
      offset: number;
    }>(`/api/artists/${artistId}/songs?${queryParams}`);

    return response.songs;
  }

  async create(artistId: number, data: CreateSongRequest): Promise<Song> {
    return http.post<Song>(`/api/artists/${artistId}/songs`, data);
  }

  async update(
    artistId: number,
    songId: number,
    data: UpdateSongRequest,
  ): Promise<Song> {
    return http.put<Song>(`/api/artists/${artistId}/songs/${songId}`, data);
  }

  async delete(artistId: number, songId: number): Promise<void> {
    return http.delete(`/api/artists/${artistId}/songs/${songId}`);
  }
}

export const songService = new SongService();
