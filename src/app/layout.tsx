import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FirebaseAuthWrapper } from '@/components/FirebaseAuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://portfoliome.vercel.app' : 'http://localhost:3000')),
  title: 'Portfolio Generator - Transform Your Resume into a Beautiful Portfolio',
  description: 'Upload your resume and get a personalized, professional portfolio website in minutes.',
  keywords: 'portfolio, resume, generator, website, professional, career',
  openGraph: {
    title: 'Portfolio Generator',
    description: 'Transform your resume into a beautiful professional portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Generator',
    description: 'Transform your resume into a beautiful professional portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthWrapper>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {children}
          </div>
        </FirebaseAuthWrapper>
      </body>
    </html>
  );
} 