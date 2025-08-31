import { MetadataRoute } from 'next'

// Helper function to get clean URL
function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }
  
  return process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/sitemap.xml'],
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 