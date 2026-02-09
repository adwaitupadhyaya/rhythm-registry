import { IncomingMessage } from 'http';
import { AuthenticatedUser } from './auth.context';

export interface AuthenticatedRequest extends IncomingMessage {
  user?: AuthenticatedUser;
}
