import { ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { sendJson } from "../utils/response";
import { parseJsonBody } from "../utils/bodyParser";
import {
  validateCreateSong,
  validateUpdateSong,
} from "../validators/song.validator";
import {
  getSongsService,
  createSongService,
  updateSongService,
  deleteSongService,
} from "../services/song.service";

export async function getAllSongsController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  artistId: number,
) {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "10"),
      100,
    );
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const songs = await getSongsService(artistId, limit, offset);

    return sendJson(res, 200, { songs, limit, offset });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "Artist not found") {
        return sendJson(res, 404, { error: err.message });
      }
      return sendJson(res, 500, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function createSongController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  artistId: number,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateCreateSong(body);

    const song = await createSongService(artistId, body);
    return sendJson(res, 201, song);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "Artist not found") {
        return sendJson(res, 404, { error: err.message });
      }
      return sendJson(res, 400, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function updateSongController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  artistId: number,
  songId: number,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateUpdateSong(body);

    const song = await updateSongService(songId, artistId, body);
    return sendJson(res, 200, song);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "Song not found") {
        return sendJson(res, 404, { error: err.message });
      }
      return sendJson(res, 400, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function deleteSongController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
  artistId: number,
  songId: number,
) {
  try {
    await deleteSongService(songId, artistId);
    res.writeHead(204);
    res.end();
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "Song not found") {
        return sendJson(res, 404, { error: err.message });
      }
      return sendJson(res, 500, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}
