/* 后台全局表格固定列：左侧固定「编号/名称」等前几列，右侧固定「操作」列
   由 admin-sidebar.js 统一注入。实现方式：按表注入 nth-child 结构化 CSS，
   tbody 行被页面重新 innerHTML 渲染后固定效果依然生效。
   单表覆盖：<table data-sticky-left="n" data-sticky-min="1200">，禁用：<table data-no-sticky>，
   已自行处理的表可标记 data-sticky="done"。 */
(function () {
  'use strict';
  var FILES = {
    'admin-orders.html':             { left: 1, right: 1, min: 1200 },
    'admin-users.html':              { left: 2, right: 1, min: 1150 },
    'admin-caregivers.html':         { left: 2, right: 1, min: 1320, onlyTable: '.caregiver-list-table' },
    'admin-caregiver-detail.html':   { left: 2, right: 1, min: 1200, onlyTable: '.caregiver-order-table' },
    'admin-bookings.html':           { left: 1, right: 1, min: 1000 },
    'admin-contracts.html':          { left: 1, right: 1, min: 950 },
    'admin-service-categories.html': { left: 1, right: 1, min: 1080, onlyTable: '.service-table' },
    'admin-mall-orders.html':        { left: 1, right: 1, min: 2100 },
    'admin-mall-categories.html':    { left: 2, right: 1, min: 1150 },
    'admin-mall-distribution.html':  { left: 1, right: 1, min: 1560 },
    'admin-points-users.html':       { left: 1, right: 1, min: 1000 },
    'admin-points-earn.html':        { left: 1, right: 0, min: 900 },
    'admin-points-invite.html':      { left: 1, right: 0, min: 900 },
    'admin-points-spend.html':       { left: 1, right: 0, min: 950 },
    'admin-comments.html':           { left: 1, right: 1, min: 1100 },
    'admin-consult.html':            { left: 1, right: 1, min: 950 },
    'admin-feedback.html':           { left: 1, right: 1, min: 1050 },
    'admin-companies.html':          { left: 2, right: 0, min: 1050 },
    'admin-hospitals.html':          { left: 1, right: 1, min: 1050 }
  };
  var MODAL_SEL = '[class*="modal"],[id*="modal"],[id*="Modal"],[class*="dialog"],[class*="overlay"]';
  var SHADOW_L = 'box-shadow:8px 0 12px -10px rgba(23,32,51,.16)';
  var SHADOW_R = 'box-shadow:-8px 0 12px -10px rgba(23,32,51,.16)';

  function file() { return (location.pathname.split('/').pop() || '').toLowerCase(); }
  function cfgFor(f) {
    if (FILES[f]) return FILES[f];
    /* 未配置页面走保守兜底：第一列 + 含「操作」的最后一列 */
    return { left: 1, right: 1, min: 0 };
  }

  var seq = 0;

  function buildCss(cls, thCount, leftCount, rightCount, lefts, rights) {
    var s = '';
    /* 表头纵向固定（所有 th 都 sticky top:0，z-index 低于左右固定的 th） */
    s += '.' + cls + ' thead th{position:sticky;top:0;z-index:1;background:#F3FDFA}';
    if (leftCount > 0) {
      s += '.' + cls + ' thead th:nth-child(-n+' + leftCount + '){position:sticky;z-index:3;background:#F3FDFA}';
      s += '.' + cls + ' tbody td:nth-child(-n+' + leftCount + '):not([colspan]){position:sticky;z-index:2;background:#fff}';
      for (var i = 0; i < leftCount; i++) {
        s += '.' + cls + ' thead th:nth-child(' + (i + 1) + '),.' + cls + ' tbody td:nth-child(' + (i + 1) + '):not([colspan]){left:' + lefts[i] + 'px}';
      }
      s += '.' + cls + ' thead th:nth-child(' + leftCount + '){' + SHADOW_L + '}';
      s += '.' + cls + ' tbody td:nth-child(' + leftCount + '):not([colspan]){' + SHADOW_L + '}';
    }
    if (rightCount > 0) {
      s += '.' + cls + ' thead th:nth-child(n+' + (thCount - rightCount + 1) + '){position:sticky;z-index:3;background:#F3FDFA}';
      s += '.' + cls + ' tbody td:nth-child(n+' + (thCount - rightCount + 1) + '):not([colspan]){position:sticky;z-index:2;background:#fff}';
      for (var j = 0; j < rightCount; j++) {
        var colIdx = thCount - j; /* 1-based：最右列 right:0，向左依次累加偏移 */
        s += '.' + cls + ' thead th:nth-child(' + colIdx + '),.' + cls + ' tbody td:nth-child(' + colIdx + '):not([colspan]){right:' + rights[j] + 'px}';
      }
      /* 最左的右固定列加阴影 */
      s += '.' + cls + ' thead th:nth-child(' + (thCount - rightCount + 1) + '){' + SHADOW_R + '}';
      s += '.' + cls + ' tbody td:nth-child(' + (thCount - rightCount + 1) + '):not([colspan]){' + SHADOW_R + '}';
    }
    return s;
  }

  function measureLefts(t, leftCount) {
    var lefts = [], sum = 0, i;
    var row = t.tHead && t.tHead.rows[0];
    if (!row) return null;
    for (i = 0; i < leftCount && i < row.cells.length; i++) {
      lefts.push(sum);
      sum += row.cells[i].offsetWidth || 0;
    }
    return lefts;
  }
  function measureRights(t, rightCount) {
    var rights = [], sum = 0, j;
    var row = t.tHead && t.tHead.rows[0];
    if (!row) return null;
    var n = row.cells.length;
    for (j = 0; j < rightCount && j < n; j++) {
      rights.push(sum);
      sum += row.cells[n - 1 - j].offsetWidth || 0;
    }
    return rights;
  }

  function apply(table) {
    if (table._akbStickyDone) return;
    if (table.hasAttribute('data-no-sticky') || table.getAttribute('data-sticky') === 'done') return;
    if (table.closest(MODAL_SEL)) return;
    var cfg = cfgFor(file());
    if (cfg.onlyTable && !table.matches(cfg.onlyTable)) return;
    if (!table.tHead || !table.tHead.rows.length) return;
    var ths = table.tHead.rows[0].cells;
    if (ths.length < 3) return;

    var leftCount = table.hasAttribute('data-sticky-left')
      ? parseInt(table.getAttribute('data-sticky-left'), 10) || 0
      : cfg.left;
    leftCount = Math.max(0, Math.min(leftCount, ths.length - 1));
    var lastTh = ths[ths.length - 1];
    var rightCount = table.hasAttribute('data-sticky-right')
      ? parseInt(table.getAttribute('data-sticky-right'), 10) || 0
      : (cfg.right && /操作/.test(lastTh.textContent || '') ? 1 : 0);
    rightCount = Math.max(0, Math.min(rightCount, ths.length - leftCount - 1));

    var min = table.hasAttribute('data-sticky-min')
      ? parseInt(table.getAttribute('data-sticky-min'), 10) || 0
      : cfg.min;
    if (min && (parseFloat(table.style.minWidth) || 0) < min) table.style.minWidth = min + 'px';

    /* 确保滚动容器可横向滚动（sticky 依赖 overflow） */
    var wrap = table.closest('.table-wrap') || table.parentNode;
    if (wrap && wrap !== document.body) {
      var ws = getComputedStyle(wrap);
      if (ws.overflowX !== 'auto' && ws.overflowX !== 'scroll') wrap.style.overflowX = 'auto';
      /* 纵向滚动条在表格容器内（表头 sticky top:0 才会生效） */
      if (ws.overflowY !== 'auto' && ws.overflowY !== 'scroll') wrap.style.overflowY = 'auto';
      if (!wrap.style.maxHeight) wrap.style.maxHeight = 'calc(100vh - 300px)';
    }

    table._akbStickyDone = true;
    var cls = 'akb-stk-t' + (++seq);
    table.classList.add(cls);

    var styleEl = document.createElement('style');
    styleEl._akbFor = table;
    document.head.appendChild(styleEl);

    function sync() {
      var row = table.tHead && table.tHead.rows[0];
      if (!row) return;
      var lefts = measureLefts(table, leftCount);
      var rights = measureRights(table, rightCount);
      if (!lefts || !rights) return;
      var key = lefts.join(',') + '|' + rights.join(',') + '|' + ths.length;
      if (styleEl._akbKey === key) return;
      styleEl._akbKey = key;
      styleEl.textContent = buildCss(cls, row.cells.length, leftCount, rightCount, lefts, rights);
    }
    table._akbStickySync = sync;
    sync();
  }

  function scan() {
    var tables = document.querySelectorAll('table');
    Array.prototype.forEach.call(tables, function (t) {
      try { apply(t); } catch (e) {}
      if (t._akbStickySync) { try { t._akbStickySync(); } catch (e) {} }
    });
  }

  var scanTimer = null;
  function schedule() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, 80);
  }

  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var n = muts[i].addedNodes;
      for (var j = 0; j < n.length; j++) {
        if (n[j].nodeType === 1 && (n[j].tagName === 'TABLE' || n[j].querySelector && n[j].querySelector('table'))) { schedule(); return; }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('resize', schedule);
  /* 兜底重算：隐藏标签页/图片加载导致列宽变化时同步偏移 */
  setInterval(schedule, 1500);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();
})();
