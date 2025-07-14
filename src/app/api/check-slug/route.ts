import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

    // Check if slug exists in database
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true }
    });

    const available = !existingPortfolio;

    return NextResponse.json({ 
      available,
      slug,
      message: available ? 'Slug is available' : 'Slug is already taken'
    });

  } catch (error) {
    console.error('Error checking slug availability:', error);
    return NextResponse.json({ 
      error: 'Failed to check slug availability',
      available: false
    }, { status: 500 });
  }
} 