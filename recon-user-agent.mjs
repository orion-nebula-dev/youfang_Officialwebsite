import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const baseUrl = 'https://www.busyming.com/';
const outDir = path.resolve('./RECON');
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  locale: 'zh-CN',
  extraHTTPHeaders: { 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8' },
});
const consoleState = { errors: [], warnings: [], pageErrors: [] };
const captures = [];

function text(node) { return (node?.textContent || '').trim().replace(/\s+/g, ' '); }

for (const width of [1440, 768, 390]) {
  const page = await context.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.setViewportSize({ width, height: 900 });
  page.on('console', (message) => {
    const entry = { type: message.type(), text: message.text(), viewport: width };
    if (message.type() === 'error') consoleState.errors.push(entry);
    if (message.type() === 'warning') consoleState.warnings.push(entry);
  });
  page.on('pageerror', (error) => consoleState.pageErrors.push({ message: error.message, viewport: width }));
  const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  const signals = await page.evaluate(() => {
    const all = (selector) => Array.from(document.querySelectorAll(selector));
    const t = (node) => (node?.textContent || '').trim().replace(/\s+/g, ' ');
    const scripts = all('script[src]').map((s) => s.src);
    const stylesheets = all("link[rel='stylesheet']").map((s) => s.href);
    const sections = all('header,nav,main,section,article,aside,footer').slice(0, 100).map((node) => {
      const rect = node.getBoundingClientRect(); const style = getComputedStyle(node);
      return { tag: node.tagName.toLowerCase(), id: node.id || '', className: String(node.className || '').slice(0, 160), text: t(node).slice(0, 240), rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }, style: { display: style.display, position: style.position, backgroundColor: style.backgroundColor, color: style.color, fontFamily: style.fontFamily, fontSize: style.fontSize } };
    });
    return {
      href: location.href, title: document.title, lang: document.documentElement.lang || '', bodyTextChars: (document.body?.innerText || '').length,
      scrollHeight: document.documentElement.scrollHeight, viewport: { width: innerWidth, height: innerHeight },
      h1: all('h1').map(t).filter(Boolean).slice(0, 10), headings: all('h1,h2,h3').slice(0, 60).map((h) => ({ tag: h.tagName.toLowerCase(), text: t(h).slice(0, 160) })),
      metaDescription: document.querySelector("meta[name='description']")?.content || '',
      counts: { links: all('a[href]').length, images: all('img').length, video: all('video').length, canvas: all('canvas').length, sections: sections.length, forms: all('form').length, buttons: all('button').length, inputs: all('input,textarea,select').length, interactive: all('a[href],button,input,textarea,select,summary,[role=button],[tabindex]').length, scripts: scripts.length, stylesheets: stylesheets.length },
      frameworks: { react: Boolean(window.__REACT_DEVTOOLS_GLOBAL_HOOK__) || Boolean(document.querySelector('#__next,[data-reactroot],[data-reactid]')), next: Boolean(document.querySelector('#__next')) || scripts.some((src) => src.includes('/_next/')), vue: Boolean(window.__VUE__) || Boolean(document.querySelector('[data-v-app]')), nuxt: Boolean(window.__NUXT__) || scripts.some((src) => src.includes('/_nuxt/')), svelte: Boolean(document.querySelector('[data-svelte-h]')), astro: Boolean(document.querySelector('[data-astro-cid]')) || scripts.some((src) => src.includes('astro')), three: Boolean(window.THREE) || scripts.some((src) => /three(\.module)?(\.min)?\.js/i.test(src)), gsap: Boolean(window.gsap) || scripts.some((src) => src.toLowerCase().includes('gsap')), lenis: Boolean(window.Lenis) || scripts.some((src) => src.toLowerCase().includes('lenis')) },
      scripts: scripts.slice(0, 120), stylesheets: stylesheets.slice(0, 80), sections,
      fonts: Array.from(document.fonts || []).map((font) => font.family).filter(Boolean).slice(0, 40),
      images: all('img').slice(0, 120).map((img) => ({ src: img.currentSrc || img.src, alt: img.alt || '', width: img.naturalWidth || img.width || 0, height: img.naturalHeight || img.height || 0 })),
      videos: all('video').slice(0, 20).map((video) => ({ src: video.currentSrc || video.src, poster: video.poster || '', width: video.videoWidth || 0, height: video.videoHeight || 0 })),
      links: all('a[href]').slice(0, 200).map((a) => ({ text: t(a).slice(0, 100), href: a.href })),
    };
  });
  signals.httpStatus = response?.status() || 0;
  const screenshotPath = path.join(outDir, 'screenshots', `original-${width}-real.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  captures.push({ viewport: { width, height: 900 }, screenshot: path.relative(outDir, screenshotPath), signals });
  await page.close();
}
await browser.close();
const result = { label: 'original', url: baseUrl, capturedAt: new Date().toISOString(), console: consoleState, captures };
fs.writeFileSync(path.join(outDir, 'original-recon-real.json'), `${JSON.stringify(result, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'original-summary-real.md'), `# original recon (browser user-agent)\n\n- URL: ${baseUrl}\n- Title: ${captures[0].signals.title}\n- HTTP status: ${captures[0].signals.httpStatus}\n- Framework signals: ${Object.entries(captures[0].signals.frameworks).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}\n- Images: ${captures[0].signals.counts.images}\n- Videos: ${captures[0].signals.counts.video}\n- Scroll height: ${captures[0].signals.scrollHeight}\n- Console errors: ${consoleState.errors.length}\n- Page errors: ${consoleState.pageErrors.length}\n`);
console.log(path.join(outDir, 'original-recon-real.json'));
