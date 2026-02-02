import { IncomingMessage, ServerResponse } from 'http';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { getAllUsersController } from '../controllers/user.controller';
import { runMiddleware } from '../utils/runMiddleware';

export async function userRoutes(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  if (req.method === 'GET' && req.url === '/api/users') {
    const authReq = req as AuthenticatedRequest;

    await runMiddleware(authReq, res, authenticateJwt);
    if (res.writableEnded) return true;

    await runMiddleware(authReq, res, requireRole(['super_admin']));
    if (res.writableEnded) return true;

    await getAllUsersController(authReq, res);
    return true;
  }

  return false;
}
