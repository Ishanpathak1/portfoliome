import { DatabasePortfolio, resolveHideBranding } from '@/lib/portfolio-db';
import { TemplateLoader } from './TemplateLoader';
import { PortfolioViewTracker } from './PortfolioViewTracker';
import { MadeWithPortfolioHub } from './MadeWithPortfolioHub';

interface TemplateRendererProps {
  portfolio: DatabasePortfolio;
}

export function TemplateRenderer({ portfolio }: TemplateRendererProps) {
  const templateId = portfolio.personalization?.templateId || portfolio.templateId || 'modern-glassmorphism';
  const hideBranding = resolveHideBranding(portfolio);

  return (
    <>
      <TemplateLoader portfolio={portfolio} templateId={templateId} />
      {!hideBranding && (
        <MadeWithPortfolioHub
          templateId={templateId}
          colorScheme={portfolio.personalization?.colorScheme}
        />
      )}
      <PortfolioViewTracker portfolioId={portfolio.id} />
    </>
  );
}
