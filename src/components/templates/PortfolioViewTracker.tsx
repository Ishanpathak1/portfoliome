'use client';

import { useEffect } from 'react';
import { trackPortfolioGeneration } from '@/lib/utils';

export function PortfolioViewTracker({ portfolioId }: { portfolioId: string }) {
  useEffect(() => {
    trackPortfolioGeneration(true);
  }, [portfolioId]);

  return null;
}
