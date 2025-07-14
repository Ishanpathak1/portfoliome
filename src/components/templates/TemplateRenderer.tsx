'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { ModernGlassmorphismTemplate } from './ModernGlassmorphismTemplate';
import { MinimalistCleanTemplate } from './MinimalistCleanTemplate';
import { DarkProfessionalTemplate } from './DarkProfessionalTemplate';
import { CreativeGradientTemplate } from './CreativeGradientTemplate';
import { DeveloperTerminalTemplate } from './DeveloperTerminalTemplate';

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
    default:
      // Fallback to modern glassmorphism template
      return <ModernGlassmorphismTemplate portfolio={portfolio} />;
  }
} 