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

const globalRooms = globalThis as unknown as {
  __rooms_map?: Map<string, Room>;
  __file_buffers?: Map<string, Buffer>;
  __room_heartbeats?: Map<string, Map<string, number>>;
};

if (!globalRooms.__rooms_map) {
  globalRooms.__rooms_map = new Map<string, Room>();
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

if (!globalRooms.__room_heartbeats) {
  globalRooms.__room_heartbeats = new Map<string, Map<string, number>>();
}

export class RoomManager {
  private static io?: Server;
  private static rooms: Map<string, Room> = globalRooms.__rooms_map!;
  private static fileBuffers: Map<string, Buffer> = globalRooms.__file_buffers!;
  private static roomHeartbeats: Map<string, Map<string, number>> = globalRooms.__room_heartbeats!;
  
  public static getUploadsDir(): string {
    if (process.env.VERCEL) {
      return path.join(os.tmpdir(), 'textshare_uploads');
    }
    return path.join(process.cwd(), 'data', 'tmp_uploads');
  }

  public static registerHeartbeat(roomId: string, clientId?: string): number {
    if (!clientId) clientId = 'anon_' + Math.random().toString(36).substring(2, 8);

    let roomClients = this.roomHeartbeats.get(roomId);
    if (!roomClients) {
      roomClients = new Map<string, number>();
      this.roomHeartbeats.set(roomId, roomClients);
    }

    const now = Date.now();
    roomClients.set(clientId, now);

    const STALE_TIMEOUT = 6000;
    for (const [id, lastSeen] of roomClients.entries()) {
      if (now - lastSeen > STALE_TIMEOUT) {
        roomClients.delete(id);
      }
    }

    const heartbeatCount = roomClients.size;
    const socketCount = this.io ? (this.io.sockets.adapter.rooms.get(roomId)?.size || 0) : 0;

    return Math.max(1, heartbeatCount, socketCount);
  }

  public static async initialize(io: Server) {
    this.io = io;
    
    const uploadsDir = this.getUploadsDir();
    await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

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
    const roomId = accessCode.trim();
    this.rooms.set(roomId, {
      id: roomId,
      isPublic: false,
      accessCode: roomId,
      content: '',
      files: [],
      lastActive: Date.now(),
    });
    return roomId;
  }

  public static getRoom(roomId: string): Room | undefined {
    const cleanId = roomId.trim();
    if (!this.rooms.has(cleanId)) {
      if (cleanId === 'public') {
        this.rooms.set('public', {
          id: 'public',
          isPublic: true,
          content: '',
          files: [],
          lastActive: Date.now(),
        });
      } else {
        // Auto-create/restore private room so serverless lambda instances across Vercel never drop room access
        this.rooms.set(cleanId, {
          id: cleanId,
          isPublic: false,
          accessCode: cleanId,
          content: '',
          files: [],
          lastActive: Date.now(),
        });
      }
    }
    return this.rooms.get(cleanId);
  }

  public static updateRoomContent(roomId: string, content: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;
    room.content = content;
    room.lastActive = Date.now();

    if (this.io) {
      this.io.to(roomId).emit('text_update', { content });
    }
    return true;
  }

  public static async addFileToRoom(roomId: string, file: SharedFile, buffer?: Buffer) {
    const room = this.getRoom(roomId);
    if (room) {
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

      if (this.io) {
        this.io.to(roomId).emit('file_shared', fileMeta);
      }
    }
  }

  public static async deleteFileFromRoom(roomId: string, fileId: string): Promise<boolean> {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const fileIndex = room.files.findIndex((f) => f.id === fileId);
    if (fileIndex !== -1) {
      room.files.splice(fileIndex, 1);
      room.lastActive = Date.now();
      
      this.fileBuffers.delete(fileId);
      const filePath = path.join(this.getUploadsDir(), fileId);
      await fs.unlink(filePath).catch(() => {});

      if (this.io) {
        this.io.to(roomId).emit('file_deleted', { fileId });
      }
      return true;
    }
    return false;
  }

  public static async clearRoomFiles(roomId: string): Promise<boolean> {
    const room = this.getRoom(roomId);
    if (!room) return false;

    for (const file of room.files) {
      this.fileBuffers.delete(file.id);
      const filePath = path.join(this.getUploadsDir(), file.id);
      await fs.unlink(filePath).catch(() => {});
    }

    room.files = [];
    room.lastActive = Date.now();

    if (this.io) {
      this.io.to(roomId).emit('files_cleared');
    }
    return true;
  }

  public static async getFileData(fileId: string): Promise<Buffer | null> {
    if (this.fileBuffers.has(fileId)) {
      return this.fileBuffers.get(fileId)!;
    }

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

  private static broadcastUserCount(roomId: string) {
    if (!this.io) return;
    const count = Math.max(1, this.io.sockets.adapter.rooms.get(roomId)?.size || 1);
    this.io.to(roomId).emit('user_count_change', { count });
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

        if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
          if (callback) callback({ error: 'Invalid access code' });
          return;
        }

        socket.rooms.forEach((r) => {
          if (r !== socket.id) {
            socket.leave(r);
            this.broadcastUserCount(r);
          }
        });

        socket.join(roomId);
        room.lastActive = Date.now();

        const count = Math.max(1, this.io!.sockets.adapter.rooms.get(roomId)?.size || 1);
        this.broadcastUserCount(roomId);

        if (callback) {
          callback({
            success: true,
            content: room.content,
            files: room.files,
            activeUsers: count,
          });
        }
      });

      socket.on('text_change', (data: { roomId: string; content: string }) => {
        const { roomId, content } = data;
        const room = this.getRoom(roomId);
        
        if (!socket.rooms.has(roomId)) return;

        if (room) {
          room.content = content;
          room.lastActive = Date.now();
          socket.to(roomId).emit('text_update', { content });
        }
      });

      socket.on('delete_file', async (data: { roomId: string; fileId: string }) => {
        if (!socket.rooms.has(data.roomId)) return;
        await this.deleteFileFromRoom(data.roomId, data.fileId);
      });

      socket.on('clear_files', async (data: { roomId: string }) => {
        if (!socket.rooms.has(data.roomId)) return;
        await this.clearRoomFiles(data.roomId);
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
          this.roomHeartbeats.delete(roomId);
          
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
