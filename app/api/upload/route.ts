import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateFileId } from '@/lib/slug';
import { RoomManager } from '@/lib/rooms';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const roomId = formData.get('roomId');

    if (!file || !(file instanceof File) || !roomId || typeof roomId !== 'string') {
      return NextResponse.json({ error: 'Missing file or roomId' }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    // Verify room exists
    const room = RoomManager.getRoom(roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const fileId = generateFileId() + path.extname(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = RoomManager.getUploadsDir();
    await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});
    await fs.writeFile(path.join(uploadsDir, fileId), buffer).catch(() => {});

    const sharedFile = {
      id: fileId,
      originalFilename: file.name,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: Date.now(),
    };

    // Add to room memory and broadcast
    await RoomManager.addFileToRoom(roomId, sharedFile, buffer);

    return NextResponse.json({ success: true, file: sharedFile }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
