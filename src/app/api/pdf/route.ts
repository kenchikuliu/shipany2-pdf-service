import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Align = 'left' | 'center' | 'right';

function asAlign(v: unknown, fallback: Align = 'center'): Align {
  if (v === 'left' || v === 'center' || v === 'right') return v;
  return fallback;
}

function asLogoPos(v: unknown) {
  const allowed = new Set([
    'header-left',
    'header-center',
    'header-right',
    'footer-left',
    'footer-center',
    'footer-right'
  ]);
  const s = typeof v === 'string' ? v : '';
  return allowed.has(s) ? s : 'header-left';
}

function escHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escAttr(s: string) {
  return s.replaceAll('"', '&quot;');
}

function buildCss(opts: {
  headerEnabled: boolean;
  footerEnabled: boolean;
  logoEnabled: boolean;
  logoPos: string;
}) {
  const topMargin = opts.headerEnabled || (opts.logoEnabled && opts.logoPos.startsWith('header')) ? 24 : 12;
  const bottomMargin = opts.footerEnabled || (opts.logoEnabled && opts.logoPos.startsWith('footer')) ? 24 : 12;

  return `
@media print {
  @page { margin: ${topMargin}mm 10mm ${bottomMargin}mm 10mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pdf-fixed-header, .pdf-fixed-footer {
    position: fixed;
    left: 10mm;
    right: 10mm;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    z-index: 2147483647;
    pointer-events: none;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  }
  .pdf-fixed-header { top: 4mm; }
  .pdf-fixed-footer { bottom: 4mm; }
  .pdf-slot-left { text-align: left; }
  .pdf-slot-center { text-align: center; }
  .pdf-slot-right { text-align: right; }
  .pdf-logo { max-height: 12mm; width: auto; object-fit: contain; }
}`;
}

function buildBar(
  kind: 'header' | 'footer',
  cfg: { enabled?: boolean; text?: string; align?: string; fontSize?: number; color?: string },
  logo: { enabled?: boolean; dataUrl?: string; position?: string; maxHeightMm?: number }
) {
  const enabled = Boolean(cfg?.enabled);
  const text = typeof cfg?.text === 'string' ? cfg.text.trim() : '';
  const align = asAlign(cfg?.align);
  const fontSize = Math.max(8, Math.min(24, Number(cfg?.fontSize || 11)));
  const color = typeof cfg?.color === 'string' && cfg.color ? cfg.color : '#111827';

  const logoEnabled = Boolean(logo?.enabled && logo?.dataUrl);
  const logoPos = asLogoPos(logo?.position);
  const showLogo = logoEnabled && logoPos.startsWith(kind);
  const logoAlign = showLogo ? (logoPos.split('-')[1] as Align) : null;
  const logoMm = Math.max(4, Math.min(30, Number(logo?.maxHeightMm || 10)));

  if (!enabled && !showLogo) return '';

  const slots: Record<Align, string> = { left: '', center: '', right: '' };
  if (enabled && text) {
    slots[align] += `<span style="font-size:${fontSize}px;color:${color};">${escHtml(text)}</span>`;
  }
  if (showLogo && logoAlign && logo?.dataUrl) {
    slots[logoAlign] += `<img class="pdf-logo" style="max-height:${logoMm}mm;" src="${escAttr(logo.dataUrl)}" alt="logo" />`;
  }

  return `
<div class="pdf-fixed-${kind}">
  <div class="pdf-slot-left">${slots.left}</div>
  <div class="pdf-slot-center">${slots.center}</div>
  <div class="pdf-slot-right">${slots.right}</div>
</div>`;
}

async function launchBrowser() {
  const wsEndpoint = process.env.BROWSER_WS_ENDPOINT;
  if (wsEndpoint) {
    return puppeteer.connect({ browserWSEndpoint: wsEndpoint });
  }

  const isVercel = Boolean(process.env.VERCEL);
  if (isVercel) {
    const packUrl =
      process.env.CHROMIUM_PACK_URL ||
      'https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar';
    const executablePath = await chromium.executablePath(packUrl);
    return puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
      defaultViewport: { width: 1440, height: 2200 }
    });
  }

  const localPath = process.env.CHROME_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  return puppeteer.launch({
    executablePath: localPath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
}

export async function POST(req: NextRequest) {
  let browser: any;
  try {
    const body = await req.json();
    const url = typeof body?.url === 'string' ? body.url : '';
    const html = typeof body?.html === 'string' ? body.html : '';

    if (!url && !html) {
      return NextResponse.json({ ok: false, error: 'Provide either url or html' }, { status: 400 });
    }
    if (url) {
      const u = new URL(url);
      if (!['http:', 'https:'].includes(u.protocol)) {
        return NextResponse.json({ ok: false, error: 'Only http/https URLs are supported' }, { status: 400 });
      }
    }

    const waitMs = Math.max(0, Math.min(30000, Number(body?.waitMs || 1500)));
    const format = typeof body?.format === 'string' ? body.format : 'A4';
    const landscape = Boolean(body?.landscape);
    const printBackground = body?.printBackground !== false;

    const header = body?.header || { enabled: false };
    const footer = body?.footer || { enabled: false };
    const logo = body?.logo || { enabled: false };

    const logoPos = asLogoPos(logo?.position);
    const printCss = buildCss({
      headerEnabled: Boolean(header?.enabled),
      footerEnabled: Boolean(footer?.enabled),
      logoEnabled: Boolean(logo?.enabled && logo?.dataUrl),
      logoPos
    });

    browser = await launchBrowser();
    const page = await browser.newPage();

    const vpW = Number(body?.viewportWidth || 1440);
    const vpH = Number(body?.viewportHeight || 2200);
    await page.setViewport({ width: vpW, height: vpH });

    if (url) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
    } else {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
    }

    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    const headerHtml = buildBar('header', header, logo);
    const footerHtml = buildBar('footer', footer, logo);

    await page.addStyleTag({ content: printCss });
    await page.evaluate(
      ({ headerMarkup, footerMarkup }: { headerMarkup: string; footerMarkup: string }) => {
        document.querySelectorAll('.pdf-fixed-header,.pdf-fixed-footer').forEach((n) => n.remove());
        if (headerMarkup) document.body.insertAdjacentHTML('beforeend', headerMarkup);
        if (footerMarkup) document.body.insertAdjacentHTML('beforeend', footerMarkup);
      },
      { headerMarkup: headerHtml, footerMarkup: footerHtml }
    );

    const pdf = await page.pdf({
      format,
      landscape,
      printBackground,
      margin: {
        top: `${Number(body?.marginTopMm ?? 12)}mm`,
        right: `${Number(body?.marginRightMm ?? 10)}mm`,
        bottom: `${Number(body?.marginBottomMm ?? 12)}mm`,
        left: `${Number(body?.marginLeftMm ?? 10)}mm`
      }
    });

    await page.close();
    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'inline; filename="export.pdf"'
      }
    });
  } catch (err: any) {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    const hint = process.env.VERCEL && !process.env.BROWSER_WS_ENDPOINT
      ? 'Set BROWSER_WS_ENDPOINT for remote browser on Vercel if local Chromium fails.'
      : undefined;
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to generate PDF', hint },
      { status: 400 }
    );
  }
}
