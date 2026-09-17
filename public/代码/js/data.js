// 全站内容与素材的单一数据源。
// - 内容口径：品牌、导航、小程序、三阶段、信息公开入口。
// - 素材注册表：assets 把语义 ID 映射到本地路径、源文件和 alt；页面用
//   data-asset-img / data-asset-bg 引用 ID，由 js/site.js 统一解析，
//   换图只改这里一行，无需动任何 HTML。
// 人工维护清单（含尺寸与适用场景标注）：素材/素材清单.md。
const localAsset = (src, sourcePath, alt, note = '') => ({ src, sourcePath, alt, note });

// 全站品牌展示顺序：所有品牌卡、名称条、画廊、下拉选项和相关入口共用这一顺序。
const BRAND_ORDER = ['naiwan', 'guxiaotui', 'zukangshu', 'hengqingshu', 'leguangli', 'aixiaowan', 'shisixun'];

const SITE_DATA = {
  // 首页配置（P1 拆分）：内容维护入口在 js/config/home.config.js，此处只聚合。
  home: typeof HOME_CONFIG !== 'undefined' ? HOME_CONFIG : undefined,
  nav: [
    ['首页', 'index.html', 'home'],
    ['关于有方', 'about.html', 'about'],
    ['门店展示', 'mdzs.html', 'stores'],
    ['集团资讯', 'news.html', 'news'],
    ['能力与产品', 'tzgx.html', 'capability'],
    ['社会责任', 'shzr.html', 'responsibility'],
    ['招商加盟', 'zsjm.html', 'join'],
    ['联系我们', 'contact.html', 'contact'],
  ],
  phone: '400-008-0629',
  phoneHref: 'tel:4000080629',
  // 小程序入口卡：image 为二维码素材 ID，logo 为产品 logo。
  // 全站统一展示顺序：有小方 → 谷有方 → 方小匠（横向从左到右 / 纵向从上到下一致）
  programs: [
    { name: '有小方', image: 'qr-youxiaofang', logo: 'logo-youxiaofang', desc: '消费者小程序：按城市浏览全品牌门店，选购养生服务与商品，支持会员、健康次卡与到店核销。', small: '扫码进入有小方' },
    { name: '谷有方', image: 'qr-guyoufang', logo: 'logo-guyoufang', desc: '品牌了解、加盟沟通、门店资料与经营入口。', small: '扫码进入谷有方' },
    { name: '方小匠', image: 'qr-fangxiaojiang', logo: 'logo-fangxiaojiang', desc: '技师小程序：大健康终身职业成长平台，技能学习、考试认证、求职招聘与提成统计。', small: '扫码进入方小匠' },
  ],
  // 门店发展三阶段：唯一数据源，首页 STORE JOURNEY 与关于有方「发展阶段」共用（data-home-journey / data-stage-flow）
  stages: [
    {
      name: '招商',
      desc: '从品牌方向、项目定位到合作沟通，帮助经营者先看懂项目，再判断是否适合自己的城市、店型与经营计划。',
      points: ['品牌资料与项目了解', '合作沟通与初步评估'],
    },
    {
      name: '建店',
      desc: '围绕选址、空间设计、装修物料和开业筹备，把确认后的门店方案推进到现场，并同步关键资料与节点。',
      points: ['选址、设计与装修协同', '物料、培训与开业准备'],
    },
    {
      name: '运营',
      desc: '门店开业后，通过小程序、门店数据与服务团队持续支持日常经营，及时承接问题反馈与阶段复盘。',
      points: ['经营信息与门店状态查看', '服务协同与持续运营支持'],
    },
  ],
  // 页脚“信息公开”低曝光入口，承接集团公告与治理类页面
  disclosure: [
    ['公告与通函', 'gggh.html'],
    ['企业治理', 'qyzl.html'],
    ['项目日历', 'tzrl.html'],
    ['阶段报告', 'yjbgs.html'],
    ['资料中心', 'ztwj.html'],
  ],
  // 素材注册表：页面只使用语义 ID，不直接写文件路径。
  // src 是 public/素材/ 下的本地运行路径；sourcePath 记录素材源；alt 是默认无障碍文案。
  assets: {
    // 主视觉
    // （group-overview / digital-platform / digital-opening 三个内部文档页渲染图与内部预览截图
    //   已于 2026-08-25 退出站点并归档至 素材/归档/未启用/visual/，不在公网页面使用。）
    'hero-mountain': localAsset('visual/hero-mountain.jpg', '归档/原始素材/源文件/有方大健康集团介绍-0714.pdf', '有方大健康山景主视觉', '集团主视觉裁切'),
    'hero-group': localAsset('visual/hero-group.jpg', '归档/原始素材/源文件/有方大健康集团介绍-0714.pdf', '有方大健康集团主视觉'),
    'visual-og': localAsset('visual/og-default.jpg', 'visual/og-default.jpg', '有方大健康分享卡（搜索与社交卡片用）'),
    // 小程序界面截图（750px 网页版；高清原图归档于 归档/源文件/screen-src/）
    'screen-youxiaofang-home': localAsset('screen/youxiaofang-home.png', 'screen/youxiaofang-home.png', '有小方小程序首页'),
    'screen-guyoufang-home': localAsset('screen/guyoufang-home.png', '归档/源文件/screen-src/guyoufang-home.png', '谷有方小程序首页'),
    'screen-guyoufang-brands': localAsset('screen/guyoufang-brands.png', '归档/源文件/screen-src/guyoufang-brands.png', '谷有方小程序全部品牌页'),
    'screen-guyoufang-guxiaotui': localAsset('screen/guyoufang-brand-guxiaotui.png', '归档/源文件/screen-src/guyoufang-brand-guxiaotui.png', '谷有方小程序谷小推品牌页'),
    'screen-guyoufang-aixiaowan': localAsset('screen/guyoufang-brand-aixiaowan.png', '归档/源文件/screen-src/guyoufang-brand-aixiaowan.png', '谷有方小程序艾小晚品牌页'),
    'screen-guyoufang-zukangshu': localAsset('screen/guyoufang-brand-zukangshu.png', '归档/源文件/screen-src/guyoufang-brand-zukangshu.png', '谷有方小程序足康树品牌页'),
    'screen-guyoufang-hengqingshu': localAsset('screen/guyoufang-brand-hengqingshu.png', '归档/源文件/screen-src/guyoufang-brand-hengqingshu.png', '谷有方小程序恒青树品牌页'),
    'screen-guyoufang-leguangli': localAsset('screen/guyoufang-brand-leguangli.png', '归档/源文件/screen-src/guyoufang-brand-leguangli.png', '谷有方小程序乐光里品牌页'),
    'screen-guyoufang-naiwan': localAsset('screen/guyoufang-brand-naiwan.png', '归档/源文件/screen-src/guyoufang-brand-naiwan.png', '谷有方小程序奈晚推拿品牌页'),
    'screen-guyoufang-shisixun': localAsset('screen/guyoufang-brand-shisixun.png', '归档/源文件/screen-src/guyoufang-brand-shisixun.png', '谷有方小程序廿肆巡品牌页'),
    // 品牌门店形象（2026-09 更新为 7.31 实拍/全景素材；品牌卡与画廊共用）
    'photo-guxiaotui': localAsset('photo/brand-gu-xiaotui.jpg', '归档/原始素材/vr-frames-20260906/guxiaotui-s01-y90.png', '谷小推门店形象'),
    'photo-aixiaowan': localAsset('photo/brand-ai-xiaowan.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02743-HDR.jpg', '艾小晚门店形象'),
    'photo-zukangshu': localAsset('photo/brand-zu-kang-shu.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02690.jpg', '足康树门店形象'),
    'photo-hengqingshu': localAsset('photo/brand-heng-qing-shu.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/DSC02700.jpg', '恒青树门店形象'),
    'photo-leguangli': localAsset('photo/brand-le-guangli.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02750-HDR.jpg', '乐光里门店形象'),
    'photo-naiwan': localAsset('photo/brand-naiwan.jpg', '归档/原始素材/vr-frames-20260906/naiwan-s01-y90.png', '奈晚推拿门店形象'),
    'photo-shisixun': localAsset('photo/brand-shisixun.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09952.jpg', '廿肆巡门店形象'),
    // 门店效果图（装修方案渲染）
    'store-guxiaotui': localAsset('photo/store-gu-xiaotui-source.png', '归档/原始素材/门店装修效果图', '谷小推门店效果图'),
    'store-aixiaowan': localAsset('photo/store-ai-xiaowan-source.png', '归档/原始素材/门店装修效果图', '艾小晚门店效果图'),
    'store-leguangli': localAsset('photo/store-le-guangli-source.png', '归档/原始素材/门店装修效果图', '乐光里门店效果图'),
    // 门店实拍（原站下载 3 张 + 集团介绍 PDF 品牌页 9 张，2026-08-25）
    'store-guxiaotui-real': localAsset('photo/store-gu-xiaotui-real.jpg', '归档/原始素材/灵枢发布-预览', '谷小推门店实拍'),
    'store-hengqingshu-real-2': localAsset('photo/store-heng-qing-shu-real-2.jpg', '归档/原始素材/集团介绍-提取', '恒青树门店门头'),
    'store-naiwan-real': localAsset('photo/store-naiwan-real.jpg', '归档/原始素材/灵枢发布-预览', '奈晚推拿门店实拍'),
    'store-naiwan-real-3': localAsset('photo/store-naiwan-real-3.jpg', '归档/原始素材/集团介绍-提取', '奈晚推拿门店门头'),
    // 门店实拍 2026-09 高清批次（源：官网素材0906/8.1各门店照片，2026-07-31 实拍）
    'store-guxiaotui-real-4': localAsset('photo/store-gu-xiaotui-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31谷小推/未标题-1.png', '谷小推门店产品陈列区'),
    'store-guxiaotui-real-5': localAsset('photo/store-gu-xiaotui-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31谷小推/DSC02680.jpg', '谷小推新中式 SPA 护理间'),
    'store-guxiaotui-real-6': localAsset('photo/store-gu-xiaotui-real-6.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31谷小推/DSC02678.jpg', '谷小推茶饮台'),
    'store-guxiaotui-real-7': localAsset('photo/store-gu-xiaotui-real-7.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31谷小推/DSC02669.jpg', '谷小推卡座休息区'),
    'store-guxiaotui-real-8': localAsset('photo/store-gu-xiaotui-real-8.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31谷小推/DSC02671.jpg', '谷小推煎药茶饮细节'),
    'store-naiwan-real-4': localAsset('photo/store-naiwan-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31奈晚/DSC02737.jpg', '奈晚推拿店内走廊'),
    'store-naiwan-real-5': localAsset('photo/store-naiwan-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31奈晚/DSC02735.jpg', '奈晚推拿单间'),
    'store-naiwan-real-6': localAsset('photo/store-naiwan-real-6.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31奈晚/DSC02721.jpg', '奈晚推拿多人护理间'),
    'store-naiwan-real-7': localAsset('photo/store-naiwan-real-7.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31奈晚/DSC02728.jpg', '奈晚推拿等候区'),
    'store-hengqingshu-real-7': localAsset('photo/store-heng-qing-shu-real-7.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/5.jpg', '恒青树棋牌活动区'),
    'store-hengqingshu-real-8': localAsset('photo/store-heng-qing-shu-real-8.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/4.jpg', '恒青树活动大厅'),
    'store-hengqingshu-real-9': localAsset('photo/store-heng-qing-shu-real-9.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/2.jpg', '恒青树理疗室'),
    'store-hengqingshu-real-10': localAsset('photo/store-heng-qing-shu-real-10.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/DSC02716.jpg', '恒青树文化墙与休息区'),
    'store-hengqingshu-real-11': localAsset('photo/store-heng-qing-shu-real-11.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31恒青树/3.jpg', '恒青树多功能活动室'),
    'store-aixiaowan-real-1': localAsset('photo/store-ai-xiaowan-real-1.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02740.jpg', '艾小晚前台与产品区'),
    'store-aixiaowan-real-2': localAsset('photo/store-ai-xiaowan-real-2.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02739.jpg', '艾小晚艾灸调理房'),
    'store-aixiaowan-real-3': localAsset('photo/store-ai-xiaowan-real-3.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02741.jpg', '艾小晚艾方灯箱'),
    'store-aixiaowan-real-4': localAsset('photo/store-ai-xiaowan-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02742.jpg', '艾小晚智能艾灸设备'),
    'store-aixiaowan-real-5': localAsset('photo/store-ai-xiaowan-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31艾小晚/DSC02743-HDR.jpg', '艾小晚门店门头'),
    'store-zukangshu-real-1': localAsset('photo/store-zu-kang-shu-real-1.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02694.jpg', '足康树足疗区'),
    'store-zukangshu-real-2': localAsset('photo/store-zu-kang-shu-real-2.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02686.jpg', '足康树前台'),
    'store-zukangshu-real-3': localAsset('photo/store-zu-kang-shu-real-3.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02688.jpg', '足康树单人足疗椅'),
    'store-zukangshu-real-4': localAsset('photo/store-zu-kang-shu-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02696.jpg', '足康树足疗床区'),
    'store-zukangshu-real-5': localAsset('photo/store-zu-kang-shu-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31足康树/DSC02690.jpg', '足康树门店大厅'),
    'store-leguangli-real-1': localAsset('photo/store-le-guangli-real-1.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02655.jpg', '乐光里前台'),
    'store-leguangli-real-2': localAsset('photo/store-le-guangli-real-2.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02618.jpg', '乐光里产品陈列区'),
    'store-leguangli-real-3': localAsset('photo/store-le-guangli-real-3.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02645.jpg', '乐光里头疗护理间'),
    'store-leguangli-real-4': localAsset('photo/store-le-guangli-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02632.jpg', '乐光里吹护工位'),
    'store-leguangli-real-5': localAsset('photo/store-le-guangli-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02659.jpg', '乐光里休息区'),
    'store-leguangli-real-6': localAsset('photo/store-le-guangli-real-6.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/7.31乐光里/DSC02750-HDR.jpg', '乐光里门店门头'),
    'store-shisixun-real-1': localAsset('photo/store-shisixun-real-1.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09880.jpg', '廿肆巡大堂药柜墙'),
    'store-shisixun-real-2': localAsset('photo/store-shisixun-real-2.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09914.jpg', '廿肆巡 SPA 护理间'),
    'store-shisixun-real-3': localAsset('photo/store-shisixun-real-3.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09918.jpg', '廿肆巡双床 SPA 房'),
    'store-shisixun-real-4': localAsset('photo/store-shisixun-real-4.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09930.jpg', '廿肆巡一客一消细节'),
    'store-shisixun-real-5': localAsset('photo/store-shisixun-real-5.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09954.jpg', '廿肆巡茶室'),
    'store-shisixun-real-6': localAsset('photo/store-shisixun-real-6.jpg', '归档/原始素材/官网素材0906/8.1各门店照片/廿肆巡/DSC09847.jpg', '廿肆巡山水墙护理间'),
    // 720° 全景截帧（源：奈晚/谷小推 VR 全景，用于「全景看店」预览）
    'vr-naiwan-1': localAsset('photo/vr-naiwan-1.jpg', '归档/原始素材/vr-frames-20260906/naiwan-s01-y90.png', '奈晚推拿门店前台全景'),
    'vr-naiwan-2': localAsset('photo/vr-naiwan-2.jpg', '归档/原始素材/vr-frames-20260906/naiwan-s04-y90.png', '奈晚推拿多人护理间全景'),
    'vr-naiwan-3': localAsset('photo/vr-naiwan-3.jpg', '归档/原始素材/vr-frames-20260906/naiwan-s06-y90.png', '奈晚推拿双床护理间全景'),
    'vr-guxiaotui-1': localAsset('photo/vr-guxiaotui-1.jpg', '归档/原始素材/vr-frames-20260906/guxiaotui-s01-y90.png', '谷小推门店门头全景'),
    'vr-guxiaotui-2': localAsset('photo/vr-guxiaotui-2.jpg', '归档/原始素材/vr-frames-20260906/guxiaotui-s02-y0.png', '谷小推门店前台全景'),
    'vr-guxiaotui-3': localAsset('photo/vr-guxiaotui-3.jpg', '归档/原始素材/vr-frames-20260906/guxiaotui-s03-y180.png', '谷小推产品陈列区全景'),
    // 官方公众号二维码
    'qr-official-wechat': localAsset('qr/official-wechat.jpg', '归档/原始素材/官网素材0906/有方大健康官方公众号.jpg', '有方大健康官方公众号二维码'),
    // 二维码
    'qr-guyoufang': localAsset('qr/qr-guyoufang.jpg', 'qr/qr-guyoufang.jpg', '谷有方小程序码'),
    'qr-youxiaofang': localAsset('qr/qr-youxiaofang.jpg', 'qr/qr-youxiaofang.jpg', '有小方小程序码'),
    'qr-fangxiaojiang': localAsset('qr/fangxiaojiang.jpg', 'qr/fangxiaojiang.jpg', '方小匠小程序码'),
    // 品牌 logo 上下锁定版（图形上+品牌名下）：品牌独立展示位（详情页 hero 标题）用
    'logo-guxiaotui-v': localAsset('logo/guxiaotui-v.png', '归档/源文件/logo-src/guxiaotui-v.png', '谷小推品牌标识'),
    'logo-aixiaowan-v': localAsset('logo/aixiaowan-v.png', '归档/源文件/logo-src/aixiaowan-v.png', '艾小晚品牌标识'),
    'logo-zukangshu-v': localAsset('logo/zukangshu-v.png', '归档/源文件/logo-src/zukangshu-v.png', '足康树品牌标识'),
    'logo-hengqingshu-v': localAsset('logo/hengqingshu-v.png', '归档/源文件/logo-src/hengqingshu-v.png', '恒青树品牌标识'),
    'logo-leguangli-v': localAsset('logo/leguangli-v.png', '归档/源文件/logo-src/leguangli-v.png', '乐光里品牌标识'),
    'logo-naiwan-v': localAsset('logo/naiwan-v.png', '归档/源文件/logo-src/naiwan-v.png', '奈晚推拿品牌标识'),
    'logo-shisixun-v': localAsset('logo/shisixun-v.png', '归档/源文件/logo-src/shisixun-v.png', '廿肆巡品牌标识'),
    // 奈晚推拿门店形态锁定版
    'logo-naiwan-care': localAsset('logo/naiwan-care.png', '归档/源文件/logo-src/naiwan-care.png', '奈晚调理店标识'),
    'logo-naiwan-relax': localAsset('logo/naiwan-relax.png', '归档/源文件/logo-src/naiwan-relax.png', '奈晚舒缓店标识'),
    'logo-naiwan-x': localAsset('logo/naiwan-x.png', '归档/源文件/logo-src/naiwan-x.png', '奈晚 X 店标识'),
    // 集团（有方大健康）logo：方形图标 / 横版
    'logo-group-icon': localAsset('logo/group-icon.png', '归档/源文件/logo-src/group-icon.png', '有方大健康集团图标'),
    'logo-group-wide': localAsset('logo/group-wide.png', '归档/源文件/logo-src/group-wide.png', '有方大健康集团标识'),
    // 品牌 logo（正圆徽章，无文字；方形小槽用）
    'logo-guxiaotui': localAsset('logo/guxiaotui.png', '归档/源文件/logo-src/guxiaotui.png', '谷小推品牌图标'),
    'logo-aixiaowan': localAsset('logo/aixiaowan.png', '归档/源文件/logo-src/aixiaowan.png', '艾小晚品牌图标'),
    'logo-zukangshu': localAsset('logo/zukangshu.png', '归档/源文件/logo-src/zukangshu.png', '足康树品牌图标'),
    'logo-hengqingshu': localAsset('logo/hengqingshu.png', '归档/源文件/logo-src/hengqingshu.png', '恒青树品牌图标'),
    'logo-leguangli': localAsset('logo/leguangli.png', '归档/源文件/logo-src/leguangli.png', '乐光里品牌图标'),
    'logo-naiwan': localAsset('logo/naiwan.png', '归档/源文件/logo-src/naiwan.png', '奈晚推拿品牌图标'),
    'logo-shisixun': localAsset('logo/shisixun.png', '归档/源文件/logo-src/shisixun.png', '廿肆巡品牌图标'),
    // 产品 logo（SVG 横版图形+文字锁定版式）
    'logo-fangxiaojiang': localAsset('logo/fangxiaojiang.svg', '归档/源文件/logo-src/fangxiaojiang.svg', '方小匠产品标识'),
    'logo-guyoufang': localAsset('logo/guyoufang.svg', '归档/源文件/logo-src/guyoufang.svg', '谷有方产品标识'),
    'logo-youxiaofang': localAsset('logo/youxiaofang.svg', '归档/源文件/logo-src/youxiaofang.svg', '有小方产品标识'),
  },
  // 品牌视频注册表（2026-09 新增）：key → 本地 mp4 + 海报帧，
  // 品牌详情页通过 brands[].video 引用 key，about/tzgx 通过 data-video-block 引用 key。
  // 源片：官网素材0906（发布版压缩为 H.264 720p/30fps，faststart；原始 1080p 另行归档）。
  videos: {
    'promo': { src: 'video/promo-3min.mp4', poster: 'video/promo-3min-poster.jpg', title: '有方大健康集团宣传片', alt: '有方大健康集团宣传片视频' },
    'lingshu': { src: 'video/lingshu-2.0.mp4', poster: 'video/lingshu-2.0-poster.jpg', title: '有方灵枢视频 2.0', alt: '有方灵枢数字化平台视频' },
    'brand-guxiaotui': { src: 'video/brand-guxiaotui.mp4', poster: 'video/brand-guxiaotui-poster.jpg', title: '谷小推品牌视频', alt: '谷小推品牌视频' },
    'brand-naiwan': { src: 'video/brand-naiwan.mp4', poster: 'video/brand-naiwan-poster.jpg', title: '奈晚推拿体验片', alt: '奈晚推拿品牌视频' },
    'brand-aixiaowan': { src: 'video/brand-aixiaowan.mp4', poster: 'video/brand-aixiaowan-poster.jpg', title: '艾小晚品牌视频', alt: '艾小晚品牌视频' },
    'brand-leguangli': { src: 'video/brand-leguangli.mp4', poster: 'video/brand-leguangli-poster.jpg', title: '乐光里品牌视频', alt: '乐光里品牌视频', vertical: true },
    'brand-shisixun': { src: 'video/store-shisixun-env.mp4', poster: 'video/store-shisixun-env-poster.jpg', title: '廿肆巡门店环境影像', alt: '廿肆巡品牌视频' },
    'hq-loop': { src: 'video/group-hq-loop.mp4', poster: 'video/group-hq-loop-poster.jpg', title: '集团总部大楼', alt: '有方大健康集团总部大楼影像' },
  },
  // 分享卡（SEO/社交）：og 图通过 build-seo.mjs 注入各页 meta
  ogImageAssetId: 'visual-og',
  // 官方公众号（contact 页展示；与三个小程序入口相互独立）
  officialWechat: { name: '有方大健康官方公众号', qr: 'qr-official-wechat', desc: '关注集团官方公众号，获取品牌动态、门店活动与行业内容。' },
  // 品牌主数据：image / logo 均为素材注册表 ID。
  // 命名口径注意：logo 源文件名为“廿四巡”“月光里”，站点文案沿用“廿肆巡”“乐光里”，
  // 以集团最终确认为准（见 素材/素材清单.md 的命名核对表）。
  brands: [
    {
      slug: 'guxiaotui', name: '谷小推', category: '新中式 SPA', tagHome: '新中式 SPA',
      image: 'photo-guxiaotui', logo: 'logo-guxiaotui', logoVertical: 'logo-guxiaotui-v', screen: 'screen-guyoufang-guxiaotui', accent: 'orange', tagline: '服务空间与体验表达', video: 'brand-guxiaotui',
      copyHome: '以舒适、专业的服务体验为核心，面向社区与商圈场景，帮助经营者理解门店定位和建店路径。',
      copyCard: '以舒适、专业的服务体验为核心，关注空间表达和到店感受。',
      copyShort: '关注服务体验和空间表达。',
      scene: '适合关注空间体验、服务细节和社区与商圈到店场景的经营者。',
      store: '从门头、动线到服务流程，先把体验落到一间可被理解的门店。',
      support: '围绕品牌理解、建店筹备、岗位训练和开业后的经营协同展开。',
      points: ['空间表达与服务体验', '社区与商圈场景理解', '开业前岗位训练与日常复盘'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟谷小推需要多少启动资金？', a: '具体预算与所在城市、物业条件、空间面积及装修方案有关。选址通过评估后，总部会给出分项投入测算。' },
      { q: '谷小推适合开在什么样的商圈？', a: '品牌主要面向年轻上班族，适合写字楼集中区、年轻社区、商业街区或生活方式业态丰富的商场周边，总部会结合目标客群与租售比进行评估。' },
      { q: '没有 SPA 或推拿经验可以经营吗？', a: '可以。总部会提供按摩 SPA 项目、服务流程、客户接待、门店管理和内容营销等培训，并协助加盟商搭建符合品牌标准的服务团队。' },
      { q: '护理产品和门店物料从哪里采购？', a: '核心护理产品、消耗品和品牌物料由总部供应链统一提供，并给出采购与库存建议，以保证不同门店的服务品质和品牌体验一致。' },
      { q: '总部会协助招聘和开业吗？', a: '总部会提供岗位配置、招聘画像、培训考核和开业执行方案，加盟商负责当地人员招聘与日常管理，督导团队会协助完成开业前验收。' },
      { q: '新店如何获取第一批顾客？', a: '开业前会结合本地生活平台、社交内容、社群和周边异业合作制定预热方案，开业后根据到店、复购和会员数据持续调整活动。' },
      ],
    },
    {
      slug: 'aixiaowan', name: '艾小晚', category: '艾灸推拿', tagHome: '家门口的智慧艾灸调理小馆',
      image: 'photo-aixiaowan', logo: 'logo-aixiaowan', logoVertical: 'logo-aixiaowan-v', screen: 'screen-guyoufang-aixiaowan', accent: 'red', tagline: '家门口的健康服务', video: 'brand-aixiaowan',
      copyHome: '以温和、清晰的消费场景，连接门店体验、服务交付和运营支持，让健康服务更容易被理解。',
      copyCard: '围绕家门口的健康服务，连接服务流程、社区触达和日常经营。',
      copyShort: '关注家门口的健康服务。',
      scene: '适合关注家庭、社区和日常健康服务场景的经营者。',
      store: '用温和、清晰的空间和服务表达，让用户更容易理解到店体验。',
      support: '从品牌与服务理解，到门店筹备、岗位训练和持续运营协同。',
      points: ['家门口的服务触达', '艾灸推拿流程理解', '社区经营与客户反馈'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟艾小晚需要多少启动资金？', a: '实际费用会因城市、铺位面积、消防及通风条件、设备数量和装修基础而变化，以门店评估后的预算为准。' },
      { q: '没有艾灸基础可以加盟吗？', a: '可以。总部会围绕艾灸基础、设备操作、服务流程、顾客沟通、安全规范和门店运营开展培训，相关岗位通过考核再正式上岗。' },
      { q: '门店对物料和通风有什么要求？', a: '选址时需要重点评估面积布局、电力、排烟通风、消防及周边客群等条件。总部会提供物业勘察清单，并在签约前协助判断铺位适配度。' },
      { q: '智能艾灸设备和耗材如何配置？', a: '总部会根据门店面积和服务工位制定设备方案，核心设备、艾制品及品牌耗材统一标准采购，并提供使用、保养和库存管理指导。' },
      { q: '一家店需要多少人运营？', a: '人员数量取决于工位数和营业时间，通常需要门店负责人、调理服务人员及接待岗位。总部会提供组织配置和排班模型供加盟商参考。' },
      { q: '总部是否提供持续运营支持？', a: '开业后可获得督导巡店、活动策划、会员运营、线上推广、供应链补货和经营复盘等支持，帮助门店逐步建立稳定的到店与复购。' },
      ],
    },
    {
      slug: 'zukangshu', name: '足康树', category: '修脚足疗', tagHome: '一家人想去的足疗修脚店',
      image: 'photo-zukangshu', logo: 'logo-zukangshu', logoVertical: 'logo-zukangshu-v', screen: 'screen-guyoufang-zukangshu', accent: 'gold', tagline: '轻松、熟悉的社区体验',
      copyHome: '聚焦日常足部护理与放松体验，适合用清晰的门店空间和服务流程建立熟悉感。',
      copyCard: '关注家庭和社区的日常放松，用清晰的服务流程建立熟悉感。',
      copyShort: '关注家庭和社区的日常放松。',
      scene: '适合关注高频日常服务、家庭客群和社区门店场景的经营者。',
      store: '以易理解、易抵达的门店表达承接日常足部护理与放松体验。',
      support: '围绕服务流程、店内岗位、开业准备和问题反馈提供阶段支持。',
      points: ['家庭与社区场景', '服务流程与岗位配合', '日常经营反馈与复盘'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟足康树需要多少启动资金？', a: '实际费用与城市、铺位面积、工位数量、上下水条件和装修基础相关，最终以选址评估及预算清单为准。' },
      { q: '没有修脚或足疗经验能加盟吗？', a: '可以。总部会提供足部护理、基础修脚、足疗服务、安全卫生、顾客接待和门店运营培训，服务岗位完成考核后方可上岗。' },
      { q: '足康树适合开在什么位置？', a: '优先选择常住人口稳定的中大型社区、成熟生活街区或社区型商场周边，门店需要兼顾面积、到店便利性和合理租售比。' },
      { q: '门店卫生和工具消毒如何管理？', a: '总部会提供服务工具、清洁消毒、耗材使用和环境卫生等标准流程，并通过培训、日常记录与运营检查帮助门店持续执行。' },
      { q: '一家门店需要配置哪些岗位？', a: '通常包含店长、足疗或修脚服务人员和前台接待，具体人数按工位、营业时间与预计客流配置，总部会提供岗位职责和排班建议。' },
      { q: '开业后总部有哪些经营支持？', a: '总部会提供开业活动、社区推广、团购平台运营、会员维护、供应链补货和经营数据复盘等支持，协助门店提升到店与复购。' },
      ],
    },
    {
      slug: 'hengqingshu', name: '恒青树', category: '社区生活服务', tagHome: '新银龄社区生活俱乐部',
      image: 'photo-hengqingshu', logo: 'logo-hengqingshu', logoVertical: 'logo-hengqingshu-v', screen: 'screen-guyoufang-hengqingshu', accent: 'ghost', tagline: '连接家庭与长者',
      copyHome: '围绕社区长者和家庭健康服务，提供从空间表达，到服务协同和运营入口的完整视角。',
      copyCard: '围绕家庭与长者的社区健康服务，关注长期关系和日常协同。',
      copyShort: '关注家庭与长者的社区健康服务。',
      scene: '适合关注社区关系、家庭服务和长期运营的经营者。',
      store: '通过舒适、可参与的空间和活动表达，连接社区日常生活。',
      support: '重点关注服务设计、团队训练、社区触达和运营问题协同。',
      points: ['家庭与长者服务场景', '社区触达与活动协同', '长期关系和阶段复盘'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟恒青树需要多少启动资金？', a: '具体预算会根据城市、社区位置、活动空间、服务功能和装修条件测算，以总部完成项目评估后的方案为准。' },
      { q: '恒青树主要服务哪些人群？', a: '品牌主要面向社区新银龄与中老年居民，通过文化娱乐、健康养生和居家照护等内容，打造日常可参与、可社交的社区生活空间。' },
      { q: '门店选址需要满足什么条件？', a: '适合老年人口相对集中、步行可达且公共交通便利的成熟社区。选址时还会评估楼层、无障碍通行、消防安全、活动空间和周边配套。' },
      { q: '没有养老服务经验可以加盟吗？', a: '可以，总部会提供话术服务、安全管理、活动组织、健康项目、会员沟通和门店运营等培训，涉及专业服务的岗位需按要求配备合格人员。' },
      { q: '课程和社区活动由谁策划？', a: '总部会提供课程方向、活动模板、节日主题与组织流程，门店可结合当地居民兴趣和社区资源进行落地，并持续收集反馈优化内容。' },
      { q: '如何保障中老年顾客的服务安全？', a: '门店会执行顾客信息登记、服务前沟通、场地巡检、突发情况处理和岗位操作规范；具体健康服务仍需根据顾客实际情况审慎开展。' },
      ],
    },
    {
      slug: 'leguangli', name: '乐光里', category: '头疗洗护', tagHome: '头疗洗护',
      image: 'photo-leguangli', logo: 'logo-leguangli', logoVertical: 'logo-leguangli-v', screen: 'screen-guyoufang-leguangli', accent: 'orange', tagline: '用空间创造放松感', video: 'brand-leguangli',
      copyHome: '以舒适空间、自然材质和放松体验，呈现更容易被感知的到店服务。',
      copyCard: '以舒适空间和放松体验为核心，关注服务交付和到店感知。',
      copyShort: '关注舒适空间与服务交付。',
      scene: '适合关注空间氛围、服务体验和品质到店场景的经营者。',
      store: '用自然材质、空间动线和服务节奏，形成容易被感知的放松体验。',
      support: '围绕空间使用、服务标准、开业训练和持续经营反馈推进。',
      points: ['舒适空间与服务节奏', '头疗洗护流程理解', '开业训练和体验复盘'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟乐光里需要多少启动资金？', a: '具体投入与城市、门店面积、护理房数量、设备和装修方案相关，总部会在铺位确认后提供详细预算。' },
      { q: '没有美容或头疗经验可以加盟吗？', a: '可以。总部会提供皮肤护理、面部清洁、精油使用、服务礼仪、客户管理和门店经营等课程，并通过实操考核保障服务标准。' },
      { q: '乐光里适合开在什么位置？', a: '适合品质女性客群和年轻消费人群集中的社区商业、购物中心或生活方式街区。总部会综合客群、动线、竞品与租金进行选址分析。' },
      { q: '护理产品和仪器由总部提供吗？', a: '总部会提供符合品牌标准的护理产品、专业工具、设备及空间软装建议，核心物料通过统一供应链采购，方便门店保持一致的护理体验。' },
      { q: '总部是否协助打造门店氛围？', a: '会。总部会提供空间设计规范、音乐香氛、灯光软装和服务动线建议，并在施工与开业验收阶段协助门店落实品牌体验。' },
      { q: '开业后如何做会员复购？', a: '总部会围绕护理周期、项目组合、会员权益和私域触达提供运营方案，门店可根据顾客需求制定持续护理计划并跟进到店反馈。' },
      ],
    },
    {
      slug: 'naiwan', name: '奈晚推拿', category: '东方推拿', tagHome: '东方推拿',
      image: 'photo-naiwan', logo: 'logo-naiwan', logoVertical: 'logo-naiwan-v',
      storeForms: [{ logo: 'logo-naiwan-care', label: '调理店' }, { logo: 'logo-naiwan-relax', label: '舒缓店' }, { logo: 'logo-naiwan-x', label: '奈晚X' }], screen: 'screen-guyoufang-naiwan', accent: 'red', tagline: '更细致的日常照护', video: 'brand-naiwan',
      copyHome: '以细致服务、安静空间和东方气质，形成有辨识度的日常照护体验。',
      copyCard: '以细致服务、安静空间和东方气质，形成日常照护体验。',
      copyShort: '关注细致服务与日常照护体验。',
      scene: '适合关注专业服务、安静体验和日常照护场景的经营者。',
      store: '通过克制的空间表达和稳定的服务流程，建立长期到店体验。',
      support: '重点支持服务理解、岗位训练、开业准备和客户反馈协同。',
      points: ['东方气质与空间表达', '服务细节与岗位训练', '客户反馈和持续改进'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟奈晚推拿需要多少启动资金？', a: '实际投入会受到城市级别、商圈租金、门店面积和装修条件影响。总部完成选址与门店评估后，会提供对应的投资测算方案。' },
      { q: '没有推拿行业经验也可以加盟吗？', a: '可以。总部会提供推拿项目、服务流程、门店管理和营销运营等系统培训，加盟商通过培训考核后再进入开业筹备阶段。' },
      { q: '奈晚推拿门店适合开在哪里？', a: '优先考虑年轻客群集中、生活配套成熟的核心商圈或中大型社区。总部会结合客流、消费能力、竞品和租金水平进行选址评估。' },
      { q: '门店通常需要配置多少名员工？', a: '人员配置会根据门店面积、房间数量和营业时段确定，通常包含店长与推拿技师。总部会在开业前提供岗位和排班建议。' },
      { q: '从签约到开业大约需要多久？', a: '筹备周期取决于选址确认、设计施工、人员招聘与培训进度，可按总部提供的开店计划表推进，具体时间以实际项目排期为准。' },
      { q: '开业后总部还会提供哪些支持？', a: '总部会持续提供门店运营指导、活动策划、线上获客、供应链服务和经营数据复盘，并根据门店实际情况协助优化项目与服务流程。' },
      ],
    },
    {
      slug: 'shisixun', name: '廿肆巡', category: '健康生活服务', tagHome: '健康生活服务',
      image: 'photo-shisixun', logo: 'logo-shisixun', logoVertical: 'logo-shisixun-v', screen: 'screen-guyoufang-shisixun', accent: 'ghost', tagline: '城市门店与经营协同方向', video: 'brand-shisixun',
      copyHome: '围绕城市生活服务场景，探索更清晰的门店表达与经营协同方式。',
      copyCard: '围绕城市生活服务场景，探索清晰的门店表达和经营协同。',
      copyShort: '关注城市门店与经营协同方向。',
      scene: '适合关注城市生活、服务协同和新门店场景探索的经营者。',
      store: '围绕真实城市需求，把服务入口、空间表达和经营动作串联起来。',
      support: '通过阶段训练、开店协同和运营反馈，帮助经营者理解下一步。',
      points: ['城市生活服务场景', '门店表达与服务入口', '阶段训练和经营协同'],
      // 常见问题：逐字采集自谷有方商家小程序文案逐字稿；费用/周期数字未上官网（规范 §14）
      faq: [
      { q: '加盟廿肆巡需要多少启动资金？', a: '门店包含 SPA、食养与沉浸式空间体验，实际投入会受到城市、面积、房间数量、设备和装修标准影响。' },
      { q: '廿肆巡适合布局在哪类商圈？', a: '品牌面向中高端客群，适合高品质购物中心、城市核心商圈、高端社区或精品酒店周边。总部会重点评估消费能力、私密性、停车与到店便利程度。' },
      { q: 'SPA 与食养项目如何落地？', a: '总部会按节气与服务场景提供项目体系、操作流程、食养搭配、顾客咨询和门店执行标准，并结合当地经营条件确定具体上线内容。' },
      { q: '总部提供哪些人才培训？', a: '培训覆盖 SPA 手法、服务礼仪、体质沟通、食养知识、顾客管理、店务运营和安全规范，关键岗位需完成理论与实操考核。' },
      { q: '空间设计必须使用统一方案吗？', a: '门店需遵循品牌的宋唐美学、功能分区与服务动线标准。总部会根据实际物业条件出具设计建议，并在施工节点和开业前进行验收。' },
      { q: '总部如何支持高端会员运营？', a: '总部会提供会员分层、节气主题活动、项目组合、预约服务和客户维护建议，帮助门店围绕体验、到店频次与长期关系开展精细化运营。' },
      ],
    },
  ].sort((a, b) => BRAND_ORDER.indexOf(a.slug) - BRAND_ORDER.indexOf(b.slug)),
  // 门店实拍二级页（mdzs/<slug>.html）：七品牌全覆盖（2026-09 高清实拍批次）。
  // copy 沿用《集团介绍》口径；photos 为素材注册表 ID；vr 为 720° 全景入口（外链 + 截帧预览）。
  storeGallery: {
    guxiaotui: {
      name: '谷小推', kicker: '新中式 SPA', back: 'mdzs.html',
      copy: '谷小推，将推拿、SPA和新中式轻养生方式融合一体，通过空间体验设计、中医药文化融入、大健康产品打造和标准化的服务设计，让城市年轻人有了养生体验与社交空间相结合的休闲新选择。谷小推始于山西太原，围绕年轻上班族的工作与生活圈开设直营门店，并逐渐开展加盟连锁，成为小红书里的“网红门店”之一，引得争相模仿。',
      vr: {
        url: 'https://vr.justeasy.cn/view/1763l6v888k2n188-1775805609.html',
        title: '谷小推 100 平店型',
        summary: '对应官方「谷小推100平店型」VR 页面，拖动即可查看大厅、前台与新中式 SPA 空间。',
        preview: { id: 'vr-guxiaotui-1' },
        shots: [{ id: 'vr-guxiaotui-1' }, { id: 'vr-guxiaotui-2' }, { id: 'vr-guxiaotui-3' }],
      },
      photos: [
        { id: 'store-guxiaotui-real', caption: '新中式 SPA 门头与入口现场' },
        { id: 'store-guxiaotui-real-4', caption: '门店产品陈列区' },
        { id: 'store-guxiaotui-real-5', caption: '新中式 SPA 护理间' },
        { id: 'store-guxiaotui-real-6', caption: '门店茶饮台' },
        { id: 'store-guxiaotui-real-7', caption: '卡座休息区' },
        { id: 'store-guxiaotui-real-8', caption: '煎药茶饮细节' },
      ],
    },
    aixiaowan: {
      name: '艾小晚', kicker: '家门口的智慧艾灸调理小馆', back: 'mdzs.html',
      copy: '艾小晚，以“艾护一生”为主张的智慧艾灸调理小馆，围绕颈肩腰腿易疲劳人群与亚健康调理需求，把智能艾灸设备、标准艾方与清晰服务流程组合成家门口就能理解的艾灸体验，让艾灸调理融入社区日常生活。',
      photos: [
        { id: 'store-aixiaowan-real-5', caption: '「艾小晚｜艾灸·推拿」门头' },
        { id: 'store-aixiaowan-real-1', caption: '前台与产品区' },
        { id: 'store-aixiaowan-real-2', caption: '艾灸调理房' },
        { id: 'store-aixiaowan-real-3', caption: '艾方项目灯箱' },
        { id: 'store-aixiaowan-real-4', caption: '智能艾灸设备' },
      ],
    },
    zukangshu: {
      name: '足康树', kicker: '一家人想去的足疗修脚店', back: 'mdzs.html',
      copy: '足康树，聚焦日常足部护理与放松体验的足疗修脚店，以清晰的服务流程、整洁的门店空间和轻松熟悉的社区氛围，服务家庭客群与社区邻里，让足疗修脚成为一家人都愿意常来的日常选择。',
      photos: [
        { id: 'store-zukangshu-real-5', caption: '门店大厅与品牌墙' },
        { id: 'store-zukangshu-real-1', caption: '足疗服务区' },
        { id: 'store-zukangshu-real-2', caption: '前台与陈列区' },
        { id: 'store-zukangshu-real-3', caption: '单人足疗沙发' },
        { id: 'store-zukangshu-real-4', caption: '足疗床区' },
      ],
    },
    hengqingshu: {
      name: '恒青树', kicker: '新银龄社区生活俱乐部', back: 'mdzs.html',
      copy: '恒青树，基于社区的新银龄生活俱乐部，为中老年人提供“文化娱乐+健康养生+居家照护”为一体的社区综合养老服务。恒青树将提供声乐、舞蹈、养生知识等丰富的线上与线下课程，为养老生活增添乐趣；提供专业的推拿、足浴等养生理疗服务，为老年人解除健康困扰；并打造整洁、安全的社交活动空间，提升老年人的精神满足。',
      photos: [
        { id: 'store-hengqingshu-real-2', caption: '「恒青树｜社区生活俱乐部」门头' },
        { id: 'store-hengqingshu-real-7', caption: '前台与品牌墙' },
        { id: 'store-hengqingshu-real-8', caption: '活动大厅' },
        { id: 'store-hengqingshu-real-11', caption: '多功能活动室' },
        { id: 'store-hengqingshu-real-10', caption: '文化墙与休息区' },
        { id: 'store-hengqingshu-real-9', caption: '理疗室' },
      ],
    },
    leguangli: {
      name: '乐光里', kicker: '头疗舒压 · 焕颜护理', back: 'mdzs.html',
      copy: '乐光里（LuuNaa），以头疗舒压与焕颜护理为核心的洗护品牌，用舒适空间、自然材质和放松的服务节奏，为都市客群提供一段容易被感知的到店体验，让头疗洗护成为日常自我关照的一部分。',
      photos: [
        { id: 'store-leguangli-real-6', caption: '乐光里门店门头' },
        { id: 'store-leguangli-real-1', caption: '前台与品牌标识' },
        { id: 'store-leguangli-real-2', caption: '产品陈列区' },
        { id: 'store-leguangli-real-3', caption: '头疗护理间' },
        { id: 'store-leguangli-real-4', caption: '吹护工位' },
        { id: 'store-leguangli-real-5', caption: '休息区' },
      ],
    },
    naiwan: {
      name: '奈晚推拿', kicker: '年轻人的推拿小馆', back: 'mdzs.html',
      copy: '奈晚推拿，为用户提供技术专业、环境整洁、安全贴心、高性价比的服务，让推拿理疗成为当代年轻人的养生新潮流。主打“一季一方，草木热敷”的品项设计理念，针对当代年轻人的亚健康问题，提供一年四季不同的养生解决方案。奈晚推拿始于重庆，围绕城市核心商圈和年轻人集中的大社区开展连锁服务，目前已经是全国领先的连锁推拿养生服务品牌。',
      vr: {
        url: 'https://vr.justeasy.cn/view/199075x156j08y54-1758796692.html',
        title: '奈晚推拿 80 平米 10 床形象店',
        summary: '对应官方「奈晚推拿-品牌优质形象店（80平米10床）」VR 页面，在线查看门头、前台与护理空间。',
        preview: { id: 'vr-naiwan-1' },
        shots: [{ id: 'vr-naiwan-1' }, { id: 'vr-naiwan-2' }, { id: 'vr-naiwan-3' }],
      },
      photos: [
        { id: 'store-naiwan-real-3', caption: '「奈晚推拿」门头招牌现场' },
        { id: 'store-naiwan-real-4', caption: '店内走廊' },
        { id: 'store-naiwan-real-5', caption: '推拿单间' },
        { id: 'store-naiwan-real-6', caption: '多人护理间' },
        { id: 'store-naiwan-real-7', caption: '等候区' },
        { id: 'store-naiwan-real', caption: '推拿门头与开店现场' },
      ],
    },
    shisixun: {
      name: '廿肆巡', kicker: 'SPA · 食养 · 沉浸式空间', back: 'mdzs.html',
      copy: '廿肆巡，以宋唐美学为空间底色的健康生活服务品牌，融合 SPA、节气食养与沉浸式空间体验，为城市中高端客群提供安静、私密、有文化气质的到店旅程，探索城市门店与服务协同的新方向。',
      photos: [
        { id: 'store-shisixun-real-1', caption: '大堂药柜墙' },
        { id: 'store-shisixun-real-6', caption: '山水墙护理间' },
        { id: 'store-shisixun-real-2', caption: 'SPA 护理间' },
        { id: 'store-shisixun-real-3', caption: '双床 SPA 房' },
        { id: 'store-shisixun-real-5', caption: '茶室' },
        { id: 'store-shisixun-real-4', caption: '一客一消服务细节' },
      ],
    },
  },
};
