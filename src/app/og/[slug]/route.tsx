import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

function titleCaseFromSlug(input: string): string {
  if (!input) return 'PortfolioHub';
  const cleaned = input.replace(/[\-_]+/g, ' ').trim();
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = (params.slug || '').slice(0, 60);
  const displayTitle = titleCaseFromSlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 60%, #4c1d95 100%)',
          padding: 80,
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center', textAlign: 'center', maxWidth: 1080 }}>
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              textShadow: '0 10px 40px rgba(0,0,0,0.45)',
              wordBreak: 'break-word'
            }}
          >
            {displayTitle}
          </div>
          {slug && (
            <div
              style={{
                fontSize: 42,
                opacity: 0.95,
                fontWeight: 600,
              }}
            >
              {`take-my.info/${slug}`}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}


