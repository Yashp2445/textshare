import { Server, Socket } from 'socket.io';
import fs from 'fs/promises';
import path from 'path';

export interface SharedFile {
  id: string;
  originalFilename: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
}

export interface Room {
  id: string;
  isPublic: boolean;
  accessCode?: string;
  content: string;
  files: SharedFile[];
  lastActive: number;
}

export class RoomManager {
  private static io: Server;
  private static rooms: Map<string, Room> = new Map();
  private static UPLOADS_DIR = path.join(process.cwd(), 'data', 'tmp_uploads');

  public static async initialize(io: Server) {
    this.io = io;
    
    // Ensure uploads directory exists
    await fs.mkdir(this.UPLOADS_DIR, { recursive: true }).catch(() => {});

    // Initialize public room
    this.rooms.set('public', {
      id: 'public',
      isPublic: true,
      content: '',
      files: [],
      lastActive: Date.now(),
    });

    this.setupSocketListeners();
    this.startCleanupTask();
  }

  public static createPrivateRoom(accessCode: string): string {
    // We use the access code itself as the room ID for simplicity,
    // since we don't persist these, and they are randomly generated.
    // However, generating a UUID for the room ID and keeping the code separate is safer.
    const roomId = Math.random().toString(36).substring(2, 15);
    this.rooms.set(roomId, {
      id: roomId,
      isPublic: false,
      accessCode,
      content: '',
      files: [],
      lastActive: Date.now(),
    });
    return roomId;
  }

  public static getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  public static addFileToRoom(roomId: string, file: SharedFile) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.files.push(file);
      room.lastActive = Date.now();
      // Broadcast to room
      this.io.to(roomId).emit('file_shared', file);
    }
  }

  private static setupSocketListeners() {
    this.io.on('connection', (socket: Socket) => {
      
      socket.on('join_room', (data: { roomId: string; accessCode?: string }, callback) => {
        const { roomId, accessCode } = data;
        const room = this.rooms.get(roomId);

        if (!room) {
          if (callback) callback({ error: 'Room not found' });
          return;
        }

        if (!room.isPublic && room.accessCode !== accessCode) {
          if (callback) callback({ error: 'Invalid access code' });
          return;
        }

        // Leave previous rooms (except the socket's own ID room)
        socket.rooms.forEach((r) => {
          if (r !== socket.id) socket.leave(r);
        });

        socket.join(roomId);
        room.lastActive = Date.now();

        // Send current state to the joining client
        if (callback) {
          callback({
            success: true,
            content: room.content,
            files: room.files,
          });
        }
      });

      socket.on('text_change', (data: { roomId: string; content: string }) => {
        const { roomId, content } = data;
        const room = this.rooms.get(roomId);
        
        // Security check: ensure socket is actually in this room
        if (!socket.rooms.has(roomId)) return;

        if (room) {
          room.content = content;
          room.lastActive = Date.now();
          // Broadcast to everyone else in the room
          socket.to(roomId).emit('text_update', { content });
        }
      });
    });
  }

  private static startCleanupTask() {
    // Check every hour for inactive rooms
    setInterval(async () => {
      const now = Date.now();
      const INACTIVE_TIMEOUT = 12 * 60 * 60 * 1000; // 12 hours

      for (const [roomId, room] of this.rooms.entries()) {
        if (roomId === 'public') continue; // Never delete public room

        if (now - room.lastActive > INACTIVE_TIMEOUT) {
          // Room has been inactive. Delete it.
          this.rooms.delete(roomId);
          
          // Delete associated files
          for (const file of room.files) {
            const filePath = path.join(this.UPLOADS_DIR, file.id);
            await fs.unlink(filePath).catch(() => {});
          }
        }
      }
    }, 60 * 60 * 1000);
  }
}
