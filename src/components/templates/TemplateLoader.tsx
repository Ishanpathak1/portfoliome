'use client';

import { useState, useEffect } from 'react';
import { DatabasePortfolio } from '@/lib/portfolio-db';
import { Loader2, AlertCircle } from 'lucide-react';

interface TemplateLoaderProps {
  portfolio: DatabasePortfolio;
  templateId: string;
}

// Fallback component for when template fails to load
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

// Loading component
const TemplateLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8">
      <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Template</h2>
      <p className="text-gray-600">
        Please wait while we load your portfolio template...
      </p>
    </div>
  </div>
);

export function TemplateLoader({ portfolio, templateId }: TemplateLoaderProps) {
  const [TemplateComponent, setTemplateComponent] = useState<React.ComponentType<{ portfolio: DatabasePortfolio }> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import with error handling
        const templateModule = await import(`./${getTemplateFileName(templateId)}`);
        const TemplateComponent = templateModule[getTemplateComponentName(templateId)];
        
        if (!TemplateComponent) {
          throw new Error(`Template component not found for: ${templateId}`);
        }

        setTemplateComponent(() => TemplateComponent);
      } catch (err) {
        console.error('Failed to load template:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  // Show loading state
  if (isLoading) {
    return <TemplateLoading />;
  }

  // Show error state
  if (error || !TemplateComponent) {
    return <TemplateFallback templateId={templateId} />;
  }

  // Render the loaded template
  return <TemplateComponent portfolio={portfolio} />;
}

// Helper functions to safely map template IDs to file names
function getTemplateFileName(templateId: string): string {
  const templateMap: Record<string, string> = {
    'modern-glassmorphism': 'ModernGlassmorphismTemplate',
    'creative-gradient': 'CreativeGradientTemplate',
    'dark-professional': 'DarkProfessionalTemplate',
    'minimalist-clean': 'MinimalistCleanTemplate',
    'developer-terminal': 'DeveloperTerminalTemplate',
    'corporate-executive': 'CorporateExecutiveTemplate',
    'creative-portfolio': 'CreativePortfolioTemplate',
    'tech-innovator': 'TechInnovatorTemplate',
    'open-source-contributor': 'OpenSourceContributorTemplate',
    'full-stack-dev': 'FullStackDevTemplate',
    'data-science-analyst': 'DataScienceAnalystTemplate',
  };

  const fileName = templateMap[templateId];
  if (!fileName) {
    throw new Error(`Unknown template ID: ${templateId}`);
  }

  return fileName;
}

function getTemplateComponentName(templateId: string): string {
  const componentMap: Record<string, string> = {
    'modern-glassmorphism': 'ModernGlassmorphismTemplate',
    'creative-gradient': 'CreativeGradientTemplate',
    'dark-professional': 'DarkProfessionalTemplate',
    'minimalist-clean': 'MinimalistCleanTemplate',
    'developer-terminal': 'DeveloperTerminalTemplate',
    'corporate-executive': 'CorporateExecutiveTemplate',
    'creative-portfolio': 'CreativePortfolioTemplate',
    'tech-innovator': 'TechInnovatorTemplate',
    'open-source-contributor': 'OpenSourceContributorTemplate',
    'full-stack-dev': 'FullStackDevTemplate',
    'data-science-analyst': 'DataScienceAnalystTemplate',
  };

  const componentName = componentMap[templateId];
  if (!componentName) {
    throw new Error(`Unknown template ID: ${templateId}`);
  }

  return componentName;
} 