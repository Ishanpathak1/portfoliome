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
        allow: [
          '/',
          '/features',
          '/templates',
          '/how-it-works',
          '/about',
          '/contact',
          '/faq',
          '/blog',
          '/privacy-policy',
          '/terms-of-service'
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/*?*', // Prevent crawling of URLs with query parameters
          '/*.json$', // Prevent crawling of JSON files
          '/private/',
          '/admin/',
          '/auth/',
          '/user/',
          '/*.php$', // Block PHP files (common attack vector)
          '/*.sql$', // Block SQL files
          '/*.xml$', // Block XML files except sitemap
          '/wp-*', // Block WordPress-style URLs
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'], // Prevent GPT from crawling the site
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'], // Prevent ChatGPT from crawling the site
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'], // Prevent Common Crawl from crawling the site
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 