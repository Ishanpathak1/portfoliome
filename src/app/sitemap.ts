import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getBlogPosts } from '@/lib/blog'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

// Helper function to get clean URL
function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  
  return process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  
  // Main pages
  const mainPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Feature and information pages
  const featurePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Support and about pages
  const supportPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Blog pages (dynamic)
  const blogPosts = getBlogPosts();
  const blogPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date || Date.now()),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    })),
  ];

  // Template showcase pages
  const templatePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/templates/developer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/templates/designer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/templates/professional`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Public portfolio pages (dynamic)
  const portfolioPages: SitemapEntry[] = [];
  try {
    if (prisma) {
      const portfolios = await prisma.portfolio.findMany({
        where: { isPublic: true },
        select: { slug: true, updatedAt: true },
      });
      for (const p of portfolios) {
        portfolioPages.push({
          url: `${baseUrl}/${p.slug}`,
          lastModified: p.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch public portfolios for sitemap:', error);
  }

  // Combine all pages
  return [
    ...mainPages,
    ...featurePages,
    ...supportPages,
    ...blogPages,
    ...templatePages,
    ...portfolioPages,
  ];
} 