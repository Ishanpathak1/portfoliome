import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalAuthWrapper from '@/components/ConditionalAuthWrapper';
import { GoogleAnalyticsWrapper } from '@/components/GoogleAnalytics';
import ConditionalNavigation from '@/components/ConditionalNavigation';

const inter = Inter({ subsets: ['latin'] });

// Helper function to get clean URL
function getBaseUrl(): string {
  // Clean up the environment variable in case it has the variable name in it
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  
  // Fallback based on environment
  return process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000';
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'PortfolioHub – Create Your Professional Portfolio Website in Minutes',
    template: '%s | PortfolioHub - AI-Powered Portfolio Generator'
  },
  description: 'Transform your resume into a stunning portfolio website instantly. Free AI-powered portfolio generator with beautiful templates. Perfect for developers, designers, and professionals. No coding required.',
  keywords: [
    'portfolio generator',
    'resume to portfolio',
    'professional portfolio',
    'personal website',
    'career portfolio',
    'AI portfolio builder',
    'resume parser',
    'professional website generator',
    'free portfolio website',
    'portfolio maker',
    'developer portfolio',
    'designer portfolio',
    'online resume',
    'digital portfolio',
    'portfolio templates',
    'portfolio website builder',
    'AI resume parser',
    'portfolio hosting',
    'personal branding',
    'job search portfolio'
  ],
  authors: [{ name: 'PortfolioHub Team' }],
  creator: 'PortfolioHub',
  publisher: 'PortfolioHub',
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: 'PortfolioHub – Create Your Professional Portfolio Website in Minutes',
    description: 'Transform your resume into a stunning portfolio website instantly. Free AI-powered portfolio generator with beautiful templates. No coding required.',
    type: 'website',
    url: getBaseUrl(),
    siteName: 'PortfolioHub',
    images: [
      {
        url: '/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'PortfolioHub - Create Your Professional Portfolio Website in Minutes',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Professional Portfolio Website in Minutes',
    description: 'Transform your resume into a stunning portfolio website instantly. Free AI-powered portfolio generator with beautiful templates.',
    images: ['/og-cover.png'],
    creator: '@portfoliohub',
    site: '@portfoliohub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    nocache: true,
  },
  verification: {
    google: 'google-site-verification-code', // Replace with your actual verification code
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalyticsWrapper />
        <ConditionalAuthWrapper>
          <ConditionalNavigation />
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
            {children}
          </div>
        </ConditionalAuthWrapper>
      </body>
    </html>
  );
} 