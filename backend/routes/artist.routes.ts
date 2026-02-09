import { IncomingMessage, ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";

import { authenticateJwt } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { runMiddleware } from "../utils/runMiddleware";

import {
  getAllArtistsController,
  createArtistController,
  updateArtistController,
  deleteArtistController,
  importArtistCsvController,
  exportArtistCsvController,
  getMyArtistController,
} from "../controllers/artist.controller";

export async function artistRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const authReq = req as AuthenticatedRequest;

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === "/api/artists/export-csv" && req.method === "GET") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(
      authReq,
      res,
      requireRole(["super_admin", "artist_manager"]),
    );
    if (res.writableEnded) return true;

    await exportArtistCsvController(authReq, res);
    return true;
  }

  if (pathname === "/api/artists/me" && req.method === "GET") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(
      authReq,
      res,
      requireRole(["artist", "super_admin", "artist_manager"]),
    );
    if (res.writableEnded) return true;

    await getMyArtistController(authReq, res);
    return true;
  }

  if (pathname === "/api/artists/import-csv" && req.method === "POST") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["artist_manager"]));
    if (res.writableEnded) return true;

    await importArtistCsvController(authReq, res);
    return true;
  }

  if (pathname === "/api/artists" && req.method === "GET") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(
      authReq,
      res,
      requireRole(["super_admin", "artist_manager"]),
    );
    if (res.writableEnded) return true;

    await getAllArtistsController(authReq, res);
    return true;
  }

  if (pathname === "/api/artists" && req.method === "POST") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["artist_manager"]));
    if (res.writableEnded) return true;

    await createArtistController(authReq, res);
    return true;
  }

  const match = pathname.match(/^\/api\/artists\/(\d+)$/);

  if (match) {
    const id = Number(match[1]);

    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["artist_manager"]));
    if (res.writableEnded) return true;

    if (req.method === "PUT") {
      await updateArtistController(authReq, res, id);
      return true;
    }

    if (req.method === "DELETE") {
      await deleteArtistController(authReq, res, id);
      return true;
    }
  }

  return false;
}
