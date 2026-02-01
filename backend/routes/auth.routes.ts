import { IncomingMessage, ServerResponse } from 'http';
import { registerController, loginController } from '../controllers/auth.controller';

export async function authRoutes(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  if (req.method === 'POST' && req.url === '/api/auth/register') {
    await registerController(req, res);
    return true;
  }

  if (req.method === 'POST' && req.url === '/api/auth/login') {
    await loginController(req, res);
    return true;
  }

  return false;
}
