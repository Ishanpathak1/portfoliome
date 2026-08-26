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
const MONTH_LOOKUP: Record<string, number> = {
  sept: 9,
};
MONTH_NAMES.forEach((name, index) => {
  MONTH_LOOKUP[name] = index + 1;
});
MONTH_ABBREV.forEach((name, index) => {
  MONTH_LOOKUP[name] = index + 1;
});

type DatePrecision = 'year' | 'month' | 'day';

type ParsedDate = {
  year: number;
  month?: number;
  day?: number;
  precision: DatePrecision;
};

function monthFromName(raw: string): number | null {
  const key = raw.toLowerCase().replace(/\./g, '');
  if (MONTH_LOOKUP[key]) return MONTH_LOOKUP[key];
  if (key.length >= 3 && MONTH_LOOKUP[key.slice(0, 3)]) return MONTH_LOOKUP[key.slice(0, 3)];
  return null;
}

function isValidYear(year: number): boolean {
  return year >= 1900 && year <= 2100;
}

function isValidMonth(month: number): boolean {
  return month >= 1 && month <= 12;
}

function isValidDay(year: number, month: number, day: number): boolean {
  if (day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isPresentLike(value: string): boolean {
  return /^(present|current|now|ongoing|today|n\/?a)$/i.test(value.trim());
}

function parsedDate(year: number, month?: number, day?: number, precision?: DatePrecision): ParsedDate | null {
  if (!isValidYear(year)) return null;
  if (month != null && !isValidMonth(month)) return null;
  if (day != null && (month == null || !isValidDay(year, month, day))) return null;
  if (precision === 'day' && (month == null || day == null)) return null;
  if (precision === 'month' && month == null) return null;
  return {
    year,
    month,
    day,
    precision: precision || (day != null ? 'day' : month != null ? 'month' : 'year'),
  };
}

function formatParsedDate(parsed: ParsedDate): string {
  if (!parsed.month || parsed.precision === 'year') return String(parsed.year);
  const monthName = MONTH_NAMES[parsed.month - 1];
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${parsed.year}`;
}

function tryParseDateString(raw: string): ParsedDate | null {
  const text = raw
    .trim()
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ');
  if (!text || isPresentLike(text)) return null;

  const value = text.toLowerCase().replace(/([a-z]+)\./g, '$1');

  // Calendar dates, including ISO timestamps. Never use `new Date("YYYY-MM-DD")`.
  let match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[t ].+)?$/);
  if (match) return parsedDate(Number(match[1]), Number(match[2]), Number(match[3]), 'day');

  match = value.match(/^(\d{4})-(\d{1,2})$/);
  if (match) return parsedDate(Number(match[1]), Number(match[2]), undefined, 'month');

  match = value.match(/^(\d{4})$/);
  if (match) return parsedDate(Number(match[1]), undefined, undefined, 'year');

  match = value.match(/^([a-z]+)\s+(\d{1,2})\s+(\d{4})$/);
  if (match) {
    const month = monthFromName(match[1]);
    if (month) return parsedDate(Number(match[3]), month, Number(match[2]), 'day');
  }

  match = value.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (match) {
    const month = monthFromName(match[2]);
    if (month) return parsedDate(Number(match[3]), month, Number(match[1]), 'day');
  }

  match = value.match(/^([a-z]+)\s+(\d{4})$/);
  if (match) {
    const month = monthFromName(match[1]);
    if (month) return parsedDate(Number(match[2]), month, undefined, 'month');
  }

  match = value.match(/^(\d{1,2})[/-](\d{4})$/);
  if (match) return parsedDate(Number(match[2]), Number(match[1]), undefined, 'month');

  match = value.match(/^(\d{4})[/.](\d{1,2})$/);
  if (match) return parsedDate(Number(match[1]), Number(match[2]), undefined, 'month');

  match = value.match(/^(\d{4})[/.](\d{1,2})[/.](\d{1,2})$/);
  if (match) return parsedDate(Number(match[1]), Number(match[2]), Number(match[3]), 'day');

  match = value.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (match) {
    const first = Number(match[1]);
    const second = Number(match[2]);
    const year = Number(match[3]);
    if (first > 12) return parsedDate(year, second, first, 'day');
    if (second > 12) return parsedDate(year, first, second, 'day');
    return parsedDate(year, first, second, 'day');
  }

  return null;
}

function parseDateParts(input: string | Date | undefined | null): ParsedDate | null {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return null;
    return parsedDate(input.getFullYear(), input.getMonth() + 1, input.getDate(), 'day');
  }
  if (typeof input !== 'string') return null;

  const raw = input.trim();
  if (!raw) return null;

  const direct = tryParseDateString(raw);
  if (direct) return direct;

  const rangeParts = raw.split(/\s*(?:–|—|−|\bto\b|\buntil\b|\bthrough\b)\s+|\s+-\s+/i);
  if (rangeParts.length > 1) {
    const fromRange = tryParseDateString(rangeParts[0]);
    if (fromRange) return fromRange;
  }

  const embedded = raw.match(/(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(?:\d{1,2}(?:st|nd|rd|th)?,?\s+)?\d{4}|\d{4}-\d{1,2}(?:-\d{1,2})?|\d{1,2}[/.]\d{1,2}[/.]\d{4}|\d{1,2}[/.]\d{4}|\b(?:19|20)\d{2}\b/i);
  if (embedded) return tryParseDateString(embedded[0]);

  return null;
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';

  try {
    if (typeof dateString === 'string' && isPresentLike(dateString)) return 'Present';
    const parsed = parseDateParts(dateString);
    if (parsed) return formatParsedDate(parsed);
    return typeof dateString === 'string' ? dateString.trim() : '';
  } catch {
    return typeof dateString === 'string' ? dateString.trim() : '';
  }
}

/** Format experience date range; handles empty start/end and current role. Returns '' when no dates. */
export function formatExperienceDateRange(exp: { startDate?: string; endDate?: string; current?: boolean }): string {
  const start = formatDate(exp.startDate || '');
  const rawEnd = (exp.endDate || '').trim();
  const isCurrent = !!exp.current || isPresentLike(rawEnd);
  const end = isCurrent ? 'Present' : formatDate(rawEnd);
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
    if (typeof dateInput === 'string' && isPresentLike(dateInput)) return '';
    const parsed = parseDateParts(dateInput);
    if (parsed) return formatParsedDate(parsed);
    return typeof dateInput === 'string' ? dateInput.trim() : '';
  } catch {
    return typeof dateInput === 'string' ? dateInput.trim() : '';
  }
}

export function extractDateRange(text: string): { startDate: string; endDate: string; current: boolean } {
  const current = /(?:\bpresent\b|\bcurrent\b|\bnow\b|\bongoing\b)/i.test(text || '');
  if (!text?.trim()) return { startDate: '', endDate: '', current };

  const tokens: string[] = [];
  const seen = new Set<string>();
  const finder = /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(?:\d{1,2}(?:st|nd|rd|th)?,?\s+)?\d{4}|\d{4}[/.]\d{1,2}(?:[/.]\d{1,2})?|\d{4}-\d{1,2}(?:-\d{1,2})?|\d{1,2}[/.]\d{1,2}[/.]\d{4}|\d{1,2}[/.]\d{4}|\b(?:19|20)\d{2}\b/gi;

  let match: RegExpExecArray | null;
  while ((match = finder.exec(text)) !== null) {
    const parsed = parseDateParts(match[0]);
    if (!parsed) continue;
    const key = `${parsed.year}-${parsed.month || 0}-${parsed.day || 0}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tokens.push(formatParsedDate(parsed));
  }

  return {
    startDate: tokens[0] || '',
    endDate: current ? '' : (tokens[1] || ''),
    current,
  };
}
