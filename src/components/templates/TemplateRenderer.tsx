'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { ModernGlassmorphismTemplate } from './ModernGlassmorphismTemplate';
import { MinimalistCleanTemplate } from './MinimalistCleanTemplate';
import { DarkProfessionalTemplate } from './DarkProfessionalTemplate';
import { CreativeGradientTemplate } from './CreativeGradientTemplate';
import { DeveloperTerminalTemplate } from './DeveloperTerminalTemplate';
import { CorporateExecutiveTemplate } from './CorporateExecutiveTemplate';
import { CreativePortfolioTemplate } from './CreativePortfolioTemplate';
import { TechInnovatorTemplate } from './TechInnovatorTemplate';
import { FullStackDevTemplate } from './FullStackDevTemplate';
import { OpenSourceContributorTemplate } from './OpenSourceContributorTemplate';

interface TemplateRendererProps {
  portfolio: DatabasePortfolio;
}

export function TemplateRenderer({ portfolio }: TemplateRendererProps) {
  const templateId = portfolio.templateId || 'modern-glassmorphism';

  switch (templateId) {
    case 'modern-glassmorphism':
      return <ModernGlassmorphismTemplate portfolio={portfolio} />;
    case 'minimalist-clean':
      return <MinimalistCleanTemplate portfolio={portfolio} />;
    case 'dark-professional':
      return <DarkProfessionalTemplate portfolio={portfolio} />;
    case 'creative-gradient':
      return <CreativeGradientTemplate portfolio={portfolio} />;
    case 'developer-terminal':
      return <DeveloperTerminalTemplate portfolio={portfolio} />;
    case 'corporate-executive':
      return <CorporateExecutiveTemplate portfolio={portfolio} />;
    case 'creative-portfolio':
      return <CreativePortfolioTemplate portfolio={portfolio} />;
    case 'tech-innovator':
      return <TechInnovatorTemplate portfolio={portfolio} />;
    case 'fullstack-developer':
      return <FullStackDevTemplate portfolio={portfolio} />;
    case 'opensource-contributor':
      return <OpenSourceContributorTemplate portfolio={portfolio} />;
    default:
      // Fallback to modern glassmorphism template
      return <ModernGlassmorphismTemplate portfolio={portfolio} />;
  }
} 