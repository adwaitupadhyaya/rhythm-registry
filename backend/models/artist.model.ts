import { PoolClient } from "pg";
import { query } from "../db/pool";
import { ArtistResponse } from "../interfaces/artist.interfaces";

export async function findArtistById(
  id: number,
): Promise<ArtistResponse | null> {
  const result = await query<ArtistResponse>(
    `SELECT * FROM artist WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function getArtists(
  limit: number,
  offset: number,
): Promise<ArtistResponse[]> {
  const result = await query<ArtistResponse>(
    `SELECT *
     FROM artist
     ORDER BY id
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  return result.rows;
}

export async function insertArtist(artist: {
  name: string;
  dob?: string;
  gender?: string;
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
  bio?: string;
}): Promise<ArtistResponse> {
  const result = await query<ArtistResponse>(
    `INSERT INTO artist (
      name, dob, gender, address,
      first_release_year,
      no_of_albums_released,
      bio
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [
      artist.name,
      artist.dob ?? null,
      artist.gender ?? null,
      artist.address ?? null,
      artist.first_release_year ?? null,
      artist.no_of_albums_released ?? 0,
      artist.bio ?? null,
    ],
  );

  return result.rows[0];
}

export async function insertArtistTx(
  client: PoolClient,
  artist: {
    name: string;
    user_id: number;
  },
): Promise<ArtistResponse> {
  const result = await client.query<ArtistResponse>(
    `
    INSERT INTO artist (name, user_id)
    VALUES ($1,$2)
    RETURNING *
    `,
    [artist.name, artist.user_id],
  );

  return result.rows[0];
}

export async function updateArtistById(
  id: number,
  fields: Record<string, unknown>,
): Promise<ArtistResponse | null> {
  const keys = Object.keys(fields);
  if (!keys.length) return null;

  const updates = keys.map((k, i) => `${k} = $${i + 1}`);

  const result = await query<ArtistResponse>(
    `UPDATE artist SET ${updates.join(", ")}
     WHERE id = $${keys.length + 1}
     RETURNING *`,
    [...Object.values(fields), id],
  );

  return result.rows[0] ?? null;
}

export async function deleteArtistById(id: number): Promise<boolean> {
  const result = await query(`DELETE FROM artist WHERE id = $1`, [id]);

  return result.rowCount ? true : false;
}
