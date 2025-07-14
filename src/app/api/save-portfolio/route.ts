import { NextRequest, NextResponse } from 'next/server';
import { saveUserPortfolio } from '@/lib/portfolio-db';
import { ResumeData, PersonalizationData } from '@/types/resume';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, personalization, fileInfo, userId, userEmail, userName } = await request.json();

    if (!resumeData || !personalization || !userId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Get the correct base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    // Save portfolio to database
    const portfolio = await saveUserPortfolio(
      userId,
      resumeData as ResumeData,
      personalization as PersonalizationData,
      fileInfo,
      userEmail,
      userName
    );

    console.log('Portfolio saved for user:', userEmail, 'Slug:', portfolio.slug);

    return NextResponse.json({ 
      success: true, 
      slug: portfolio.slug,
      url: `${baseUrl}/portfolio/${portfolio.slug}`
    });

  } catch (error) {
    console.error('Error saving portfolio:', error);
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
} 