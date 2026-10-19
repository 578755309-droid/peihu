/* 后台全局交互增强（admin-ux.css 配套）
   由 admin-sidebar.js 统一注入；不改动各页业务逻辑，仅增强交互：
   1. 筛选区自动注入「重置」按钮（清空条件并立即刷新）
   2. 搜索输入 300ms 防抖（离散控件仍立即生效）
   3. 弹层规范：焦点进入/归还、Escape 关闭、有未保存内容时关闭需确认
   4. 保存/提交类按钮防重复提交（800ms 加载态）
   5. 可点击统计卡键盘可达（Tab 聚焦、Enter/Space 触发）
   6. 空状态双态（[data-ux-empty] 容器：暂无数据 / 筛选无匹配结果+清除筛选）
   单页禁用：URL 加 ?ux=0 */
(function () {
  'use strict';
  try {
    if (/[?&]ux=0\b/.test(location.search)) return;
  } catch (e) {}

  var FILTER_SEL = '.filter,.filter-bar,.mall-filter';

  /* ─────────── 工具 ─────────── */
  function isTextInput(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    var t = (el.type || 'text').toLowerCase();
    return t === 'text' || t === 'search' || t === '';
  }
  function replay(el, type) {
    var ev = new Event(type, { bubbles: true });
    ev.__uxReplay = true;
    el.dispatchEvent(ev);
  }

  /* ─────────── 1. 筛选区「重置」按钮 ─────────── */
  function injectReset() {
    document.querySelectorAll(FILTER_SEL).forEach(function (box) {
      if (box.closest('.modal-mask')) return;                 // 弹层内筛选不注入
      if (box.querySelector('.ux-reset')) return;
      if (!box.querySelector('input,select')) return;         // 无条件控件不注入
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ux-reset';
      btn.textContent = '重置';
      btn.addEventListener('click', function () {
        box.querySelectorAll('input,select').forEach(function (el) {
          if (el.type === 'checkbox' || el.type === 'radio') {
            if (el.checked) { el.checked = false; replay(el, 'change'); }
          } else if (el.tagName === 'SELECT') {
            if (el.selectedIndex !== 0) { el.selectedIndex = 0; replay(el, 'change'); }
          } else if (isTextInput(el) || el.type === 'date' || el.type === 'number') {
            if (el.value !== '') { el.value = ''; replay(el, 'input'); replay(el, 'change'); }
          }
        });
        if (window.showToast) showToast('已清空筛选条件');
      });
      box.appendChild(btn);
    });
  }

  /* ─────────── 2. 搜索输入防抖（300ms） ─────────── */
  var debounceTimers = new WeakMap();
  document.addEventListener('input', function (e) {
    if (e.__uxReplay) return;
    var el = e.target;
    if (!isTextInput(el)) return;
    if (!el.closest(FILTER_SEL)) return;
    if (el.closest('.modal-mask')) return;
    e.stopImmediatePropagation();
    clearTimeout(debounceTimers.get(el));
    debounceTimers.set(el, setTimeout(function () { replay(el, 'input'); }, 300));
  }, true);

  /* ─────────── 3. 弹层规范 ─────────── */
  var maskState = new WeakMap();   // mask → { trigger, dirty }
  var openStack = [];

  function isVisible(mask) {
    var cs = getComputedStyle(mask);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }
  function closeMask(mask) {
    mask.classList.remove('show');
    if (isVisible(mask)) mask.style.display = 'none';
  }
  function tryCloseMask(mask) {
    var st = maskState.get(mask);
    if (st && st.dirty && window.showConfirm) {
      showConfirm({ title: '提示', message: '有未保存内容，确定关闭？', okText: '关闭' }).then(function (ok) {
        if (ok) closeMask(mask);
      });
    } else {
      closeMask(mask);
    }
  }
  function onMaskOpen(mask) {
    if (openStack.indexOf(mask) > -1) return;
    var st = { trigger: document.activeElement, dirty: false };
    maskState.set(mask, st);
    openStack.push(mask);
    setTimeout(function () {
      if (!isVisible(mask)) return;
      var f = mask.querySelector('input:not([type=hidden]):not([type=file]),select,textarea,button:not(.modal-close)');
      if (f) try { f.focus(); } catch (e) {}
    }, 50);
  }
  function onMaskClose(mask) {
    var i = openStack.indexOf(mask);
    if (i === -1) return;
    openStack.splice(i, 1);
    var st = maskState.get(mask);
    if (st && st.trigger && document.contains(st.trigger)) {
      try { st.trigger.focus(); } catch (e) {}
    }
    maskState.delete(mask);
  }
  function scanMasks() {
    document.querySelectorAll('.modal-mask').forEach(function (mask) {
      if (mask._uxObserved) return;
      mask._uxObserved = 1;
      /* 脏数据监听：弹层内任何输入都置脏 */
      mask.addEventListener('input', function (e) {
        var st = maskState.get(mask);
        if (st && e.target && e.target.matches && e.target.matches('input,select,textarea,[contenteditable]')) st.dirty = true;
      });
      /* 遮罩点击拦截：有未保存内容时先确认 */
      mask.addEventListener('click', function (e) {
        if (e.target !== mask) return;
        var st = maskState.get(mask);
        if (st && st.dirty) {
          e.stopImmediatePropagation();
          e.preventDefault();
          tryCloseMask(mask);
        }
      }, true);
      new MutationObserver(function () {
        if (isVisible(mask)) onMaskOpen(mask); else onMaskClose(mask);
      }).observe(mask, { attributes: true, attributeFilter: ['class', 'style'] });
      if (isVisible(mask)) onMaskOpen(mask);
    });
  }
  /* Escape 关闭最上层弹层 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    for (var i = openStack.length - 1; i >= 0; i--) {
      if (isVisible(openStack[i])) {
        e.stopImmediatePropagation();
        tryCloseMask(openStack[i]);
        return;
      }
    }
  }, true);

  /* ─────────── 4. 保存/提交按钮防重复提交 ─────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('button');
    if (!btn || btn.disabled || btn.classList.contains('ux-busy')) return;
    if (btn.closest('.cui-mask')) return;                      // showConfirm 自身除外
    if (!btn.closest('.modal-mask')) return;
    if (btn.classList.contains('modal-close')) return;
    var txt = (btn.textContent || '').replace(/\s+/g, '');
    if (!/^(保存|提交|确定|确认|发布|确认删除|确认下架|确认发布)$/.test(txt)) return;
    btn.classList.add('ux-busy');
    btn.disabled = true;
    setTimeout(function () {
      btn.classList.remove('ux-busy');
      btn.disabled = false;
    }, 800);
  }, true);

  /* ─────────── 5. 可点击统计卡键盘可达 ─────────── */
  function enhanceCards() {
    document.querySelectorAll('.mall-metric.clickable,.order-metric.clickable').forEach(function (c) {
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
      if (!c.hasAttribute('role')) c.setAttribute('role', 'button');
      c.setAttribute('aria-pressed', c.classList.contains('active') ? 'true' : 'false');
      if (!c._uxKey) {
        c._uxKey = 1;
        c.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            c.click();
          }
        });
      }
    });
  }

  /* ─────────── 6. 空状态双态（[data-ux-empty] 容器） ─────────── */
  function isFiltering(box) {
    var filtering = false;
    box.querySelectorAll('input,select').forEach(function (el) {
      if (filtering) return;
      if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) filtering = true; }
      else if (el.tagName === 'SELECT') { if (el.selectedIndex !== 0) filtering = true; }
      else if (el.value !== '') filtering = true;
    });
    return filtering;
  }
  window.uxIsFiltering = isFiltering;
  function scanEmpty() {
    document.querySelectorAll('[data-ux-empty]').forEach(function (box) {
      if (box._uxEmptyObserved) return;
      box._uxEmptyObserved = 1;
      var tbody = box.querySelector('tbody');
      var empty = box.querySelector('.empty-state,.empty');
      if (!tbody || !empty) return;
      var defaultText = empty.textContent.trim() || '暂无数据';
      new MutationObserver(function () {
        if (tbody.rows.length > 0) { empty.style.display = 'none'; return; }
        var filterBox = null;
        document.querySelectorAll(FILTER_SEL).forEach(function (b) {
          if (!filterBox && !b.closest('.modal-mask')) filterBox = b;
        });
        if (filterBox && isFiltering(filterBox)) {
          empty.innerHTML = '筛选无匹配结果<br><button type="button" class="ux-empty-clear">清除筛选</button>';
          var b = empty.querySelector('.ux-empty-clear');
          if (b) b.addEventListener('click', function () {
            var r = filterBox.querySelector('.ux-reset');
            if (r) r.click();
          });
        } else {
          empty.textContent = defaultText;
        }
        empty.style.display = '';
      }).observe(tbody, { childList: true });
    });
  }

  /* ─────────── 启动 ─────────── */
  function boot() {
    try { injectReset(); } catch (e) {}
    try { scanMasks(); } catch (e) {}
    try { enhanceCards(); } catch (e) {}
    try { scanEmpty(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  /* 页面多为动态渲染，延迟再扫一轮 + 周期兜底 */
  setTimeout(boot, 800);
  setInterval(function () {
    try { injectReset(); } catch (e) {}
    try { scanMasks(); } catch (e) {}
    try { enhanceCards(); } catch (e) {}
    try { scanEmpty(); } catch (e) {}
  }, 2000);
})();
