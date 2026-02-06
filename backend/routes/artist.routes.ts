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
} from "../controllers/artist.controller";

export async function artistRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const authReq = req as AuthenticatedRequest;

  /* LIST */
  if (req.url?.startsWith("/api/artists") && req.method === "GET") {
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

  /* CREATE */
  if (req.url === "/api/artists" && req.method === "POST") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await createArtistController(authReq, res);
    return true;
  }

  /* UPDATE / DELETE */
  const match = req.url?.match(/^\/api\/artists\/(\d+)$/);

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

  /* CSV PLACEHOLDER */
  if (req.url === "/api/artists/import-csv" && req.method === "POST") {
    await runMiddleware(authReq, res, authenticateJwt);
    await runMiddleware(authReq, res, requireRole(["artist_manager"]));

    await importArtistCsvController(authReq, res);
    return true;
  }

  return false;
}
