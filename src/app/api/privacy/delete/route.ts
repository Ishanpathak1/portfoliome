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
    const prisma = requirePrisma();

    await prisma.$transaction(async (tx) => {
      const userIds = new Set<string>([user.uid]);

      if (user.email) {
        const usersByEmail = await tx.user.findMany({
          where: { email: { equals: user.email, mode: 'insensitive' } },
          select: { id: true },
        });
        for (const row of usersByEmail) userIds.add(row.id);

        const relatedPortfolios = await tx.portfolio.findMany({
          where: {
            OR: [
              { userId: { in: Array.from(userIds) } },
              {
                resumeData: {
                  path: ['contact', 'email'],
                  equals: user.email,
                },
              },
            ],
          },
          select: { userId: true },
        });
        for (const row of relatedPortfolios) userIds.add(row.userId);
      }

      const ids = Array.from(userIds);

      await (tx as any).application.deleteMany({ where: { userId: { in: ids } } });
      await tx.announcementReceipt.deleteMany({ where: { userId: { in: ids } } });
      await tx.portfolio.deleteMany({
        where: {
          OR: [
            { userId: { in: ids } },
            ...(user.email
              ? [{
                  resumeData: {
                    path: ['contact', 'email'],
                    equals: user.email,
                  },
                }]
              : []),
          ],
        },
      });
      await tx.account.deleteMany({ where: { userId: { in: ids } } });
      await tx.session.deleteMany({ where: { userId: { in: ids } } });
      if (user.email) {
        await tx.verificationToken.deleteMany({ where: { identifier: user.email } });
      }
      await tx.user.deleteMany({ where: { id: { in: ids } } });
    });

    if (isFirebaseAdminConfigured()) {
      try {
        await deleteFirebaseAuthUser(user.uid);
      } catch (error) {
        // App data is already gone; the client will also try to delete the login.
        console.error('Failed to delete Firebase auth user after account wipe:', error);
      }
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
