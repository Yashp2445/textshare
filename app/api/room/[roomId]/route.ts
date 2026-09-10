import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/rooms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const accessCode = searchParams.get('accessCode') || undefined;
    const clientId = searchParams.get('clientId') || undefined;

    const room = RoomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
    }

    // Register active user heartbeat
    const activeUsers = RoomManager.registerHeartbeat(roomId, clientId);

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        isPublic: room.isPublic,
        content: room.content,
        files: room.files,
        lastActive: room.lastActive,
        activeUsers,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch room state' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { content, accessCode, action, fileId, clientId } = body;

    const room = RoomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
    }

    // Register active user heartbeat
    const activeUsers = RoomManager.registerHeartbeat(roomId, clientId);

    if (action === 'clear_files') {
      await RoomManager.clearRoomFiles(roomId);
      return NextResponse.json({ success: true, files: [], activeUsers });
    }

    if (action === 'delete_file' && fileId) {
      await RoomManager.deleteFileFromRoom(roomId, fileId);
      return NextResponse.json({ success: true, files: room.files, activeUsers });
    }

    if (typeof content === 'string') {
      RoomManager.updateRoomContent(roomId, content);
    }

    return NextResponse.json({ success: true, content: room.content, activeUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');
    const accessCode = searchParams.get('accessCode') || undefined;

    const room = RoomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
    }

    if (fileId === 'all' || !fileId) {
      await RoomManager.clearRoomFiles(roomId);
    } else {
      await RoomManager.deleteFileFromRoom(roomId, fileId);
    }

    return NextResponse.json({ success: true, files: room.files });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
