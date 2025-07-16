import { Inter } from 'next/font/google';
import { GoogleAnalyticsWrapper } from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <GoogleAnalyticsWrapper />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        {children}
      </div>
    </div>
  );
} 