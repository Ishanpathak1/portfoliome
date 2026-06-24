import { NextRequest, NextResponse } from 'next/server';
import { requirePrisma } from '@/lib/prisma';
import { verifyRequestUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const slugSchema = z.string().trim().min(3).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'check-slug', ...RATE_LIMITS.publicRead });
    if (limited) return limited;

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const parsedSlug = slugSchema.safeParse(slug);
    if (!parsedSlug.success) {
      return NextResponse.json({ 
        available: false,
        error: 'Slug must be 3-50 characters and contain only lowercase letters, numbers, and hyphens'
      }, { status: 200 });
    }

    // Get user ID from token for authenticated requests
    const user = await verifyRequestUser(request);

    // Check if slug exists in database
    const prisma = requirePrisma();
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug: parsedSlug.data },
      select: { id: true, userId: true }
    });

    let available = true;
    let message = 'Slug is available';

    if (existingPortfolio) {
      // If the existing portfolio belongs to the current user, it's available for them
      if (user?.uid && existingPortfolio.userId === user.uid) {
        available = true;
        message = 'This is your current slug';
      } else {
        available = false;
        message = 'Slug is already taken';
      }
    }

    return NextResponse.json({ 
      available,
      slug: parsedSlug.data,
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