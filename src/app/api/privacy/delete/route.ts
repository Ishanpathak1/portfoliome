import { NextRequest, NextResponse } from 'next/server';
import { AuthError, deleteFirebaseAuthUser, isFirebaseAdminConfigured, requireUser } from '@/lib/auth';
import { requirePrisma } from '@/lib/prisma';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'privacy-delete', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(request);

    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Account deletion is unavailable' },
        { status: 503 }
      );
    }

    const prisma = requirePrisma();

    await prisma.$transaction([
      (prisma as any).application.deleteMany({ where: { userId: user.uid } }),
      prisma.announcementReceipt.deleteMany({ where: { userId: user.uid } }),
      prisma.portfolio.deleteMany({ where: { userId: user.uid } }),
      prisma.account.deleteMany({ where: { userId: user.uid } }),
      prisma.session.deleteMany({ where: { userId: user.uid } }),
      ...(user.email
        ? [prisma.verificationToken.deleteMany({ where: { identifier: user.email } })]
        : []),
      prisma.user.deleteMany({ where: { id: user.uid } }),
    ]);

    try {
      await deleteFirebaseAuthUser(user.uid);
    } catch (error) {
      // App data is already gone; a leftover login would still land as an empty new account.
      console.error('Failed to delete Firebase auth user after account wipe:', error);
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'Account deleted',
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
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
