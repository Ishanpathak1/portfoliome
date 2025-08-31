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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 60%, #4c1d95 100%)',
          padding: 80,
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              textShadow: '0 6px 30px rgba(0,0,0,0.35)'
            }}
          >
            {displayTitle}
          </div>
          {slug && (
            <div
              style={{
                fontSize: 34,
                opacity: 0.9,
              }}
            >
              {`take-my.info/${slug}`}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              padding: '12px 18px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)'
            }}
          >
            PortfolioHub
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}


