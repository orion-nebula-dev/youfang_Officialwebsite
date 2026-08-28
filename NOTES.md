# 有方大健康官网 · 克隆笔记

## 源信息

- 原站 URL：`https://www.busyming.com/`
- 侦察证据：`RECON/original-recon-real.json`、`RECON/original-summary-real.md`、`RECON/screenshots/original-*-real.png`
- 源站多页面核验：`RECON/original-routes-real.md`
- 完整对照说明：根目录 `CLONE_REPORT.md`
- 原站类型：中企动力生成的静态多页面企业官网，首页含背景视频/海报、统计/能力区、品牌卡片和黄色波浪页脚
- 本地模式：视觉复刻 + 集团素材内容替换
- 使用范围：本地/集团内部评审；原站部署资产的许可与公开再部署权未作推定

## 复刻前预判

- 复杂度：L3（多页面静态官网 + 视频/海报 + 交互导航）
- 可高保真：导航层级、页面节奏、首页首屏、介绍/数据/品牌/页脚分区、响应式单列、门店/资讯/联系页面的信息形态
- 近似处理：原站视频改为本地品牌海报与弹层，原站后台内容列表改为集团官网内容初稿，外部表单改为本地演示提交
- 不克隆：原站 CMS 管理端、外部投资者关系数据、真实视频文件、第三方统计/追踪/客服服务

## 原站基线

真实浏览器（普通浏览器 User-Agent）取得首页 HTTP 200，首页关键基线为：固定 80px 导航、首屏背景视频/海报、约 2837px 页面高度、5 项信息指标、2 列品牌卡片、黄色波浪页脚；默认无头浏览器 User-Agent 会被原站返回 403，因此保留了普通浏览器基线截图。

## 替换地图

| 要替换的内容 | 文件 |
| --- | --- |
| 首屏与页面背景 | `../素材/hero-mountain.jpg`、各页面 hero 的内联 `background-image`；`hero-group.jpg` 保留作视频海报 |
| 品牌卡片 | `index.html`、`about.html`、`zsjm.html` 中的 `../素材/brand-*.jpg` |
| 门店效果图 | `index.html`、`mdzs.html` 中的 `../素材/store-*-source.png` |
| 数字化小程序截图 | `index.html`、`tzgx.html`、`news_detail/digital-platform.html` 中的 `../素材/digital-opening.png` |
| 页脚二维码 | `js/site.js`、页面联系区的 `../素材/qr-guyoufang.jpg` 与 `../素材/qr-youxiaofang.jpg` |
| 品牌/加盟文案 | 各页面正文；具体变更点见 `REPLACE_GUIDE.md` |
| 全局配色 | `style.css` 的 `:root` 变量 |

## 验证

- [x] 原站真实结构、资源和截图已保存
- [x] 本地素材均来自集团附件材料，来源说明见 `../素材/README.md`
- [x] 首页 1440/768/390 三档截图对照
- [x] 多页面路由、移动菜单、折叠、选项卡和演示表单浏览器验证
- [ ] 正式联系方式、二维码、品牌主数据和业务政策上线前确认
