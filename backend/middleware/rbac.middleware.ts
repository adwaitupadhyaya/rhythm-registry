import { ServerResponse } from 'http';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { Middleware } from '../interfaces/middleware.interface';
import { UserRole } from '../interfaces/auth.interfaces';
import { sendJson } from '../utils/response';

export function requireRole(
  allowedRoles: readonly UserRole[]
): Middleware<AuthenticatedRequest> {
  return (req, res, next) => {
    if (!req.user) {
      sendJson(res, 401, { error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendJson(res, 403, { error: 'Forbidden' });
      return;
    }

    next();
  };
}
