import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Force dynamic execution so build doesn't try to prerender this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Read announcements from data/announcements.json
function parseTokenUserId(authHeader: string | null): { userId: string | null } {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return { userId: null };
  try {
    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return { userId: payload.user_id || payload.sub || payload.uid || null };
  } catch {
    return { userId: null };
  }
}

export async function GET(req: NextRequest) {
  try {
    // Prefer DB announcements
    const db = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    const auth = parseTokenUserId(req.headers.get('Authorization'));
    let readMap: Record<string, boolean> = {};
    if (auth.userId) {
      const receipts = await prisma.announcementReceipt.findMany({
        where: { userId: auth.userId },
        select: { announcementId: true },
      });
      receipts.forEach(r => { readMap[r.announcementId] = true; });
    }
    console.log('[GET /api/notifications] userId=', auth.userId, 'dbCount=', db.length, 'readIds=', Object.keys(readMap).length);
    if (db && db.length > 0) {
      const normalized = db.map(a => ({
        id: a.id,
        kind: (a.kind as any) || 'announcement',
        title: a.title,
        message: a.message,
        action: a.action as any,
        createdAt: new Date(a.createdAt).getTime(),
        read: !!readMap[a.id],
      }));
      return NextResponse.json({ announcements: normalized });
    }

    const filePath = path.join(process.cwd(), 'data', 'announcements.json');
    let announcements: any[] = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(raw || '{"announcements": []}');
      announcements = Array.isArray(json.announcements) ? json.announcements : [];
    }
    console.log('[GET /api/notifications] fallback file announcements=', announcements.length);
    return NextResponse.json({ announcements });
  } catch (e) {
    console.error('[GET /api/notifications] ERROR', e);
    return NextResponse.json({ announcements: [] });
  }
}

