import { NextRequest, NextResponse } from 'next/server';
import { saveUserPortfolio } from '@/lib/portfolio-db';
import { ResumeData, PersonalizationData } from '@/types/resume';
import { requireUser, AuthError } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const savePortfolioSchema = z.object({
  resumeData: z.record(z.any()),
  personalization: z.record(z.any()),
  fileInfo: z.object({
    originalFileName: z.string().max(255),
    fileUrl: z.string().max(2048).default(''),
    fileType: z.string().max(20),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, { key: 'save-portfolio', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(request);
    const parsed = savePortfolioSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const { resumeData, personalization, fileInfo } = parsed.data;

    // Get the correct base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    
    // Clean up environment variable in case it contains the variable name
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
    const baseUrl = (envUrl && envUrl.startsWith('http')) ? envUrl : `${protocol}://${host}`;

    // Save portfolio to database
    const portfolio = await saveUserPortfolio(
      user.uid,
      resumeData as ResumeData,
      personalization as PersonalizationData,
      fileInfo,
      user.email,
      user.name
    );

    console.log('Portfolio saved', { slug: portfolio.slug });

    return NextResponse.json({ 
      success: true, 
      slug: portfolio.slug,
      url: `${baseUrl}/${portfolio.slug}`
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error saving portfolio:', error);
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
} 