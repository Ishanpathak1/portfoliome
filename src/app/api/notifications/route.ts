import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requirePrisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { verifyRequestUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Force dynamic execution so build doesn't try to prerender this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const limited = rateLimit(req, { key: 'notifications', ...RATE_LIMITS.publicRead });
    if (limited) return limited;

    // Prefer DB announcements
    const prisma = requirePrisma();
    const db = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    const auth = await verifyRequestUser(req);
    let readMap: Record<string, boolean> = {};
    if (auth?.uid) {
      const receipts = await prisma.announcementReceipt.findMany({
        where: { userId: auth.uid },
        select: { announcementId: true },
      });
      receipts.forEach(r => { readMap[r.announcementId] = true; });
    }
    console.log('Notifications fetched', { dbCount: db.length, readIds: Object.keys(readMap).length });
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
    console.log('Fallback notifications fetched', { count: announcements.length });
    return NextResponse.json({ announcements });
  } catch (e) {
    console.error('[GET /api/notifications] ERROR', e);
    return NextResponse.json({ announcements: [] });
  }
}

