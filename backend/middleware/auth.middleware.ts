import { ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/request.interface';
import { Middleware } from '../interfaces/middleware.interface';
import { sendJson } from '../utils/response';
import { UserRole } from '../interfaces/auth.interfaces';

interface JwtPayload {
  sub: number;
  role: UserRole;
}

export const authenticateJwt: Middleware<AuthenticatedRequest> = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendJson(res, 401, { error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as unknown as JwtPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch {
    sendJson(res, 401, { error: 'Invalid or expired token' });
  }
};
