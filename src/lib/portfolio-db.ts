import { prisma } from './prisma';
import { ResumeData, PersonalizationData } from '@/types/resume';

export interface DatabasePortfolio {
  id: string;
  userId: string;
  slug: string;
  views: number;
  isPublic: boolean;
  resumeData: ResumeData;
  personalization: PersonalizationData;
  templateId: string;
  originalFileName?: string;
  fileUrl?: string;
  fileType?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveUserPortfolio(
  userId: string,
  resumeData: ResumeData,
  personalization: PersonalizationData,
  fileInfo?: {
    originalFileName: string;
    fileUrl: string;
    fileType: string;
  },
  userEmail?: string,
  userName?: string
): Promise<DatabasePortfolio> {
  const name = resumeData.contact.name || 'Portfolio';
  const slug = generateUniqueSlug(name);
  
  // Ensure user exists in database (upsert)
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      email: userEmail || resumeData.contact.email,
      name: userName || resumeData.contact.name,
    },
    create: {
      id: userId,
      email: userEmail || resumeData.contact.email || `user-${userId}@example.com`,
      name: userName || resumeData.contact.name || 'User',
    },
  });
  
  // Developer bypass: Allow multiple portfolios for developer emails
  const isDeveloper = userEmail === 'ishan.pathak2711@gmail.com';
  
  // Check if user already has a portfolio (skip for developers)
  const existingPortfolio = !isDeveloper ? await prisma.portfolio.findUnique({
    where: { userId }
  }) : null;

  const portfolioData = {
    slug: existingPortfolio?.slug || slug,
    resumeData: resumeData as any,
    personalization: personalization as any,
    templateId: personalization.templateId || 'modern-glassmorphism',
    originalFileName: fileInfo?.originalFileName,
    fileUrl: fileInfo?.fileUrl,
    fileType: fileInfo?.fileType,
    metaTitle: `${name} - Portfolio`,
    metaDescription: resumeData.summary?.substring(0, 160) || `Professional portfolio of ${name}`,
    isPublic: true,
  };

  if (existingPortfolio && !isDeveloper) {
    // Update existing portfolio (don't include userId in update)
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: existingPortfolio.id },
      data: portfolioData,
    });
    return transformPortfolio(updatedPortfolio);
  } else {
    // Create new portfolio (include userId for creation)
    // For developers: Always create new, for others: create if no existing portfolio
    const newPortfolio = await prisma.portfolio.create({
      data: {
        ...portfolioData,
        userId,
      },
    });
    return transformPortfolio(newPortfolio);
  }
}

export async function getPortfolioBySlug(slug: string): Promise<DatabasePortfolio | null> {
  try {
    // ⚡ Optimized query - only select needed fields
    const portfolio = await prisma.portfolio.findUnique({
      where: { 
        slug, 
        isPublic: true 
      },
      select: {
        id: true,
        userId: true,
        slug: true,
        views: true,
        isPublic: true,
        resumeData: true,
        personalization: true,
        templateId: true,
        originalFileName: true,
        fileUrl: true,
        fileType: true,
        metaTitle: true,
        metaDescription: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!portfolio) return null;

    // ⚡ Simplified analytics - only increment view count, no background operations
    try {
      await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { views: { increment: 1 } },
      });
    } catch (error) {
      console.error('View count increment failed:', error);
      // Don't throw - this shouldn't break the page load
    }

    return transformPortfolio(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    return null;
  }
}

export async function getUserPortfolio(userId: string, userEmail?: string, testNewUser?: boolean): Promise<DatabasePortfolio | null> {
  try {
    // Developer bypass: If developer is in test mode, return null to enable new user flow
    const isDeveloper = userEmail === 'ishan.pathak2711@gmail.com';
    if (isDeveloper && testNewUser) {
      return null;
    }

    // Add timeout protection to the database query
    const portfolioPromise = isDeveloper 
      ? // For developers: Get the most recent portfolio (since they can have multiple)
        prisma.portfolio.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' }
        })
      : // For regular users: Get the unique portfolio
        prisma.portfolio.findUnique({
          where: { userId },
        });

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timed out')), 5000); // 5 second timeout
    });

    // Race between the database query and timeout
    const portfolio = await Promise.race([portfolioPromise, timeoutPromise]) as any;

    if (!portfolio) return null;
    return transformPortfolio(portfolio);
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    return null;
  }
}

export async function deleteUserPortfolio(userId: string): Promise<boolean> {
  try {
    await prisma.portfolio.delete({
      where: { userId },
    });
    return true;
  } catch (error) {
    return false;
  }
}

function transformPortfolio(portfolio: any): DatabasePortfolio {
  return {
    id: portfolio.id,
    userId: portfolio.userId,
    slug: portfolio.slug,
    views: portfolio.views,
    isPublic: portfolio.isPublic,
    resumeData: portfolio.resumeData as ResumeData,
    personalization: portfolio.personalization as PersonalizationData,
    templateId: portfolio.templateId || 'modern-glassmorphism',
    originalFileName: portfolio.originalFileName,
    fileUrl: portfolio.fileUrl,
    fileType: portfolio.fileType,
    metaTitle: portfolio.metaTitle,
    metaDescription: portfolio.metaDescription,
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
  };
}

function generateUniqueSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

export async function getPopularPortfolios(limit: number = 10): Promise<DatabasePortfolio[]> {
  const portfolios = await prisma.portfolio.findMany({
    where: { isPublic: true },
    orderBy: { views: 'desc' },
    take: limit,
    include: { user: true },
  });

  return portfolios.map(transformPortfolio);
}

export async function getRecentPortfolios(limit: number = 10): Promise<DatabasePortfolio[]> {
  const portfolios = await prisma.portfolio.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: true },
  });

  return portfolios.map(transformPortfolio);
} 