import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Simple token verification for development
async function getUserIdFromToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.user_id || payload.sub || payload.uid;
  } catch (error) {
    console.error('Token parsing failed:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        available: false,
        error: 'Slug must contain only lowercase letters, numbers, and hyphens'
      }, { status: 200 });
    }

    // Check if slug is too short or too long
    if (slug.length < 3 || slug.length > 50) {
      return NextResponse.json({ 
        available: false,
        error: 'Slug must be between 3 and 50 characters'
      }, { status: 200 });
    }

    // Get user ID from token for authenticated requests
    const authHeader = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authHeader);

    // Check if slug exists in database
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true, userId: true }
    });

    let available = true;
    let message = 'Slug is available';

    if (existingPortfolio) {
      // If the existing portfolio belongs to the current user, it's available for them
      if (userId && existingPortfolio.userId === userId) {
        available = true;
        message = 'This is your current slug';
      } else {
        available = false;
        message = 'Slug is already taken';
      }
    }

    return NextResponse.json({ 
      available,
      slug,
      message
    });

  } catch (error) {
    console.error('Error checking slug availability:', error);
    return NextResponse.json({ 
      error: 'Failed to check slug availability',
      available: false
    }, { status: 500 });
  }
} 