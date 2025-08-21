import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
	let browser: any = null;
	try {
		const { searchParams } = new URL(request.url);
		const targetUrl = searchParams.get('url');
		const origin = new URL(request.url).origin;
		const { default: puppeteer } = await import('puppeteer');
		browser = await puppeteer.launch({
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--font-render-hinting=none',
				'--disable-gpu',
			],
			headless: true
		});
		const page = await browser.newPage();
		await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
		await page.emulateMediaType('print');
		const url = targetUrl && targetUrl.startsWith('http') ? targetUrl : `${origin}/cover-letter-render?pdf=1`;
		await page.goto(url, { waitUntil: 'networkidle0' });
		// Force-hide overlays via CSS in case DOM removal happens too early
		await page.addStyleTag({ content: `
		  [data-nextjs-toast], #nextjs__container, #nextjs-overlay, .nextjs-toast-errors, .nextjs-toast { display: none !important; visibility: hidden !important; opacity: 0 !important; }
		` });
		// Remove Next.js dev overlays/toasts to avoid capturing them in PDF during development
		try {
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
		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			preferCSSPageSize: true,
			margin: { top: '0', bottom: '0', left: '0', right: '0' },
			pageRanges: '1'
		});
		await page.close();
		await browser.close();
		browser = null;

		return new NextResponse(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="cover-letter.pdf"'
			}
		});
	} catch (error) {
		if (browser) {
			try { await browser.close(); } catch {}
		}
		console.error('PDF render error:', error);
		return NextResponse.json({ error: 'Failed to render PDF' }, { status: 500 });
	}
}


