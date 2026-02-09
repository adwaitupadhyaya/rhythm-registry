import { ServerResponse } from 'http';

export function sendJson<T>(
  res: ServerResponse,
  statusCode: number,
  data: T
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
