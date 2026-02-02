import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from '../interfaces/middleware.interface';

export function runMiddleware<TReq extends IncomingMessage>(
  req: TReq,
  res: ServerResponse,
  middleware: Middleware<TReq>
): Promise<void> {
  return new Promise((resolve) => {
    middleware(req, res, () => {
      resolve();
    });

    if (res.writableEnded) {
      resolve();
    }
  });
}
