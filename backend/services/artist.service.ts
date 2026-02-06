import {
  insertArtist,
  getArtists,
  updateArtistById,
  deleteArtistById,
  findArtistById,
} from "../models/artist.model";

import {
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../interfaces/artist.interfaces";

export async function getArtistsService(limit: number, offset: number) {
  return getArtists(limit, offset);
}

export async function createArtistService(data: CreateArtistRequest) {
  return insertArtist(data);
}

export async function updateArtistService(
  id: number,
  data: UpdateArtistRequest,
) {
  const artist = await updateArtistById(id, data as Record<string, unknown>);
  if (!artist) {
    throw new Error("Artist not found");
  }
  return artist;
}

export async function deleteArtistService(id: number) {
  const deleted = await deleteArtistById(id);
  if (!deleted) {
    throw new Error("Artist not found");
  }
  return true;
}
