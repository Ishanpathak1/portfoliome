import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasFirebase: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
  });
} 