import { NextRequest, NextResponse } from 'next/server';
import { upsertApplicationStatus, type ApplicationStatus } from '@/lib/portfolio-db';
import { requirePrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function parseTokenUserId(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.user_id || payload.sub || payload.uid || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = parseTokenUserId(req.headers.get('Authorization'));
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { company, status } = await req.json();
    const allowed: ApplicationStatus[] = ['APPLIED', 'ACCEPTED', 'REJECTED'];
    if (!company || typeof company !== 'string') {
      return NextResponse.json({ error: 'company is required' }, { status: 400 });
    }
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const item = await upsertApplicationStatus(userId, company, status);
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = parseTokenUserId(req.headers.get('Authorization'));
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const prisma = requirePrisma();
    const items = await (prisma as any).application.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}


