import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

export function rateLimit(request: NextRequest, options: RateLimitOptions): NextResponse | null {
  const now = Date.now();
  const id = `${options.key}:${getClientIp(request)}`;
  const current = buckets.get(id);

  if (!current || current.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= options.limit) return null;

  const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}

export const RATE_LIMITS = {
  auth: { limit: 60, windowMs: 60_000 },
  publicRead: { limit: 120, windowMs: 60_000 },
  mutation: { limit: 30, windowMs: 60_000 },
  expensive: { limit: 10, windowMs: 60_000 },
  contact: { limit: 5, windowMs: 10 * 60_000 },
};
