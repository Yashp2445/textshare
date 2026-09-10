import { Server, Socket } from 'socket.io';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export interface SharedFile {
  id: string;
  originalFilename: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
  buffer?: Buffer;
}

export interface Room {
  id: string;
  isPublic: boolean;
  accessCode?: string;
  content: string;
  files: SharedFile[];
  lastActive: number;
}

// Global rooms store so state persists across serverless function re-invocations in the same process instance
const globalRooms = globalThis as unknown as {
  __rooms_map?: Map<string, Room>;
  __file_buffers?: Map<string, Buffer>;
};

if (!globalRooms.__rooms_map) {
  globalRooms.__rooms_map = new Map<string, Room>();
  // Initialize default public room
  globalRooms.__rooms_map.set('public', {
    id: 'public',
    isPublic: true,
    content: '',
    files: [],
    lastActive: Date.now(),
  });
}

if (!globalRooms.__file_buffers) {
  globalRooms.__file_buffers = new Map<string, Buffer>();
}

export class RoomManager {
  private static io?: Server;
  private static rooms: Map<string, Room> = globalRooms.__rooms_map!;
  private static fileBuffers: Map<string, Buffer> = globalRooms.__file_buffers!;
  
  public static getUploadsDir(): string {
    // On Vercel / serverless, process.cwd() might be read-only, so use OS temp directory if needed
    if (process.env.VERCEL) {
      return path.join(os.tmpdir(), 'textshare_uploads');
    }
    return path.join(process.cwd(), 'data', 'tmp_uploads');
  }

  public static async initialize(io: Server) {
    this.io = io;
    
    // Ensure uploads directory exists
    const uploadsDir = this.getUploadsDir();
    await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

    // Ensure public room exists
    if (!this.rooms.has('public')) {
      this.rooms.set('public', {
        id: 'public',
        isPublic: true,
        content: '',
        files: [],
        lastActive: Date.now(),
      });
    }

    this.setupSocketListeners();
    this.startCleanupTask();
  }

  public static createPrivateRoom(accessCode: string): string {
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
    if (!this.rooms.has(roomId) && roomId === 'public') {
      this.rooms.set('public', {
        id: 'public',
        isPublic: true,
        content: '',
        files: [],
        lastActive: Date.now(),
      });
    }
    return this.rooms.get(roomId);
  }

  public static updateRoomContent(roomId: string, content: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;
    room.content = content;
    room.lastActive = Date.now();

    // If socket server is initialized, broadcast update
    if (this.io) {
      this.io.to(roomId).emit('text_update', { content });
    }
    return true;
  }

  public static async addFileToRoom(roomId: string, file: SharedFile, buffer?: Buffer) {
    const room = this.getRoom(roomId);
    if (room) {
      // Store clean version in room (without buffer attached to JSON responses)
      const fileMeta: SharedFile = {
        id: file.id,
        originalFilename: file.originalFilename,
        size: file.size,
        mimeType: file.mimeType,
        uploadedAt: file.uploadedAt,
      };

      room.files.push(fileMeta);
      room.lastActive = Date.now();

      if (buffer) {
        this.fileBuffers.set(file.id, buffer);
      }

      // Broadcast if Socket.io is active
      if (this.io) {
        this.io.to(roomId).emit('file_shared', fileMeta);
      }
    }
  }

  public static async getFileData(fileId: string): Promise<Buffer | null> {
    // First check in-memory cache
    if (this.fileBuffers.has(fileId)) {
      return this.fileBuffers.get(fileId)!;
    }

    // Fallback to disk
    try {
      const uploadsDir = this.getUploadsDir();
      const filePath = path.join(uploadsDir, path.basename(fileId));
      const buffer = await fs.readFile(filePath);
      this.fileBuffers.set(fileId, buffer);
      return buffer;
    } catch {
      return null;
    }
  }

  private static setupSocketListeners() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      socket.on('join_room', (data: { roomId: string; accessCode?: string }, callback) => {
        const { roomId, accessCode } = data;
        const room = this.getRoom(roomId);

        if (!room) {
          if (callback) callback({ error: 'Room not found' });
          return;
        }

        if (!room.isPublic && room.accessCode !== accessCode) {
          if (callback) callback({ error: 'Invalid access code' });
          return;
        }

        socket.rooms.forEach((r) => {
          if (r !== socket.id) socket.leave(r);
        });

        socket.join(roomId);
        room.lastActive = Date.now();

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
        
        if (!socket.rooms.has(roomId)) return;

        if (room) {
          room.content = content;
          room.lastActive = Date.now();
          socket.to(roomId).emit('text_update', { content });
        }
      });
    });
  }

  private static startCleanupTask() {
    setInterval(async () => {
      const now = Date.now();
      const INACTIVE_TIMEOUT = 12 * 60 * 60 * 1000;

      for (const [roomId, room] of this.rooms.entries()) {
        if (roomId === 'public') continue;

        if (now - room.lastActive > INACTIVE_TIMEOUT) {
          this.rooms.delete(roomId);
          
          for (const file of room.files) {
            this.fileBuffers.delete(file.id);
            const filePath = path.join(this.getUploadsDir(), file.id);
            await fs.unlink(filePath).catch(() => {});
          }
        }
      }
    }, 60 * 60 * 1000);
  }
}
