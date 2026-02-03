import { ServerResponse } from 'http';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { sendJson } from '../utils/response';
import { getAllUsers } from '../models/user.model';
import { parseJsonBody } from '../utils/bodyParser';
import { validateCreateUser, validateUpdateUser } from '../validators/user.validator';
import { createUserService, deleteUserService, updateUserService } from '../services/user.service';

export async function getAllUsersController(
  req: AuthenticatedRequest,
  res: ServerResponse
) {
  const users = await getAllUsers();
  return sendJson(res, 200, users);
}

export async function createUserController(
  req: AuthenticatedRequest,
  res: ServerResponse
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
    return sendJson(res, 500, { error: 'Internal error' });
  }
}

export async function updateUserController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  id: number
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
    return sendJson(res, 500, { error: 'Internal error' });
  }
}

export async function deleteUserController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
  id: number
) {
  await deleteUserService(id);
  return sendJson(res, 204, { success: true });
}