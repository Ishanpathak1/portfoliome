import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export function getPortfolioUrl(slug: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${slug}`;
}

export function validateAndFixUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    // If it's not a valid URL, try to fix it
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
}

export function trackPortfolioGeneration(success: boolean): void {
  // This function can be used to track portfolio generation events
  // You can integrate with analytics services like Google Analytics, Mixpanel, etc.
  if (typeof window !== 'undefined') {
    console.log('Portfolio generation tracked:', success);
    
    // Example: Send to analytics service
    // gtag('event', 'portfolio_generation', {
    //   success: success,
    //   timestamp: new Date().toISOString()
    // });
  }
}

export function trackTemplateSelection(templateId: string): void {
  // Track template selection events
  if (typeof window !== 'undefined') {
    console.log('Template selected:', templateId);
    
    // Example: Send to analytics service
    // gtag('event', 'template_selection', {
    //   template_id: templateId,
    //   timestamp: new Date().toISOString()
    // });
  }
}

export function trackResumeUpload(success: boolean): void {
  // Track resume upload events
  if (typeof window !== 'undefined') {
    console.log('Resume upload tracked:', success);
    
    // Example: Send to analytics service
    // gtag('event', 'resume_upload', {
    //   success: success,
    //   timestamp: new Date().toISOString()
    // });
  }
}

const MONTH_NAMES = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const MONTH_ABBREV = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

function parseFlexibleDate(s: string): Date | null {
  if (!s || typeof s !== 'string') return null;
  const trimmed = s.trim().toLowerCase();
  if (!trimmed) return null;
  let date = new Date(s);
  if (!isNaN(date.getTime())) return date;
  const match = trimmed.match(/^([a-z]+)\s*[\s\-,\/]*\s*(\d{4})$/);
  if (match) {
    const monthStr = match[1];
    const year = parseInt(match[2], 10);
    const mi = MONTH_NAMES.indexOf(monthStr);
    const ai = MONTH_ABBREV.indexOf(monthStr.slice(0, 3));
    const month = mi >= 0 ? mi : (ai >= 0 ? ai : -1);
    if (month >= 0 && year >= 1900 && year <= 2100) {
      date = new Date(year, month, 1);
      if (!isNaN(date.getTime())) return date;
    }
  }
  const ymd = trimmed.match(/^(\d{4})-(\d{1,2})-?(\d{1,2})?$/);
  if (ymd) {
    const y = parseInt(ymd[1], 10);
    const m = parseInt(ymd[2], 10) - 1;
    const d = ymd[3] ? parseInt(ymd[3], 10) : 1;
    date = new Date(y, m, d);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseFlexibleDate(dateString) : (isNaN((dateString as Date).getTime()) ? null : dateString);
    if (!date || isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  } catch {
    return '';
  }
}

/** Format experience date range; handles empty start/end and current role. Returns '' when no dates. */
export function formatExperienceDateRange(exp: { startDate?: string; endDate?: string; current?: boolean }): string {
  const start = formatDate(exp.startDate || '');
  const end = formatDate(exp.endDate || '');
  const isCurrent = !!exp.current;
  if (!start && !end && !isCurrent) return '';
  if (isCurrent) return start ? `${start} – Present` : 'Present';
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
}

/** Format project date range; returns '' when no dates. */
export function formatProjectDateRange(project: { startDate?: string; endDate?: string }): string {
  const start = formatDate(project.startDate || '');
  const end = formatDate(project.endDate || '');
  if (!start && !end) return '';
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

/** Format graduation date; returns 'In Progress' when empty. */
export function formatGraduationDate(dateString?: string): string {
  const formatted = formatDate(dateString || '');
  return formatted || 'In Progress';
}

export function safeUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  try {
    // If it already has a protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, add https://
    return `https://${url}`;
  } catch {
    return '';
  }
}

export function normalizeDateInput(dateInput: string | Date | undefined): string {
  if (!dateInput) return '';
  
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch {
    return '';
  }
}
