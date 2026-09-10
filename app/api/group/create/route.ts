import { NextRequest, NextResponse } from 'next/server';
import { RoomManager } from '@/lib/rooms';
import { generateSlug } from '@/lib/slug';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    // Optional: allow user to provide an access code, or generate one
    const code = accessCode?.trim() || generateSlug();

    const roomId = RoomManager.createPrivateRoom(code);

    return NextResponse.json({ roomId, accessCode: code });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
