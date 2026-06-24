import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioBySlug } from '@/lib/portfolio-db';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const slugSchema = z.string().trim().min(3).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'portfolio-loading', ...RATE_LIMITS.publicRead });
    if (limited) return limited;

    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    
    const parsedSlug = slug ? slugSchema.safeParse(slug) : null;
    if (!parsedSlug?.success) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get minimal portfolio data for loading state
    const portfolio = await getPortfolioBySlug(parsedSlug.data);
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Return only the data needed for loading state
    return NextResponse.json({
      name: portfolio.resumeData.contact.name || 'User',
      colorScheme: portfolio.personalization.colorScheme || 'blue',
      templateId: portfolio.templateId || 'modern-glassmorphism'
    });

  } catch (error) {
    console.error('Error fetching portfolio loading data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 