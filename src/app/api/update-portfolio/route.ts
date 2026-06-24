import { NextRequest, NextResponse } from 'next/server';
import { getUserPortfolio } from '@/lib/portfolio-db';
import { requirePrisma } from '@/lib/prisma';
import { PersonalizationData, ResumeData } from '@/types/resume';
import { AuthError, requireUser } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updatePortfolioSchema = z.object({
  slug: z.string().trim().min(3).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  personalization: z.record(z.any()).optional(),
  resumeData: z.record(z.any()).optional(),
}).refine((value) => value.slug || value.personalization || value.resumeData, {
  message: 'No update data provided',
});

export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const limited = rateLimit(request, { key: 'update-portfolio', ...RATE_LIMITS.mutation });
    if (limited) return limited;

    const user = await requireUser(request);
    const parsed = updatePortfolioSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update data' }, { status: 400 });
    }

    const { slug, personalization, resumeData } = parsed.data;
    
    const currentPortfolio = await getUserPortfolio(user.uid, user.email);
    if (!currentPortfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Update personalization if provided
    if (personalization) {
      updateData.personalization = personalization as PersonalizationData;
      updateData.templateId = personalization.templateId || currentPortfolio.templateId;
    }

    // Update resume data if provided
    if (resumeData) {
      updateData.resumeData = resumeData as ResumeData;
    }

    // Update slug if provided and different
    if (slug && slug !== currentPortfolio.slug) {
      // Double-check if new slug is available (race condition protection)
      const prisma = requirePrisma();
      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { slug },
        select: { id: true, userId: true }
      });

      if (existingPortfolio && existingPortfolio.userId !== user.uid) {
        return NextResponse.json({ 
          error: 'Slug is already taken',
          field: 'slug'
        }, { status: 400 });
      }

      updateData.slug = slug;
    }

    // Update portfolio with proper error handling and timeout
    let updatedPortfolio;
    
    // Retry mechanism for database operations
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add a timeout to the database operation
        const prisma = requirePrisma();
        const dbUpdatePromise = prisma.portfolio.update({
          where: { userId: user.uid },
          data: updateData
        });

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database operation timed out')), 8000); // 8 second timeout
        });

        // Race between the database operation and timeout
        updatedPortfolio = await Promise.race([dbUpdatePromise, timeoutPromise]) as any;
        
        break; // Success, exit retry loop
        
      } catch (dbError: any) {
        lastError = dbError;
        console.error('Portfolio update database error', { attempt, code: dbError?.code });
        
        // Handle database constraint violations
        if (dbError.code === 'P2002') {
          return NextResponse.json({ 
            error: 'Slug is already taken. Please try a different one.',
            field: 'slug'
          }, { status: 400 });
        }
        
        if (dbError.message === 'Database operation timed out') {
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          } else {
            return NextResponse.json({ 
              error: 'Database operation timed out. Please try again.',
              field: 'database'
            }, { status: 408 });
          }
        }
        
        // For connection pool errors, retry
        if (dbError.code === 'P2024' || dbError.message?.includes('connection pool')) {
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            continue;
          }
        }
        
        // For other errors, don't retry
        break;
      }
    }
    
    // If all retries failed
    if (!updatedPortfolio) {
      console.error('Portfolio update failed after retries', { code: lastError?.code });
      return NextResponse.json({ 
        error: 'Failed to update portfolio'
      }, { status: 500 });
    }

    // Transform and return updated portfolio
    const transformedPortfolio = {
      id: updatedPortfolio.id,
      userId: updatedPortfolio.userId,
      slug: updatedPortfolio.slug,
      views: updatedPortfolio.views,
      isPublic: updatedPortfolio.isPublic,
      resumeData: updatedPortfolio.resumeData,
      personalization: updatedPortfolio.personalization,
      templateId: updatedPortfolio.templateId,
      originalFileName: updatedPortfolio.originalFileName,
      fileUrl: updatedPortfolio.fileUrl,
      fileType: updatedPortfolio.fileType,
      metaTitle: updatedPortfolio.metaTitle,
      metaDescription: updatedPortfolio.metaDescription,
      createdAt: updatedPortfolio.createdAt,
      updatedAt: updatedPortfolio.updatedAt,
    };

    // 🔥 Warm OG image cache asynchronously (best-effort, non-blocking)
    try {
      const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
      const baseUrl = envUrl && envUrl.startsWith('http')
        ? envUrl
        : (process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000');
      const ogUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(transformedPortfolio.slug)}&v=${encodeURIComponent(new Date(transformedPortfolio.updatedAt).toISOString())}`;
      // Fire-and-forget to prime CDN cache
      fetch(ogUrl, { method: 'GET', headers: { 'User-Agent': 'CacheWarm' } }).catch(() => {});
    } catch {}

    const totalTime = Date.now() - startTime;
    console.log('Portfolio update completed', { durationMs: totalTime });

    return NextResponse.json({ 
      success: true,
      portfolio: transformedPortfolio,
      message: 'Portfolio updated successfully'
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Portfolio update failed', { durationMs: totalTime, error });
    return NextResponse.json({ 
      error: 'Failed to update portfolio'
    }, { status: 500 });
  }
} 