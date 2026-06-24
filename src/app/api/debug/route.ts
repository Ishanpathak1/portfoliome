import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return NextResponse.json({
      status: 'ok',
      nodeEnv: process.env.NODE_ENV,
      configured: {
        database: !!process.env.DATABASE_URL,
        openai: !!(process.env.OPENAI_API_KEY || process.env.OPEN_KEY),
        firebaseAdmin: !!(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
          (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
        ),
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Debug route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 