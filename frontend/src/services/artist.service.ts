import { http } from "./http";
import type {
  Artist,
  CreateArtistRequest,
  UpdateArtistRequest,
  PaginationParams,
  CsvImportResponse,
} from "@/types";

class ArtistService {
  async getAll(params: PaginationParams): Promise<Artist[]> {
    const queryParams = new URLSearchParams({
      limit: params.limit.toString(),
      offset: params.offset.toString(),
    });

    // CRITICAL FIX: Backend returns { artists: [], limit, offset }
    // We need to extract just the artists array
    const response = await http.get<{
      artists: Artist[];
      limit: number;
      offset: number;
    }>(`/api/artists?${queryParams}`);

    // Return just the artists array
    return response.artists;
  }

  async create(data: CreateArtistRequest): Promise<Artist> {
    return http.post<Artist>("/api/artists", data);
  }

  async update(id: number, data: UpdateArtistRequest): Promise<Artist> {
    return http.put<Artist>(`/api/artists/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return http.delete(`/api/artists/${id}`);
  }

  async exportCsv(): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/artists/export-csv`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to export CSV");
    }

    return response.blob();
  }

  async importCsv(file: File): Promise<CsvImportResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/artists/import-csv`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to import CSV");
    }

    return response.json();
  }
}

export const artistService = new ArtistService();
