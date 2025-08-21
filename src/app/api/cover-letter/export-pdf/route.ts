import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let browser: any = null;
  try {
    const { html } = await request.json();
    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing html' }, { status: 400 });
    }
    const { default: puppeteer } = await import('puppeteer-core');
    const { default: chromium } = await import('@sparticuz/chromium');
    const executablePath = await chromium.executablePath();
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--font-render-hinting=none',
        '--disable-gpu',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless ?? true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
      <style>
        @page { size: A4; margin: 0; }
        html, body { height: 100%; margin:0; padding:0; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Inter', ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial; }
        * { box-sizing: border-box; }
        .a4 { width: 794px; height: 1123px; margin: 0 auto; overflow: hidden; box-sizing: border-box; }
        .muted { color: #6B7280; font-size: 12px; }
        .title { font-weight: 800; font-size: 22px; color: #111827; }
        .subtitle { color: #4B5563; font-size: 14px; }
        .bar { height: 6px; background: linear-gradient(90deg,#7c3aed,#ec4899,#2563eb); border-radius: 6px; }
      </style>
    </head><body>${html}</body></html>`, { waitUntil: 'networkidle0' });

    // Remove dev overlays/errors before PDF capture
    try {
      await page.addStyleTag({ content: `
        [data-nextjs-toast], #nextjs__container, #nextjs-overlay, .nextjs-toast-errors, .nextjs-toast { display: none !important; visibility: hidden !important; opacity: 0 !important; }
      ` });
      await page.evaluate(() => {
        const selectors = [
          '[data-nextjs-toast]',
          '#nextjs__container',
          '#nextjs-overlay',
          '.nextjs-toast-errors',
        ];
        selectors.forEach(s => {
          Array.from(document.querySelectorAll(s)).forEach(el => el.remove());
        });
      });
    } catch {}

    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: '0', bottom: '0', left: '0', right: '0' }, pageRanges: '1' });
    await page.close();
    await browser.close();
    browser = null;

    return new NextResponse(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="cover-letter.pdf"' } });
  } catch (error) {
    if (browser) { try { await browser.close(); } catch {} }
    console.error('Export PDF error:', error);
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 });
  }
}


