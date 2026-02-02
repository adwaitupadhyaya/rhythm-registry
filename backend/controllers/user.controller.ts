import { ServerResponse } from 'http';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { sendJson } from '../utils/response';
import { findAllUsers } from '../models/user.model';

export async function getAllUsersController(
  req: AuthenticatedRequest,
  res: ServerResponse
) {
  const users = await findAllUsers();
  return sendJson(res, 200, users);
}
