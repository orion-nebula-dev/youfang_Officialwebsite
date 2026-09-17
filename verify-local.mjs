import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const origin = process.env.CLONE_ORIGIN || 'http://127.0.0.1:8123';
const routes = [
  'index.html', 'home.html', 'home1.html', 'about.html', 'mdzs.html', 'news.html',
  'mdzs/guxiaotui.html', 'mdzs/hengqingshu.html', 'mdzs/naiwan.html',
  'mdzs/aixiaowan.html', 'mdzs/zukangshu.html', 'mdzs/leguangli.html', 'mdzs/shisixun.html',
  'video/2049311683814764544.html', 'tzgx.html', 'ztwj.html', 'yjbgs.html',
  'gggh.html', 'qyzl.html', 'tzrl.html', 'shzr.html', 'zsjm.html', 'contact.html',
  'taglist.html', 'privacy.html', 'pxyy.html',
  'brands/index.html', 'brands/guxiaotui.html', 'brands/aixiaowan.html',
  'brands/zukangshu.html', 'brands/hengqingshu.html', 'brands/leguangli.html',
  'brands/naiwan.html', 'brands/shisixun.html',
  'news_detail/brand-and-model.html', 'news_detail/digital-platform.html',
  'news_detail/store-operations.html', 'news_detail/community-health.html',
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const failures = [];
const checked = [];

for (const route of routes) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error' || message.text().includes('[assets]')) consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
  try {
    const response = await page.goto(`${origin}/代码/${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response?.status() || 0;
    const title = await page.title();
    // 结构化素材断言：页面上所有图片必须真实加载（无裂图 / 无未注册 ID）
    const brokenImgs = await page.evaluate(() => [...document.images]
      .filter((img) => img.src && (img.complete === false || img.naturalWidth === 0))
      .map((img) => img.getAttribute('data-asset-img') || img.getAttribute('data-brand-image') || img.src));
    checked.push({ route, status, title, consoleErrors, brokenImgs });
    if (status >= 400 || consoleErrors.length || brokenImgs.length) failures.push({ route, status, consoleErrors, brokenImgs });
  } catch (error) {
    failures.push({ route, status: 0, consoleErrors: [error.message] });
  }
  await page.close();
}

const page = await context.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1 });
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(`${origin}/代码/index.html`, { waitUntil: 'networkidle' });
await page.click('.menu-toggle');
const mobileMenuOpen = await page.locator('.site-nav.open').count() === 1;
await page.click('.site-nav a[href*="about.html"]');
const mobileMenuClosed = await page.locator('.site-nav.open').count() === 0;
await page.goto(`${origin}/代码/zsjm.html`, { waitUntil: 'networkidle' });
await page.locator('[data-accordion] .faq-item').nth(1).locator('.faq-question').click();
const faqOpen = await page.locator('[data-accordion] .faq-item').nth(1).evaluate((node) => node.classList.contains('open'));
await page.goto(`${origin}/代码/index.html`, { waitUntil: 'networkidle' });
const homeBrandCards = await page.locator('[data-brands-grid="home"] .brand-card').count();
const homeLogoChips = await page.locator('[data-brands-grid="home"] .brand-logo-chip img').count();
const homeLogoLoaded = await page.locator('[data-brands-grid="home"] .brand-logo-chip img').first().evaluate((img) => img.naturalWidth > 0);
const homePlatformQrs = await page.locator('#lingshu .platform-qr').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0));
const homeVisionCards = await page.locator('#mission .info-card').count();
const homeScaleItems = await page.locator('#scale .scale-item').count();
const homeScaleCounted = await page.locator('#scale [data-count]').first().evaluate((n) => n.dataset.count === '5');
const homePlatformLogos = await page.locator('#lingshu .platform-name img').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0));
const homeAppShowcase = await page.locator('#lingshu .app-showcase-grid > figure').evaluateAll((cards) => cards.length === 3
  && cards.every((card) => card.querySelector('img')?.naturalWidth > 0));
const homeBrandOrder = await page.locator('[data-brands-grid="home"] .brand-name-large').allTextContents();
const homeHeroTitle = await page.locator('.hero-title').innerText();
await page.goto(`${origin}/代码/tzgx.html`, { waitUntil: 'networkidle' });
await page.click('[data-tab="platform"]');
const tabOpen = await page.locator('[data-panel="platform"].active').count() === 1;
const platformScreens = await page.locator('[data-panel="platform"] .media-card img').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0));
await page.goto(`${origin}/代码/zsjm.html`, { waitUntil: 'networkidle' });
await page.locator('[data-contact-form]').first().evaluate((form) => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
const formStatus = await page.locator('[data-contact-form] .form-status').first().textContent();
const joinBrandCards = await page.locator('[data-brands-grid="join"] .brand-card').count();
await page.goto(`${origin}/代码/zsjm.html?brand=guxiaotui#consult`, { waitUntil: 'networkidle' });
const preFilledBrand = await page.locator('[data-consult-brand]').inputValue();
const footerDisclosureLinks = await page.locator('.footer-disclosure a').count();
await page.goto(`${origin}/代码/index.html`, { waitUntil: 'networkidle' });
// Hero 仅一主一次两个 CTA（开发规范 §4.4），区块顺序由 HOME_CONFIG.sections 控制（§4.2/§9）
const homeHeroButtons = await page.locator('.home-hero .hero-actions .btn').count();
const homeSectionOrder = await page.evaluate(() => [...document.querySelectorAll('main > [data-home-section]')].map((node) => node.dataset.homeSection).join(','));
const homeInternalClean = await page.evaluate(() => {
  const text = document.body.innerText;
  return !['待补充', '待业务', '待集团', '待确认', '演示', '原始材料', '集团介绍', '附件', '官网建设', '官网首期', '已提供'].some((word) => text.includes(word));
});
await page.goto(`${origin}/代码/video/2049311683814764544.html`, { waitUntil: 'networkidle' });
await page.click('[data-video-open]');
const modalOpen = await page.locator('[data-modal].open').count() === 1;
const headerLogo = await page.locator('.brand-lockup-logo').evaluate((img) => img.naturalWidth > 0 && img.src.includes('group-wide'));
const faviconOk = await page.evaluate(() => !!document.querySelector('link[rel="icon"]'));
await page.goto(`${origin}/代码/brands/guxiaotui.html`, { waitUntil: 'networkidle' });
const heroLockupLoaded = await page.locator('.brand-hero-lockup').evaluate((img) => img.naturalWidth > 0 && img.src.includes('-v'));
const detailScreenLoaded = await page.locator('[data-brand-screen]').evaluate((img) => img.naturalWidth > 0 && img.src.includes('screen/'));
await page.goto(`${origin}/代码/brands/naiwan.html`, { waitUntil: 'networkidle' });
const naiwanForms = await page.locator('[data-brand-forms-grid] img').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0));
const naiwanFormsVisible = await page.locator('[data-brand-forms]').evaluate((node) => !node.hidden);
await page.goto(`${origin}/代码/brands/guxiaotui.html`, { waitUntil: 'networkidle' });
const otherFormsHidden = await page.locator('[data-brand-forms]').evaluate((node) => node.hidden);
// 品牌详情页 FAQ（7 页 × 6 条，来自小程序逐字稿）+ 两处移除项（徽章 / 旧入口）
const brandFaqChecks = [];
for (const slug of ['guxiaotui', 'aixiaowan', 'zukangshu', 'hengqingshu', 'leguangli', 'naiwan', 'shisixun']) {
  await page.goto(`${origin}/代码/brands/${slug}.html`, { waitUntil: 'networkidle' });
  const count = await page.locator('[data-brand-faq] .faq-item').count();
  const noSimulate = await page.locator('[data-brand-simulate]').count() === 0;
  const noBadge = await page.locator('.brand-logo-badge').count() === 0;
  brandFaqChecks.push(count === 6 && noSimulate && noBadge);
}
await page.locator('[data-brand-faq] .faq-item').nth(1).locator('.faq-question').click();
const brandFaqToggle = await page.locator('[data-brand-faq] .faq-item').nth(1).evaluate((node) => node.classList.contains('open'));
const brandFaqOk = brandFaqChecks.every(Boolean) && brandFaqToggle;
await page.goto(`${origin}/代码/brands/index.html`, { waitUntil: 'networkidle' });
const matrixScreens = await page.locator('.screen-pair img').evaluateAll((imgs) => imgs.length === 2 && imgs.every((img) => img.naturalWidth > 0));
// 门店实拍二级页：mdzs 列表页七张卡可进入、免责句已移除；七个二级页照片数与加载正确
await page.goto(`${origin}/代码/mdzs.html`, { waitUntil: 'networkidle' });
const storeCardLinks = await page.locator('.gallery-grid a[href^="mdzs/"]').count();
const disclaimerRemoved = await page.evaluate(() => !document.body.innerText.includes('本页仅展示'));
const storeGalleryChecks = [];
const galleryExpect = { guxiaotui: 6, hengqingshu: 6, naiwan: 6, aixiaowan: 5, zukangshu: 5, leguangli: 6, shisixun: 6 };
for (const [slug, photoCount] of Object.entries(galleryExpect)) {
  await page.goto(`${origin}/代码/mdzs/${slug}.html`, { waitUntil: 'networkidle' });
  const cards = await page.locator('[data-store-gallery] .gallery-card--interactive').count();
  const imgsOk = await page.locator('[data-store-gallery] img').evaluateAll((imgs, expected) => imgs.length === expected && imgs.every((img) => img.naturalWidth > 0), photoCount);
  const heroName = (await page.locator('h1.hero-title').innerText()).trim();
  storeGalleryChecks.push(cards === photoCount && imgsOk && heroName.length > 1);
}
const storeGalleriesOk = storeGalleryChecks.every(Boolean);
// 720° 全景看店：奈晚/谷小推二级页各有一个真实 VR 入口，其余品牌隐藏
await page.goto(`${origin}/代码/mdzs/naiwan.html`, { waitUntil: 'networkidle' });
const naiwanVrCards = await page.locator('[data-store-vr] .vr-feature').count();
const naiwanVrImgs = await page.locator('[data-store-vr] .vr-feature img').evaluateAll((imgs) => imgs.length === 1 && imgs.every((img) => img.naturalWidth > 0));
const naiwanVrLink = await page.locator('[data-store-vr] a[href*="vr.justeasy.cn"]').count();
await page.goto(`${origin}/代码/mdzs/guxiaotui.html`, { waitUntil: 'networkidle' });
const guxiaotuiVrCards = await page.locator('[data-store-vr] .vr-feature').count();
const guxiaotuiVrLink = await page.locator('[data-store-vr] a[href*="vr.justeasy.cn"]').count();
const guxiaotuiLightbox = await page.locator('[data-gallery-item]').first().click().then(async () => {
  const open = await page.locator('.gallery-lightbox.open').count() === 1;
  const caption = await page.locator('[data-gallery-lightbox-caption]').textContent();
  await page.keyboard.press('ArrowRight');
  const nextCaption = await page.locator('[data-gallery-lightbox-caption]').textContent();
  await page.keyboard.press('Escape');
  return open && !!caption && !!nextCaption && caption !== nextCaption && await page.locator('.gallery-lightbox.open').count() === 0;
});
await page.goto(`${origin}/代码/mdzs/aixiaowan.html`, { waitUntil: 'networkidle' });
const aixiaowanVrHidden = await page.locator('[data-store-vr]').evaluate((node) => node.hidden);
await page.goto(`${origin}/代码/contact.html`, { waitUntil: 'networkidle' });
const programCards = await page.locator('[data-programs-grid] .program-card').count();
const footerQrs = await page.locator('.footer-qr .qr-item img').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0));
const programLogos = await page.locator('.program-logo').evaluateAll((imgs) => imgs.length === 3 && imgs.every((img) => img.naturalWidth > 0 && img.src.endsWith('.svg')));
const wechatQrLoaded = await page.locator('[data-asset-img="qr-official-wechat"]').evaluate((img) => img.naturalWidth > 0);
// 视频块：品牌页（谷小推）、about（宣传片）、tzgx（灵枢）海报与源就绪
await page.goto(`${origin}/代码/brands/guxiaotui.html`, { waitUntil: 'networkidle' });
const brandVideoOk = await page.locator('[data-brand-video]').evaluate((node) => !node.hidden
  && !!node.querySelector('video[poster] source[src*="brand-guxiaotui"]'));
await page.goto(`${origin}/代码/about.html`, { waitUntil: 'networkidle' });
const aboutVideoOk = await page.locator('[data-video-block="promo"] video source[src*="promo-3min"]').count() === 1;
await page.goto(`${origin}/代码/tzgx.html`, { waitUntil: 'networkidle' });
const lingshuVideoOk = await page.locator('[data-video-block="lingshu"] video source[src*="lingshu"]').count() === 1;
await page.goto(`${origin}/代码/about.html`, { waitUntil: 'networkidle' });
const galleryLogos = await page.locator('.gallery-logo').count();
// 公开文案审计：全站页面（含 alt）不出现内部状态与来源性措辞
const publicCopyChecks = [];
const simulationChecks = [];
for (const route of ['zsjm.html', 'contact.html', 'news.html', 'about.html', 'gggh.html', 'qyzl.html', 'ztwj.html', 'yjbgs.html', 'tzrl.html', 'shzr.html', 'pxyy.html', 'mdzs.html', 'tzgx.html', 'privacy.html', 'brands/index.html', 'mdzs/guxiaotui.html', 'mdzs/hengqingshu.html', 'mdzs/naiwan.html', 'mdzs/aixiaowan.html', 'mdzs/zukangshu.html', 'mdzs/leguangli.html', 'mdzs/shisixun.html', 'video/2049311683814764544.html', 'news_detail/digital-platform.html', 'news_detail/brand-and-model.html', 'news_detail/store-operations.html', 'news_detail/community-health.html']) {
  await page.goto(`${origin}/代码/${route}`, { waitUntil: 'networkidle' });
  const clean = await page.evaluate(() => {
    const text = document.body.innerText + ' ' + [...document.images].map((img) => img.alt).join(' ');
    return !['待补充', '待业务', '待集团', '待确认', '演示', '原始材料', '集团介绍', '附件', '官网建设', '官网首期', '已提供', '招股文件', '原始装修方案'].some((word) => text.includes(word));
  });
  const simulationFree = await page.evaluate(() => {
    const text = document.body.innerText + ' ' + document.documentElement.innerHTML;
    const links = [...document.querySelectorAll('a')].map((link) => link.getAttribute('href') || '').join(' ');
    return !/模拟经营|模拟方案|模拟我的|mnjy\.html|data-sim|simulator/i.test(`${text} ${links}`)
      && !document.querySelector('[data-brand-options]');
  });
  publicCopyChecks.push(clean);
  simulationChecks.push(simulationFree);
}
const publicCopyClean = publicCopyChecks.every(Boolean);
const simulationRemoved = simulationChecks.every(Boolean);
await page.close();
await browser.close();

const interactions = { mobileMenuOpen, mobileMenuClosed, faqOpen, brandFaqOk, tabOpen, platformScreens, formStatus, modalOpen, homeHeroButtons, homeSectionOrder, homeInternalClean, publicCopyClean, simulationRemoved, homeBrandCards, homeLogoChips, homeLogoLoaded, homeVisionCards, homeScaleItems, homeScaleCounted, homePlatformLogos, homeAppShowcase, homeBrandOrder, homeHeroTitle: homeHeroTitle.replace(/\n/g, ''), headerLogo, faviconOk, heroLockupLoaded, naiwanForms, naiwanFormsVisible, otherFormsHidden, detailScreenLoaded, matrixScreens, galleryLogos, joinBrandCards, preFilledBrand, footerDisclosureLinks, programCards, programLogos, footerQrs, wechatQrLoaded, homePlatformQrs, storeCardLinks, disclaimerRemoved, storeGalleriesOk, naiwanVrCards, naiwanVrImgs, naiwanVrLink, guxiaotuiVrCards, guxiaotuiVrLink, guxiaotuiLightbox, aixiaowanVrHidden, brandVideoOk, aboutVideoOk, lingshuVideoOk };
console.log(JSON.stringify({ checked, failures, interactions }, null, 2));
const ok = failures.length === 0 && mobileMenuOpen && mobileMenuClosed && faqOpen && brandFaqOk && tabOpen && platformScreens && modalOpen && homeHeroButtons === 2 && homeSectionOrder === 'scale,brands,stores,capabilities,lingshu,process,mission,cta' && homeInternalClean && publicCopyClean
  && homeBrandCards === 7 && homeLogoChips === 7 && homeLogoLoaded && homeVisionCards === 4 && homeScaleItems === 4 && homeScaleCounted && homePlatformLogos && homeAppShowcase && homeBrandOrder.join('|') === '奈晚推拿|谷小推|足康树|恒青树|乐光里|艾小晚|廿肆巡' && homeHeroTitle.includes('产业运营与投资孵化') && headerLogo && faviconOk && heroLockupLoaded && naiwanForms && naiwanFormsVisible && otherFormsHidden && detailScreenLoaded && matrixScreens && galleryLogos === 7
  && joinBrandCards === 7 && preFilledBrand === '谷小推' && footerDisclosureLinks === 5 && simulationRemoved
  && programCards === 3 && programLogos && footerQrs && wechatQrLoaded && homePlatformQrs
  && storeCardLinks === 7 && disclaimerRemoved && storeGalleriesOk
  && naiwanVrCards === 1 && naiwanVrImgs && naiwanVrLink > 0 && guxiaotuiVrCards === 1 && guxiaotuiVrLink > 0 && guxiaotuiLightbox && aixiaowanVrHidden
  && brandVideoOk && aboutVideoOk && lingshuVideoOk;
process.exit(ok ? 0 : 1);
