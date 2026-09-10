import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { RoomManager } from '@/lib/rooms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    
    // Security: prevent directory traversal
    const safeFileId = path.basename(fileId);
    const fileBuffer = await RoomManager.getFileData(safeFileId);

    if (!fileBuffer) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get original filename from query if provided, else generic
    const url = new URL(request.url);
    const filename = url.searchParams.get('name') || safeFileId;

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Length', String(fileBuffer.length));

    return new NextResponse(new Uint8Array(fileBuffer), { status: 200, headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
