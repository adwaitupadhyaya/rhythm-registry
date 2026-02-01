import { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody } from '../utils/bodyParser';
import { sendJson } from '../utils/response';
import { registerUser, loginUser } from '../services/auth.service';
import { validateLoginRequest, validateRegisterRequest } from '../validators/auth.validator';

export async function registerController(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateRegisterRequest(body);    
    const user = await registerUser(
      body.first_name,
      body.last_name,
      body.email,
      body.password,
      body.role ?? 'artist'
    );
    return sendJson(res, 201, user);
  } catch (error: any) {
    return sendJson(res, 400, { error: error.message });
  }
}

export async function loginController(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateLoginRequest(body);
    const result = await loginUser(body.email, body.password);
    return sendJson(res, 200, result);
  } catch (error: any) {
    return sendJson(res, 401, { error: error.message });
  }
}
