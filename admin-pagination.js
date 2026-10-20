/* 后台全局表格分页组件：由 admin-sidebar.js 统一注入，对页面内所有数据表格自动分页
   - 始终显示分页条（含条数选择器）；数据不足一页时仅隐藏翻页按钮
   - 支持 10/20/50 条每页，选择全局记忆（localStorage）
   - 可通过给 <table data-no-pager> 标记禁用 */
(function () {
  'use strict';
  var SIZES = [10, 20, 50];
  var SIZE_KEY = 'akb_admin_page_size';
  var MODAL_SEL = '[class*="modal"],[id*="modal"],[id*="Modal"],[class*="dialog"],[class*="overlay"]';

  /* 注入样式（单文件自包含，不改动 admin-shell.css） */
  var css = '.akb-pager{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 4px 2px;font-size:12px;color:#5b6b8c}' +
    '.akb-pager .pg-total{margin-right:auto}' +
    '.akb-pager select{height:26px;border:1px solid #d8e0f0;border-radius:12px;padding:0 6px;font-size:12px;color:#41536d;background:#fff}' +
    '.akb-pager .pg-btn{min-width:26px;height:26px;padding:0 8px;border:1px solid #d8e0f0;border-radius:12px;background:#fff;color:#41536d;font-size:12px;cursor:pointer}' +
    '.akb-pager .pg-btn:hover:not(:disabled){border-color:#1CD8B7;color:#1CD8B7}' +
    '.akb-pager .pg-btn:disabled{opacity:.4;cursor:default}' +
    '.akb-pager .pg-btn.cur{background:#1CD8B7;border-color:#1CD8B7;color:#fff;font-weight:600}' +
    '.akb-pager .pg-ellipsis{padding:0 2px;color:#9aa7c0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function dataRows(tbody) {
    var out = [];
    Array.prototype.forEach.call(tbody.children, function (tr) {
      if (tr.tagName !== 'TR') return;
      if (tr.children.length === 1 && tr.children[0].hasAttribute('colspan')) return; /* 空状态行 */
      out.push(tr);
    });
    return out;
  }

  function eligible(table) {
    if (!table || table._akbSkip) return false;
    if (table.hasAttribute('data-no-pager')) return false;
    if (table.closest(MODAL_SEL)) return false;
    if (!table.tBodies || !table.tBodies.length) return false;
    return true;
  }

  function pageSize(table) {
    if (table._akbSize) return table._akbSize;
    var saved = parseInt(localStorage.getItem(SIZE_KEY) || '10', 10);
    return SIZES.indexOf(saved) > -1 ? saved : 10;
  }

  function ensurePager(table) {
    if (table._akbPager && table._akbPager.isConnected) return table._akbPager;
    var host = table.closest('.table-wrap') || table;
    var pager = document.createElement('div');
    pager.className = 'akb-pager';
    host.parentNode.insertBefore(pager, host.nextSibling);
    table._akbPager = pager;
    return pager;
  }

  function pageNums(cur, pages) {
    var set = [1, pages, cur - 1, cur, cur + 1].filter(function (n) { return n >= 1 && n <= pages; });
    set = set.filter(function (n, i) { return set.indexOf(n) === i; }).sort(function (a, b) { return a - b; });
    var out = [], prev = 0;
    set.forEach(function (n) { if (n - prev > 1) out.push('…'); out.push(n); prev = n; });
    return out;
  }

  function paginate(table, reset) {
    if (!eligible(table)) return;
    var tbody = table.tBodies[0];
    var list = dataRows(tbody);
    var total = list.length;
    var size = pageSize(table);
    if (reset) table._akbPage = 1;
    var pager = ensurePager(table);
    pager.style.display = '';
    if (total <= size) {
      /* 数据不足一页：仍显示总数与条数选择器，隐藏翻页按钮 */
      list.forEach(function (tr) { tr.style.display = ''; });
      pager.innerHTML =
        '<span class="pg-total">共 ' + total + ' 条</span>' +
        '<select class="pg-size">' + SIZES.map(function (s) { return '<option value="' + s + '"' + (s === size ? ' selected' : '') + '>' + s + ' 条/页</option>'; }).join('') + '</select>';
      return;
    }
    var pages = Math.ceil(total / size);
    var cur = Math.min(Math.max(table._akbPage || 1, 1), pages);
    table._akbPage = cur;
    list.forEach(function (tr, i) {
      tr.style.display = (i >= (cur - 1) * size && i < cur * size) ? '' : 'none';
    });
    var nums = pageNums(cur, pages).map(function (n) {
      return n === '…' ? '<span class="pg-ellipsis">…</span>' : '<button type="button" class="pg-btn' + (n === cur ? ' cur' : '') + '" data-page="' + n + '">' + n + '</button>';
    }).join('');
    pager.innerHTML =
      '<span class="pg-total">共 ' + total + ' 条</span>' +
      '<select class="pg-size">' + SIZES.map(function (s) { return '<option value="' + s + '"' + (s === size ? ' selected' : '') + '>' + s + ' 条/页</option>'; }).join('') + '</select>' +
      '<button type="button" class="pg-btn" data-page="prev"' + (cur === 1 ? ' disabled' : '') + '>上一页</button>' +
      nums +
      '<button type="button" class="pg-btn" data-page="next"' + (cur === pages ? ' disabled' : '') + '>下一页</button>';
  }

  /* 事件代理：页码/上一页/下一页/条数切换 */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.akb-pager .pg-btn');
    if (!btn || btn.disabled) return;
    var pager = btn.closest('.akb-pager');
    var table = findTable(pager);
    if (!table) return;
    var size = pageSize(table);
    var pages = Math.ceil(dataRows(table.tBodies[0]).length / size);
    var cur = table._akbPage || 1;
    var p = btn.dataset.page;
    if (p === 'prev') cur--;
    else if (p === 'next') cur++;
    else cur = parseInt(p, 10);
    table._akbPage = Math.min(Math.max(cur, 1), pages);
    paginate(table);
  });
  document.addEventListener('change', function (e) {
    var sel = e.target.closest && e.target.closest('.akb-pager .pg-size');
    if (!sel) return;
    var table = findTable(sel.closest('.akb-pager'));
    if (!table) return;
    table._akbSize = parseInt(sel.value, 10);
    table._akbPage = 1;
    try { localStorage.setItem(SIZE_KEY, sel.value); } catch (err) {}
    paginate(table);
  });
  function findTable(pager) {
    var tables = document.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) if (tables[i]._akbPager === pager) return tables[i];
    return null;
  }

  /* tbody 行变化（筛选/重渲染）→ 行数变化时回到第 1 页，否则仅重排 */
  function watch(table) {
    if (table._akbWatched) return;
    table._akbWatched = true;
    var lastCount = -1;
    new MutationObserver(function () {
      var c = dataRows(table.tBodies[0]).length;
      paginate(table, c !== lastCount);
      lastCount = c;
    }).observe(table.tBodies[0], { childList: true });
  }

  var scanTimer = null;
  function scan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll('table'), function (table) {
        if (!eligible(table)) return;
        watch(table);
        paginate(table);
      });
    }, 80);
  }

  /* 全局监听新增表格（页面异步渲染场景） */
  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var n = muts[i].addedNodes;
      for (var j = 0; j < n.length; j++) {
        if (n[j].nodeType === 1 && (n[j].tagName === 'TABLE' || n[j].querySelector && n[j].querySelector('table'))) { scan(); return; }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
