/* 佑小邦运营后台 · 商城管理共享数据模块
 * 商品 / 分类 / 订单的默认数据、localStorage 持久化，
 * 以及与用户端小程序（mall.html / mall-order-detail.html）的数据联动。
 */
(function (w) {
  var PRODUCT_KEY = 'akb_admin_mall_products';
  var CATEGORY_KEY = 'akb_admin_mall_categories';
  var ORDER_KEY = 'akb_admin_mall_orders';
  var MINI_ORDER_KEY = 'ankebang_mall_orders';
  var DIST_KEY = 'akb_admin_mall_distributors';

  /* ── 默认分类（与 mall.html 分类入口一致） ── */
  var DEFAULT_CATEGORIES = [
    { id: 'measure',    name: '健康监测', sort: 1, status: 'on', description: '体温、血压、血糖等家用监测设备' },
    { id: 'care',       name: '照护设备', sort: 2, status: 'on', description: '制氧、雾化、助听等居家照护设备' },
    { id: 'protection', name: '防护用品', sort: 3, status: 'on', description: '口罩等日常防护耗材' },
    { id: 'maternal',   name: '母婴健康', sort: 4, status: 'on', description: '孕期及母婴健康辅助设备' }
  ];

  /* ── 默认商品（与小程序 mall.html 在售商品保持一致，扩展库存/销量/上下架） ── */
  var DEFAULT_PRODUCTS = [
    { id: 'thermometer', name: '电子体温计', sub: '快速测温 · 大屏易读', category: 'measure', price: 39, badge: '居家常备', tone: 'purple', icon: 'thermometer', image: 'assets/mall/thermometer.png', desc: '适合家庭日常体温监测，读数清晰，操作简单。', points: ['测量便捷，适合老人和儿童使用', '蜂鸣提示，读数清晰易辨', '轻巧便携，方便家庭备用'], stock: 128, sales: 356, status: 'on', sort: 1 },
    { id: 'infrared', name: '红外额温枪 / 耳温枪', sub: '非接触测温 · 一机两用', category: 'measure', price: 129, badge: '热销', tone: 'blue', icon: 'infrared', image: 'assets/mall/infrared-thermometer.png', desc: '支持额温与耳温测量，适合照护场景下快速了解体温变化。', points: ['非接触测量，减少交叉接触', '额温、耳温模式可切换', '夜间静音显示，使用更安心'], stock: 86, sales: 214, status: 'on', sort: 2 },
    { id: 'bp', name: '电子血压计', sub: '上臂式无创血压计', category: 'measure', price: 239, badge: '无创监测', tone: 'blue', icon: 'bp', image: 'assets/mall/blood-pressure-monitor.png', desc: '上臂式设计，适合家庭日常血压记录与趋势观察。', points: ['上臂式测量，佩戴更稳定', '大屏显示血压与心率', '支持家庭成员数据记录'], stock: 42, sales: 168, status: 'on', sort: 3 },
    { id: 'glucose', name: '血糖仪 + 血糖试纸', sub: '家用血糖监测套装', category: 'measure', price: 168, badge: '套装', tone: 'green', icon: 'glucose', image: 'assets/mall/glucose-meter.png', desc: '包含血糖仪与配套试纸，满足日常血糖监测需要。', points: ['采血量少，操作步骤清晰', '试纸独立包装，方便保存', '适合建立日常监测记录'], stock: 35, sales: 96, status: 'on', sort: 4 },
    { id: 'oxygen', name: '家用制氧机', sub: '医用级 · 安静运行', category: 'care', price: 1599, badge: '医用级', tone: 'green', icon: 'oxygen', image: 'assets/mall/oxygen-concentrator.png', desc: '用于家庭氧疗场景的辅助设备，具体使用请遵医嘱。', points: ['医用级制氧能力', '运行声音低，适合居家使用', '配备基础雾化接口'], stock: 12, sales: 33, status: 'on', sort: 5 },
    { id: 'nebulizer', name: '家用雾化器', sub: '细雾雾化 · 便携易收纳', category: 'care', price: 199, badge: '轻便', tone: 'purple', icon: 'nebulizer', image: 'assets/mall/nebulizer.png', desc: '适合家庭雾化护理场景，使用药液与频次请遵医嘱。', points: ['雾化颗粒细腻均匀', '操作简单，拆洗方便', '体积小，便于收纳携带'], stock: 58, sales: 120, status: 'on', sort: 6 },
    { id: 'hearing', name: '助听器', sub: '轻巧隐形 · 日常交流辅助', category: 'care', price: 699, badge: '轻巧', tone: 'orange', icon: 'hearing', image: 'assets/mall/hearing-aid.png', desc: '帮助改善部分听力下降人群的日常交流体验，购买前建议先做听力评估。', points: ['轻巧佩戴，适合日常交流', '多档音量调节', '购买前建议进行专业听力评估'], stock: 24, sales: 41, status: 'on', sort: 7 },
    { id: 'mask', name: '医用无菌口罩', sub: '医用外科 / 一次性使用', category: 'protection', price: 29, badge: '防护用品', tone: 'blue', icon: 'mask', image: 'assets/mall/medical-mask.png', desc: '医用外科口罩与一次性使用医用口罩可选，适合日常防护。', points: ['独立鼻梁条，贴合面部', '多层防护结构', '一次性使用，用后及时更换'], stock: 520, sales: 1280, status: 'on', sort: 8 },
    { id: 'fetal', name: '家用胎心仪', sub: '胎心监护 · 孕期辅助', category: 'maternal', price: 299, badge: '母婴健康', tone: 'red', icon: 'fetal', image: 'assets/mall/fetal-monitor.png', desc: '用于孕期家庭胎心声音辅助监测，不能替代产检和医生判断。', points: ['便携机身，操作直观', '声音清晰，方便家属陪伴', '异常情况请及时就医检查'], stock: 30, sales: 52, status: 'on', sort: 9 }
  ];

  /* ── 订单状态模型 ── */
  var STATES = ['待付款', '支付中', '已支付', '待发货', '待收货', '已完成', '退款/售后', '已退款', '已取消'];
  var DELIVERY_LABELS = { instant: '立即送达', runner: '跑腿送达', express: '快递送达' };
  var STATE_FLOW = {
    '待付款': { status: 'payment',   deliveryStatus: 'pending' },
    '支付中': { status: 'payment',   deliveryStatus: 'pending' },
    '已支付': { status: 'shipping',  deliveryStatus: 'processing' },
    '待发货': { status: 'shipping',  deliveryStatus: 'processing' },
    '待收货': { status: 'receiving', deliveryStatus: 'delivered' },
    '已完成': { status: 'done',      deliveryStatus: 'signed' },
    '退款/售后': { status: 'refund', deliveryStatus: 'processing' },
    '已退款': { status: 'cancelled', deliveryStatus: 'cancelled' },
    '已取消': { status: 'cancelled', deliveryStatus: 'cancelled' }
  };
  function flowOf(state) { return STATE_FLOW[state] || STATE_FLOW['待发货']; }

  /* ── 种子订单（含各状态；今日单用于概览演示） ── */
  function item(name, desc, price, qty, image, tone) {
    return { name: name, desc: desc, price: String(price), quantity: qty, image: image, tone: tone || 'purple' };
  }
  function order(no, state, createdAt, date, userName, userPhone, address, deliveryMethod, items, receiptCode, note, dist, meta) {
    meta = meta || {};
    var quantity = items.reduce(function (s, i) { return s + i.quantity; }, 0);
    var amount = items.reduce(function (s, i) { return s + Number(i.price) * i.quantity; }, 0);
    var flow = flowOf(state);
    return {
      no: no,
      state: state,
      status: flow.status,
      deliveryStatus: flow.deliveryStatus,
      createdAt: createdAt,
      date: date,
      userName: userName,
      userPhone: userPhone,
      address: address,
      deliveryMethod: deliveryMethod,
      deliveryLabel: DELIVERY_LABELS[deliveryMethod] || '快递送达',
      receiptCode: receiptCode || '',
      items: items,
      quantity: quantity,
      amount: String(amount),
      note: note || '',
      orderType: meta.orderType || '普通订单',
      payer: meta.payer || userName,
      payerPhone: meta.payerPhone || userPhone,
      creator: meta.creator || '用户自主下单',
      updatedAt: meta.updatedAt || createdAt,
      shipInfo: null,
      distId: dist ? dist.id : '',
      distName: dist ? dist.name : '',
      source: 'admin'
    };
  }

  var SEED_ORDERS = [
    order('AKB-M2026-101601', '支付中', '2026-10-16 09:12:45', '2026-10-16', '王女士', '138****2468', '西安市雁塔区高新路 28 号', 'instant',
      [item('电子体温计', '快速测温 · 大屏易读', 39, 1, 'assets/mall/thermometer.png', 'purple')], '', '用户正在支付，等待支付结果回调。'),
    order('AKB-M2026-101602', '已支付', '2026-10-16 08:05:12', '2026-10-16', '王女士', '138****2468', '西安市雁塔区高新路 28 号', 'runner',
      [item('医用无菌口罩', '医用外科 / 一次性使用', 29, 2, 'assets/mall/medical-mask.png', 'blue')], '7085', ''),
    order('AKB-M2026-101303', '已完成', '2026-10-13 08:40:12', '2026-10-13', '郑女士', '135****0218', '西安市雁塔区电子城街道 12 号', 'runner',
      [item('医用无菌口罩', '医用外科 / 一次性使用', 29, 3, 'assets/mall/medical-mask.png', 'blue')], '6114'),
    order('AKB-M2026-101302', '待收货', '2026-10-13 10:24:46', '2026-10-13', '吴先生', '188****6630', '北京市海淀区中关村南大街 18 号院', 'express',
      [item('电子血压计', '上臂式无创血压计', 239, 1, 'assets/mall/blood-pressure-monitor.png', 'blue')], '3692', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-101301', '待发货', '2026-10-13 09:12:05', '2026-10-13', '周女士', '137****4521', '北京市朝阳区望京西园三区 5 号楼', 'instant',
      [item('红外额温枪 / 耳温枪', '非接触测温 · 一机两用', 129, 1, 'assets/mall/infrared-thermometer.png', 'blue')], '8350'),
    order('AKB-M2026-101305', '待发货', '2026-10-13 08:40:12', '2026-10-13', '郑先生', '159****7712', '上海市浦东新区张杨路 500 号 8 号楼', 'express',
      [item('家用制氧机', '医用级 · 安静运行', 1599, 1, 'assets/mall/oxygen-concentrator.png', 'green')], '6138', '', { id: 'D1002', name: '陈先生' }),
    order('AKB-M2026-101205', '待付款', '2026-10-12 20:15:33', '2026-10-12', '王女士', '138****2468', '西安市雁塔区高新路 28 号', 'instant',
      [item('电子体温计', '快速测温 · 大屏易读', 39, 1, 'assets/mall/thermometer.png', 'purple')], '7264', '用户下单后未完成支付，已发送支付提醒。'),
    order('AKB-M2026-101118', '待发货', '2026-10-11 15:48:20', '2026-10-11', '赵阿姨', '186****3016', '北京市东城区安定门外大街 88 号', 'runner',
      [item('血糖仪 + 血糖试纸', '家用血糖监测套装', 168, 1, 'assets/mall/glucose-meter.png', 'green'),
       item('医用无菌口罩', '医用外科 / 一次性使用', 29, 1, 'assets/mall/medical-mask.png', 'blue')], '4907', '', { id: 'D1002', name: '陈先生' }),
    order('AKB-M2026-101007', '退款/售后', '2026-10-10 11:05:58', '2026-10-10', '孙大爷', '158****5509', '北京市西城区复兴门内大街 60 号', 'express',
      [item('助听器', '轻巧隐形 · 日常交流辅助', 699, 1, 'assets/mall/hearing-aid.png', 'orange')], '2048', '用户反馈佩戴不适，申请七天无理由退货，待客服审核。'),
    order('AKB-M2026-100912', '已完成', '2026-10-09 14:22:09', '2026-10-09', '李女士', '139****8572', '北京市海淀区学院路 15 号院', 'runner',
      [item('家用雾化器', '细雾雾化 · 便携易收纳', 199, 1, 'assets/mall/nebulizer.png', 'purple')], '5826', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-100830', '已完成', '2026-10-08 16:30:41', '2026-10-08', '刘先生', '177****9183', '西安市高新区锦业路 69 号', 'express',
      [item('医用无菌口罩', '医用外科 / 一次性使用', 29, 2, 'assets/mall/medical-mask.png', 'blue')], '9031'),
    order('AKB-M2026-100760', '已取消', '2026-10-07 09:18:27', '2026-10-07', '马女士', '133****7742', '北京市丰台区方庄芳城园 3 区', 'express',
      [item('家用胎心仪', '胎心监护 · 孕期辅助', 299, 1, 'assets/mall/fetal-monitor.png', 'red')], '1593', '超时未支付，系统自动取消。'),

    /* ── 刘姐（D1001）名下分销订单：扫码进群客户下单，自动归属并计佣 ── */
    order('AKB-M2026-101304', '已完成', '2026-10-13 11:05:40', '2026-10-13', '陈女士', '136****7712', '西安市雁塔区紫薇花园 6 号楼', 'instant',
      [item('医用无菌口罩', '医用外科 / 一次性使用', 29, 2, 'assets/mall/medical-mask.png', 'blue'),
       item('电子体温计', '快速测温 · 大屏易读', 39, 1, 'assets/mall/thermometer.png', 'purple')], '4820', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-101203', '待收货', '2026-10-12 16:40:18', '2026-10-12', '高先生', '150****3320', '西安市雁塔区科技二路 77 号', 'express',
      [item('血糖仪 + 血糖试纸', '家用血糖监测套装', 168, 1, 'assets/mall/glucose-meter.png', 'green')], '7315', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-101119', '已完成', '2026-10-11 10:32:55', '2026-10-11', '郭阿姨', '187****9054', '西安市雁塔区明德门小区 3 号楼', 'runner',
      [item('医用无菌口罩', '医用外科 / 一次性使用', 29, 5, 'assets/mall/medical-mask.png', 'blue')], '2684', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-101008', '待付款', '2026-10-10 19:22:07', '2026-10-10', '韩女士', '132****6641', '西安市雁塔区电子正街 26 号', 'instant',
      [item('电子体温计', '快速测温 · 大屏易读', 39, 2, 'assets/mall/thermometer.png', 'purple')], '5539', '', { id: 'D1001', name: '刘姐' }),

    /* ── 待付款演示订单 ── */
    order('AKB-M2026-101603', '待付款', '2026-10-16 10:32:18', '2026-10-16', '刘女士', '152****8890', '西安市雁塔区小寨东路 126 号', 'instant',
      [item('家用雾化器', '细雾雾化 · 便携易收纳', 199, 1, 'assets/mall/nebulizer.png', 'purple')], '', '用户下单后未完成支付，已发送支付提醒。'),
    order('AKB-M2026-101604', '待付款', '2026-10-16 11:05:47', '2026-10-16', '张先生', '139****2205', '北京市朝阳区建国路 89 号 3 号楼', 'express',
      [item('血糖仪 + 血糖试纸', '家用血糖监测套装', 168, 1, 'assets/mall/glucose-meter.png', 'green'),
       item('电子体温计', '快速测温 · 大屏易读', 39, 1, 'assets/mall/thermometer.png', 'purple')], '', ''),
    order('AKB-M2026-101605', '待付款', '2026-10-16 13:41:02', '2026-10-16', '陈女士', '186****5531', '上海市静安区南京西路 1266 号 40 层', 'runner',
      [item('助听器', '轻巧隐形 · 日常交流辅助', 699, 1, 'assets/mall/hearing-aid.png', 'orange')], '', '', { id: 'D1002', name: '陈先生' }),
    order('AKB-M2026-100913', '已完成', '2026-10-09 09:15:31', '2026-10-09', '杨大爷', '186****2287', '西安市碑林区南大街 41 号', 'express',
      [item('家用雾化器', '细雾雾化 · 便携易收纳', 199, 1, 'assets/mall/nebulizer.png', 'purple'),
       item('医用无菌口罩', '医用外科 / 一次性使用', 29, 2, 'assets/mall/medical-mask.png', 'blue')], '8451', '', { id: 'D1001', name: '刘姐' }),
    order('AKB-M2026-100831', '退款/售后', '2026-10-08 14:50:12', '2026-10-08', '曹女士', '155****8833', '西安市新城区长乐西路 10 号', 'express',
      [item('红外额温枪 / 耳温枪', '非接触测温 · 一机两用', 129, 1, 'assets/mall/infrared-thermometer.png', 'blue')], '3392', '用户收到后称买重复了，申请退货。', { id: 'D1001', name: '刘姐' })
  ];

  /* ── 支付明细（演示）：支付方式 微信支付 / 卡兑换，含积分抵扣与实收金额 ── */
  var SEED_PAY = {
    'AKB-M2026-101601': { method: '微信支付' },
    'AKB-M2026-101602': { method: '微信支付', deduct: '¥0', actual: '¥58', received: '¥58', at: '2026-10-16 08:06:38' },
    'AKB-M2026-101303': { method: '微信支付', deduct: '¥12', actual: '¥75', received: '¥75', at: '2026-10-13 08:41:20' },
    'AKB-M2026-101302': { method: '微信支付', deduct: '¥0', actual: '¥239', received: '¥239', at: '2026-10-13 10:26:15' },
    'AKB-M2026-101301': { method: '微信支付', deduct: '¥0', actual: '¥129', received: '¥129', at: '2026-10-13 09:13:48' },
    'AKB-M2026-101305': { method: '微信支付', deduct: '¥0', actual: '¥1,599', received: '¥1,599', at: '2026-10-13 08:42:02' },
    'AKB-M2026-101118': { method: '微信支付', deduct: '¥10', actual: '¥187', received: '¥187', at: '2026-10-11 15:50:11' },
    'AKB-M2026-101007': { method: '微信支付', deduct: '¥0', actual: '¥699', received: '¥699', at: '2026-10-10 11:07:44' },
    'AKB-M2026-100912': { method: '微信支付', deduct: '¥0', actual: '¥199', received: '¥199', at: '2026-10-09 14:24:33' },
    'AKB-M2026-100830': { method: '微信支付', deduct: '¥6', actual: '¥52', received: '¥52', at: '2026-10-08 16:32:19' },
    'AKB-M2026-101304': { method: '微信支付', deduct: '¥0', actual: '¥97', received: '¥97', at: '2026-10-13 11:07:26' },
    'AKB-M2026-101203': { method: '微信支付', deduct: '¥0', actual: '¥168', received: '¥168', at: '2026-10-12 16:42:51' },
    'AKB-M2026-101119': { method: '微信支付', deduct: '¥0', actual: '¥145', received: '¥145', at: '2026-10-11 10:34:09' },
    'AKB-M2026-100913': { method: '微信支付', deduct: '¥0', actual: '¥257', received: '¥257', at: '2026-10-09 09:17:44' },
    'AKB-M2026-100831': { method: '微信支付', deduct: '¥0', actual: '¥129', received: '¥129', at: '2026-10-08 14:52:30' }
  };
  SEED_ORDERS.forEach(function (o) { if (SEED_PAY[o.no]) o.pay = SEED_PAY[o.no]; });

  /* 订单类型等元数据（演示）：订单类型 普通订单 / 续费订单；创建人默认用户自主下单 */
  var SEED_META = {
    'AKB-M2026-101118': { orderType: '续费订单' },
    'AKB-M2026-101601': { creator: '管理员' }
  };
  SEED_ORDERS.forEach(function (o) { var m = SEED_META[o.no]; if (m) { if (m.orderType) o.orderType = m.orderType; if (m.creator) o.creator = m.creator; } });

  /* ── 工具 ── */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function read(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      if (v) return v;
    } catch (e) {}
    return clone(fallback);
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return '¥' + Number(n || 0).toLocaleString('zh-CN'); }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function genReceiptCode() { return String(Math.floor(1000 + Math.random() * 9000)); }
  function genOrderNo() {
    var d = new Date();
    var s = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    return 'AKB-M' + s + String(Math.floor(100 + Math.random() * 900));
  }

  /* ── 分类 ── */
  function getCategories() {
    var list = read(CATEGORY_KEY, DEFAULT_CATEGORIES);
    if (!Array.isArray(list) || !list.length) list = clone(DEFAULT_CATEGORIES);
    var byId = {};
    DEFAULT_CATEGORIES.forEach(function (c) { byId[c.id] = c; });
    list.forEach(function (c) { if (!c.status) c.status = 'on'; if (!c.sort) c.sort = 99; if (byId[c.id] && !c.description) c.description = byId[c.id].description; });
    return list.sort(function (a, b) { return a.sort - b.sort; });
  }
  function saveCategories(list) { write(CATEGORY_KEY, list); }
  function categoryMap() {
    var m = {};
    getCategories().forEach(function (c) { m[c.id] = c; });
    return m;
  }
  function categoryName(id) {
    var c = categoryMap()[id];
    return c ? c.name : '未分类';
  }
  /* 按商品名称反查所属分类名称（订单列表商品列前缀展示） */
  function itemCategory(name) {
    if (!name) return '';
    var list = getProducts();
    for (var i = 0; i < list.length; i++) {
      if (list[i].name === name) return categoryName(list[i].category) || '';
    }
    return '';
  }

  /* ── 商品 ── */
  /* 统计每个商品的实际已售数量（从已完成/已发货订单的 items 中按商品名称累计） */
  function calcActualSales() {
    var map = {};
    var orders = getOrders();
    orders.forEach(function (o) {
      /* 只统计非取消/非退款的订单 */
      if (o.state === '已取消' || o.state === '已退款' || o.state === '待付款') return;
      if (!Array.isArray(o.items)) return;
      o.items.forEach(function (it) {
        var name = it.name || it.product || '';
        if (!name) return;
        map[name] = (map[name] || 0) + Number(it.quantity || 1);
      });
    });
    return map;
  }
  function getProducts(includeOff) {
    var list = read(PRODUCT_KEY, DEFAULT_PRODUCTS);
    if (!Array.isArray(list) || !list.length) list = clone(DEFAULT_PRODUCTS);
    var actualMap = calcActualSales();
    list.forEach(function (p) {
      if (!p.status) p.status = 'on';
      if (p.stock == null) p.stock = 0;
      if (p.sales == null) p.sales = 0;
      /* 手动已售：兼容旧数据，sales 即手动已售 */
      if (p.manualSales == null) p.manualSales = p.sales || 0;
      /* 实际已售：从订单统计，按商品名称匹配 */
      p.actualSales = actualMap[p.name] || 0;
      if (!p.sort) p.sort = 99;
      if (!p.tone) p.tone = 'purple';
      if (!p.icon) p.icon = 'generic';
      if (p.cover == null) p.cover = '';
      if (p.detailHtml == null) p.detailHtml = '';
      if (!Array.isArray(p.points)) p.points = [];
      /* 积分抵扣设置：follow 跟随全局 / on 强制开启 / off 强制关闭；pointsCap 为空则跟随全局上限 */
      if (!p.pointsDeduct) p.pointsDeduct = 'follow';
      if (p.pointsCap == null || p.pointsCap === '') p.pointsCap = null; else p.pointsCap = Number(p.pointsCap);
    });
    var result = list.filter(function (p) { return includeOff ? true : p.status === 'on'; });
    return result.sort(function (a, b) { return a.sort - b.sort; });
  }
  function saveProducts(list) { write(PRODUCT_KEY, list); }
  function productById(id) {
    var all = getProducts(true);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* ── 订单：管理端种子 + 小程序端真实下单合并 ── */
  function normalizeMiniOrder(o) {
    var first = (o.items && o.items[0]) || { product: o.product, desc: o.desc, price: o.price, quantity: o.quantity, image: o.image, tone: o.tone };
    var items = (o.items && o.items.length ? o.items : [first]).map(function (it) {
      return {
        name: it.product || it.name || '健康商品',
        desc: it.desc || '',
        price: String(it.price || 0),
        quantity: Number(it.quantity || 1),
        image: it.image || '',
        tone: it.tone || 'purple'
      };
    });
    var address = o.address || '默认收货地址';
    var userName = '小程序用户';
    if (address.indexOf('·') > -1) {
      var parts = address.split('·');
      userName = parts[1].trim();
      address = parts[0].trim();
    }
    var state = o.state;
    if (!state) {
      if (o.status === 'refund') state = '退款/售后';
      else if (o.status === 'cancel' || o.status === 'cancelled') state = '已退款';
      else if (o.deliveryStatus === 'signed') state = '已完成';
      else if (o.deliveryStatus === 'delivered') state = '待收货';
      else if (o.status === 'payment') state = '待付款';
      else state = '待发货';
    }
    var flow = flowOf(state);
    return {
      no: o.id || o.no,
      state: state,
      status: o.status || flow.status,
      deliveryStatus: o.deliveryStatus || flow.deliveryStatus,
      createdAt: o.date ? o.date + ' ' + (o.time || '') : '',
      date: o.date || today(),
      userName: userName,
      userPhone: '小程序下单',
      address: address,
      deliveryMethod: o.deliveryMethod || 'instant',
      deliveryLabel: o.deliveryLabel || DELIVERY_LABELS[o.deliveryMethod] || '立即送达',
      receiptCode: String(o.receiptCode || ''),
      items: items,
      quantity: Number(o.quantity || items.reduce(function (s, i) { return s + i.quantity; }, 0)),
      amount: String(o.amount != null ? o.amount : items.reduce(function (s, i) { return s + Number(i.price) * i.quantity; }, 0)),
      note: o.note || '',
      shipInfo: null,
      distId: o.distId || '',
      distName: o.distName || '',
      distRate: o.distRate || 0,
      source: 'mini',
      refundState: o.refundState || '',
      refundType: o.refundType || '',
      refundReason: o.refundReason || '',
      refundRemark: o.refundRemark || '',
      refundPhotos: o.refundPhotos || [],
      refundAmount: o.refundAmount || '',
      refundAt: o.refundAt || '',
      refundAppliedAt: o.refundAppliedAt || ''
    };
  }

  function getAdminOrders() {
    var list = read(ORDER_KEY, SEED_ORDERS);
    if (!Array.isArray(list) || !list.length) list = clone(SEED_ORDERS);
    /* 新增种子订单自动并入已有本地存储（缺失的按种子补齐，已有订单不动） */
    var haveNo = {};
    list.forEach(function (o) { haveNo[o.no] = true; });
    var seedAdded = false;
    SEED_ORDERS.forEach(function (s) { if (!haveNo[s.no]) { list.push(clone(s)); seedAdded = true; } });
    if (seedAdded) write(ORDER_KEY, list);
    /* 兼容旧本地存储：回填新增字段默认值（订单类型/支付人/创建人/更新时间），不覆盖已有值 */
    var seedMap = {};
    SEED_ORDERS.forEach(function (s) { seedMap[s.no] = s; });
    list.forEach(function (o) {
      var s = seedMap[o.no] || {};
      if (!o.orderType) o.orderType = s.orderType || '普通订单';
      if (!o.payer) o.payer = s.payer || o.userName || '';
      if (!o.payerPhone) o.payerPhone = s.payerPhone || o.userPhone || '';
      if (!o.creator) o.creator = s.creator || (o.source === 'mini' ? '用户自主下单' : '管理员');
      if (!o.updatedAt) o.updatedAt = s.updatedAt || o.createdAt || o.date || '';
    });
    return list;
  }

  function getOrders() {
    var admin = getAdminOrders();
    var known = {};
    admin.forEach(function (o) { known[o.no] = true; });
    var result = admin.slice();
    try {
      var mini = JSON.parse(localStorage.getItem(MINI_ORDER_KEY) || '[]');
      if (Array.isArray(mini)) {
        mini.forEach(function (o) {
          var no = o.id || o.no;
          if (no && !known[no]) result.push(normalizeMiniOrder(o));
        });
      }
    } catch (e) {}
    return result.sort(function (a, b) { return String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)); });
  }
  function getOrder(no) {
    var list = getOrders();
    for (var i = 0; i < list.length; i++) if (list[i].no === no) return list[i];
    return null;
  }
  function saveAdminOrders(list) { write(ORDER_KEY, list); }

  /* 状态流转：更新管理端订单，若订单来自小程序则同步回小程序存储；自动写入更新时间 */
  function updateOrder(no, patch) {
    var list = getAdminOrders();
    var found = false;
    var d = new Date();
    var p2 = function (n) { return ('0' + n).slice(-2); };
    patch.updatedAt = d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds());
    list.forEach(function (o) {
      if (o.no === no) {
        found = true;
        Object.keys(patch).forEach(function (k) { o[k] = patch[k]; });
        var flow = flowOf(o.state);
        o.status = flow.status;
        o.deliveryStatus = flow.deliveryStatus;
      }
    });
    if (found) write(ORDER_KEY, list);
    try {
      var mini = JSON.parse(localStorage.getItem(MINI_ORDER_KEY) || '[]');
      if (Array.isArray(mini)) {
        var changed = false;
        mini.forEach(function (o) {
          if ((o.id || o.no) === no) {
            changed = true;
            Object.keys(patch).forEach(function (k) {
              if (k === 'state') { o.state = patch[k]; }
              else if (k === 'note') { o.note = patch[k]; }
              else if (k === 'receiptCode') { o.receiptCode = patch[k]; }
              else o[k] = patch[k];
            });
            var flow = flowOf(o.state);
            o.status = flow.status;
            o.deliveryStatus = flow.deliveryStatus;
          }
        });
        if (changed) write(MINI_ORDER_KEY, mini);
      }
    } catch (e) {}
    return found;
  }

  /* ── 分销员（后台手动录入，一人一码；客户扫码进商城下单即归属该分销员） ── */
  var DEFAULT_DISTRIBUTORS = [
    { id: 'D1001', name: '刘姐',   phone: '138****6677', rate: 0.12, status: 'on',  createdAt: '2026-09-28', note: '社区团长，覆盖雁塔区多个小区', hospCode: 'JDYFY', docCode: 'DJ' },
    { id: 'D1002', name: '陈先生', phone: '139****2233', rate: 0.10, status: 'on',  createdAt: '2026-10-05', note: '朋友圈与病友群推广', hospCode: '', docCode: '' },
    { id: 'D1003', name: '王阿姨', phone: '186****8899', rate: 0.08, status: 'off', createdAt: '2026-10-08', note: '已暂停合作', hospCode: '', docCode: '' },
    { id: 'D1004', name: '张医生', phone: '137****5566', rate: 0.15, status: 'on',  createdAt: '2026-10-10', note: '合作医生渠道', hospCode: '', docCode: '' }
  ];
  function getDistributors() {
    var list = read(DIST_KEY, DEFAULT_DISTRIBUTORS);
    if (!Array.isArray(list) || !list.length) list = clone(DEFAULT_DISTRIBUTORS);
    list.forEach(function (d) {
      if (!d.status) d.status = 'on';
      if (d.rate == null) d.rate = 0.1;
      if (!d.createdAt) d.createdAt = today();
      if (!d.note) d.note = '';
      if (d.hospCode == null) d.hospCode = '';
      if (d.docCode == null) d.docCode = '';
    });
    return list;
  }
  function saveDistributors(list) { write(DIST_KEY, list); }
  function distributorById(id) {
    var all = getDistributors();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function genDistId() {
    var max = 1000;
    getDistributors().forEach(function (d) {
      var n = parseInt(String(d.id).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return 'D' + (max + 1);
  }
  /* 订单分销佣金：已取消 / 退款售后的订单不结算 */
  function distCommission(o) {
    if (!o || !o.distId) return null;
    var d = distributorById(o.distId);
    var rate = d ? Number(d.rate) : (Number(o.distRate) || 0.1);
    var settled = o.state !== '已取消' && o.state !== '退款/售后';
    return {
      id: o.distId,
      name: o.distName || (d ? d.name : o.distId),
      rate: rate,
      amount: Math.round(Number(o.amount) * rate * 100) / 100,
      settled: settled
    };
  }
  /* 分销汇总：按分销员统计 订单数 / 有效销售额 / 应结佣金 */
  function distStats() {
    var map = {};
    getOrders().forEach(function (o) {
      if (!o.distId) return;
      if (!map[o.distId]) map[o.distId] = { orderCount: 0, sales: 0, commission: 0 };
      map[o.distId].orderCount++;
      var c = distCommission(o);
      if (c && c.settled) {
        map[o.distId].sales += Number(o.amount);
        map[o.distId].commission += c.amount;
      }
    });
    return getDistributors().map(function (d) {
      var s = map[d.id] || { orderCount: 0, sales: 0, commission: 0 };
      return { dist: d, orderCount: s.orderCount, sales: Math.round(s.sales * 100) / 100, commission: Math.round(s.commission * 100) / 100 };
    });
  }

  /* ── 汇总 ── */
  function summarize() {
    var orders = getOrders();
    var products = getProducts(true);
    var t = today();
    var todayOrders = orders.filter(function (o) { return o.date === t; });
    var pendingShip = orders.filter(function (o) { return o.state === '待发货'; });
    var pendingPay = orders.filter(function (o) { return o.state === '待付款'; });
    var afterSales = orders.filter(function (o) { return o.state === '退款/售后'; });
    var revenue = orders.filter(function (o) { return o.state === '已完成'; }).reduce(function (s, o) { return s + Number(o.amount); }, 0);
    var todayAmount = todayOrders.reduce(function (s, o) { return s + (o.state === '已取消' ? 0 : Number(o.amount)); }, 0);
    var lowStock = products.filter(function (p) { return p.status === 'on' && p.stock < 30; });
    return {
      todayCount: todayOrders.length,
      todayAmount: todayAmount,
      pendingShipCount: pendingShip.length,
      pendingPayCount: pendingPay.length,
      afterSalesCount: afterSales.length,
      revenue: revenue,
      onSaleCount: products.filter(function (p) { return p.status === 'on'; }).length,
      productCount: products.length,
      lowStock: lowStock
    };
  }

  /* 侧栏待发货徽标（不依赖种子初始化，直接读存储） */
  function pendingShipBadge() {
    var count = 0;
    try {
      var admin = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
      if (Array.isArray(admin)) count += admin.filter(function (o) { return o.state === '待发货'; }).length;
      var mini = JSON.parse(localStorage.getItem(MINI_ORDER_KEY) || '[]');
      if (Array.isArray(mini) && !Array.isArray(admin)) count += mini.filter(function (o) { return o.state === '待发货' || (o.status === 'shipping' && o.deliveryStatus === 'processing'); }).length;
    } catch (e) {}
    return count;
  }

  /* ── CSV 导出 ── */
  function exportCsv(filename, header, rows) {
    var lines = [header].concat(rows).map(function (r) {
      return r.map(function (cell) { return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"'; }).join(',');
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv' }));
    a.download = filename;
    a.click();
  }

  w.AKBMallAdmin = {
    DEFAULT_PRODUCTS: DEFAULT_PRODUCTS,
    DEFAULT_CATEGORIES: DEFAULT_CATEGORIES,
    SEED_ORDERS: SEED_ORDERS,
    DEFAULT_DISTRIBUTORS: DEFAULT_DISTRIBUTORS,
    getDistributors: getDistributors,
    saveDistributors: saveDistributors,
    distributorById: distributorById,
    genDistId: genDistId,
    distCommission: distCommission,
    distStats: distStats,
    STATES: STATES,
    DELIVERY_LABELS: DELIVERY_LABELS,
    getCategories: getCategories,
    saveCategories: saveCategories,
    categoryName: categoryName,
    categoryMap: categoryMap,
    itemCategory: itemCategory,
    getProducts: getProducts,
    saveProducts: saveProducts,
    productById: productById,
    getOrders: getOrders,
    getOrder: getOrder,
    saveAdminOrders: saveAdminOrders,
    updateOrder: updateOrder,
    normalizeMiniOrder: normalizeMiniOrder,
    summarize: summarize,
    pendingShipBadge: pendingShipBadge,
    exportCsv: exportCsv,
    esc: esc,
    money: money,
    today: today,
    genReceiptCode: genReceiptCode,
    genOrderNo: genOrderNo
  };
})(window);
