import { NextRequest, NextResponse } from 'next/server';
import { requirePrisma } from '@/lib/prisma';
import { AuthError, requireUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

const readSchema = z.object({
  ids: z.array(z.string().min(1).max(128)).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'notifications-read', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(request);
    const parsed = readSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const idArray = parsed.data.ids;
    if (idArray.length === 0) return NextResponse.json({ ok: true });

    const prisma = requirePrisma();
    await prisma.$transaction(
      idArray.map((announcementId) =>
        prisma.announcementReceipt.upsert({
          where: { userId_announcementId: { userId: user.uid, announcementId } },
          update: {},
          create: { userId: user.uid, announcementId },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[POST /api/notifications/read] ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

