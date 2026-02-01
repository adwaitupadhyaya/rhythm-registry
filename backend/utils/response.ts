import { ServerResponse } from 'http';

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: any
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
