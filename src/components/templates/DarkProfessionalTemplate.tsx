'use client';

import { DatabasePortfolio } from '@/lib/portfolio-db';

interface DarkProfessionalTemplateProps {
  portfolio: DatabasePortfolio;
}

export function DarkProfessionalTemplate({ portfolio }: DarkProfessionalTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dark Professional Template</h1>
        <p className="text-gray-300">Coming Soon - Under Development</p>
        <p className="text-sm text-gray-500 mt-4">Portfolio for: {portfolio.resumeData.contact.name}</p>
      </div>
    </div>
  );
} 