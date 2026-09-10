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

    const room = RoomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        isPublic: room.isPublic,
        content: room.content,
        files: room.files,
        lastActive: room.lastActive,
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
    const { content, accessCode } = body;

    const room = RoomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (!room.isPublic && room.accessCode && room.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 403 });
    }

    if (typeof content === 'string') {
      RoomManager.updateRoomContent(roomId, content);
    }

    return NextResponse.json({ success: true, content: room.content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}
