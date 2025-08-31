import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get('slug') || '').slice(0, 60);
  const title = (searchParams.get('title') || '').slice(0, 80);

  const displayTitle = title || (slug ? `${slug}` : 'PortfolioHub');

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
          padding: 64,
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0,0,0,0.35)'
            }}
          >
            {displayTitle}
          </div>
          {slug && (
            <div
              style={{
                fontSize: 28,
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
              fontSize: 24,
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)'
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


