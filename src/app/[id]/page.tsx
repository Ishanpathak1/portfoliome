import { getPortfolioBySlug } from '@/lib/portfolio-db';
import { PortfolioRenderer } from '@/components/PortfolioRenderer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildPortfolioJsonLd } from '@/lib/portfolio-structured-data';
import React from 'react';

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  if (envUrl && envUrl.startsWith('http')) return envUrl;
  return process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000';
}

interface PortfolioPageProps {
  params: {
    id: string;
  };
  searchParams: {
    preview?: string;
    templateId?: string;
    colorScheme?: string;
  };
}

// ⚡ Enable ISR for better performance while allowing dynamic content
export const revalidate = 3600; // Revalidate every hour

export default async function PortfolioPage({ params, searchParams }: PortfolioPageProps) {
  const { id: slug } = params;
  
  // ⚡ Load portfolio data - now with non-blocking analytics
  const portfolio = await getPortfolioBySlug(slug);
  
  if (!portfolio) {
    notFound();
  }

  // If preview mode, use the preview parameters
  let renderPortfolio = portfolio;
  if (searchParams.preview === 'true' && (searchParams.templateId || searchParams.colorScheme)) {
    renderPortfolio = {
      ...portfolio,
      personalization: {
        ...portfolio.personalization,
        ...(searchParams.templateId && { templateId: searchParams.templateId }),
        ...(searchParams.colorScheme && { colorScheme: searchParams.colorScheme as any }),
      }
    };
  }

  const jsonLd = buildPortfolioJsonLd(portfolio);

  return (
    <>
      <PortfolioRenderer portfolio={renderPortfolio} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

// ⚡ Generate metadata with error handling and caching
export async function generateMetadata({ params, searchParams }: PortfolioPageProps): Promise<Metadata> {
  const { id: slug } = params;
  
  try {
    const portfolio = await getPortfolioBySlug(slug);
    
    if (!portfolio) {
      return {
        title: 'Portfolio Not Found',
        description: 'The portfolio you are looking for could not be found.'
      };
    }

    const name = portfolio.resumeData.contact.name || 'Professional';
    const summary = portfolio.resumeData.summary || 'Professional portfolio';
    const baseUrl = getBaseUrl();
    const canonicalUrl = `${baseUrl}/${slug}`;
    const previewMode = searchParams?.preview === 'true';

    // Generate a unique OG image URL per portfolio (slug-based)
    // Version image with updatedAt for cache-busting when portfolio/theme changes
    const ogImageUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}&v=${encodeURIComponent(portfolio.updatedAt as any)}`;
    
    return {
      title: portfolio.metaTitle || `${name} - Portfolio`,
      description: portfolio.metaDescription || summary.substring(0, 160),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: portfolio.metaTitle || `${name} - Portfolio`,
        description: portfolio.metaDescription || summary.substring(0, 160),
        type: 'website',
        url: canonicalUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${name} - Portfolio`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: portfolio.metaTitle || `${name} - Portfolio`,
        description: portfolio.metaDescription || summary.substring(0, 160),
        images: [ogImageUrl],
      },
      robots: previewMode
        ? { index: false, follow: true }
        : { index: true, follow: true },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio',
      description: 'Professional portfolio'
    };
  }
} 