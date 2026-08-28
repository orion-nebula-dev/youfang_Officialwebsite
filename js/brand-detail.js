// 品牌详情页渲染：页面骨架固定，内容由 js/data.js 的 SITE_DATA.brands 注入。
// 路径根从本脚本自身的 URL 推导，与 site.js 一致，不依赖部署目录名。
const brandScriptUrl = new URL(document.currentScript.getAttribute('src'), document.baseURI);
const brandSiteRoot = brandScriptUrl.href.replace(/\?.*$/, '').replace(/js\/brand-detail\.js$/, '');
const brandSiteRootUrl = new URL(brandSiteRoot);
const brandAssetRoot = decodeURIComponent(brandSiteRootUrl.pathname).endsWith('/代码/')
  ? new URL('../', brandSiteRootUrl).href
  : brandSiteRoot;
const brandAsset = (id) => {
  const record = SITE_DATA.assets[id];
  const file = typeof record === 'string' ? record : record?.src;
  if (!file) { console.warn(`[assets] 未注册的素材 ID: ${id}`); return ''; }
  return `${brandAssetRoot}素材/${file}`;
};

function renderBrandDetail() {
  const slug = document.body.dataset.brand;
  const brand = SITE_DATA.brands.find((item) => item.slug === slug);
  if (!brand) return;
  const photo = brandAsset(brand.image);
  const detailRoot = document.querySelector('[data-brand-detail]');
  document.title = `${brand.name}｜有方大健康`;
  document.querySelector('[data-brand-hero]').style.backgroundImage = `url('${photo}')`;
  // hero 标题按场景选 logo 形态：有上下锁定版时标题位直接用锁定 logo（alt 保留品牌名语义），
  // 否则回退「圆形徽章 + 文字标题」
  const badgeNode = document.querySelector('[data-brand-logo]');
  const nameNode = document.querySelector('[data-brand-name]');
  if (brand.logoVertical) {
    if (badgeNode) badgeNode.hidden = true;
    nameNode.innerHTML = `<img class="brand-hero-lockup" src="${brandAsset(brand.logoVertical)}" alt="${brand.name}">`;
  } else {
    if (badgeNode) {
      badgeNode.hidden = false;
      badgeNode.src = brandAsset(brand.logo);
      badgeNode.alt = `${brand.name}品牌 logo`;
    }
    nameNode.textContent = brand.name;
  }
  document.querySelector('[data-brand-category]').textContent = brand.category;
  document.querySelector('[data-brand-detail-title]').textContent = `${brand.name}，把服务方向落到一间店`;
  document.querySelector('[data-brand-detail-summary]').textContent = brand.copyCard;
  document.querySelector('[data-brand-scene]').textContent = brand.scene;
  document.querySelector('[data-brand-store]').textContent = brand.store;
  document.querySelector('[data-brand-support]').textContent = brand.support;
  document.querySelector('[data-brand-image]').src = photo;
  document.querySelector('[data-brand-image]').alt = `${brand.name}品牌门店方向`;
  // 谷有方小程序品牌页预览（素材 ID 来自 SITE_DATA.brands[].screen）
  const screenNode = document.querySelector('[data-brand-screen]');
  if (screenNode && brand.screen) {
    screenNode.src = brandAsset(brand.screen);
    screenNode.alt = `谷有方小程序${brand.name}品牌页截图`;
    const caption = document.querySelector('[data-brand-screen-caption]');
    if (caption) caption.textContent = `谷有方 · ${brand.name}品牌页`;
  }
  // 「模拟我的经营方案」入口已按用户要求移除；保留判空防止旧骨架报错
  const simulateNode = document.querySelector('[data-brand-simulate]');
  if (simulateNode) simulateNode.href = `${brandSiteRoot}mnjy.html?brand=${slug}`;
  document.querySelector('[data-brand-consult]').href = `${brandSiteRoot}zsjm.html?brand=${slug}#consult`;
  document.querySelector('[data-brand-points]').innerHTML = brand.points.map((point) => `<li>${point}</li>`).join('');
  // 品牌常见问题（SITE_DATA.brands[].faq，文案来自谷有方商家小程序逐字稿）：
  // site.js 的 setupAccordions 先于本脚本执行，渲染后需重新绑定折叠交互
  const faqHolder = document.querySelector('[data-brand-faq]');
  if (faqHolder && Array.isArray(brand.faq)) {
    const faqTitle = document.querySelector('[data-brand-faq-title]');
    if (faqTitle) faqTitle.textContent = `关于${brand.name}的常见问题`;
    faqHolder.innerHTML = brand.faq.map((item, index) => `
      <div class="faq-item${index === 0 ? ' open' : ''}"><button class="faq-question" type="button">${item.q}</button><div class="faq-answer"><div>${item.a}</div></div></div>
    `).join('');
    if (typeof setupAccordions === 'function') setupAccordions();
  }
  detailRoot.hidden = false;
  renderBrandForms(brand);
}

renderBrandDetail();
