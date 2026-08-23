import { DatabasePortfolio } from '@/lib/portfolio-db';
import { AlertCircle } from 'lucide-react';
import { ModernGlassmorphismTemplate } from './ModernGlassmorphismTemplate';
import { CreativeGradientTemplate } from './CreativeGradientTemplate';
import { DarkProfessionalTemplate } from './DarkProfessionalTemplate';
import { MinimalistCleanTemplate } from './MinimalistCleanTemplate';
import { DeveloperTerminalTemplate } from './DeveloperTerminalTemplate';
import { CorporateExecutiveTemplate } from './CorporateExecutiveTemplate';
import { CreativePortfolioTemplate } from './CreativePortfolioTemplate';
import { TechInnovatorTemplate } from './TechInnovatorTemplate';
import { OpenSourceContributorTemplate } from './OpenSourceContributorTemplate';
import { FullStackDevTemplate } from './FullStackDevTemplate';
import { DataScienceAnalystTemplate } from './DataScienceAnalystTemplate';

interface TemplateLoaderProps {
  portfolio: DatabasePortfolio;
  templateId: string;
}

type TemplateComponent = (props: { portfolio: DatabasePortfolio }) => JSX.Element;

const TEMPLATE_MAP: Record<string, TemplateComponent> = {
  'modern-glassmorphism': ModernGlassmorphismTemplate,
  'creative-gradient': CreativeGradientTemplate,
  'dark-professional': DarkProfessionalTemplate,
  'minimalist-clean': MinimalistCleanTemplate,
  'developer-terminal': DeveloperTerminalTemplate,
  'corporate-executive': CorporateExecutiveTemplate,
  'creative-portfolio': CreativePortfolioTemplate,
  'tech-innovator': TechInnovatorTemplate,
  'open-source-contributor': OpenSourceContributorTemplate,
  'full-stack-developer': FullStackDevTemplate,
  'data-science-analyst': DataScienceAnalystTemplate,
};

const TemplateFallback = ({ templateId }: { templateId: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Loading Error</h2>
      <p className="text-gray-600 mb-4">
        Failed to load template: {templateId}
      </p>
      <p className="text-sm text-gray-500">
        Please try refreshing the page or contact support if the issue persists.
      </p>
    </div>
  </div>
);

export function resolveTemplateComponent(templateId: string): TemplateComponent | null {
  return TEMPLATE_MAP[templateId] || TEMPLATE_MAP['modern-glassmorphism'] || null;
}

export function TemplateLoader({ portfolio, templateId }: TemplateLoaderProps) {
  const resolvedId = templateId || 'modern-glassmorphism';
  const TemplateComponent = resolveTemplateComponent(resolvedId);

  if (!TemplateComponent) {
    return <TemplateFallback templateId={resolvedId} />;
  }

  return <TemplateComponent portfolio={portfolio} />;
}
