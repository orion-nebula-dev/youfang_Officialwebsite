// 首页配置（单一数据源 P1 拆分，见 官网首页开发规范.md §5.3/§6.1）。
// - 只保存内容与素材语义 ID，不保存文件路径；素材由 SITE_DATA.assets 解析。
// - index.html 的骨架保留同文静态回退（无 JS 时主标题仍可读，规范 §11），
//   本配置是唯一的文案维护入口，改首页内容只改这里。
// - sections 控制「显示什么、按什么顺序显示」；未列出的区块不渲染。
const HOME_CONFIG = {
  schemaVersion: 1,
  hero: {
    title: '专注大健康消费领域的产业运营与投资孵化',
    summary: '让健康有方成为生活习惯。赋能十万个体创业者开设十万家门店，创造十万可传承的家业。',
    bgAssetId: 'hero-mountain',
    primaryAction: { label: '了解加盟', href: 'zsjm.html' },
    secondaryAction: { label: '查看品牌', href: 'brands/index.html' },
  },
  scale: {
    eyebrow: 'GROUP SCALE',
    title: '集团全国组织及运营分布',
    items: [
      { value: 5, unit: '大', label: '区域总部' },
      { value: 20, unit: '大', label: '运营中心', sub: '师夫子校区 & 健康英才服务中心' },
      { value: 700, unit: '+', label: '全职员工' },
      { value: 15000, unit: 'm²+', label: '办公面积', format: true },
    ],
  },
  capabilities: {
    eyebrow: 'GROUP CAPABILITY',
    title: '集团三大核心板块',
    segments: [
      { no: '01', title: '运营管理', copy: '专注大健康消费产业运营管理：涵盖线下养生门店连锁经营、大健康产品研发与供应链、教育与人才服务、线上流量运营和数智化系统研发与服务。' },
      { no: '02', title: '投资孵化', copy: '专注大健康消费领域投资孵化：有方资本布局养生门店投资与银发产业投资两大板块，构建多方共赢的养生门店生态体系，破解中国养老服务难题。' },
      { no: '03', title: '公益扶持', copy: '心容公益基金会作为 3A 级社会组织，聚焦「助幼、敬老、扶弱」三大公益领域，探索助力「幼、老、弱」人群的社会公益实践。' },
    ],
    ecosystemEyebrow: 'BUSINESS ECOSYSTEM',
    ecosystemTitle: '六大业务板块协同',
    ecosystem: [
      { no: '01', title: '养生门店业务', copy: '奈晚推拿 · 谷小推 · 艾小晚 · 足康树 · 乐光里 · 廿肆巡' },
      { no: '02', title: '养老服务业务', copy: '方邸银龄：恒青树（新银龄社区生活俱乐部）· 乐家介护（居家养老服务运营商）' },
      { no: '03', title: '教育与人才业务', copy: '师夫子（大健康职业教育）· 健康英才（人力资源一站式方案）· 良年创商院（创业商学院）' },
      { no: '04', title: '数字智能中台', copy: '本数科技 · 灵枢：大健康门店全场景数智化系统' },
      { no: '05', title: '全域流量中台', copy: '有方传媒：本地传媒（本地生活运营）· 流方百视（大健康 MCN）' },
      { no: '06', title: '产品与建店中台', copy: '本草生方（养生产品）· 本果供应链 · 果创空间（一站式建店交付）' },
    ],
  },
  journey: {
    eyebrow: 'STORE JOURNEY',
    title: '招商、建店、运营，三阶段清晰推进',
    summary: '三阶段为概念流程，具体节点、费用、时长、城市政策和合同规则以业务确认版本为准。',
  },
  mission: {
    eyebrow: 'MISSION & VISION',
    title: '让健康有方成为生活习惯',
    items: [
      { no: '01', title: '十万门店的家业', copy: '赋能十万个体创业者开设十万家门店，创造十万可传承的家业。' },
      { no: '02', title: '令人尊敬的就业', copy: '帮助十万盲人和百万健全人接受教育，实现令人尊敬的就业。' },
      { no: '03', title: '中医药文化传播', copy: '面向一亿家庭传播中医药文化，解决数亿人群的健康养生问题。' },
      { no: '04', title: '全球知名平台', copy: '成为全球知名的全产业链生态型大健康产业运营和投资孵化平台。' },
    ],
  },
  cta: {
    eyebrow: 'OFFICIAL CONSULTATION',
    title: '下一步，从一次官方咨询开始',
    copy: '官方咨询电话 400-008-0629。留下你的城市与门店计划，官方团队会与你联系。',
    primary: { label: '预约官方咨询', href: 'zsjm.html#consult' },
    secondary: { label: '拨打 400-008-0629', href: 'tel:4000080629' },
  },
  // 区块顺序与可见性：renderHomeSections() 按此重排 index.html 的 section。
  sections: [
    { id: 'scale', visible: true },
    { id: 'brands', visible: true },
    { id: 'stores', visible: true },
    { id: 'capabilities', visible: true },
    { id: 'lingshu', visible: true },
    { id: 'process', visible: true },
    { id: 'mission', visible: true },
    { id: 'cta', visible: true },
  ],
};
