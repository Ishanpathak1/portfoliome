import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-defined structured data for the homepage
export function HomepageStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PortfolioHub",
    "description": "Generate a professional portfolio from your resume in minutes. Transform your career story into a stunning, personalized website with AI-powered design.",
    "url": "https://take-my.info",
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "PortfolioHub"
    },
    "featureList": [
      "AI-powered resume parsing",
      "Professional portfolio templates",
      "Responsive design",
      "Custom domain support",
      "SEO optimization",
      "Real-time preview"
    ]
  };

  return <StructuredData data={structuredData} />;
} 