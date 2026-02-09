import { IncomingMessage, ServerResponse } from 'http';

export type NextFunction = () => void;

export type Middleware<TReq extends IncomingMessage = IncomingMessage> = (
  req: TReq,
  res: ServerResponse,
  next: NextFunction
) => void;
