import { ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { sendJson } from "../utils/response";
import { parseJsonBody } from "../utils/bodyParser";

import {
  getArtistsService,
  createArtistService,
  updateArtistService,
  deleteArtistService,
} from "../services/artist.service";

import {
  validateCreateArtist,
  validateUpdateArtist,
} from "../validators/artist.validator";

export async function getAllArtistsController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "50"),
      100,
    );
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const artists = await getArtistsService(limit, offset);
    return sendJson(res, 200, { artists, limit, offset });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 500, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function createArtistController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateCreateArtist(body);

    const artist = await createArtistService(body);
    return sendJson(res, 201, artist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function updateArtistController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateUpdateArtist(body);
    const artist = await updateArtistService(id, body);
    return sendJson(res, 200, artist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Artist not found") {
        return sendJson(res, 404, { error: error.message });
      }
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function deleteArtistController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    await deleteArtistService(id);
    return sendJson(res, 200, { message: "Artist deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Artist not found") {
        return sendJson(res, 404, { error: error.message });
      }
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

/* CSV IMPORT PLACEHOLDER */
export async function importArtistCsvController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
) {
  return sendJson(res, 501, {
    message: "CSV import endpoint placeholder",
  });
}
