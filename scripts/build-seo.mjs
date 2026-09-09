// 全站 SEO 元信息注入脚本（幂等，可重复执行）：
// - 每个页面 <head> 写入/更新 <!-- seo:start -->…<!-- seo:end --> 块：
//   title / description / keywords / canonical / Open Graph / Twitter Card / favicon / JSON-LD。
// - 同步生成 sitemap.xml 与 robots.txt（写在 代码/ 根，部署后位于站点根）。
// - 域名只在本文件 SITE_URL 一处配置；正式域名确认后改这一行并重跑即可。
// 用法：node scripts/build-seo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE_URL = 'https://www.benshutech.com'; // TODO 正式域名确认后只改这里

const FAVICON = `${SITE_URL}/素材/logo/group-icon.png`;
const PHONE = '400-008-0629';

// 读取 SITE_DATA（data.js 是浏览器全局脚本，末尾追加 return 取值）
function loadSiteData() {
  const src = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
  return new Function(`${src}\nreturn SITE_DATA;`)();
}
const SITE_DATA = loadSiteData();
const OG_IMAGE_SRC = SITE_DATA.assets[SITE_DATA.ogImageAssetId]?.src || 'visual/og-default.jpg';
const OG_IMAGE = `${SITE_URL}/素材/${OG_IMAGE_SRC}`;

// 页面元信息表：title/description 每页唯一；keywords 聚焦品牌与业务词。
const PAGES = [
  { file: 'index.html', title: '有方大健康｜专注大健康消费领域的产业运营与投资孵化', description: '有方大健康集团官网：专注大健康消费领域的产业运营与投资孵化，旗下谷小推、奈晚推拿、艾小晚、足康树、恒青树、乐光里、廿肆巡七大品牌，提供招商、建店、运营全阶段支持，让健康有方成为生活习惯。', keywords: '有方大健康,大健康集团,养生品牌加盟,谷小推,奈晚推拿,艾小晚,足康树,恒青树,乐光里,廿肆巡,门店加盟' },
  { file: 'about.html', title: '关于有方｜有方大健康', description: '了解有方大健康：围绕大健康消费场景，连接七大品牌、门店经营与有方灵枢数字化能力，看集团如何把健康服务做成可经营的生意。', keywords: '有方大健康,集团介绍,大健康产业,品牌矩阵,数字化平台' },
  { file: 'mdzs.html', title: '门店展示｜有方大健康', description: '有方大健康七大品牌门店实拍：谷小推新中式 SPA、奈晚推拿、艾小晚艾灸、足康树足疗、恒青树社区俱乐部、乐光里头疗洗护与廿肆巡 SPA 空间，先看真实门店再谈合作。', keywords: '门店实拍,养生门店展示,加盟门店,谷小推门店,奈晚推拿门店,720全景看店' },
  { file: 'news.html', title: '集团资讯｜有方大健康', description: '有方大健康集团资讯：品牌动态、门店模型、数字化平台与社会责任内容持续更新。', keywords: '有方大健康,集团资讯,品牌动态,行业观察' },
  { file: 'tzgx.html', title: '能力与产品｜有方大健康', description: '有方大健康能力与产品：招商、建店、运营三阶段支持体系，加上有小方、谷有方、方小匠三大数字化产品与有方灵枢平台。', keywords: '招商支持,建店支持,运营支持,有小方,谷有方,方小匠,有方灵枢' },
  { file: 'shzr.html', title: '社会责任｜有方大健康', description: '有方大健康社会责任：让健康服务成为生活习惯，关注社区健康、就业培训与可持续经营。', keywords: '社会责任,社区健康,大健康公益' },
  { file: 'zsjm.html', title: '招商加盟｜有方大健康', description: '有方大健康招商加盟：了解七大品牌方向、建店支持与运营协同，预约官方咨询，获取适合你城市的门店方案。', keywords: '养生加盟,大健康加盟,门店加盟,招商咨询,加盟条件' },
  { file: 'contact.html', title: '联系我们｜有方大健康', description: '有方大健康官方联系方式：咨询电话 400-008-0629，官方公众号与有小方、谷有方、方小匠小程序入口，预约官方咨询。', keywords: '有方大健康电话,官方咨询,联系方式,公众号,小程序' },
  { file: 'gggh.html', title: '公告与通函｜有方大健康', description: '有方大健康公告与通函：集团对外公告信息汇总。', keywords: '有方大健康,公告,通函' },
  { file: 'qyzl.html', title: '企业治理｜有方大健康', description: '有方大健康企业治理：治理原则、协作边界与规范运营信息。', keywords: '企业治理,治理原则,规范运营' },
  { file: 'tzrl.html', title: '项目日历｜有方大健康', description: '有方大健康项目日历：内容更新与项目节点安排。', keywords: '项目日历,更新计划' },
  { file: 'yjbgs.html', title: '阶段报告｜有方大健康', description: '有方大健康阶段报告：阶段性经营与能力建设情况。', keywords: '阶段报告,经营情况' },
  { file: 'ztwj.html', title: '资料中心｜有方大健康', description: '有方大健康资料中心：品牌与经营相关资料入口。', keywords: '资料中心,下载' },
  { file: 'privacy.html', title: '隐私说明｜有方大健康', description: '有方大健康隐私说明：了解本网站如何处理访问者信息。', keywords: '隐私说明,隐私政策' },
  { file: 'mnjy.html', title: '模拟经营｜有方大健康', description: '有方大健康模拟经营：选择经营场景、品牌方向与所处阶段，形成一份可讨论的门店经营方案，并预约官方咨询。', keywords: '模拟经营,开店测算,经营方案,加盟模拟' },
  { file: 'pxyy.html', title: '培训与运营支持｜有方大健康', description: '有方大健康培训与运营支持：围绕开店训练、服务交付、日常经营和阶段复盘提供清晰协同。', keywords: '开店培训,运营支持,督导,服务标准' },
  { file: 'brands/index.html', title: '品牌矩阵｜有方大健康', description: '有方大健康七大品牌方向：谷小推、奈晚推拿、艾小晚、足康树、恒青树、乐光里、廿肆巡，从场景、门店表达与经营支持找到适合自己的方向。', keywords: '品牌矩阵,养生品牌,加盟品牌对比,推拿,艾灸,足疗,头疗,SPA' },
  { file: 'video/2049311683814764544.html', title: '品牌视频｜有方大健康', description: '有方大健康品牌视频入口。', keywords: '品牌视频', noindex: true },
  { file: 'home.html', title: '有方大健康', description: '有方大健康。', keywords: '', noindex: true },
  { file: 'home1.html', title: '有方大健康', description: '有方大健康。', keywords: '', noindex: true },
  { file: 'taglist.html', title: '集团资讯｜有方大健康', description: '有方大健康集团资讯。', keywords: '', noindex: true },
];

// 品牌详情页与门店实拍页、资讯详情页：由数据/命名规则生成
const brandName = { guxiaotui: '谷小推', aixiaowan: '艾小晚', zukangshu: '足康树', hengqingshu: '恒青树', leguangli: '乐光里', naiwan: '奈晚推拿', shisixun: '廿肆巡' };
for (const brand of SITE_DATA.brands) {
  PAGES.push({
    file: `brands/${brand.slug}.html`,
    title: `${brand.name}｜有方大健康`,
    description: `${brand.name}品牌方向：${brand.category}。${brand.copyCard}了解${brand.name}的门店场景、建店支持与常见问题。`,
    keywords: `${brand.name},${brand.category},${brand.name}加盟,养生门店`,
    brand,
  });
  PAGES.push({
    file: `mdzs/${brand.slug}.html`,
    title: `${brand.name} · 门店实拍｜有方大健康`,
    description: `${brand.name}门店实拍与 720° 全景看店：${brand.kicker}，真实呈现门头、护理间与到店氛围。`,
    keywords: `${brand.name}门店,${brand.name}实拍,门店环境`,
    breadcrumb: ['首页', '门店展示'],
  });
}
const newsDetail = {
  'brand-and-model': { title: '从品牌方向，到可经营的门店模型', description: '从品牌定位、店型与空间，到服务流程和运营协同，了解有方大健康的门店模型。' },
  'digital-platform': { title: '让门店经营情况，进入清晰的视图', description: '了解谷有方与有小方如何围绕招商、建店、运营三个阶段组织门店经营入口。' },
  'store-operations': { title: '把品牌主张落到每一间门店', description: '从选址与店型，到空间交付和运营协同，了解有方大健康如何把品牌主张落到真实门店。' },
  'community-health': { title: '让健康服务成为生活习惯', description: '从家庭与社区需求，到门店触达和持续反馈，了解有方大健康的社区健康服务方向。' },
};
for (const [slug, meta] of Object.entries(newsDetail)) {
  PAGES.push({ file: `news_detail/${slug}.html`, title: `${meta.title}｜有方大健康`, description: meta.description, keywords: '有方大健康,门店模型,数字化,社区健康', breadcrumb: ['首页', '集团资讯'] });
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageUrl = (file) => `${SITE_URL}/${file}`;

function breadcrumbLd(file, extra) {
  const crumbs = [['首页', 'index.html'], ...(extra || [])];
  const label = esc((file.match(/([^/]+)\.html$/) || [])[1] || '');
  const items = crumbs.map(([name], i) => ({ '@type': 'ListItem', position: i + 1, name }));
  if (label && !items.some((i) => i.name === label)) items.push({ '@type': 'ListItem', position: items.length + 1, name: label });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function videoLd(video, brandNameStr) {
  if (!video) return null;
  const dur = { 'promo-3min': 'PT3M18S', 'lingshu-2.0': 'PT3M26S', 'brand-guxiaotui': 'PT1M0S', 'brand-naiwan': 'PT1M0S', 'brand-aixiaowan': 'PT0M49S', 'brand-leguangli': 'PT0M23S', 'store-shisixun-env': 'PT0M32S', 'group-hq-loop': 'PT0M2S' };
  const key = path.basename(video.src, '.mp4');
  return {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: brandNameStr ? `${brandNameStr}品牌视频` : video.title,
    description: video.alt || video.title,
    thumbnailUrl: `${SITE_URL}/素材/${video.poster}`,
    uploadDate: '2026-09-06',
    duration: dur[key] || 'PT1M',
    contentUrl: `${SITE_URL}/素材/${video.src}`,
    publisher: { '@type': 'Organization', name: '有方大健康' },
  };
}

function buildSeoBlock(meta) {
  const url = pageUrl(meta.file);
  const parts = [];
  parts.push(`<title>${esc(meta.title)}</title>`);
  parts.push(`<meta name="description" content="${esc(meta.description)}">`);
  if (meta.keywords) parts.push(`<meta name="keywords" content="${esc(meta.keywords)}">`);
  parts.push(meta.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">');
  parts.push(`<link rel="canonical" href="${esc(url)}">`);
  parts.push('<meta name="theme-color" content="#c91522">');
  parts.push(`<link rel="icon" href="${FAVICON}">`);
  // Open Graph / Twitter Card
  parts.push(`<meta property="og:site_name" content="有方大健康">`);
  parts.push(`<meta property="og:locale" content="zh_CN">`);
  parts.push(`<meta property="og:type" content="website">`);
  parts.push(`<meta property="og:title" content="${esc(meta.title)}">`);
  parts.push(`<meta property="og:description" content="${esc(meta.description)}">`);
  parts.push(`<meta property="og:url" content="${esc(url)}">`);
  parts.push(`<meta property="og:image" content="${OG_IMAGE}">`);
  parts.push(`<meta name="twitter:card" content="summary_large_image">`);
  parts.push(`<meta name="twitter:title" content="${esc(meta.title)}">`);
  parts.push(`<meta name="twitter:description" content="${esc(meta.description)}">`);
  parts.push(`<meta name="twitter:image" content="${OG_IMAGE}">`);
  // JSON-LD
  const ld = [];
  if (meta.file === 'index.html') {
    ld.push({
      '@context': 'https://schema.org', '@type': 'Organization', name: '有方大健康', url: `${SITE_URL}/`,
      logo: OG_IMAGE, telephone: PHONE,
      contactPoint: [{ '@type': 'ContactPoint', telephone: `+86-${PHONE}`, contactType: 'customer service' }],
    });
    ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: '有方大健康官网', url: `${SITE_URL}/` });
  }
  if (meta.brand) {
    const b = meta.brand;
    ld.push({
      '@context': 'https://schema.org', '@type': 'Brand', name: b.name,
      description: `${b.name}，${b.category}。${b.copyCard}`,
      brand: b.name, url: pageUrl(`brands/${b.slug}.html`),
      parentOrganization: { '@type': 'Organization', name: '有方大健康' },
    });
    if (Array.isArray(b.faq) && b.faq.length) {
      ld.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: b.faq.map((item) => ({
          '@type': 'Question', name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      });
    }
    if (b.video) ld.push(videoLd(SITE_DATA.videos[b.video], b.name));
    ld.push(breadcrumbLd(meta.file, [['品牌矩阵', 'brands/index.html']]));
  }
  if (meta.file === 'about.html') ld.push(videoLd(SITE_DATA.videos.promo));
  if (meta.file === 'tzgx.html') ld.push(videoLd(SITE_DATA.videos.lingshu));
  if (meta.breadcrumb) ld.push(breadcrumbLd(meta.file, meta.breadcrumb));
  if (ld.length) parts.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  return `<!-- seo:start -->\n  ${parts.join('\n  ')}\n  <!-- seo:end -->`;
}

let updated = 0;
for (const meta of PAGES) {
  const file = path.join(root, meta.file);
  if (!fs.existsSync(file)) { console.error('缺文件:', meta.file); continue; }
  let html = fs.readFileSync(file, 'utf8');
  const block = buildSeoBlock(meta);
  if (html.includes('<!-- seo:start -->')) {
    html = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, block);
  } else {
    // 插到 charset 之后；title 如已存在则移除旧 title（避免重复）
    if (!/<meta charset/.test(html)) { console.error('无 charset 锚点:', meta.file); continue; }
    html = html.replace(/<title>[^<]*<\/title>/, '');
    html = html.replace(/<meta charset="utf-8">/, `<meta charset="utf-8">\n  ${block}`);
  }
  // 静态图片补 lazy/async（跳过 hero 区与已带 loading 的）
  html = html.replace(/<img ((?:(?!loading=)[^>])*)>/g, (m, attrs) => {
    if (/data-asset-img|hero|brand-hero|loading=/.test(m)) return m;
    return `<img ${attrs} loading="lazy" decoding="async">`;
  });
  // 块外清理旧 description（避免与 seo 块内重复）
  const blockMatch = html.match(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/);
  if (blockMatch) {
    const before = html.slice(0, blockMatch.index);
    const after = html.slice(blockMatch.index + blockMatch[0].length);
    const cleaned = before.replace(/<meta name="description" content="[^"]*">/, '') + blockMatch[0] + after.replace(/<meta name="description" content="[^"]*">/, '');
    html = cleaned;
  }
  fs.writeFileSync(file, html);
  updated++;
}
console.log(`SEO 注入完成：${updated}/${PAGES.length} 页`);

// sitemap.xml：仅收录正常页面
const sitePages = PAGES.filter((p) => !p.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitePages.map((p) => `  <url><loc>${pageUrl(p.file)}</loc><lastmod>2026-09-06</lastmod><changefreq>weekly</changefreq><priority>${p.file === 'index.html' ? '1.0' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`sitemap.xml：${sitePages.length} 条 URL`);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(root, 'robots.txt'), robots);
console.log('robots.txt 已生成');
