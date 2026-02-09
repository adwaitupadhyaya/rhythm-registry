import { IncomingMessage, ServerResponse } from "http";

export function corsMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
}
