/**
 * Entry point for Rhythm Registry backend server.
 */

import http, { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ---- Database ----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkDbConnection(): Promise<void> {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
  }
}

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
  await checkDbConnection();
});
