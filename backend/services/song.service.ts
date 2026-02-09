import {
  findSongsByArtist,
  findSongById,
  createSong,
  updateSongById,
  deleteSongById,
  artistExists,
  findArtistByUserId,
} from "../models/song.model";
import {
  CreateSongRequest,
  UpdateSongRequest,
} from "../interfaces/song.interfaces";

export async function getSongsService(
  artistId: number,
  limit: number,
  offset: number,
) {
  const exists = await artistExists(artistId);
  if (!exists) {
    throw new Error("Artist not found");
  }

  return findSongsByArtist(artistId, limit, offset);
}

export async function getSongService(songId: number, artistId: number) {
  const song = await findSongById(songId, artistId);
  if (!song) {
    throw new Error("Song not found");
  }
  return song;
}

export async function createSongService(
  artistId: number,
  data: CreateSongRequest,
) {
  const exists = await artistExists(artistId);
  if (!exists) {
    throw new Error("Artist not found");
  }

  return createSong(
    artistId,
    data.title,
    data.album_name,
    data.genre,
    data.release_date,
  );
}

export async function updateSongService(
  songId: number,
  artistId: number,
  data: UpdateSongRequest,
) {
  const song = await findSongById(songId, artistId);
  if (!song) {
    throw new Error("Song not found");
  }

  const updated = await updateSongById(songId, artistId, data);
  if (!updated) {
    throw new Error("Failed to update song");
  }

  return updated;
}

export async function deleteSongService(songId: number, artistId: number) {
  const song = await findSongById(songId, artistId);
  if (!song) {
    throw new Error("Song not found");
  }

  const deleted = await deleteSongById(songId, artistId);
  if (!deleted) {
    throw new Error("Failed to delete song");
  }

  return true;
}

export async function checkArtistOwnership(
  userId: number,
  artistId: number,
): Promise<{ id: number; user_id: number | null }> {
  const artist = await findArtistByUserId(userId);

  if (!artist) {
    throw new Error("No artist profile found for your account");
  }

  if (artist.id !== artistId) {
    throw new Error("You can only access your own artist profile");
  }

  return artist;
}
