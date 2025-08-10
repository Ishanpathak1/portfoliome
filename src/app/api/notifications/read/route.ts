import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseToken(request: NextRequest): { userId: string | null } {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return { userId: null };
  try {
    const token = auth.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return { userId: payload.user_id || payload.sub || payload.uid || null };
  } catch {
    return { userId: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = parseToken(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ids } = await request.json();
    const idArray: string[] = Array.isArray(ids) ? ids : [];
    if (idArray.length === 0) return NextResponse.json({ ok: true });

    console.log('[POST /api/notifications/read] userId=', userId, 'ids=', idArray);
    await prisma.$transaction(
      idArray.map((announcementId) =>
        prisma.announcementReceipt.upsert({
          where: { userId_announcementId: { userId, announcementId } },
          update: {},
          create: { userId, announcementId },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[POST /api/notifications/read] ERROR', e);
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

