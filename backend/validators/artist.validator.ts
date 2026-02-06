import {
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../interfaces/artist.interfaces";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function validateCreateArtist(
  body: unknown,
): asserts body is CreateArtistRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid body");
  }

  const b = body as Record<string, unknown>;

  if (!isString(b.name)) {
    throw new Error("Artist name required");
  }

  if (b.first_release_year !== undefined && !isNumber(b.first_release_year)) {
    throw new Error("Invalid first_release_year");
  }

  if (
    b.no_of_albums_released !== undefined &&
    !isNumber(b.no_of_albums_released)
  ) {
    throw new Error("Invalid album count");
  }
}

export function validateUpdateArtist(
  body: unknown,
): asserts body is UpdateArtistRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid body");
  }
}
