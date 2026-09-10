import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { RoomManager } from './lib/rooms';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      if (req.url && req.url.startsWith('/socket.io')) {
        // Let Socket.IO handle it. Next.js shouldn't touch this.
        return;
      }
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Adjust for production
    },
    // Allows larger payloads if needed, though we upload files via HTTP
    maxHttpBufferSize: 1e7,
  });

  // Attach io to global for API routes (like /api/upload) to access if needed
  (global as any).io = io;

  RoomManager.initialize(io);

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    );
  });
});
