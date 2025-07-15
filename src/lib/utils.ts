export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
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