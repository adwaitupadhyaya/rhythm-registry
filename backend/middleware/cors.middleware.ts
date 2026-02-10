import { IncomingMessage, ServerResponse } from "http";

export function corsMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://rhythm-registry-five.vercel.app/",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

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
