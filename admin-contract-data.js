/* 佑小邦 · 电子合同共享数据模块（管理后台 / 护理员端 / 用户端三端共用）
 * 合同模板：标题、甲乙方、服务条款、落款说明，后台「合同管理」可编辑；
 * 签约记录：护理员上门开始服务时发起 → 用户移动端浏览并手写签名 → 各端同步查看。
 */
(function (w) {
  var TEMPLATE_KEY = 'akb_contract_template_v1';
  var RECORDS_KEY = 'akb_contract_records_v1';

  var DEFAULT_TEMPLATE = {
    title: '陪护服务电子合同',
    partyA: '西安佑小邦健康科技有限公司',
    partyALabel: '甲方（服务提供方）',
    partyBLabel: '乙方（服务对象 / 监护人）',
    clauses: [
      '服务内容：甲方按照订单约定的服务项目、服务时长与服务标准，安排持证护理人员为乙方提供陪护服务，具体以订单详情为准。',
      '服务期限与地点：服务期限与服务地址以订单约定为准；如需变更，双方应提前协商一致并在平台完成变更记录。',
      '服务费用与支付：服务费用按订单页面公示价格执行，乙方通过平台完成线上支付；费用包含护理人员服务费，不含医疗耗材及药品费用。',
      '双方权利义务：甲方确保护理人员持证上岗、遵守服务规范；乙方应如实告知服务对象身体状况（自理等级、管路、传染性疾病等），并为护理人员提供必要的服务条件。',
      '安全与免责：护理服务不构成医疗行为；服务过程中因乙方隐瞒病情或不可抗力导致的意外，甲方不承担相应责任；因护理人员过错造成的损失，由甲方依法承担。',
      '合同生效：本合同经乙方在平台以电子签名方式签署后生效，电子签名与手写签名具有同等法律效力；合同签署信息由平台存档备查。'
    ],
    footerNote: '本合同一式两份，甲乙双方各执一份，均存储于平台电子合同系统，可随时在线查阅。',
    sealText: '西安佑小邦健康科技有限公司 · 合同专用章',
    updatedAt: '2026-04-01 10:00'
  };

  /* 种子签名（内联 SVG，模拟手写笔迹） */
  function seedSign(text, color) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="80" viewBox="0 0 220 80"><path d="M18 52 C34 22, 52 20, 62 40 S88 66, 104 44 S138 18, 156 38 S192 60, 204 34" fill="none" stroke="' + color + '" stroke-width="2.6" stroke-linecap="round"/><text x="20" y="72" font-size="13" fill="' + color + '" font-family="Kaiti,STKaiti,serif">' + text + '</text></svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  var SEED_RECORDS = {
    /* 后台服务订单（服务中 · 张爷爷）：已完成签署样例 */
    'AKB-20260412-001': {
      orderNo: 'AKB-20260412-001',
      contractNo: 'HT-20260412-001',
      userName: '张女士（代 张爷爷）',
      serviceType: '住院陪护',
      serviceTime: '04/12 08时 - 04/14 20时',
      amount: '¥1,080',
      issuedAt: '2026-04-12 07:45',
      issuedBy: '护理员 张阿姨',
      status: '已签署',
      signedAt: '2026-04-12 07:52',
      signerName: '张女士',
      signImage: seedSign('张女士', '#1F3FA0'),
      templateTitle: '陪护服务电子合同'
    },
    /* 用户端待服务订单（张爷爷）：演示用户移动端签署流 */
    'AKB-2026-038421': {
      orderNo: 'AKB-2026-038421',
      contractNo: 'HT-2026-038421',
      userName: '张女士（代 张爷爷）',
      serviceType: '住院陪护 · 住院专护服务',
      serviceTime: '2026-04-10 08:00 至 2026-04-13 20:00（3天）',
      amount: '¥840',
      address: '北京红十字医院 · 内科 5楼 · 3床',
      issuedAt: '2026-04-10 07:50',
      issuedBy: '护理员 李桂芳',
      status: '待签署',
      signedAt: '',
      signerName: '',
      signImage: '',
      templateTitle: '陪护服务电子合同'
    }
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var val = JSON.parse(raw);
      return val && typeof val === 'object' ? val : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function getTemplate() {
    var t = Object.assign(clone(DEFAULT_TEMPLATE), read(TEMPLATE_KEY, {}));
    if (!Array.isArray(t.clauses) || !t.clauses.length) t.clauses = clone(DEFAULT_TEMPLATE.clauses);
    return t;
  }
  function saveTemplate(t) { return null; /* disabled */
    t.updatedAt = now();
    write(TEMPLATE_KEY, t);
    return t;
  }

  /* 记录 = 种子 + localStorage 覆盖（签署/新发起优先） */
  function getRecords() {
    var stored = read(RECORDS_KEY, {});
    var merged = clone(SEED_RECORDS);
    Object.keys(stored).forEach(function (k) { merged[k] = stored[k]; });
    return merged;
  }
  function recordFor(orderNo) { return getRecords()[orderNo] || null; }

  function persistRecord(rec) {
    var stored = read(RECORDS_KEY, {});
    stored[rec.orderNo] = rec;
    write(RECORDS_KEY, stored);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function now() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  /* 护理员端发起合同 */
  function issue(orderNo, meta) { return null; /* disabled */
    var existing = recordFor(orderNo);
    if (existing) return existing;
    meta = meta || {};
    var rec = {
      orderNo: orderNo,
      contractNo: 'HT-' + String(orderNo).replace(/^AKB-?/, '').replace(/-/g, ''),
      userName: meta.userName || '—',
      serviceType: meta.serviceType || '陪护服务',
      serviceTime: meta.serviceTime || '',
      amount: meta.amount || '',
      address: meta.address || '',
      issuedAt: now(),
      issuedBy: meta.issuedBy || '护理员',
      status: '待签署',
      signedAt: '',
      signerName: '',
      signImage: '',
      templateTitle: getTemplate().title
    };
    persistRecord(rec);
    return rec;
  }

  /* 用户端签署 */
  function sign(orderNo, payload) { return null; /* disabled */
    var rec = recordFor(orderNo);
    if (!rec || rec.status === '已签署') return rec;
    rec.status = '已签署';
    rec.signedAt = now();
    rec.signerName = (payload && payload.signerName) || rec.userName;
    rec.signImage = (payload && payload.signImage) || '';
    persistRecord(rec);
    return rec;
  }

  function summarize() {
    var all = getRecords();
    var list = Object.keys(all).map(function (k) { return all[k]; });
    var signed = list.filter(function (r) { return r.status === '已签署'; });
    return {
      total: list.length,
      signed: signed.length,
      pending: list.length - signed.length
    };
  }

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  w.AKBContract = {
    enabled: false,
    getTemplate: getTemplate,
    saveTemplate: saveTemplate,
    getRecords: getRecords,
    recordFor: recordFor,
    issue: issue,
    sign: sign,
    summarize: summarize,
    esc: esc
  };
})(window);
