import { getPortfolioBySlug } from '@/lib/portfolio-db';
import { PortfolioRenderer } from '@/components/PortfolioRenderer';
import { notFound } from 'next/navigation';

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

export default async function PortfolioPage({ params, searchParams }: PortfolioPageProps) {
  const { id: slug } = params;
  
  // Load portfolio data by slug
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

  return <PortfolioRenderer portfolio={renderPortfolio} />;
}

// Generate metadata for better SEO and sharing
export async function generateMetadata({ params }: PortfolioPageProps) {
  const { id: slug } = params;
  const portfolio = await getPortfolioBySlug(slug);
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The portfolio you are looking for could not be found.'
    };
  }

  const name = portfolio.resumeData.contact.name || 'Professional';
  const summary = portfolio.resumeData.summary || 'Professional portfolio';
  
  return {
    title: portfolio.metaTitle || `${name} - Portfolio`,
    description: portfolio.metaDescription || summary.substring(0, 160),
    openGraph: {
      title: portfolio.metaTitle || `${name} - Portfolio`,
      description: portfolio.metaDescription || summary.substring(0, 160),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: portfolio.metaTitle || `${name} - Portfolio`,
      description: portfolio.metaDescription || summary.substring(0, 160),
    },
  };
} 