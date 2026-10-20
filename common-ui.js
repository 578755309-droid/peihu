/* 全局轻提示与确认弹窗：替代原生 alert/confirm（原生弹窗会导致内嵌 WebView2 预览卡死） */
(function () {
  'use strict';

  function ensureStyle() {
    if (document.getElementById('cui-style')) return;
    var st = document.createElement('style');
    st.id = 'cui-style';
    st.textContent = [
      '.cui-toast{position:fixed;left:50%;top:18%;transform:translateX(-50%) translateY(-8px);max-width:min(320px,80vw);padding:11px 18px;border-radius:12px;background:rgba(20,16,32,.88);color:#fff;font-size:13px;font-weight:600;line-height:1.5;text-align:center;z-index:99999;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;box-shadow:0 8px 28px rgba(20,16,32,.28)}',
      '.cui-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',
      '.cui-mask{position:fixed;inset:0;background:rgba(15,12,26,.45);z-index:99998;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s}',
      '.cui-mask.show{opacity:1}',
      '.cui-dialog{width:min(300px,82vw);background:#fff;border-radius:16px;padding:22px 20px 16px;box-shadow:0 18px 50px rgba(15,12,26,.3);transform:scale(.94);transition:transform .18s}',
      '.cui-mask.show .cui-dialog{transform:scale(1)}',
      '.cui-title{font-size:15px;font-weight:800;color:#221d33;text-align:center}',
      '.cui-msg{margin-top:8px;font-size:13px;color:#5d5870;line-height:1.6;text-align:center;white-space:pre-wrap;word-break:break-all}',
      '.cui-btns{display:flex;gap:10px;margin-top:18px}',
      '.cui-btn{flex:1;height:40px;border-radius:11px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid #E4E0EE;background:#F6F4FA;color:#5d5870}',
      '.cui-btn.primary{border-color:#1CD8B7;background:#1CD8B7;color:#fff}',
      '.cui-btn.danger{border-color:#EF4444;background:#EF4444;color:#fff}'
    ].join('\n');
    document.head.appendChild(st);
  }

  var toastTimer = null;
  function showToast(msg, duration) {
    ensureStyle();
    var t = document.querySelector('.cui-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'cui-toast';
      document.body.appendChild(t);
    }
    t.textContent = String(msg == null ? '' : msg);
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, duration || 2200);
  }

  /**
   * 确认弹窗（Promise 版 confirm）
   * showConfirm('确认删除？') 或 showConfirm({ title:'提示', message:'确认删除？', okText:'删除', danger:true })
   * 返回 Promise<boolean>
   */
  function showConfirm(msg, opts) {
    ensureStyle();
    var o = {};
    if (typeof msg === 'object' && msg !== null) { o = msg; }
    else { o.message = msg; }
    if (opts) { for (var k in opts) o[k] = opts[k]; }
    return new Promise(function (resolve) {
      var mask = document.createElement('div');
      mask.className = 'cui-mask';
      mask.innerHTML =
        '<div class="cui-dialog">' +
          '<div class="cui-title">' + escapeHtml(o.title || '提示') + '</div>' +
          '<div class="cui-msg">' + escapeHtml(o.message || '') + '</div>' +
          '<div class="cui-btns">' +
            '<button type="button" class="cui-btn" data-act="cancel">' + escapeHtml(o.cancelText || '取消') + '</button>' +
            '<button type="button" class="cui-btn ' + (o.danger ? 'danger' : 'primary') + '" data-act="ok">' + escapeHtml(o.okText || '确认') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(mask);
      requestAnimationFrame(function () { mask.classList.add('show'); });
      function done(val) {
        mask.classList.remove('show');
        setTimeout(function () { mask.remove(); }, 200);
        resolve(val);
      }
      mask.addEventListener('click', function (e) {
        var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'ok') return done(true);
        if (act === 'cancel') return done(false);
        if (e.target === mask) return done(false);
      });
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /* 上传图片预处理：等比压缩到页面宽度（默认750px），返回 dataURL；PNG 保留透明底，其余转 JPEG */
  window.akbFitImage = window.akbFitImage || function (file, cb, maxW) {
    var limit = maxW || 750;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        if (img.width <= limit) { cb(reader.result); return; }
        var h = Math.round(img.height * limit / img.width);
        var canvas = document.createElement('canvas');
        canvas.width = limit; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, limit, h);
        var isPng = file.type === 'image/png';
        cb(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.85));
      };
      img.onerror = function () { cb(reader.result); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  /* 覆盖原生 alert：所有存量 alert('...') 调用自动变为页内 Toast，避免卡死 */
  window.showToast = window.showToast || showToast;
  window.showConfirm = window.showConfirm || showConfirm;
  var toastAlert = function (msg) { window.showToast(msg); };
  /* IDE 内嵌 WebView2 宿主会在页面加载后再次覆盖 window.alert，用 defineProperty 锁定，吞掉后续赋值 */
  try {
    Object.defineProperty(window, 'alert', {
      configurable: true,
      get: function () { return toastAlert; },
      set: function () { /* 忽略外部覆盖 */ }
    });
  } catch (e) {
    window.alert = toastAlert;
    window.addEventListener('load', function () { setTimeout(function () { window.alert = toastAlert; }, 0); });
  }
})();

/* ── 联系人信息组件：联系人姓名 + 联系电话，统一各处表单界面 ──
   用法：AKBContact.render(target, opts)
   opts: { showName:false 隐藏姓名, nameLabel, namePlaceholder, nameId,
           phoneLabel, phonePlaceholder, phoneId } */
(function () {
  'use strict';
  var STYLE = [
    '.akb-contact{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.akb-contact.single{grid-template-columns:1fr}',
    '.akb-contact-label{display:block;font-size:12px;color:#6B6880;font-weight:700;margin:0 0 6px;font-family:inherit}',
    '.akb-contact-input{width:100%;height:44px;border:1.5px solid #EDE9F5;border-radius:12px;background:#F5F5F5;color:#1A1828;padding:0 12px;font:600 14px inherit;outline:none;transition:border-color .15s,background .15s;box-sizing:border-box;-webkit-appearance:none;appearance:none}',
    '.akb-contact-input:focus{border-color:#1CD8B7;background:#fff}',
    '.akb-contact-input::placeholder{color:#AEACC0;font-weight:500}'
  ].join('\n');
  window.AKBContact = {
    render: function (target, opts) {
      opts = opts || {};
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return null;
      var nameId = opts.nameId || 'contactName';
      var phoneId = opts.phoneId || 'contactPhone';
      var showName = opts.showName !== false;
      if (!document.getElementById('akb-contact-style')) {
        var st = document.createElement('style');
        st.id = 'akb-contact-style';
        st.textContent = STYLE;
        document.head.appendChild(st);
      }
      el.classList.add('akb-contact');
      el.classList.toggle('single', !showName);
      el.innerHTML = (showName
        ? '<div class="akb-contact-item"><label class="akb-contact-label" id="' + nameId + 'Label" for="' + nameId + '">' + (opts.nameLabel || '联系人姓名') + '</label>'
          + '<input class="akb-contact-input" id="' + nameId + '" type="text" maxlength="20" autocomplete="name" placeholder="' + (opts.namePlaceholder || '请填写联系人姓名') + '" /></div>'
        : '')
        + '<div class="akb-contact-item"><label class="akb-contact-label" id="' + phoneId + 'Label" for="' + phoneId + '">' + (opts.phoneLabel || '联系电话') + '</label>'
        + '<input class="akb-contact-input" id="' + phoneId + '" type="tel" maxlength="11" inputmode="numeric" autocomplete="tel" placeholder="' + (opts.phonePlaceholder || '请填写11位手机号') + '" /></div>';
      return el;
    }
  };
})();

/* ── 上传图片组件：缩略图 + 添加按钮，自动等比压缩 ──
   用法：var up = AKBImageUpload.render(target, { max: 3, label: '添加图片' })
   up.get() 返回已选图片 dataURL 数组；点击缩略图移除 */
(function () {
  'use strict';
  var STYLE = [
    '.akb-upload{display:flex;gap:10px;flex-wrap:wrap}',
    '.akb-upload-btn{width:72px;height:72px;border:1.5px dashed #EDE9F5;border-radius:12px;background:#FAFAFC;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#AEACC0;font-size:10px;font-weight:700;cursor:pointer;box-sizing:border-box;text-align:center}',
    '.akb-upload-btn svg{width:20px;height:20px}',
    '.akb-upload-thumb{width:72px;height:72px;border-radius:12px;object-fit:cover;border:1px solid #EDE9F5;cursor:pointer}'
  ].join('\n');
  window.AKBImageUpload = {
    render: function (target, opts) {
      opts = opts || {};
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return null;
      var max = opts.max || 3;
      var photos = [];
      if (!document.getElementById('akb-upload-style')) {
        var st = document.createElement('style');
        st.id = 'akb-upload-style';
        st.textContent = STYLE;
        document.head.appendChild(st);
      }
      el.classList.add('akb-upload');
      var file = document.createElement('input');
      file.type = 'file'; file.accept = 'image/*'; file.style.display = 'none';
      el.appendChild(file);
      function draw() {
        Array.prototype.forEach.call(el.querySelectorAll('.akb-upload-thumb,.akb-upload-btn'), function (n) { n.remove(); });
        photos.forEach(function (src, i) {
          var img = document.createElement('img');
          img.className = 'akb-upload-thumb'; img.src = src;
          img.title = '点击移除';
          img.onclick = function () { photos.splice(i, 1); draw(); };
          el.insertBefore(img, file);
        });
        if (photos.length < max) {
          var btn = document.createElement('div');
          btn.className = 'akb-upload-btn';
          btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#AEACC0" stroke-width="1.8" stroke-linecap="round"/></svg>' + (opts.label || '添加图片');
          btn.onclick = function () { file.click(); };
          el.insertBefore(btn, file);
        }
      }
      file.onchange = function () {
        var f = file.files && file.files[0];
        if (!f) return;
        if (window.akbFitImage) {
          window.akbFitImage(f, function (dataUrl) { photos.push(dataUrl); draw(); });
        } else {
          var reader = new FileReader();
          reader.onload = function (ev) { photos.push(ev.target.result); draw(); };
          reader.readAsDataURL(f);
        }
        file.value = '';
      };
      draw();
      return { get: function () { return photos.slice(); } };
    }
  };
})();
