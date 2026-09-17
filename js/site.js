// 站点脚本：导航/页脚注入、品牌区块渲染和页面交互。
// 路径根从本脚本自身的 URL 推导，不依赖部署目录名，站点可部署在任意子路径或域名根。
const scriptUrl = new URL(document.currentScript.getAttribute('src'), document.baseURI);
const siteRoot = scriptUrl.href.replace(/\?.*$/, '').replace(/js\/site\.js$/, '');
// 本地预览时代码位于 /代码/、素材位于同级 /素材/；Site 发布后两者都位于站点根目录。
const siteRootUrl = new URL(siteRoot);
const assetRoot = decodeURIComponent(siteRootUrl.pathname).endsWith('/代码/')
  ? new URL('../', siteRootUrl).href
  : siteRoot;
const page = document.body.dataset.page || '';

function siteLink(file) { return `${siteRoot}${file}`; }
function assetLink(file) { return `${assetRoot}素材/${file}`; }
// 素材注册表解析：ID → 完整链接；未知 ID 打警告并回退空串，避免裂图难排查
function asset(id) {
  const record = SITE_DATA.assets[id];
  const file = typeof record === 'string' ? record : record?.src;
  if (!file) { console.warn(`[assets] 未注册的素材 ID: ${id}`); return ''; }
  return assetLink(file);
}
function brandBySlug(slug) { return SITE_DATA.brands.find((brand) => brand.slug === slug); }
// 素材注册表 alt：无障碍文案与注册表单一来源一致
function assetAlt(id) { return SITE_DATA.assets[id]?.alt || ''; }
// 视频注册表解析：key → { src, poster, title, alt }，路径经 assetLink 指向 素材/ 目录
function videoData(key) {
  const record = SITE_DATA.videos?.[key];
  if (!record) { console.warn(`[videos] 未注册的视频 ID: ${key}`); return null; }
  return { ...record, srcUrl: assetLink(record.src), posterUrl: record.poster ? assetLink(record.poster) : '' };
}

function renderHeader() {
  const holder = document.querySelector('#site-header');
  if (!holder) return;
  holder.innerHTML = `
    <header class="site-header" id="top">
      <div class="header-inner">
        <a class="brand-lockup" href="${siteLink('index.html')}" aria-label="有方大健康首页">
          <img class="brand-lockup-logo" src="${asset('logo-group-wide')}" alt="有方大健康">
        </a>
        <button class="menu-toggle" type="button" aria-label="打开导航" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" aria-label="主导航">
          ${SITE_DATA.nav.map(([label, href, key]) => `<a class="${page === key ? 'active' : ''}" href="${siteLink(href)}">${label}</a>`).join('')}
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const holder = document.querySelector('#site-footer');
  if (!holder) return;
  const disclosure = SITE_DATA.disclosure
    .map(([label, href]) => `<a href="${siteLink(href)}">${label}</a>`)
    .join('<span class="sep">·</span>');
  holder.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-content">
        <div>
          <p class="footer-title">OFFICIAL CONTACT</p>
          <div class="footer-contact-grid">
            <div class="footer-contact-item"><small>官方咨询电话</small><a href="${SITE_DATA.phoneHref}">${SITE_DATA.phone}</a></div>
            <div class="footer-contact-item"><small>品牌合作</small><strong>欢迎与有方大健康联系</strong></div>
            <div class="footer-contact-item"><small>业务阶段</small><strong>招商 · 建店 · 运营</strong></div>
          </div>
          <p class="footer-address">官方咨询电话：${SITE_DATA.phone}。</p>
          <p class="footer-disclosure">信息公开：${disclosure}</p>
        </div>
        <div>
          <p class="footer-title">小程序入口 · MINI PROGRAM</p>
          <div class="footer-qr">
            ${SITE_DATA.programs.map((program) => `<a class="qr-item" href="${siteLink('contact.html')}#xiaochengxu"><img src="${asset(program.image)}" alt="${program.name}小程序码"><span>${program.name}</span></a>`).join('')}
          </div>
        </div>
      </div>
      <div class="container copyright"><span>© <span data-year></span> 有方大健康</span><span class="footer-secondary"><a href="${siteLink('privacy.html')}">隐私说明</a></span></div>
    </footer>
  `;
}

// 品牌区块统一从 SITE_DATA 渲染，消除各页面的重复卡片维护：
//   data-brands-grid="home"   首页大卡（长文案 + 营销标签）
//   data-brands-grid="join"   招商页小卡（短文案）
//   data-brands-grid="matrix" 品牌矩阵小卡（中文案，链接到同目录详情页）
//   data-brands-strip         关于页品牌名称条
//   data-brands-gallery       关于页品牌画廊
// 品牌详情页链接前缀用 data-brand-prefix 覆盖（默认 brands/）。
function renderBrandSections() {
  document.querySelectorAll('[data-brands-grid]').forEach((grid) => {
    const variant = grid.dataset.brandsGrid;
    const prefix = grid.dataset.brandPrefix ?? 'brands/';
    const variants = {
      home: { cls: 'brand-card', tag: 'tagHome', copy: 'copyHome', action: '查看品牌方向' },
      join: { cls: 'brand-card brand-card--small', tag: 'category', copy: 'copyShort', action: '了解品牌' },
      matrix: { cls: 'brand-card brand-card--small', tag: 'category', copy: 'copyCard', action: '查看品牌' },
    };
    const config = variants[variant];
    if (!config) return;
    grid.innerHTML = SITE_DATA.brands.map((brand) => `
      <article class="${config.cls} brand-card--${brand.slug}">
        <img class="brand-photo" src="${asset(brand.image)}" alt="${assetAlt(brand.image) || `${brand.name}品牌门店形象`}">
        <div class="brand-card-body">
          <span class="brand-tag">${brand[config.tag]}</span>
          <div class="brand-name-row"><span class="brand-logo-chip"><img src="${asset(brand.logo)}" alt="${brand.name}品牌 logo"></span><h3 class="brand-name-large">${brand.name}</h3></div>
          <p class="brand-copy">${brand[config.copy]}</p>
          <a class="btn btn--${brand.accent}" href="${prefix}${brand.slug}.html">${config.action}</a>
        </div>
      </article>
    `).join('');
  });

  document.querySelectorAll('[data-brands-strip]').forEach((strip) => {
    strip.innerHTML = SITE_DATA.brands.map((brand) => `<span>${brand.name}</span>`).join('');
  });

  document.querySelectorAll('[data-brands-gallery]').forEach((gallery) => {
    gallery.innerHTML = SITE_DATA.brands.map((brand) => `
      <article class="gallery-card">
        <div class="gallery-card-media"><img src="${asset(brand.image)}" alt="${assetAlt(brand.image) || brand.name}"><span class="gallery-brand-label">${brand.name}</span></div>
        <div class="gallery-card-body"><div class="gallery-brand-name"><img class="gallery-logo" src="${asset(brand.logo)}" alt=""><h3>${brand.name}</h3></div><p>${brand.category} · ${brand.tagline}</p></div>
      </article>
    `).join('');
  });

}

// 结构化素材引用：页面用 data-asset-img / data-asset-bg 写素材 ID，
// 这里统一解析为 素材/ 链接；换图只改 js/data.js 的 assets 注册表。
function applyAssets() {
  document.querySelectorAll('[data-asset-img]').forEach((node) => { node.src = asset(node.dataset.assetImg); });
  document.querySelectorAll('[data-asset-bg]').forEach((node) => { node.style.backgroundImage = `url('${asset(node.dataset.assetBg)}')`; });
}

// 小程序入口卡统一从 SITE_DATA.programs 渲染（含二维码、产品 logo、名称与说明），
// 页面放 <div class="program-grid" data-programs-grid data-programs-link="..."></div>；
// data-programs-link 缺省为 联系我们#xiaochengxu，本页锚点可传 "#xiaochengxu"。
function renderProgramGrids() {
  document.querySelectorAll('[data-programs-grid]').forEach((grid) => {
    const rawLink = grid.dataset.programsLink;
    const link = rawLink ? (rawLink.startsWith('#') ? rawLink : siteLink(rawLink)) : `${siteLink('contact.html')}#xiaochengxu`;
    grid.innerHTML = SITE_DATA.programs.map((program, index) => `
      <a class="program-card" href="${link}">
        <img data-asset-img="${program.image}" alt="${program.name}小程序码">
        <div>
          <p class="eyebrow">MINI PROGRAM 0${index + 1}</p>
          <h3 class="program-name">${program.logo ? `<img class="program-logo" data-asset-img="${program.logo}" alt="${program.name}">` : program.name}</h3>
          <p>${program.desc}</p><small>${program.small}</small>
        </div>
      </a>
    `).join('');
  });
}

// 门店实拍二级页（mdzs/<slug>.html）：页面放骨架 + data-store-gallery="slug"，
// 名称/定位/官方文案与照片清单统一读 SITE_DATA.storeGallery；
// 配置 vr 时追加「720° 全景看店」区块（外链 VR + 截帧预览）。
function renderStoreGallery() {
  const holder = document.querySelector('[data-store-gallery]');
  if (!holder) return;
  const slug = holder.dataset.storeGallery;
  const data = SITE_DATA.storeGallery?.[slug];
  if (!data) { console.warn(`[storeGallery] 未收录的门店实拍: ${slug}`); return; }
  document.querySelectorAll('[data-store-name]').forEach((node) => { node.textContent = data.name; });
  document.querySelectorAll('[data-store-kicker]').forEach((node) => { node.textContent = data.kicker; });
  document.querySelectorAll('[data-store-copy]').forEach((node) => { node.textContent = data.copy; });
  document.title = `${data.name} · 门店实拍｜有方大健康`;
  holder.innerHTML = data.photos.map((photo, index) => `
    <a class="gallery-card gallery-card--interactive" href="${asset(photo.id)}" data-gallery-item data-gallery-index="${index}" data-gallery-src="${asset(photo.id)}" data-gallery-caption="${photo.caption}" aria-label="放大查看${data.name}：${photo.caption}">
      <span class="gallery-card-media"><img src="${asset(photo.id)}" alt="${data.name}门店实拍：${photo.caption}"></span>
      <span class="gallery-card-body"><span class="gallery-card-caption">${photo.caption}</span></span>
    </a>
  `).join('');
  if (data.vr) renderStoreVR(data.vr, data.name);
}

// 720° 全景看店：每个品牌只对应一个真实 VR 链接，使用一张主预览卡，避免把同一全景误渲染成三个入口。
function renderStoreVR(vr, storeName) {
  const holder = document.querySelector('[data-store-vr]');
  if (!holder) return;
  const preview = vr.preview || vr.shots?.[0];
  const previewId = preview?.id || preview;
  const title = vr.title || `${storeName} 720° 全景看店`;
  const summary = vr.summary || '打开官方 VR 页面，拖动视角查看门店空间与动线。';
  holder.innerHTML = `
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">VIRTUAL TOUR</p>
        <h2 class="section-title">720° 全景看店</h2>
        <p class="section-summary">${summary}</p>
      </div>
      <a class="vr-feature" href="${vr.url}" target="_blank" rel="noopener">
        <span class="vr-feature-media"><img src="${asset(previewId)}" alt="${title}预览"><span class="vr-card-badge">720°</span><span class="vr-feature-play" aria-hidden="true">↗</span></span>
        <span class="vr-feature-copy"><span><strong>${title}</strong><small>点击进入官方全景页面，支持拖动、场景切换与全屏浏览</small></span><span class="btn btn--orange">进入全景</span></span>
      </a>
    </div>`;
  holder.hidden = false;
}

// 门店实拍灯箱：点击图片放大；支持关闭、上一张/下一张和键盘左右切换。
function setupGalleryLightbox() {
  const items = [...document.querySelectorAll('[data-gallery-item]')];
  if (!items.length) return;
  const modal = document.createElement('div');
  modal.className = 'gallery-lightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', '门店照片预览');
  modal.innerHTML = `
    <button class="gallery-lightbox-close" type="button" data-gallery-close aria-label="关闭照片预览">×</button>
    <button class="gallery-lightbox-nav gallery-lightbox-prev" type="button" data-gallery-prev aria-label="上一张照片">‹</button>
    <figure class="gallery-lightbox-card">
      <img data-gallery-lightbox-image alt="">
      <figcaption><span data-gallery-lightbox-caption></span><small data-gallery-lightbox-count></small></figcaption>
    </figure>
    <button class="gallery-lightbox-nav gallery-lightbox-next" type="button" data-gallery-next aria-label="下一张照片">›</button>`;
  document.body.appendChild(modal);
  const image = modal.querySelector('[data-gallery-lightbox-image]');
  const caption = modal.querySelector('[data-gallery-lightbox-caption]');
  const count = modal.querySelector('[data-gallery-lightbox-count]');
  let current = 0;
  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    image.src = item.dataset.gallerySrc;
    image.alt = item.getAttribute('aria-label') || '';
    caption.textContent = item.dataset.galleryCaption || '';
    count.textContent = `${current + 1} / ${items.length}`;
    modal.classList.add('open');
    document.body.classList.add('lightbox-open');
    modal.querySelector('[data-gallery-close]').focus();
  };
  const close = () => {
    modal.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    items[current]?.focus();
  };
  items.forEach((item, index) => item.addEventListener('click', (event) => { event.preventDefault(); show(index); }));
  modal.querySelector('[data-gallery-close]').addEventListener('click', close);
  modal.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  modal.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
}

// 品牌视频块：页面放 <div data-video-block="key"></div>，由视频注册表渲染
// （poster 海报帧 + controls，preload="none" 不预加载流量）。
function renderVideoBlocks() {
  document.querySelectorAll('[data-video-block]').forEach((node) => {
    const video = videoData(node.dataset.videoBlock);
    if (!video) return;
    const vertical = !!video.vertical;
    node.innerHTML = `
      <figure class="video-block${vertical ? ' video-block--vertical' : ''}">
        <video controls preload="none" poster="${video.posterUrl}" playsinline aria-label="${video.alt || video.title}">
          <source src="${video.srcUrl}" type="video/mp4">
        </video>
        <figcaption class="media-caption">${video.title}</figcaption>
      </figure>`;
  });
}

// 首页配置渲染（HOME_CONFIG 定义在 js/config/home.config.js）：
// index.html 骨架带同文静态回退（无 JS 时主标题可读），本函数用配置覆盖内容，
// 并按 sections 顺序重排区块；journey 步骤复用 SITE_DATA.stages，避免双份维护。
function renderHomeSections() {
  const home = SITE_DATA.home;
  if (!home) return;
  const setText = (selector, text) => { if (text == null) return; const node = document.querySelector(selector); if (node) node.textContent = text; };
  const hero = home.hero || {};
  setText('[data-home-hero-title]', hero.title);
  setText('[data-home-hero-summary]', hero.summary);
  const heroBg = document.querySelector('[data-home-hero-bg]');
  if (heroBg && hero.bgAssetId) heroBg.setAttribute('data-asset-bg', hero.bgAssetId);
  const heroActions = document.querySelector('[data-home-hero-actions]');
  if (heroActions && hero.primaryAction && hero.secondaryAction) {
    heroActions.innerHTML = `<a class="btn btn--orange" href="${siteLink(hero.primaryAction.href)}">${hero.primaryAction.label}</a><a class="btn btn--light" href="${siteLink(hero.secondaryAction.href)}">${hero.secondaryAction.label}</a>`;
  }
  const scale = home.scale || {};
  setText('[data-home-eyebrow="scale"]', scale.eyebrow);
  setText('[data-home-title="scale"]', scale.title);
  const scaleGrid = document.querySelector('[data-home-scale]');
  if (scaleGrid && scale.items) {
    scaleGrid.innerHTML = scale.items.map((item) => `
      <div class="scale-item"><div class="scale-value"><span data-count="${item.value}">${item.format ? item.value.toLocaleString('zh-CN') : item.value}</span><small>${item.unit}</small></div><div class="scale-label">${item.label}${item.sub ? `<small>${item.sub}</small>` : ''}</div></div>
    `).join('');
  }
  const capabilities = home.capabilities || {};
  setText('[data-home-eyebrow="capabilities"]', capabilities.eyebrow);
  setText('[data-home-title="capabilities"]', capabilities.title);
  const segmentGrid = document.querySelector('[data-home-segments]');
  if (segmentGrid && capabilities.segments) {
    segmentGrid.innerHTML = capabilities.segments.map((card) => `<article class="info-card"><div class="card-number">${card.no}</div><h3>${card.title}</h3><p>${card.copy}</p></article>`).join('');
  }
  setText('[data-home-eyebrow="ecosystem"]', capabilities.ecosystemEyebrow);
  setText('[data-home-title="ecosystem"]', capabilities.ecosystemTitle);
  const ecosystemGrid = document.querySelector('[data-home-ecosystem]');
  if (ecosystemGrid && capabilities.ecosystem) {
    ecosystemGrid.innerHTML = capabilities.ecosystem.map((card) => `<article class="info-card"><div class="card-number">${card.no}</div><h3>${card.title}</h3><p>${card.copy}</p></article>`).join('');
  }
  const journey = home.journey || {};
  setText('[data-home-eyebrow="journey"]', journey.eyebrow);
  setText('[data-home-title="journey"]', journey.title);
  setText('[data-home-summary="journey"]', journey.summary);
  // 门店发展三阶段通用卡片：SITE_DATA.stages 单一数据源，首页与 data-stage-flow 容器共用
  const stageCardHTML = (stage, i) => `<article class="stage-card"><div class="stage-card-head"><span class="stage-number">0${i + 1}</span><span class="stage-kicker">${stage.kicker || `阶段${'一二三'[i] || ''}`}</span></div><h3>${stage.name}</h3><p>${stage.desc}</p>${Array.isArray(stage.points) && stage.points.length ? `<ul class="stage-points">${stage.points.map((point) => `<li>${point}</li>`).join('')}</ul>` : ''}</article>`;
  const journeyGrid = document.querySelector('[data-home-journey]');
  if (journeyGrid) {
    journeyGrid.innerHTML = SITE_DATA.stages.map(stageCardHTML).join('');
  }
  document.querySelectorAll('[data-stage-flow]').forEach((flow) => {
    flow.innerHTML = SITE_DATA.stages.map(stageCardHTML).join('');
  });
  const mission = home.mission || {};
  setText('[data-home-eyebrow="mission"]', mission.eyebrow);
  setText('[data-home-title="mission"]', mission.title);
  const missionGrid = document.querySelector('[data-home-mission]');
  if (missionGrid && mission.items) {
    missionGrid.innerHTML = mission.items.map((card) => `<article class="info-card"><div class="card-number">${card.no}</div><h3>${card.title}</h3><p>${card.copy}</p></article>`).join('');
  }
  const cta = home.cta || {};
  setText('[data-home-eyebrow="cta"]', cta.eyebrow);
  setText('[data-home-title="cta"]', cta.title);
  setText('[data-home-cta-copy]', cta.copy);
  const ctaActions = document.querySelector('[data-home-cta-actions]');
  if (ctaActions && cta.primary && cta.secondary) {
    const href = (action) => (action.href.startsWith('tel:') ? action.href : siteLink(action.href));
    ctaActions.innerHTML = `<a class="btn btn--orange" href="${href(cta.primary)}">${cta.primary.label}</a><a class="btn btn--ghost" href="${href(cta.secondary)}">${cta.secondary.label}</a>`;
  }
  const main = document.querySelector('main');
  if (main && Array.isArray(home.sections)) {
    home.sections.forEach(({ id, visible }) => {
      const section = main.querySelector(`[data-home-section="${id}"]`);
      if (!section) return;
      if (visible === false) { section.remove(); return; }
      main.appendChild(section);
    });
    main.querySelectorAll('[data-home-section]').forEach((section) => {
      if (!home.sections.some(({ id }) => id === section.dataset.homeSection)) section.remove();
    });
  }
}

function setupNavigation() {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!header || !menu || !toggle) return;
  const close = () => {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    document.querySelector('.back-top')?.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupAccordions() {
  document.querySelectorAll('[data-accordion] .faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const list = button.closest('[data-accordion]');
      list.querySelectorAll('.faq-item').forEach((other) => { if (other !== item) other.classList.remove('open'); });
      item.classList.toggle('open');
    });
  });
}

function setupTabs() {
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('[data-tab]');
    const panels = tabs.querySelectorAll('[data-panel]');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const target = button.dataset.tab;
      buttons.forEach((item) => item.classList.toggle('active', item === button));
      panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === target));
    }));
  });
}

function setupCountUp() {
  const nodes = document.querySelectorAll('[data-count]');
  if (!nodes.length) return;
  const run = (node) => {
    const target = Number(node.dataset.count || 0);
    if (!Number.isFinite(target)) return;
    const duration = 700;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      node.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString('zh-CN');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { nodes.forEach(run); return; }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => { run(entry.target); obs.unobserve(entry.target); });
  }, { threshold: .4 });
  nodes.forEach((node) => observer.observe(node));
}

function setupModal() {
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;
  const close = () => modal.classList.remove('open');
  document.querySelectorAll('[data-video-open]').forEach((button) => button.addEventListener('click', () => modal.classList.add('open')));
  modal.querySelectorAll('[data-video-close]').forEach((button) => button.addEventListener('click', close));
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}

function regionEntries(parentCode) {
  return Object.entries(window.CHINA_REGION_DATA?.[parentCode] || {})
    .map(([value, label]) => ({ value, label }));
}

function fillRegionSelect(select, options, placeholder) {
  if (!select) return;
  select.replaceChildren();
  const first = document.createElement('option');
  first.value = '';
  first.textContent = placeholder;
  select.append(first);
  options.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
  select.disabled = options.length === 0;
  select.value = '';
}

function setupRegionPicker(form) {
  const picker = form.querySelector('[data-region-picker]');
  if (!picker) return () => {};
  const province = picker.querySelector('[data-region-level="province"]');
  const city = picker.querySelector('[data-region-level="city"]');
  const district = picker.querySelector('[data-region-level="district"]');
  if (!province || !city || !district) return () => {};

  const reset = () => {
    fillRegionSelect(province, regionEntries('86'), '请选择省份');
    fillRegionSelect(city, [], '请选择城市');
    fillRegionSelect(district, [], '请选择区/县');
  };
  province.addEventListener('change', () => {
    fillRegionSelect(city, regionEntries(province.value), '请选择城市');
    fillRegionSelect(district, [], '请选择区/县');
  });
  city.addEventListener('change', () => {
    fillRegionSelect(district, regionEntries(city.value), '请选择区/县');
  });
  reset();
  return reset;
}

function renderIntentBrandChoices() {
  document.querySelectorAll('[data-intent-brands]').forEach((holder) => {
    const brands = Array.isArray(SITE_DATA.brands) ? SITE_DATA.brands : [];
    holder.replaceChildren(...brands.map((brand) => {
      const label = document.createElement('label');
      label.className = 'intent-brand-option';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'brand';
      input.value = brand.slug;
      input.dataset.intentBrand = brand.slug;
      input.dataset.brandName = brand.name;
      input.setAttribute('aria-label', brand.name);
      const name = document.createElement('span');
      name.textContent = brand.name;
      label.append(input, name);
      return label;
    }));
  });
}

function setupFormValidation(form) {
  const phone = form.elements.phone;
  const brands = [...form.querySelectorAll('[data-intent-brand]')];
  const syncPhoneValidity = () => {
    if (!phone) return;
    const value = phone.value.trim();
    phone.setCustomValidity(!value || /^1[3-9]\d{9}$/.test(value) ? '' : '请输入11位有效手机号码');
  };
  const syncBrandValidity = () => {
    if (!brands.length) return;
    brands[0].setCustomValidity(brands.some((input) => input.checked) ? '' : '请至少选择一个意向品牌');
  };
  if (phone) {
    phone.addEventListener('input', () => {
      phone.value = phone.value.replace(/\D/g, '').slice(0, 11);
      syncPhoneValidity();
    });
    phone.addEventListener('blur', syncPhoneValidity);
  }
  brands.forEach((input) => input.addEventListener('change', syncBrandValidity));
  syncPhoneValidity();
  syncBrandValidity();
  return () => {
    syncPhoneValidity();
    syncBrandValidity();
  };
};

function selectedRegionValue(form, level) {
  const select = form.querySelector(`[data-region-level="${level}"]`);
  return select ? { code: select.value, name: select.selectedOptions[0]?.textContent || '' } : { code: '', name: '' };
}

function formPayload(form) {
  const data = new FormData(form);
  return {
    name: String(data.get('name') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    province: selectedRegionValue(form, 'province'),
    city: selectedRegionValue(form, 'city'),
    district: selectedRegionValue(form, 'district'),
    brands: data.getAll('brand'),
    message: String(data.get('message') || '').trim(),
  };
}

function setFormStatus(form, message, tone = '') {
  const status = form.querySelector('.form-status');
  if (!status) return;
  status.className = `form-status${tone ? ` form-status--${tone}` : ''}`;
  status.textContent = message;
}

function setupForms() {
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const resetRegions = setupRegionPicker(form);
    const syncValidation = setupFormValidation(form);
    form.addEventListener('reset', () => window.setTimeout(resetRegions, 0));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      syncValidation();
      if (!form.reportValidity()) {
        setFormStatus(form, '请按提示补全信息后再提交。', 'error');
        return;
      }
      const endpoint = form.dataset.endpoint?.trim();
      if (!endpoint) {
        setFormStatus(form, '信息已校验，在线提交通道正在接入；如需咨询请拨打 400-008-0629。', 'warning');
        return;
      }
      setFormStatus(form, '正在提交，请稍候。');
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formPayload(form)),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setFormStatus(form, '信息已提交，感谢你的咨询。');
        form.reset();
      } catch (error) {
        console.error('[contact-form]', error);
        setFormStatus(form, '暂时无法提交，请稍后重试或拨打 400-008-0629。', 'error');
      }
    });
  });
}

// 招商咨询表单消费品牌详情页的 ?brand= 参数，自动勾选对应意向品牌。
function setupConsultPreFill() {
  const slug = new URLSearchParams(window.location.search).get('brand');
  const brand = slug && brandBySlug(slug);
  if (!brand) return;
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const input = [...form.querySelectorAll('[data-intent-brand]')].find((item) => item.value === brand.slug);
    if (!input) return;
    input.checked = true;
    const status = form.querySelector('.form-status');
    if (status) status.textContent = `已为你选中「${brand.name}」品牌，补充联系方式即可提交。`;
  });
}

// 品牌门店形态（当前仅奈晚推拿有店型数据）：填充 [data-brand-forms] 骨架
function renderBrandForms(brand) {
  const holder = document.querySelector('[data-brand-forms]');
  if (!holder || !brand || !brand.storeForms) return;
  const grid = holder.querySelector('[data-brand-forms-grid]');
  const title = holder.querySelector('[data-brand-forms-title]');
  if (!grid) return;
  if (title) title.textContent = `${brand.name}的门店形态`;
  grid.innerHTML = brand.storeForms.map((form) => `
    <figure class="brand-form-item">
      <img src="${asset(form.logo)}" alt="${brand.name}${form.label}logo">
      <figcaption>${form.label}</figcaption>
    </figure>
  `).join('');
  holder.hidden = false;
}

function setupBackTop() {
  const button = document.querySelector('.back-top');
  if (button) button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

renderHeader();
renderFooter();
renderBrandSections();
renderProgramGrids();
renderStoreGallery();
renderVideoBlocks();
renderHomeSections();
applyAssets();
setupGalleryLightbox();
// favicon：集团方形图标（有方图标）
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = asset('logo-group-icon');
document.head.appendChild(favicon);
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
setupNavigation();
setupAccordions();
setupTabs();
setupCountUp();
setupModal();
renderIntentBrandChoices();
setupForms();
setupConsultPreFill();
setupBackTop();
