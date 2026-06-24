import { NextRequest, NextResponse } from 'next/server';
import { requirePrisma } from '@/lib/prisma';
import { AuthError, requireAdmin } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const announcementSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  message: z.string().trim().min(1).max(2_000),
  kind: z.string().trim().min(1).max(40).optional(),
  action: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'admin-announcements-get', ...RATE_LIMITS.auth });
    if (limited) return limited;

    await requireAdmin(request);
    const prisma = requirePrisma();
    const items = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ announcements: items });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin GET announcements error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'admin-announcements-post', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const admin = await requireAdmin(request);
    const parsed = announcementSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid announcement' }, { status: 400 });

    const { title, message, kind, action } = parsed.data;
    const prisma = requirePrisma();
    const item = await prisma.announcement.create({
      data: {
        title: title || 'Announcement',
        message,
        kind: kind || 'announcement',
        action: action ? action : undefined,
        createdByEmail: admin.email || 'admin',
        createdByName: admin.name || 'Admin',
      }
    });
    return NextResponse.json({ announcement: item });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Admin POST announcement error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

