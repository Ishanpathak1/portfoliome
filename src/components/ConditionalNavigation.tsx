'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Hide navigation for portfolio pages (URLs like /username)
  const isPortfolioPage = pathname?.split('/').length === 2 && pathname !== '/dashboard';
  const isDashboardPage = pathname === '/dashboard';
  const marketingPages = ['/features', '/templates', '/how-it-works', '/faq', '/contact'];
  const shouldShowNav = !isPortfolioPage || marketingPages.includes(pathname || '');

  if (!shouldShowNav) {
    return null;
  }

  return <Navigation showDashboardMode={isDashboardPage} />;
} 