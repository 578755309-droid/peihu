/* ==========================================================================
   安科邦 · 移动端组件库（Mobile UI Kit）JavaScript
   依赖：ui/mobile-ui.css；可选：AKBUI（Vue 公共交互层）
   用法：
     MobileUI.form('#orderForm').values()      // 读取表单值 {name:'...'}
     MobileUI.form('#orderForm').set({name:'张三'})
     MobileUI.form('#orderForm').validate()    // 校验 data-required / .mui-req 行，返回 boolean
     MobileUI.toast('已保存')
     var sheet = MobileUI.sheet({title:'选择时间', html:'<div class="mui-list">…</div>'})
     sheet.close()
   ========================================================================== */
(function (global) {
  'use strict';

  var MUI = { version: '1.0.0' };

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Toast ---------- */
  MUI.toast = function (message, options) {
    if (global.AKBUI && typeof global.AKBUI.toast === 'function') { global.AKBUI.toast(message); return; }
    var opts = options || {};
    var el = qs('.mui-toast');
    if (!el) { el = document.createElement('div'); el.className = 'mui-toast'; document.body.appendChild(el); }
    el.textContent = message;
    el.classList.add('is-show');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () { el.classList.remove('is-show'); }, opts.duration || 1800);
  };

  /* ---------- 底部弹层 ---------- */
  MUI.sheet = function (options) {
    var opts = options || {};
    var mask = document.createElement('div');
    mask.className = 'mui-mask';
    var sheet = document.createElement('div');
    sheet.className = 'mui-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.innerHTML =
      '<div class="mui-sheet-hd">' + (opts.title || '') + '</div>' +
      '<div class="mui-sheet-bd">' + (opts.html || '') + '</div>' +
      (opts.actions ? '<div class="mui-sheet-ft">' + opts.actions + '</div>' : '');
    document.body.appendChild(mask);
    document.body.appendChild(sheet);
    requestAnimationFrame(function () { mask.classList.add('is-show'); sheet.classList.add('is-show'); });

    function close() {
      mask.classList.remove('is-show');
      sheet.classList.remove('is-show');
      setTimeout(function () { mask.remove(); sheet.remove(); }, 240);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    mask.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    if (typeof opts.onMount === 'function') opts.onMount(sheet, close);
    return { el: sheet, close: close };
  };

  /* ---------- 表单 ---------- */
  function fieldKey(el, index) {
    return el.getAttribute('data-field') || el.name || el.id || ('field' + index);
  }

  function controlsOf(row) {
    return qsa('input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]),select,textarea', row);
  }

  MUI.form = function (target) {
    var root = typeof target === 'string' ? qs(target) : target;
    if (!root) return null;

    function rows() {
      var list = qsa('.mui-row,.field,.form-row', root);
      return list.length ? list : [root];
    }

    function values() {
      var data = {};
      qsa('input[name],select[name],textarea[name]', root).forEach(function (el) {
        data[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      });
      return data;
    }

    function set(data) {
      Object.keys(data || {}).forEach(function (key) {
        var el = qs('[name="' + key + '"]', root) || qs('#' + key, root);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = !!data[key];
        else el.value = data[key] == null ? '' : data[key];
      });
    }

    function validate() {
      var ok = true;
      rows().forEach(function (row) {
        var required = row.hasAttribute('data-required') || !!qs('.mui-req,.req', row);
        if (!required) return;
        var ctrls = controlsOf(row);
        if (!ctrls.length) return;
        var empty = ctrls.every(function (c) { return !String(c.value || '').trim(); });
        row.classList.toggle('is-invalid', empty);
        if (empty && ok) {
          var err = qs('.mui-error,.err', row);
          if (err) err.style.display = 'block';
          ok = false;
        }
      });
      if (!ok) {
        var first = qs('.is-invalid', root) || qs('.invalid', root);
        if (first) {
          first.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var focusable = qs('input,select,textarea', first);
          if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 260);
        }
      }
      return ok;
    }

    function reset() {
      root.reset && root.reset();
      qsa('.is-invalid,.invalid', root).forEach(function (el) { el.classList.remove('is-invalid', 'invalid'); });
    }

    return { root: root, values: values, set: set, validate: validate, reset: reset };
  };

  /* ---------- 返回按钮组件 ---------- */
  MUI.back = function (options) {
    var o = options || {};
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mui-back' + (o.text ? ' mui-back--text' : '');
    btn.setAttribute('aria-label', o.label || '返回');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>' +
      (o.text ? '<span>' + o.text + '</span>' : '');
    btn.addEventListener('click', function () {
      if (typeof o.onClick === 'function') { o.onClick(); return; }
      if (o.href) { location.href = o.href; return; }
      if (history.length > 1) history.back();
      else location.href = o.fallback || 'home.html';
    });
    if (o.mount) {
      var host = typeof o.mount === 'string' ? qs(o.mount) : o.mount;
      if (host) host.insertBefore(btn, host.firstChild);
    }
    return btn;
  };

  /* ---------- 事件委托：输入即清除错误态 ---------- */
  document.addEventListener('input', function (e) {
    var row = e.target.closest && e.target.closest('.mui-row.is-invalid,.field.invalid,.form-row.is-invalid');
    if (row) row.classList.remove('is-invalid', 'invalid');
  }, true);

  global.MobileUI = MUI;
})(window);
