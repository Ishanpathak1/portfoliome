import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireUser } from '@/lib/auth';
import { requirePrisma } from '@/lib/prisma';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'privacy-delete', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(request);
    const prisma = requirePrisma();

    await prisma.$transaction([
      (prisma as any).application.deleteMany({ where: { userId: user.uid } }),
      prisma.announcementReceipt.deleteMany({ where: { userId: user.uid } }),
      prisma.portfolio.deleteMany({ where: { userId: user.uid } }),
      prisma.account.deleteMany({ where: { userId: user.uid } }),
      prisma.session.deleteMany({ where: { userId: user.uid } }),
      prisma.user.deleteMany({ where: { id: user.uid } }),
    ]);

    return NextResponse.json(
      {
        ok: true,
        message: 'Account data deleted',
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Privacy deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete account data' }, { status: 500 });
  }
}
