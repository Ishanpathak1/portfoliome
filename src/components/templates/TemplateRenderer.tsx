'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { TemplateLoader } from './TemplateLoader';
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
    return <TemplateLoader portfolio={portfolio} templateId={templateId} />;
  } catch (error) {
    trackPortfolioGeneration(false);
    throw error;
  }
} 