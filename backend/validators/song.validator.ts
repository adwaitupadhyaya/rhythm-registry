import {
  CreateSongRequest,
  UpdateSongRequest,
} from "../interfaces/song.interfaces";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const VALID_GENRES = ["rnb", "country", "classic", "rock", "jazz"] as const;

function isValidGenre(
  value: unknown,
): value is "rnb" | "country" | "classic" | "rock" | "jazz" {
  return typeof value === "string" && VALID_GENRES.includes(value as any);
}

function isValidDate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function validateCreateSong(
  body: unknown,
): asserts body is CreateSongRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.title)) {
    throw new Error("Title is required");
  }

  if (!isNonEmptyString(b.album_name)) {
    throw new Error("Album name is required");
  }

  if (!isValidGenre(b.genre)) {
    throw new Error(`Genre must be one of: ${VALID_GENRES.join(", ")}`);
  }

  if (!isValidDate(b.release_date)) {
    throw new Error(
      "Release date is required and must be in YYYY-MM-DD format",
    );
  }
}

export function validateUpdateSong(
  body: unknown,
): asserts body is UpdateSongRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const b = body as Record<string, unknown>;

  if (!b.title && !b.album_name && !b.genre && !b.release_date) {
    throw new Error("At least one field must be provided for update");
  }

  if (b.title !== undefined && !isNonEmptyString(b.title)) {
    throw new Error("Invalid title");
  }

  if (b.album_name !== undefined && !isNonEmptyString(b.album_name)) {
    throw new Error("Invalid album name");
  }

  if (b.genre !== undefined && !isValidGenre(b.genre)) {
    throw new Error(`Genre must be one of: ${VALID_GENRES.join(", ")}`);
  }

  if (b.release_date !== undefined && !isValidDate(b.release_date)) {
    throw new Error("Release date must be in YYYY-MM-DD format");
  }
}
