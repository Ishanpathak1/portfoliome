export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';

  const raw = String(dateString).trim();
  if (!raw) return '';

  // Normalize common terms
  const lower = raw.toLowerCase();
  if (lower === 'present' || lower === 'current' || lower === 'now') {
    return 'Present';
  }

  // Quick paths for common formats to avoid Safari/iOS parsing issues
  // 1) YYYY
  const yearOnlyMatch = raw.match(/^\d{4}$/);
  if (yearOnlyMatch) {
    return yearOnlyMatch[0];
  }

  // 2) YYYY-MM or YYYY/M
  const ymMatch = raw.replace(/\//g, '-').match(/^(\d{4})-(\d{1,2})$/);
  if (ymMatch) {
    const year = parseInt(ymMatch[1], 10);
    const month = Math.min(Math.max(parseInt(ymMatch[2], 10), 1), 12);
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC'
    });
  }

  // 3) YYYY-MM-DD or YYYY/MM/DD (show Month Year)
  const ymdMatch = raw.replace(/\//g, '-').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = Math.min(Math.max(parseInt(ymdMatch[2], 10), 1), 12);
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC'
    });
  }

  // 4) MM/YYYY or M/YYYY (show Month Year)
  const myMatch = raw.match(/^(\d{1,2})[\/-](\d{4})$/);
  if (myMatch) {
    const month = Math.min(Math.max(parseInt(myMatch[1], 10), 1), 12);
    const year = parseInt(myMatch[2], 10);
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC'
    });
  }

  // 5) Month YYYY (various month name lengths)
  const monthNames = [
    'january','february','march','april','may','jun','june','jul','july','aug','august','sep','september','oct','october','nov','november','dec','december'
  ];
  const monthYearNameMatch = raw.match(/^([A-Za-z]+)[\s,]+(\d{4})$/);
  if (monthYearNameMatch) {
    const monthName = monthYearNameMatch[1].toLowerCase();
    const year = parseInt(monthYearNameMatch[2], 10);

    let monthIndex = -1;
    // Map various month tokens to month index
    const tokenToIndex: Record<string, number> = {
      january: 0, jan: 0,
      february: 1, feb: 1,
      march: 2, mar: 2,
      april: 3, apr: 3,
      may: 4,
      june: 5, jun: 5,
      july: 6, jul: 6,
      august: 7, aug: 7,
      september: 8, sep: 8,
      october: 9, oct: 9,
      november: 10, nov: 10,
      december: 11, dec: 11
    };
    if (monthName in tokenToIndex) {
      monthIndex = tokenToIndex[monthName];
    } else if (monthNames.includes(monthName)) {
      // Fallback in unlikely case
      monthIndex = monthNames.indexOf(monthName) % 12;
    }

    if (monthIndex >= 0) {
      return new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        timeZone: 'UTC'
      });
    }
  }

  // Final fallback: try native parse; if invalid, return the original string
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  // If we still cannot parse, return the input as-is to avoid "Invalid Date"
  return raw;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getBaseUrl(): string {
  // Get the environment variable for the app URL
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace('NEXT_PUBLIC_APP_URL=', '').trim();
  
  // If we have an environment variable and it's a valid URL, use it
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl;
  }
  
  // Fallback to window.location.origin for client-side (with safety check)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallback
  return 'http://localhost:3000';
}

export function getPortfolioUrl(slug: string): string {
  return `${getBaseUrl()}/${slug}`;
}

export function validateAndFixUrl(url: string): string {
  if (!url || url.trim() === '') return '';
  
  let cleanUrl = url.trim();
  
  // If URL doesn't start with http:// or https://, add https://
  if (!cleanUrl.match(/^https?:\/\//)) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  // Basic URL validation
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch {
    // If URL is still invalid, return empty string
    return '';
  }
}

export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function safeUrl(url: string | undefined): string {
  if (!url) return '';
  return isValidUrl(url) ? url : validateAndFixUrl(url);
} 

// Normalize various date strings into a canonical format for storage.
// Returns:
// - "YYYY-MM" if month is known
// - "YYYY" if only year is known
// - "Present" if the string indicates current/present
// - original trimmed string if unrecognized
export function normalizeDateInput(input: string): string {
  if (!input) return '';
  const raw = String(input).trim();
  if (!raw) return '';

  const lower = raw.toLowerCase();
  if (/(present|current|now)/i.test(lower)) return 'Present';

  // YYYY
  const yearOnly = raw.match(/^\d{4}$/);
  if (yearOnly) return yearOnly[0];

  // Normalize separators
  const normalized = raw.replace(/\./g, '').replace(/\s+to\s+/i, ' - ').replace(/[–—]/g, '-').replace(/\//g, '-');

  // YYYY-MM or YYYY-M
  let m = normalized.match(/^(\d{4})-(\d{1,2})$/);
  if (m) {
    const year = m[1];
    const month = String(Math.min(Math.max(parseInt(m[2], 10), 1), 12)).padStart(2, '0');
    return `${year}-${month}`;
  }

  // YYYY-MM-DD or YYYY-M-D
  m = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const year = m[1];
    const month = String(Math.min(Math.max(parseInt(m[2], 10), 1), 12)).padStart(2, '0');
    return `${year}-${month}`;
  }

  // MM-YYYY or M-YYYY
  m = normalized.match(/^(\d{1,2})-(\d{4})$/);
  if (m) {
    const month = String(Math.min(Math.max(parseInt(m[1], 10), 1), 12)).padStart(2, '0');
    const year = m[2];
    return `${year}-${month}`;
  }

  // Month YYYY
  const monthMap: Record<string, string> = {
    january: '01', jan: '01',
    february: '02', feb: '02',
    march: '03', mar: '03',
    april: '04', apr: '04',
    may: '05',
    june: '06', jun: '06',
    july: '07', jul: '07',
    august: '08', aug: '08',
    september: '09', sep: '09', sept: '09',
    october: '10', oct: '10',
    november: '11', nov: '11',
    december: '12', dec: '12'
  };
  const monthYear = normalized.match(/^([A-Za-z]+)[\s,]+(\d{4})$/);
  if (monthYear) {
    const token = monthYear[1].toLowerCase();
    const year = monthYear[2];
    if (token in monthMap) return `${year}-${monthMap[token]}`;
  }

  // MM/DD/YYYY or M/D/YYYY → YYYY-MM
  m = normalized.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const year = m[3];
    const month = String(Math.min(Math.max(parseInt(m[1], 10), 1), 12)).padStart(2, '0');
    return `${year}-${month}`;
  }

  return raw;
}

// Analytics Event Tracking
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

export const analyticsEvents = {
  TEMPLATE_SELECTED: 'template_selected',
  RESUME_UPLOADED: 'resume_uploaded',
  PORTFOLIO_GENERATED: 'portfolio_generated',
  SECTION_EDITED: 'section_edited',
  PORTFOLIO_PUBLISHED: 'portfolio_published',
  PERSONALIZATION_UPDATED: 'personalization_updated',
} as const;

// Analytics helper functions
export const trackTemplateSelection = (templateName: string) => {
  trackEvent(analyticsEvents.TEMPLATE_SELECTED, { template_name: templateName });
};

export const trackResumeUpload = (fileSize: number, fileType: string) => {
  trackEvent(analyticsEvents.RESUME_UPLOADED, { file_size: fileSize, file_type: fileType });
};

export const trackPortfolioGeneration = (success: boolean, error?: string) => {
  trackEvent(analyticsEvents.PORTFOLIO_GENERATED, { 
    success,
    error_message: error || undefined 
  });
};

export const trackSectionEdit = (sectionName: string) => {
  trackEvent(analyticsEvents.SECTION_EDITED, { section_name: sectionName });
};

export const trackPortfolioPublish = (portfolioId: string) => {
  trackEvent(analyticsEvents.PORTFOLIO_PUBLISHED, { portfolio_id: portfolioId });
};

export const trackPersonalizationUpdate = (updatedFields: string[]) => {
  trackEvent(analyticsEvents.PERSONALIZATION_UPDATED, { 
    fields_updated: updatedFields.join(',') 
  });
}; 