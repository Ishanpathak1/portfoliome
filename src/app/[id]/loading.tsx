'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface LoadingData {
  name: string;
  colorScheme: string;
  templateId: string;
}

export default function PortfolioLoading() {
  const params = useParams();
  const [loadingData, setLoadingData] = useState<LoadingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const slug = params.id as string;

  useEffect(() => {
    if (slug) {
      fetchLoadingData();
    }
  }, [slug]);

  const fetchLoadingData = async () => {
    try {
      const response = await fetch(`/api/portfolio-loading?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setLoadingData(data);
      }
    } catch (error) {
      console.error('Error fetching loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Color scheme mapping
  const getColorScheme = (colorScheme: string) => {
    const schemes = {
      blue: {
        gradient: 'from-blue-900 via-slate-900 to-blue-900',
        text: 'text-blue-300'
      },
      green: {
        gradient: 'from-green-900 via-slate-900 to-green-900',
        text: 'text-green-300'
      },
      purple: {
        gradient: 'from-purple-900 via-slate-900 to-purple-900',
        text: 'text-purple-300'
      },
      orange: {
        gradient: 'from-orange-900 via-slate-900 to-orange-900',
        text: 'text-orange-300'
      }
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.blue;
  };

  const colors = getColorScheme(loadingData?.colorScheme || 'blue');
  
  // Show loading state until we have the data
  if (isLoading || !loadingData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mb-6"></div>
          <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
            Loading Portfolio
          </h1>
          <p className="text-white/60">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Show with actual name once data is loaded
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mb-6"></div>
        <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>
          Loading {loadingData.name}'s Portfolio
        </h1>
        <p className="text-white/60">
          Please wait...
        </p>
      </div>
    </div>
  );
} 