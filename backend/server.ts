/**
 * Entry point for Rhythm Registry backend server.
 */

import http, { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();

import { checkDb } from './db/pool';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';


// ---- Server ----
const PORT = Number(process.env.PORT);

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = url.parse(req.url || '', true);

    if (req.method === 'GET' && parsedUrl.pathname === '/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          status: 'ok',
          message: 'pong',
        })
      );
      return;
    }

    if (await authRoutes(req, res)) {
      return;
    }

    if (await userRoutes(req, res)) {
      return;
    }


    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Route not found',
      })
    );
  }
);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
   await checkDb();
   console.log('Database connected');
});
