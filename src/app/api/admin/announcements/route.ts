import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_EMAIL = 'ishan.pathak2711@gmail.com';

function parseTokenEmail(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.email || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const items = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ announcements: items });
  } catch (e: any) {
    console.error('Admin GET announcements error:', e);
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = parseTokenEmail(request.headers.get('Authorization'));
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, message, kind } = await request.json();
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const item = await prisma.announcement.create({
      data: {
        title: title || 'Announcement',
        message,
        kind: kind || 'announcement',
        createdByEmail: email,
        createdByName: 'Admin',
      }
    });
    return NextResponse.json({ announcement: item });
  } catch (e: any) {
    console.error('Admin POST announcement error:', e);
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

