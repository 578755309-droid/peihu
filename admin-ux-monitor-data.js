/* 用户体验监测数据模块
   暴露 window.AKBUXMonitor，供后台 admin-ux-monitor.html 使用。

   职责：
   - 维护全局关键词库（分类 / 风险等级 / 启用状态），持久化到 localStorage
   - 对四类内容源（AI聊天 / 日志评论 / 商城评论 / 服务评论）逐条做「包含匹配」
   - 命中后聚合出监测记录，并带上客户信息，供后台跟进

   说明：AI聊天、日志评论、商城评论在原型中暂无持久化的用户行为数据，
   因此内置了演示种子内容；服务评论除种子外，还会合并用户端真实写入的
   localStorage('akb_service_ratings_v2')，以体现"全局检索"确实读到了线上数据。 */
(function () {
  'use strict';

  var KW_KEY = 'akb_ux_keywords_v1';   /* 关键词库 */
  var FU_KEY = 'akb_ux_followup_v1';   /* 跟进状态： { hitId: { status, note } } */
  var RATING_KEY = 'akb_service_ratings_v2'; /* 用户端服务评价 */

  var SOURCE_LABELS = { ai: 'AI聊天', log: '日志评论', mall: '商城评论', service: '服务评论' };
  var CATS = ['服务态度', '服务质量', '费用争议', '安全健康', '流程效率'];
  var LEVELS = ['高', '中', '低'];
  var STATUSES = ['待跟进', '已跟进', '已忽略'];

  /* ── 关键词库种子 ── */
  var SEED_KEYWORDS = [
    { id: 'kw01', word: '投诉',     cat: '服务态度', level: '高', on: true },
    { id: 'kw02', word: '态度差',   cat: '服务态度', level: '高', on: true },
    { id: 'kw03', word: '骗',       cat: '服务态度', level: '高', on: true },
    { id: 'kw04', word: '不满意',   cat: '服务质量', level: '中', on: true },
    { id: 'kw05', word: '差评',     cat: '服务质量', level: '中', on: true },
    { id: 'kw06', word: '漏做',     cat: '服务质量', level: '中', on: true },
    { id: 'kw07', word: '退款',     cat: '费用争议', level: '中', on: true },
    { id: 'kw08', word: '乱收费',   cat: '费用争议', level: '高', on: true },
    { id: 'kw09', word: '加钱',     cat: '费用争议', level: '中', on: true },
    { id: 'kw10', word: '过敏',     cat: '安全健康', level: '高', on: true },
    { id: 'kw11', word: '头晕',     cat: '安全健康', level: '高', on: true },
    { id: 'kw12', word: '危险',     cat: '安全健康', level: '高', on: true },
    { id: 'kw13', word: '摔',       cat: '安全健康', level: '高', on: true },
    { id: 'kw14', word: '隐私',     cat: '安全健康', level: '中', on: true },
    { id: 'kw15', word: '不舒服',   cat: '安全健康', level: '中', on: true },
    { id: 'kw16', word: '等太久',   cat: '流程效率', level: '中', on: true },
    { id: 'kw17', word: '太慢',     cat: '流程效率', level: '低', on: true },
    { id: 'kw18', word: '联系不上', cat: '流程效率', level: '中', on: true }
  ];

  /* ── 内容源种子（四类） ── */
  var SEED_SOURCES = [
    /* AI聊天 */
    { id: 'SRC-ai-01', source: 'ai', userId: 'U1001', userName: '王女士', userPhone: '138****2468', userLevel: '金卡会员', refNo: 'AI-20260417-0912', createdAt: '2026-04-17 09:12', text: '我妈妈昨晚吃药之后一直头晕，还有点恶心，是不是药不对？' },
    { id: 'SRC-ai-02', source: 'ai', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'AI-20260417-0820', createdAt: '2026-04-17 08:20', text: '预约的陪护今天一直没来，也联系不上，我等太久了还要赶去上班' },
    { id: 'SRC-ai-03', source: 'ai', userId: 'U1003', userName: '孙大爷', userPhone: '158****5509', userLevel: '银卡会员', refNo: 'AI-20260416-2015', createdAt: '2026-04-16 20:15', text: '想问下上门助浴大概多少钱，会不会中途临时加钱？' },
    { id: 'SRC-ai-04', source: 'ai', userId: 'U1004', userName: '李阿姨', userPhone: '135****6621', userLevel: '普通会员', refNo: 'AI-20260416-1530', createdAt: '2026-04-16 15:30', text: '护理员挺有耐心的，服务还不错，想问下怎么续约' },
    { id: 'SRC-ai-05', source: 'ai', userId: 'U1005', userName: '陈先生', userPhone: '186****3016', userLevel: '银卡会员', refNo: 'AI-20260416-1108', createdAt: '2026-04-16 11:08', text: '老人对花生过敏，饮食上需要特别注意什么吗' },
    { id: 'SRC-ai-06', source: 'ai', userId: 'U1006', userName: '周女士', userPhone: '133****6420', userLevel: '普通会员', refNo: 'AI-20260415-1640', createdAt: '2026-04-15 16:40', text: '合同快到期了，续签的流程是怎样的' },

    /* 日志评论（家属对护理日志的评论） */
    { id: 'SRC-log-01', source: 'log', userId: 'U1001', userName: '王女士', userPhone: '138****2468', userLevel: '金卡会员', refNo: 'LOG-20260417-01', createdAt: '2026-04-17 10:42', text: '日志说今天只翻身两次，比约定的少了，我有点不满意，麻烦关注一下' },
    { id: 'SRC-log-02', source: 'log', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'LOG-20260417-02', createdAt: '2026-04-17 09:36', text: '照片里老人脸色不太好，是不是哪里不舒服？' },
    { id: 'SRC-log-03', source: 'log', userId: 'U1003', userName: '孙大爷', userPhone: '158****5509', userLevel: '银卡会员', refNo: 'LOG-20260417-03', createdAt: '2026-04-17 08:05', text: '今天的护理记录写得很详细，护理员辛苦了' },
    { id: 'SRC-log-04', source: 'log', userId: 'U1004', userName: '李阿姨', userPhone: '135****6621', userLevel: '普通会员', refNo: 'LOG-20260416-01', createdAt: '2026-04-16 21:18', text: '说好晚上八点服药提醒，日志里没有记录，是不是漏做了？' },
    { id: 'SRC-log-05', source: 'log', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'LOG-20260416-02', createdAt: '2026-04-16 19:50', text: '感觉护理员态度差，问问题爱搭不理的' },
    { id: 'SRC-log-06', source: 'log', userId: 'U1005', userName: '陈先生', userPhone: '186****3016', userLevel: '银卡会员', refNo: 'LOG-20260416-03', createdAt: '2026-04-16 18:12', text: '希望护理日志能写得再详细一些，方便我们了解情况' },

    /* 商城评论 */
    { id: 'SRC-mall-01', source: 'mall', userId: 'U1001', userName: '王女士', userPhone: '138****2468', userLevel: '金卡会员', refNo: 'MALL-20260417-01', createdAt: '2026-04-17 14:20', text: '助行器收到就有点变形，做工太差了，我要退款' },
    { id: 'SRC-mall-02', source: 'mall', userId: 'U1004', userName: '李阿姨', userPhone: '135****6621', userLevel: '普通会员', refNo: 'MALL-20260416-01', createdAt: '2026-04-16 16:02', text: '护理垫比图片薄很多，感觉被骗了，直接差评' },
    { id: 'SRC-mall-03', source: 'mall', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'MALL-20260416-02', createdAt: '2026-04-16 13:44', text: '血压计用着还行，就是客服回复太慢了点' },
    { id: 'SRC-mall-04', source: 'mall', userId: 'U1005', userName: '陈先生', userPhone: '186****3016', userLevel: '银卡会员', refNo: 'MALL-20260416-03', createdAt: '2026-04-16 11:30', text: '发货很快，包装完好，好评' },
    { id: 'SRC-mall-05', source: 'mall', userId: 'U1003', userName: '孙大爷', userPhone: '158****5509', userLevel: '银卡会员', refNo: 'MALL-20260415-01', createdAt: '2026-04-15 20:26', text: '买的轮椅刹车有点松，担心用的时候摔着，太危险了' },
    { id: 'SRC-mall-06', source: 'mall', userId: 'U1006', userName: '周女士', userPhone: '133****6420', userLevel: '普通会员', refNo: 'MALL-20260415-02', createdAt: '2026-04-15 17:08', text: '想申请退款，但一直找不到入口，流程太麻烦了' },

    /* 服务评论 */
    { id: 'SRC-svc-01', source: 'service', userId: 'U1001', userName: '王女士', userPhone: '138****2468', userLevel: '金卡会员', refNo: 'AKB-20260417-001', createdAt: '2026-04-17 18:30', text: '陪护阿姨很负责，老人恢复得不错，感谢' },
    { id: 'SRC-svc-02', source: 'service', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'AKB-20260416-086', createdAt: '2026-04-16 20:12', text: '服务过程中一直玩手机，态度差，我要投诉' },
    { id: 'SRC-svc-03', source: 'service', userId: 'U1003', userName: '孙大爷', userPhone: '158****5509', userLevel: '银卡会员', refNo: 'AKB-20260416-042', createdAt: '2026-04-16 09:45', text: '预约迟到了两个小时，等太久了，希望改进' },
    { id: 'SRC-svc-04', source: 'service', userId: 'U1004', userName: '李阿姨', userPhone: '135****6621', userLevel: '普通会员', refNo: 'AKB-20260415-018', createdAt: '2026-04-15 21:36', text: '护理员操作不规范，老人差点摔下床，太危险了' },
    { id: 'SRC-svc-05', source: 'service', userId: 'U1005', userName: '陈先生', userPhone: '186****3016', userLevel: '银卡会员', refNo: 'AKB-20260415-007', createdAt: '2026-04-15 15:02', text: '收费比事先说的多，存在乱收费的情况' },
    { id: 'SRC-svc-06', source: 'service', userId: 'U1006', userName: '周女士', userPhone: '133****6420', userLevel: '普通会员', refNo: 'AKB-20260414-033', createdAt: '2026-04-14 19:24', text: '服务还可以，就是沟通上不太及时' },
    { id: 'SRC-svc-07', source: 'service', userId: 'U1001', userName: '王女士', userPhone: '138****2468', userLevel: '金卡会员', refNo: 'AKB-20260414-012', createdAt: '2026-04-14 12:08', text: '老人说头晕恶心，护理员没有及时反馈给我们' },
    { id: 'SRC-svc-08', source: 'service', userId: 'U1002', userName: '刘女士', userPhone: '177****9183', userLevel: '普通会员', refNo: 'AKB-20260413-005', createdAt: '2026-04-13 16:50', text: '护理员很专业，服务很满意' }
  ];

  /* ── 通用工具 ── */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function read(key) {
    try { var v = JSON.parse(localStorage.getItem(key) || 'null'); return v; } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    return val;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtTime(v) {
    if (v == null || v === '') return '—';
    if (typeof v === 'number' || /^\d{10,13}$/.test(String(v))) {
      var d = new Date(Number(v));
      if (!isNaN(d.getTime())) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      }
    }
    return String(v);
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── 关键词库 ── */
  function getKeywords() {
    var list = read(KW_KEY);
    if (!Array.isArray(list) || !list.length) {
      list = clone(SEED_KEYWORDS);
      write(KW_KEY, list);
    }
    return list;
  }
  function saveKeywords(list) { write(KW_KEY, list); return list; }
  function addKeyword(word, cat, level) {
    word = String(word || '').trim();
    if (!word) return { ok: false, msg: '请输入关键词' };
    var list = getKeywords();
    for (var i = 0; i < list.length; i++) {
      if (list[i].word === word) return { ok: false, msg: '该关键词已存在' };
    }
    var kw = {
      id: 'kw' + Date.now().toString(36),
      word: word,
      cat: CATS.indexOf(cat) > -1 ? cat : CATS[0],
      level: LEVELS.indexOf(level) > -1 ? level : '中',
      on: true
    };
    list.push(kw);
    saveKeywords(list);
    return { ok: true, keyword: kw };
  }
  function removeKeyword(id) {
    saveKeywords(getKeywords().filter(function (k) { return k.id !== id; }));
  }
  function toggleKeyword(id) {
    var list = getKeywords();
    list.forEach(function (k) { if (k.id === id) k.on = !k.on; });
    saveKeywords(list);
  }

  /* ── 内容源（种子 + 真实服务评价） ── */
  function realServiceRecords() {
    var out = [];
    var list = read(RATING_KEY);
    if (!Array.isArray(list)) return out;
    list.forEach(function (r, i) {
      if (!r || !r.text) return;
      out.push({
        id: 'REAL-svc-' + i,
        source: 'service',
        userId: r.userId || ('REAL-U' + i),
        userName: r.user || r.userName || '匿名客户',
        userPhone: r.userPhone || '—',
        userLevel: r.userLevel || '普通会员',
        refNo: r.no || r.orderNo || '—',
        createdAt: fmtTime(r.createdAt),
        text: String(r.text)
      });
    });
    return out;
  }
  function allSources() { return SEED_SOURCES.concat(realServiceRecords()); }

  /* ── 跟进状态 ── */
  function getFollowup() {
    var map = read(FU_KEY);
    return (map && typeof map === 'object') ? map : {};
  }
  function setFollowup(hitId, patch) {
    var map = getFollowup();
    var cur = map[hitId] || { status: '待跟进', note: '' };
    if (patch && patch.status && STATUSES.indexOf(patch.status) > -1) cur.status = patch.status;
    if (patch && typeof patch.note === 'string') cur.note = patch.note;
    map[hitId] = cur;
    write(FU_KEY, map);
    return cur;
  }

  /* ── 扫描：关键词对内容源做包含匹配 ── */
  function scan() {
    var keywords = getKeywords().filter(function (k) { return k.on && k.word; });
    var sources = allSources();
    var fu = getFollowup();
    var hits = [];

    sources.forEach(function (src) {
      var lower = String(src.text || '').toLowerCase();
      keywords.forEach(function (kw) {
        if (lower.indexOf(String(kw.word).toLowerCase()) === -1) return;
        var hitId = src.id + '#' + kw.id;
        var state = fu[hitId] || {};
        hits.push({
          id: hitId,
          source: src.source,
          sourceLabel: SOURCE_LABELS[src.source] || src.source,
          text: src.text,
          keyword: kw.word,
          cat: kw.cat,
          level: kw.level,
          userId: src.userId,
          userName: src.userName,
          userPhone: src.userPhone,
          userLevel: src.userLevel,
          refNo: src.refNo,
          createdAt: src.createdAt,
          status: state.status || '待跟进',
          note: state.note || ''
        });
      });
    });

    hits.sort(function (a, b) {
      if (a.createdAt === b.createdAt) return 0;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return hits;
  }

  /* 命中内容中把关键词包成 <mark> 高亮（返回已转义的安全 HTML） */
  function highlight(text, word) {
    var safe = esc(text);
    if (!word) return safe;
    var needle = esc(word);
    var lowerSafe = safe.toLowerCase();
    var lowerNeedle = needle.toLowerCase();
    var out = '', from = 0, idx;
    while ((idx = lowerSafe.indexOf(lowerNeedle, from)) > -1) {
      out += safe.slice(from, idx) + '<mark>' + safe.slice(idx, idx + needle.length) + '</mark>';
      from = idx + needle.length;
    }
    out += safe.slice(from);
    return out;
  }

  function getHits(filter) {
    filter = filter || {};
    var q = String(filter.q || '').trim().toLowerCase();
    return scan().filter(function (h) {
      if (filter.source && filter.source !== 'all' && h.source !== filter.source) return false;
      if (filter.status && filter.status !== 'all' && h.status !== filter.status) return false;
      if (filter.level && filter.level !== 'all' && h.level !== filter.level) return false;
      if (q) {
        var hay = (h.text + ' ' + h.keyword + ' ' + h.userName + ' ' + h.userPhone + ' ' + h.refNo).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function latestDate() {
    var max = '';
    allSources().forEach(function (s) {
      var d = String(s.createdAt || '').slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d > max) max = d;
    });
    return max;
  }

  function summarize() {
    var hits = scan();
    var today = latestDate();
    return {
      total: hits.length,
      pending: hits.filter(function (h) { return h.status === '待跟进'; }).length,
      followed: hits.filter(function (h) { return h.status === '已跟进'; }).length,
      ignored: hits.filter(function (h) { return h.status === '已忽略'; }).length,
      high: hits.filter(function (h) { return h.level === '高'; }).length,
      today: today ? hits.filter(function (h) { return String(h.createdAt).slice(0, 10) === today; }).length : 0,
      todayDate: today,
      sourceCount: allSources().length
    };
  }

  /* 单个客户档案：基本信息 + 其全部命中记录 */
  function customerProfile(userId) {
    var srcs = allSources().filter(function (s) { return s.userId === userId; });
    var info = srcs[0] || null;
    if (!info) return null;
    return {
      userId: userId,
      userName: info.userName,
      userPhone: info.userPhone,
      userLevel: info.userLevel,
      refCount: srcs.length,
      sources: srcs.map(function (s) { return SOURCE_LABELS[s.source] || s.source; })
        .filter(function (v, i, arr) { return arr.indexOf(v) === i; }),
      hits: getHits({}).filter(function (h) { return h.userId === userId; })
    };
  }

  function exportCsv(name, headers, rows) {
    var cell = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var lines = [headers].concat(rows).map(function (r) { return r.map(cell).join(','); });
    var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  var API = {
    SOURCE_LABELS: SOURCE_LABELS,
    CATS: CATS,
    LEVELS: LEVELS,
    STATUSES: STATUSES,
    esc: esc,
    highlight: highlight,
    getKeywords: getKeywords,
    addKeyword: addKeyword,
    removeKeyword: removeKeyword,
    toggleKeyword: toggleKeyword,
    scan: scan,
    getHits: getHits,
    summarize: summarize,
    customerProfile: customerProfile,
    getFollowup: getFollowup,
    setFollowup: setFollowup,
    exportCsv: exportCsv,
    today: today
  };

  (typeof window !== 'undefined' ? window : this).AKBUXMonitor = API;
  if (typeof window !== 'undefined' && window.console && window.console.log) {
    /* 便于在控制台排查：window.AKBUXMonitor */
  }
})();
