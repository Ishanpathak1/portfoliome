import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 1200x630 Open Graph image
export const size = {
  width: 1200,
  height: 630,
};

export async function GET(req: NextRequest) {
  try {
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
        ...size,
      }
    );
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { requirePrisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function getPalette(color: string) {
  switch (color) {
    case 'green':
      return { bgFrom: '#10B981', bgTo: '#065F46', text: '#ECFDF5', accent: '#34D399' }
    case 'purple':
      return { bgFrom: '#8B5CF6', bgTo: '#4C1D95', text: '#F5F3FF', accent: '#A78BFA' }
    case 'orange':
      return { bgFrom: '#F59E0B', bgTo: '#7C2D12', text: '#FFFBEB', accent: '#FBBF24' }
    case 'red':
      return { bgFrom: '#EF4444', bgTo: '#7F1D1D', text: '#FEF2F2', accent: '#F87171' }
    case 'blue':
    default:
      return { bgFrom: '#3B82F6', bgTo: '#1E3A8A', text: '#EFF6FF', accent: '#60A5FA' }
  }
}

function buildHtml(opts: {
  name: string
  role: string
  summary?: string
  colorScheme: string
  templateId: string
  slug: string
}) {
  const palette = getPalette(opts.colorScheme)
  const title = `${opts.name}`
  const subtitle = opts.role
  const summary = opts.summary?.slice(0, 140) || ''

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=1200, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: 1200px;
        height: 630px;
        background: linear-gradient(135deg, ${palette.bgFrom} 0%, ${palette.bgTo} 100%);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: ${palette.text};
        position: relative;
      }
      .wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 80px;
        height: 100%;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-radius: 9999px;
        background: rgba(255,255,255,0.12);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255,255,255,0.2);
        font-size: 24px;
      }
      .dot {
        width: 12px; height: 12px; border-radius: 50%; background: ${palette.accent};
      }
      h1 { font-size: 84px; line-height: 1.05; margin: 24px 0 10px; }
      h2 { font-size: 40px; font-weight: 600; opacity: 0.95; margin: 0 0 20px; }
      p { font-size: 28px; line-height: 1.4; opacity: 0.9; max-width: 900px; margin: 0; }
      .footer { position: absolute; bottom: 32px; left: 80px; font-size: 26px; opacity: 0.85; }
      .shape {
        position: absolute; right: -60px; top: -60px;
        width: 420px; height: 420px; border-radius: 24px;
        background: radial-gradient(closest-side, rgba(255,255,255,0.3), transparent),
                    linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05));
        transform: rotate(30deg);
        border: 1px solid rgba(255,255,255,0.18);
      }
    </style>
  </head>
  <body>
    <div class="shape"></div>
    <div class="wrap">
      <div class="badge"><div class="dot"></div><span>Portfolio</span></div>
      <h1>${escapeHtml(title)}</h1>
      <h2>${escapeHtml(subtitle)}</h2>
      <p>${escapeHtml(summary)}</p>
      <div class="footer">${escapeHtml(opts.slug)} • take-my.info</div>
    </div>
  </body>
</html>`
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function computeEtag(payload: any) {
  const json = JSON.stringify(payload)
  let hash = 0
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0
  }
  return `W/"${hash.toString(16)}"`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const width = Number(searchParams.get('w') || 1200)
  const height = Number(searchParams.get('h') || 630)

  if (!slug) {
    return new NextResponse('Missing slug', { status: 400 })
  }

  try {
    const prisma = requirePrisma()
    const portfolio = await prisma.portfolio.findFirst({
      where: { slug, isPublic: true },
      select: {
        slug: true,
        updatedAt: true,
        resumeData: true,
        personalization: true,
        templateId: true,
      },
    })

    if (!portfolio) {
      return new NextResponse('Not found', { status: 404 })
    }

    const resumeData: any = portfolio.resumeData as any
    const personalization: any = portfolio.personalization as any
    const name = resumeData?.contact?.name || 'Professional'
    const role = resumeData?.experience?.[0]?.position || 'Portfolio'
    const summary = resumeData?.summary
    const colorScheme = personalization?.colorScheme || 'blue'
    const templateId = personalization?.templateId || portfolio.templateId || 'modern-glassmorphism'

    // Prepare HTML
    const html = buildHtml({ name, role, summary, colorScheme, templateId, slug })

    // Launch headless Chrome in serverless-friendly mode
    const executablePath = await chromium.executablePath()
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width, height },
      executablePath: executablePath || undefined,
      headless: chromium.headless,
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const imageBuffer = await page.screenshot({ type: 'png' })
    await page.close()
    await browser.close()

    const etag = computeEtag({ slug, updatedAt: portfolio.updatedAt, colorScheme, templateId })
    const headers: Record<string, string> = {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      ETag: etag,
    }

    // ETag handling
    const ifNoneMatch = req.headers.get('if-none-match')
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers })
    }

    return new NextResponse(imageBuffer, { status: 200, headers })
  } catch (error) {
    console.error('OG image generation failed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


