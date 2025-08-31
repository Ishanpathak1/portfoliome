import { DatabasePortfolio } from '@/lib/portfolio-db'

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  if (envUrl && envUrl.startsWith('http')) return envUrl;
  return process.env.NODE_ENV === 'production' ? 'https://take-my.info' : 'http://localhost:3000';
}

export function buildPortfolioJsonLd(portfolio: DatabasePortfolio) {
  const baseUrl = getBaseUrl();
  const resume: any = portfolio.resumeData as any;
  const personName: string = resume?.contact?.name || 'Professional';
  const jobTitle: string | undefined = resume?.experience?.[0]?.position;
  const websiteUrl = `${baseUrl}/${portfolio.slug}`;

  const person: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personName,
    url: websiteUrl,
  };

  if (jobTitle) person.jobTitle = jobTitle;
  if (resume?.contact?.email) person.email = resume.contact.email;
  if (resume?.contact?.location) person.address = { '@type': 'PostalAddress', addressLocality: resume.contact.location };
  if (resume?.contact?.linkedin) person.sameAs = [...(person.sameAs || []), resume.contact.linkedin];
  if (resume?.contact?.github) person.sameAs = [...(person.sameAs || []), resume.contact.github];
  if (resume?.contact?.website) person.sameAs = [...(person.sameAs || []), resume.contact.website];

  const website: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: websiteUrl,
    name: `${personName} – Portfolio`,
  };

  const works: any[] = [];
  const projects: any[] = resume?.projects || [];
  for (const p of projects) {
    works.push({
      '@type': 'CreativeWork',
      name: p.name,
      description: p.description,
      url: p.link || websiteUrl,
      dateCreated: p.startDate,
    });
  }

  const graph = [person, website, ...works];
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}


