import { IncomingMessage, ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { authenticateJwt } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  updateUserController,
} from "../controllers/user.controller";
import { runMiddleware } from "../utils/runMiddleware";

export async function userRoutes(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const authReq = req as AuthenticatedRequest;

  if (req.url === "/api/users" && req.method === "GET") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["super_admin"]));
    if (res.writableEnded) return true;

    await getAllUsersController(authReq, res);
    return true;
  }

  if (req.url === "/api/users" && req.method === "POST") {
    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["super_admin"]));
    if (res.writableEnded) return true;

    await createUserController(authReq, res);
    return true;
  }

  const match = req.url?.match(/^\/api\/users\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);

    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(["super_admin"]));
    if (res.writableEnded) return true;

    if (req.method === "PUT") {
      await updateUserController(authReq, res, id);
      return true;
    }

    if (req.method === "DELETE") {
      await deleteUserController(authReq, res, id);
      return true;
    }
  }

  return false;
}
