import { NextRequest, NextResponse } from 'next/server';
import { getUserPortfolio } from '@/lib/portfolio-db';
import { AuthError, requireUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'user-portfolio', ...RATE_LIMITS.auth });
    if (limited) return limited;

    const user = await requireUser(request);

    // Check if this is a test-new-user request
    const { searchParams } = new URL(request.url);
    const testNewUser = user.isAdmin && searchParams.has('test-new-user');

    const portfolio = await getUserPortfolio(user.uid, user.email, testNewUser);

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      portfolio 
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching user portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 