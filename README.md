# 有方大健康官网复刻

这是放在“复刻官网/代码/”下的纯静态多页面官网。页面结构、导航层级、首页节奏、视频海报交互、两列品牌卡片、黄色波浪页脚和响应式菜单参考已保存的源站侦察证据；页面内容和图片已替换为有方大健康的集团材料。

## 本地预览

请在“复刻官网/代码”目录启动本地静态服务器：

```bash
cd "/Users/wwh/Documents/AItools/项目文件夹/本数科技/暂存区/复刻官网/代码"
npm run dev
```

然后访问 `http://127.0.0.1:3000/`。`public/` 是自动生成的运行副本，`scripts/` 负责同步、素材校验和本地服务。

## 页面

- 首页：`index.html`
- 关于有方：`about.html`
- 门店展示：`mdzs.html`（二级页 `mdzs/{slug}.html` × 3：谷小推 / 恒青树 / 奈晚推拿门店实拍，`SITE_DATA.storeGallery` 驱动）
- 集团资讯：`news.html`（首条为品牌视频入口，通向 `video/2049311683814764544.html`）
- 能力与产品：`tzgx.html`
- 社会责任：`shzr.html`
- 招商加盟：`zsjm.html`（咨询表单消费 `?brand=` 参数，见下文）
- 联系我们：`contact.html`（`#xiaochengxu` 为全站小程序码锚点唯一位置）
- 品牌矩阵：`brands/index.html`
- 品牌详情：`brands/{slug}.html` × 7（结构同构，内容来自 `js/data.js`）
- 培训与运营支持：`pxyy.html`
- 信息公开（页脚低曝光入口，`data-page="disclosure"`）：公告与通函 `gggh.html`、企业治理 `qyzl.html`、项目日历 `tzrl.html`、阶段报告 `yjbgs.html`、资料中心 `ztwj.html`
- 隐私说明：`privacy.html`（仅在页脚低调入口展示）
- 原站路由兼容跳转存根：`home.html`、`home1.html`、`taglist.html`（meta-refresh，无正文）

## 结构化维护说明

全站内容与行为的单一数据源是 `js/data.js`；首页文案、CTA 与区块顺序的维护入口是 `js/config/home.config.js`（`HOME_CONFIG`，由 `site.js` 的 `renderHomeSections()` 渲染并排序）。改动口径时只改配置：

| 维护内容 | 位置 | 生效范围 |
| --- | --- | --- |
| 品牌主数据（名称、类目、文案、图片、logo、适配信息） | `SITE_DATA.brands` | 首页/招商/品牌矩阵品牌卡片、关于页画廊与名称条、品牌详情页全文 |
| 素材注册表（语义 ID → 素材/ 文件路径） | `SITE_DATA.assets` | 全站所有图片引用（见下） |
| 主导航 | `SITE_DATA.nav` | 全站导航（8 项不变） |
| 首页文案、CTA、素材 ID 与区块顺序 | `js/config/home.config.js`（HOME_CONFIG） | 仅 `index.html` |
| 小程序、400 电话、三阶段、信息公开入口 | `SITE_DATA.programs/phone/stages/disclosure` | 页脚与相关区块 |

### 素材引用（结构化）

- 页面图片一律用素材 ID：`<img data-asset-img="hero-group">`、`<div data-asset-bg="hero-mountain">`，由 `js/site.js` 的 `applyAssets()` 经 `SITE_DATA.assets` 解析为 `素材/` 链接；HTML 里不出现直连素材路径。
- 换图流程与全部素材的尺寸/场景审计见 `../素材/素材清单.md`；品牌 Logo 与产品 Logo 的发布文件在 `../素材/logo/`，高清源文件在 `../素材/归档/源文件/logo-src/`。
- 品牌 logo 展示位：品牌卡 chip、品牌详情页 hero 竖版锁定 logo（`logoVertical`）、关于页画廊。品牌详情页 FAQ 由 `SITE_DATA.brands[].faq` 渲染（`data-brand-faq`，文案来自谷有方商家小程序逐字稿）。
- 小程序入口卡由 `SITE_DATA.programs` 数据驱动渲染（页面放 `<div class="program-grid" data-programs-grid></div>`），三个入口（谷有方 / 有小方 / 方小匠）均带产品 logo 与小程序码。
- 未注册的素材 ID 会在浏览器控制台输出 `[assets] 未注册的素材 ID` 警告，`verify-local.mjs` 会把它计为失败。

页面里的品牌区块用占位容器声明式渲染（`js/site.js` 的 `renderBrandSections`）：

- `<div class="brand-grid" data-brands-grid="home"></div>` 首页大卡（长文案 + 营销标签）
- `<div class="brand-grid" data-brands-grid="join"></div>` 招商页小卡（短文案）
- `<div class="brand-grid" data-brands-grid="matrix" data-brand-prefix=""></div>` 品牌矩阵小卡（同目录链接）
- `<div class="brand-name-strip" data-brands-strip></div>` / `<div class="gallery-grid" data-brands-gallery></div>` 关于页

其他实现约定：

- 新增/修改品牌时只改 `js/data.js` 的 `brands` 数组并补充 `素材/` 图片；所有页面自动同步。
- 路径根从脚本自身 URL 推导（`site.js` / `brand-detail.js` 首行），站点部署在任意子路径或域名根均可，无需修改代码。
- 招商加盟表单使用省 / 市 / 区（县）三级联动和 `data-intent-brands` 多选品牌；从品牌详情页带 `?brand={slug}` 跳转时自动勾选对应意向品牌。
- 新增页面后：8 项主导航保持不变；低曝光页面挂 `data-page="disclosure"`，在 `SITE_DATA.disclosure` 登记页脚入口。

## 验证

```bash
npm test
```

## 实现说明

- 无框架、无构建步骤，使用 `style.css` 和 `js/site.js`、`js/data.js`、`js/brand-detail.js`；适合先在本地评审页面和素材。
- `js/site.js` 统一注入导航、页脚、移动端菜单、品牌区块、折叠面板、选项卡、数字/状态交互、咨询表单校验和品牌带入。
- 所有官网业务入口、素材链接和页面路由均为本地引用；没有继续引用原站图片、视频、统计脚本或外部 CDN。
- 当前集团口径已统一为 7 个品牌、谷有方 / 有小方 / 方小匠 3 个小程序入口，以及招商 / 建店 / 运营 3 个门店阶段。
- 400 电话、费用、收益、周期、城市开放、合同规则和正式对外邮箱没有虚构，待最终资料确认后再上线。
