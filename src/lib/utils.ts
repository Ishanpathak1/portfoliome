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

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '';
  }
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
