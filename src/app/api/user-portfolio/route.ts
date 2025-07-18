import { NextRequest, NextResponse } from 'next/server';
import { getUserPortfolio } from '@/lib/portfolio-db';

export const dynamic = 'force-dynamic';

// Simple token verification for development
// In production, you should use Firebase Admin SDK for proper verification
async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    // For development, we'll extract user ID from token payload
    // This is not secure for production - use Firebase Admin SDK instead
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.user_id || payload.sub || payload.uid;
  } catch (error) {
    console.error('Token parsing failed:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from token for developer bypass
    const token = authHeader?.substring(7);
    let userEmail: string | undefined;
    try {
      const payload = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString());
      userEmail = payload.email;
    } catch (error) {
      console.error('Failed to extract email from token:', error);
    }

    // Check if this is a test-new-user request
    const { searchParams } = new URL(request.url);
    const testNewUser = searchParams.has('test-new-user');

    const portfolio = await getUserPortfolio(userId, userEmail, testNewUser);

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      portfolio 
    });

  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 