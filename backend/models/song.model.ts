import { query } from "../db/pool";
import { Song, SongRow } from "../interfaces/song.interfaces";

export async function findSongsByArtist(
  artistId: number,
  limit: number,
  offset: number,
): Promise<SongRow[]> {
  const result = await query<SongRow>(
    `SELECT id, artist_id, title, album_name, genre, release_date, created_at, updated_at
     FROM music
     WHERE artist_id = $1
     ORDER BY id
     LIMIT $2 OFFSET $3`,
    [artistId, limit, offset],
  );

  return result.rows;
}

export async function findSongById(
  songId: number,
  artistId: number,
): Promise<Song | null> {
  const result = await query<Song>(
    `SELECT id, artist_id, title, album_name, genre, release_date, created_at, updated_at
     FROM music
     WHERE id = $1 AND artist_id = $2`,
    [songId, artistId],
  );

  return result.rows[0] || null;
}

export async function createSong(
  artistId: number,
  title: string,
  albumName: string,
  genre: "rnb" | "country" | "classic" | "rock" | "jazz",
  releaseDate: string,
): Promise<Song> {
  const result = await query<Song>(
    `INSERT INTO music (artist_id, title, album_name, genre, release_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, artist_id, title, album_name, genre, release_date, created_at, updated_at`,
    [artistId, title, albumName, genre, releaseDate],
  );

  return result.rows[0];
}

export async function updateSongById(
  songId: number,
  artistId: number,
  fields: Partial<{
    title: string;
    album_name: string;
    genre: "rnb" | "country" | "classic" | "rock" | "jazz";
    release_date: string;
  }>,
): Promise<SongRow | null> {
  const ALLOWED_FIELDS = ["title", "album_name", "genre", "release_date"];
  const keys = Object.keys(fields).filter((key) =>
    ALLOWED_FIELDS.includes(key),
  );

  if (keys.length === 0) return null;

  const updates = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = keys.map((key) => fields[key as keyof typeof fields]);

  const result = await query<SongRow>(
    `UPDATE music 
     SET ${updates.join(", ")}, updated_at = NOW()
     WHERE id = $${keys.length + 1} AND artist_id = $${keys.length + 2}
     RETURNING id, artist_id, title, album_name, genre, release_date, created_at, updated_at`,
    [...values, songId, artistId],
  );

  return result.rows[0] ?? null;
}

export async function deleteSongById(
  songId: number,
  artistId: number,
): Promise<boolean> {
  const result = await query(
    `DELETE FROM music WHERE id = $1 AND artist_id = $2`,
    [songId, artistId],
  );

  return result.rowCount === 1;
}

export async function artistExists(artistId: number): Promise<boolean> {
  const result = await query(`SELECT 1 FROM artist WHERE id = $1`, [artistId]);

  return result.rows.length > 0;
}

export async function findArtistByUserId(
  userId: number,
): Promise<{ id: number; user_id: number | null } | null> {
  const result = await query<{ id: number; user_id: number | null }>(
    `SELECT id, user_id FROM artist WHERE user_id = $1`,
    [userId],
  );

  return result.rows[0] || null;
}
