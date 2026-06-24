import { NextRequest, NextResponse } from 'next/server';
import { upsertApplicationStatus, type ApplicationStatus } from '@/lib/portfolio-db';
import { requirePrisma } from '@/lib/prisma';
import { AuthError, requireUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const applicationSchema = z.object({
  company: z.string().trim().min(1).max(160),
  status: z.enum(['APPLIED', 'ACCEPTED', 'REJECTED']),
});

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, { key: 'applications-post', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(req);
    const parsed = applicationSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid application data' }, { status: 400 });
    }

    const item = await upsertApplicationStatus(user.uid, parsed.data.company, parsed.data.status as ApplicationStatus);
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Applications POST error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const limited = rateLimit(req, { key: 'applications-get', ...RATE_LIMITS.auth });
    if (limited) return limited;

    const user = await requireUser(req);
    const prisma = requirePrisma();
    const items = await (prisma as any).application.findMany({
      where: { userId: user.uid },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Applications GET error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


