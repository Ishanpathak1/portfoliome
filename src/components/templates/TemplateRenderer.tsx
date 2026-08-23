import { DatabasePortfolio } from '@/lib/portfolio-db';
import { TemplateLoader } from './TemplateLoader';
import { PortfolioViewTracker } from './PortfolioViewTracker';

interface TemplateRendererProps {
  portfolio: DatabasePortfolio;
}

export function TemplateRenderer({ portfolio }: TemplateRendererProps) {
  const templateId = portfolio.templateId || 'modern-glassmorphism';

  return (
    <>
      <TemplateLoader portfolio={portfolio} templateId={templateId} />
      <PortfolioViewTracker portfolioId={portfolio.id} />
    </>
  );
}
