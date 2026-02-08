import { IncomingMessage, ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { authenticateJwt } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { runMiddleware } from "../utils/runMiddleware";
import { sendJson } from "../utils/response";
import {
  getAllSongsController,
  createSongController,
  updateSongController,
  deleteSongController,
} from "../controllers/song.controller";
import { checkArtistOwnership } from "../services/song.service";

export async function songRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const authReq = req as AuthenticatedRequest;

  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathname = url.pathname;

    const listMatch = pathname.match(/^\/api\/artists\/(\d+)\/songs$/);
    if (listMatch && req.method === "GET") {
      const artistId = Number(listMatch[1]);

      await runMiddleware(authReq, res, authenticateJwt);
      if (res.writableEnded) return true;

      await runMiddleware(
        authReq,
        res,
        requireRole(["super_admin", "artist_manager", "artist"]),
      );
      if (res.writableEnded) return true;

      if (authReq.user!.role === "artist") {
        try {
          const userId = authReq.user?.id;
          if (!userId) {
            throw new Error("User ID not found in authentication context");
          }
          await checkArtistOwnership(userId, artistId);
        } catch (error) {
          sendJson(res, 403, {
            error: error instanceof Error ? error.message : "Access denied",
          });
          return true;
        }
      }

      await getAllSongsController(authReq, res, artistId);
      return true;
    }

    if (listMatch && req.method === "POST") {
      const artistId = Number(listMatch[1]);

      await runMiddleware(authReq, res, authenticateJwt);
      if (res.writableEnded) return true;

      await runMiddleware(authReq, res, requireRole(["artist"]));
      if (res.writableEnded) return true;

      try {
        const userId = authReq.user?.id;
        if (!userId) {
          throw new Error("User ID not found in authentication context");
        }
        await checkArtistOwnership(userId, artistId);
      } catch (error) {
        sendJson(res, 403, {
          error: error instanceof Error ? error.message : "Access denied",
        });
        return true;
      }

      await createSongController(authReq, res, artistId);
      return true;
    }

    const songMatch = pathname.match(/^\/api\/artists\/(\d+)\/songs\/(\d+)$/);
    if (songMatch && req.method === "PUT") {
      const artistId = Number(songMatch[1]);
      const songId = Number(songMatch[2]);

      await runMiddleware(authReq, res, authenticateJwt);
      if (res.writableEnded) return true;

      await runMiddleware(authReq, res, requireRole(["artist"]));
      if (res.writableEnded) return true;

      try {
        const userId = authReq.user?.id;
        if (!userId) {
          throw new Error("User ID not found in authentication context");
        }
        await checkArtistOwnership(userId, artistId);
      } catch (error) {
        sendJson(res, 403, {
          error: error instanceof Error ? error.message : "Access denied",
        });
        return true;
      }

      await updateSongController(authReq, res, artistId, songId);
      return true;
    }

    if (songMatch && req.method === "DELETE") {
      const artistId = Number(songMatch[1]);
      const songId = Number(songMatch[2]);

      await runMiddleware(authReq, res, authenticateJwt);
      if (res.writableEnded) return true;

      await runMiddleware(authReq, res, requireRole(["artist"]));
      if (res.writableEnded) return true;

      try {
        const userId = authReq.user?.id;
        if (!userId) {
          throw new Error("User ID not found in authentication context");
        }
        await checkArtistOwnership(userId, artistId);
      } catch (error) {
        sendJson(res, 403, {
          error: error instanceof Error ? error.message : "Access denied",
        });
        return true;
      }

      await deleteSongController(authReq, res, artistId, songId);
      return true;
    }

    return false;
  } catch (error) {
    if (!res.writableEnded) {
      sendJson(res, 500, { error: "Internal server error" });
    }
    return true;
  }
}
