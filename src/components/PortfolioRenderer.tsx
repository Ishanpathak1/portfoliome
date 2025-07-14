'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';
import { TemplateRenderer } from './templates/TemplateRenderer';

interface PortfolioRendererProps {
  portfolio: DatabasePortfolio;
}

export function PortfolioRenderer({ portfolio }: PortfolioRendererProps) {
  return <TemplateRenderer portfolio={portfolio} />;
} 