/* 资讯数据模块：运营后台（admin-consult.html）与用户移动端（home.html / consult-list.html / consult-detail.html）共享 */
(function () {
  var KEY = 'akb_admin_consults_v1';

  var SEED = [
    { id: 'CS001', name: '平台公告', title: '佑小邦陪护服务全新上线', sub: '专业持证护理员 · 住院 / 居家 / 助浴全覆盖', mode: 'rich', content: '<h2>专业陪护，安心到家</h2><p>佑小邦平台现已全面上线三大类陪护服务，所有护理员均持证上岗、实名认证。</p><ul><li><b>住院陪护</b>：12/24 小时班次可选，支持按天计费</li><li><b>居家陪护</b>：生活照护、康复协助、用药提醒</li><li><b>上门助浴</b>：专业助浴设备入户，全程安全监护</li></ul><blockquote>新用户首单立减 30 元，邀请好友双方各得 30 积分。</blockquote><p>更多服务详情请在小程序「服务分类」中查看。</p>', link: '', cover: '', enabled: true, updatedAt: '2026-04-10 09:30' },
    { id: 'CS002', name: '健康科普', title: '术后康复期陪护注意事项', sub: '来自护理团队的 12 条专业建议', mode: 'link', content: '', link: 'https://mp.weixin.qq.com/s/akb-care-guide-2026', cover: '', enabled: true, updatedAt: '2026-04-08 15:20' },
    { id: 'CS003', name: '服务说明', title: '陪护服务费用与计价规则', sub: '按天 / 按次计费说明及加价项公示', mode: 'rich', content: '<h3>计价方式</h3><p>住院陪护、居家陪护按天计费；上门助浴按次计费。</p><h3>加价项</h3><ul><li>半自理 / 不能自理：按护理等级加价</li><li>管路护理（胃管、尿管等）：单项加价</li><li>传染性疾病陪护：专项加价</li></ul><p>具体价格以下单页实时计算为准，可在分类服务管理中配置。</p>', link: '', cover: '', enabled: false, updatedAt: '2026-04-02 11:05' }
  ];

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function read() { try { var raw = localStorage.getItem(KEY); if (!raw) return null; var v = JSON.parse(raw); return Array.isArray(v) ? v : null; } catch (e) { return null; } }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { } }
  function get() { var stored = read(); if (stored) return stored; var init = JSON.parse(JSON.stringify(SEED)); save(init); return init; }
  function getEnabled() { return get().filter(function (i) { return i.enabled; }).sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); }); }
  function getById(id) { return get().find(function (i) { return i.id === id; }) || null; }

  /* 'YYYY-MM-DD HH:mm' → 相对时间（刚刚 / n分钟前 / n个小时前 / n天前 / 日期） */
  function relTime(ts) {
    if (!ts) return '';
    var t = new Date(String(ts).replace(' ', 'T')).getTime();
    if (isNaN(t)) return ts;
    var diff = Date.now() - t; if (diff < 0) diff = 0;
    var m = Math.floor(diff / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return m + '分钟前';
    var h = Math.floor(m / 60);
    if (h < 24) return h + '个小时前';
    var d = Math.floor(h / 24);
    if (d < 30) return d + '天前';
    return String(ts).slice(0, 10);
  }

  function strip(html) { var d = document.createElement('div'); d.innerHTML = html || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }

  window.AKBConsult = { KEY: KEY, get: get, save: save, getEnabled: getEnabled, getById: getById, relTime: relTime, strip: strip, esc: esc };
})();
