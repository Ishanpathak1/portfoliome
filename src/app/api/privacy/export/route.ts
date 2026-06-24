import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireUser } from '@/lib/auth';
import { requirePrisma } from '@/lib/prisma';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'privacy-export', ...RATE_LIMITS.auth });
    if (limited) return limited;

    const user = await requireUser(request);
    const prisma = requirePrisma();

    const [userRecord, portfolio, applications, announcementReceipts, accounts, sessions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.uid },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.portfolio.findUnique({ where: { userId: user.uid } }),
      (prisma as any).application.findMany({
        where: { userId: user.uid },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.announcementReceipt.findMany({
        where: { userId: user.uid },
        orderBy: { readAt: 'desc' },
      }),
      prisma.account.findMany({
        where: { userId: user.uid },
        select: {
          id: true,
          provider: true,
          providerAccountId: true,
          type: true,
          expires_at: true,
          token_type: true,
          scope: true,
        },
      }),
      prisma.session.findMany({
        where: { userId: user.uid },
        select: {
          id: true,
          expires: true,
        },
      }),
    ]);

    const exportedAt = new Date().toISOString();
    return NextResponse.json(
      {
        exportedAt,
        subject: {
          userId: user.uid,
          email: user.email,
        },
        data: {
          user: userRecord,
          portfolio,
          applications,
          announcementReceipts,
          legacyAuthAccounts: accounts,
          legacyAuthSessions: sessions,
        },
      },
      {
        headers: {
          'Content-Disposition': `attachment; filename="portfolio-data-export-${exportedAt.slice(0, 10)}.json"`,
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Privacy export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
