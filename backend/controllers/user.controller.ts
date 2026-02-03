import { ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { sendJson } from "../utils/response";
import { findUsers, getAllUsers } from "../models/user.model";
import { parseJsonBody } from "../utils/bodyParser";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../validators/user.validator";
import {
  createUserService,
  deleteUserService,
  updateUserService,
} from "../services/user.service";

export async function getAllUsersController(
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

    const users = await findUsers(limit, offset);
    return sendJson(res, 200, { users, limit, offset });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 500, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function createUserController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateCreateUser(body);
    const user = await createUserService(body);
    return sendJson(res, 201, user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 400, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function updateUserController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateUpdateUser(body);
    const user = await updateUserService(id, body);
    return sendJson(res, 200, user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 400, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function deleteUserController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    await deleteUserService(id);
    res.writeHead(204);
    res.end();
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 404, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}
