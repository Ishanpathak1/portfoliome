import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioBySlug } from '@/lib/portfolio-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get minimal portfolio data for loading state
    const portfolio = await getPortfolioBySlug(slug);
    
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