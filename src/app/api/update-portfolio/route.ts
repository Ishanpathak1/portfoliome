import { NextRequest, NextResponse } from 'next/server';
import { getUserPortfolio } from '@/lib/portfolio-db';
import { requirePrisma } from '@/lib/prisma';
import { PersonalizationData, ResumeData } from '@/types/resume';

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

export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔄 Portfolio update request started');
  
  try {
    const authHeader = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      console.log('❌ Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`👤 User ID: ${userId}`);
    const { slug, personalization, resumeData } = await request.json();
    console.log(`📝 Update data:`, { 
      hasSlug: !!slug, 
      hasPersonalization: !!personalization, 
      hasResumeData: !!resumeData 
    });

    // Get current portfolio with timeout
    console.log('🔍 Fetching current portfolio...');
    
    // Get user email from token for developer multi-portfolio support
    const token = authHeader?.substring(7);
    let userEmail: string | undefined;
    try {
      const payload = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString());
      userEmail = payload.email;
    } catch (error) {
      console.error('Failed to extract email from token:', error);
    }
    
    const currentPortfolio = await getUserPortfolio(userId, userEmail);
    if (!currentPortfolio) {
      console.log('❌ Portfolio not found');
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    console.log(`✅ Current portfolio found: ${currentPortfolio.slug}`);

    // Prepare update data
    const updateData: any = {};

    // Update personalization if provided
    if (personalization) {
      updateData.personalization = personalization as PersonalizationData;
      updateData.templateId = personalization.templateId || currentPortfolio.templateId;
      console.log('🎨 Personalization data prepared');
    }

    // Update resume data if provided
    if (resumeData) {
      updateData.resumeData = resumeData as ResumeData;
      console.log('📄 Resume data prepared');
    }

    // Update slug if provided and different
    if (slug && slug !== currentPortfolio.slug) {
      console.log(`🔄 Slug change requested: ${currentPortfolio.slug} → ${slug}`);
      
      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        console.log('❌ Invalid slug format');
        return NextResponse.json({ 
          error: 'Slug must contain only lowercase letters, numbers, and hyphens',
          field: 'slug'
        }, { status: 400 });
      }

      // Check if slug is too short or too long
      if (slug.length < 3 || slug.length > 50) {
        console.log('❌ Slug length invalid');
        return NextResponse.json({ 
          error: 'Slug must be between 3 and 50 characters',
          field: 'slug'
        }, { status: 400 });
      }

      // Double-check if new slug is available (race condition protection)
      console.log('🔍 Checking slug availability...');
      const prisma = requirePrisma();
      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { slug },
        select: { id: true, userId: true }
      });

      if (existingPortfolio && existingPortfolio.userId !== userId) {
        console.log('❌ Slug already taken by another user');
        return NextResponse.json({ 
          error: 'Slug is already taken',
          field: 'slug'
        }, { status: 400 });
      }

      updateData.slug = slug;
      console.log('✅ Slug change validated');
    }

    // Update portfolio with proper error handling and timeout
    console.log('💾 Starting database update...');
    let updatedPortfolio;
    
    // Retry mechanism for database operations
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Database update attempt ${attempt}/${maxRetries}`);
        
        // Add a timeout to the database operation
        const prisma = requirePrisma();
        const dbUpdatePromise = prisma.portfolio.update({
          where: { userId },
          data: updateData
        });

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database operation timed out')), 8000); // 8 second timeout
        });

        // Race between the database operation and timeout
        updatedPortfolio = await Promise.race([dbUpdatePromise, timeoutPromise]) as any;
        
        console.log('✅ Database update completed successfully');
        break; // Success, exit retry loop
        
      } catch (dbError: any) {
        lastError = dbError;
        console.error(`❌ Database error (attempt ${attempt}/${maxRetries}):`, dbError);
        
        // Handle database constraint violations
        if (dbError.code === 'P2002') {
          console.log('❌ Unique constraint violation');
          return NextResponse.json({ 
            error: 'Slug is already taken. Please try a different one.',
            field: 'slug'
          }, { status: 400 });
        }
        
        if (dbError.message === 'Database operation timed out') {
          console.log(`❌ Database operation timed out (attempt ${attempt})`);
          if (attempt < maxRetries) {
            console.log(`⏳ Retrying in 1 second...`);
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
          console.log(`🔄 Connection pool error (attempt ${attempt}), retrying...`);
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
      console.error('❌ All database update attempts failed');
      return NextResponse.json({ 
        error: 'Database error occurred while updating portfolio',
        details: process.env.NODE_ENV === 'development' ? lastError?.message : undefined
      }, { status: 500 });
    }

    // Transform and return updated portfolio
    console.log('🔄 Transforming response data...');
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
    console.log(`✅ Portfolio update completed in ${totalTime}ms`);

    return NextResponse.json({ 
      success: true,
      portfolio: transformedPortfolio,
      message: 'Portfolio updated successfully'
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ Portfolio update failed after ${totalTime}ms:`, error);
    return NextResponse.json({ 
      error: 'Failed to update portfolio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 