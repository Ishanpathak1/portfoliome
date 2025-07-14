import { NextRequest, NextResponse } from 'next/server';
import { getUserPortfolio } from '@/lib/portfolio-db';
import { prisma } from '@/lib/prisma';
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
  try {
    const authHeader = request.headers.get('Authorization');
    const userId = await getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, personalization, resumeData } = await request.json();

    // Get current portfolio
    const currentPortfolio = await getUserPortfolio(userId);
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
      // Check if new slug is available
      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { slug }
      });

      if (existingPortfolio && existingPortfolio.userId !== userId) {
        return NextResponse.json({ 
          error: 'Slug is already taken',
          field: 'slug'
        }, { status: 400 });
      }

      updateData.slug = slug;
    }

    // Update portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userId },
      data: updateData
    });

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

    return NextResponse.json({ 
      success: true,
      portfolio: transformedPortfolio,
      message: 'Portfolio updated successfully'
    });

  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json({ 
      error: 'Failed to update portfolio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 