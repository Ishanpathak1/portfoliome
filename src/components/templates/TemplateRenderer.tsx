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
import { useEffect } from 'react';
import { trackPortfolioGeneration } from '@/lib/utils';

interface TemplateRendererProps {
  portfolio: DatabasePortfolio;
}

export function TemplateRenderer({ portfolio }: TemplateRendererProps) {
  const templateId = portfolio.templateId || 'modern-glassmorphism';

  useEffect(() => {
    trackPortfolioGeneration(true);
  }, [portfolio.id]);

  try {
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
      case 'full-stack-developer':
        return <FullStackDevTemplate portfolio={portfolio} />;
      case 'open-source-contributor':
        return <OpenSourceContributorTemplate portfolio={portfolio} />;
      default:
        // Fallback to modern glassmorphism template
        return <ModernGlassmorphismTemplate portfolio={portfolio} />;
    }
  } catch (error) {
    trackPortfolioGeneration(false, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
} 