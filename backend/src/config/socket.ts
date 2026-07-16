import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_user', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their notification channel.`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const sendNotification = (userId: string, data: any) => {
  if (io) {
    io.to(userId).emit('notification', data);
  }
};
