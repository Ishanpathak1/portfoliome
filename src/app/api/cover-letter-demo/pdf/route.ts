import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
	let browser: any = null;
	try {
		const { searchParams } = new URL(request.url);
		const targetUrl = searchParams.get('url');
		const origin = new URL(request.url).origin;
		const { default: puppeteer } = await import('puppeteer-core');
		const { default: chromium } = await import('@sparticuz/chromium');
		// Ensure serverless-friendly modes
		(chromium as any).setHeadlessMode = true;
		(chromium as any).setGraphicsMode = false;
		// Ensure dynamic loader can find packaged libs
		try {
			const libPath = (chromium as any).libPath as string | undefined;
			if (libPath) {
				process.env.LD_LIBRARY_PATH = `${libPath}:${process.env.LD_LIBRARY_PATH || ''}`;
			}
		} catch {}

		const browserWSEndpoint = process.env.BROWSER_WS_ENDPOINT || process.env.BROWSERLESS_WS;
		if (browserWSEndpoint) {
			try {
				browser = await puppeteer.connect({ browserWSEndpoint });
			} catch (connectError: any) {
				// Fallback: Browserless REST PDF API for URL
				try {
					const token = (() => { try { const u = new URL(browserWSEndpoint); return u.searchParams.get('token'); } catch { return null; } })();
					const httpEndpoint = process.env.BROWSERLESS_HTTP_ENDPOINT || (token ? `https://production-sfo.browserless.io/pdf?token=${token}` : null);
					if (!httpEndpoint) throw connectError;
					const url = targetUrl && targetUrl.startsWith('http') ? targetUrl : `${origin}/cover-letter-render?pdf=1`;
					const res = await fetch(httpEndpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ url, options: { format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: '0', bottom: '0', left: '0', right: '0' }, pageRanges: '1' } })
					});
					if (!res.ok) throw new Error(`Browserless REST PDF failed: ${res.status}`);
					const arrayBuffer = await res.arrayBuffer();
					const pdf = Buffer.from(arrayBuffer);
					return new NextResponse(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="cover-letter.pdf"' } });
				} catch {
					throw connectError;
				}
			}
		} else {
			const executablePath = await chromium.executablePath();
			browser = await puppeteer.launch({
				args: [
					...chromium.args,
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--no-zygote',
					'--single-process',
					'--font-render-hinting=none',
					'--disable-gpu',
					'--disable-software-rasterizer',
				],
				defaultViewport: chromium.defaultViewport,
				executablePath,
				headless: (chromium as any).headless ?? true,
				ignoreHTTPSErrors: true,
			});
		}
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


