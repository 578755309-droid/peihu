/* 商城订单发货弹窗：按配送方式录入订单号 / 配送人 / 配送人手机号 */
(function () {
  var M = window.AKBMallAdmin;
  if (!M) return;

  var style = document.createElement('style');
  style.textContent = '.ship-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,32,65,.42)}.ship-mask.show{display:flex}.ship-dialog{width:min(540px,calc(100vw - 48px));max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 24px 60px rgba(12,33,73,.24)}.ship-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #E5EEF9}.ship-eyebrow{margin-bottom:4px;color:#7290BA;font-size:12px;font-weight:800}.ship-head h2{margin:0;color:#172033;font-size:19px;font-weight:900}.ship-close{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:9px;background:#F2F6FC;color:#62738C;font-size:22px;line-height:1;cursor:pointer}.ship-body{overflow-y:auto;padding:18px 24px 22px}.ship-order{padding:12px 14px;border-radius:10px;background:#F5F9FF;color:#536882;font-size:12px;font-weight:700;line-height:1.8}.ship-order b{color:#172033;font-size:13px}.ship-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.ship-field{display:flex;flex-direction:column;gap:7px}.ship-field.full{grid-column:1/-1}.ship-field label{color:#64758D;font-size:12px;font-weight:800}.ship-field label .req{color:#DC2626}.ship-field input,.ship-field select{width:100%;height:38px;box-sizing:border-box;border:1px solid #D6E4F5;border-radius:8px;padding:0 10px;background:#fff;color:#25364D;font:600 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;outline:none}.ship-field input:focus,.ship-field select:focus{border-color:#224CD3;box-shadow:0 0 0 3px rgba(34,76,211,.08)}.ship-hint{margin-top:12px;color:#8A9AB0;font-size:11px;font-weight:700;line-height:1.7}.ship-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;border-top:1px solid #E5EEF9}.ship-tip{color:#8A9AB0;font-size:11px;font-weight:700}.ship-btn{height:34px;padding:0 14px;border-radius:8px;font:800 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.ship-cancel{margin-right:8px;border:1px solid #D6E4F5;background:#fff;color:#617188}.ship-confirm{border:1px solid #224CD3;background:#224CD3;color:#fff}.ship-toast{position:fixed;z-index:1010;left:50%;bottom:30px;display:none;transform:translateX(-50%);padding:10px 15px;border-radius:9px;background:#172033;color:#fff;font-size:12px;font-weight:700;box-shadow:0 8px 25px rgba(0,0,0,.2)}.ship-toast.show{display:block}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend',
    '<div class="ship-mask" id="shipMask" aria-hidden="true"><section class="ship-dialog" role="dialog" aria-modal="true" aria-labelledby="shipTitle">' +
      '<header class="ship-head"><div><div class="ship-eyebrow" id="shipOrderNo">订单发货</div><h2 id="shipTitle">录入发货信息</h2></div>' +
      '<button class="ship-close" type="button" onclick="closeShipModal()" aria-label="关闭">×</button></header>' +
      '<div class="ship-body"><div class="ship-order" id="shipOrder"></div><div class="ship-fields" id="shipFields"></div><div class="ship-hint" id="shipHint"></div></div>' +
      '<footer class="ship-foot"><span class="ship-tip">确认后订单进入「待收货」，并生成签收收货码</span><div>' +
      '<button class="ship-cancel" type="button" onclick="closeShipModal()">取消</button>' +
      '<button class="ship-confirm" type="button" onclick="submitShip()">确认发货</button></div></footer>' +
    '</section></div><div class="ship-toast" id="shipToast"></div>');

  var COMPANIES = ['顺丰速运', '京东物流', '中通快递', '圆通速递', 'EMS'];
  var HINTS = {
    instant: '立即送达：填写平台配送单号与配送人信息，便于用户联系配送员。',
    runner: '跑腿送达：填写跑腿平台订单号与配送人信息，配送单号可在跑腿平台查询。',
    express: '快递送达：填写快递公司与快递单号，用户可据此查询物流进度。'
  };
  var activeNo = '';

  function value(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function field(label, control, required, full) {
    return '<div class="ship-field' + (full ? ' full' : '') + '"><label>' + label + (required ? ' <span class="req">*</span>' : '') + '</label>' + control + '</div>';
  }
  function control(id, valueText, placeholder) {
    return '<input id="' + id + '" value="' + M.esc(valueText || '') + '" placeholder="' + placeholder + '">';
  }

  function shipFields(o) {
    var method = o.deliveryMethod || 'express';
    var ship = o.shipInfo || {};
    var isExpress = method === 'express';
    var isRunner = method === 'runner';
    var noLabel = isExpress ? '快递单号' : (isRunner ? '跑腿订单号' : '配送单号');
    var noRequired = isExpress || isRunner;
    var html = '';
    if (isExpress) {
      html += field('快递公司', '<select id="shipCompany">' + COMPANIES.map(function (name) {
        return '<option' + (ship.company === name ? ' selected' : '') + '>' + name + '</option>';
      }).join('') + '</select>', true);
      html += field(noLabel, control('shipNo', ship.trackingNo, '请输入快递单号'), true);
    } else {
      html += field(noLabel, control('shipNo', ship.trackingNo, noRequired ? '请输入' + noLabel : '选填，便于后续追溯'), noRequired, true);
    }
    html += field('配送人', control('shipCourier', ship.courier, isExpress ? '请输入快递员姓名' : '请输入配送员姓名'), true);
    html += field('配送人手机号', control('shipCourierPhone', ship.courierPhone, '请输入 11 位手机号'), true);
    return html;
  }

  window.openShipModal = function (no) {
    var o = M.getOrder(no);
    if (!o) return;
    if (o.state !== '待发货') { showToast('仅「待发货」订单可执行发货操作'); return; }
    activeNo = no;
    var first = (o.items && o.items[0]) || {};
    document.getElementById('shipOrderNo').textContent = '订单发货 · ' + o.no;
    document.getElementById('shipOrder').innerHTML =
      '<b>' + M.esc(first.name || o.product || o.item || '商品') + ' · ' + o.quantity + ' 件</b><br>' +
      '收货人：' + M.esc(o.userName || '—') + '　' + M.esc(o.userPhone || '') + '<br>' +
      '配送方式：<span class="delivery-tag">' + M.esc(o.deliveryLabel) + '</span>　实付：' + M.money(o.amount) + '<br>' +
      '收货地址：' + M.esc(o.address || '—');
    document.getElementById('shipFields').innerHTML = shipFields(o);
    document.getElementById('shipHint').textContent = HINTS[o.deliveryMethod] || HINTS.express;
    document.getElementById('shipMask').classList.add('show');
    document.getElementById('shipMask').setAttribute('aria-hidden', 'false');
  };

  window.closeShipModal = function () {
    document.getElementById('shipMask').classList.remove('show');
    document.getElementById('shipMask').setAttribute('aria-hidden', 'true');
    activeNo = '';
  };

  window.submitShip = function () {
    var o = M.getOrder(activeNo);
    if (!o) return;
    var isExpress = o.deliveryMethod === 'express';
    var isRunner = o.deliveryMethod === 'runner';
    var noLabel = isExpress ? '快递单号' : (isRunner ? '跑腿订单号' : '配送单号');
    var trackingNo = value('shipNo');
    var courier = value('shipCourier');
    var courierPhone = value('shipCourierPhone');
    if ((isExpress || isRunner) && !trackingNo) { showToast('请填写' + noLabel); return; }
    if (!courier) { showToast('请填写配送人姓名'); return; }
    if (!/^1\d{10}$/.test(courierPhone)) { showToast('请填写正确的 11 位配送人手机号'); return; }

    var time = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var shippedAt = time.getFullYear() + '-' + pad(time.getMonth() + 1) + '-' + pad(time.getDate()) + ' ' + pad(time.getHours()) + ':' + pad(time.getMinutes());
    var patch = {
      state: '待收货',
      deliveredAt: shippedAt,
      deliveryLabel: o.deliveryLabel,
      shipInfo: {
        company: isExpress ? value('shipCompany') : '',
        trackingNo: trackingNo,
        courier: courier,
        courierPhone: courierPhone,
        shippedAt: shippedAt
      }
    };
    if (isExpress) { patch.logisticsCompany = patch.shipInfo.company; patch.logisticsNo = trackingNo; }
    if (!o.receiptCode) patch.receiptCode = M.genReceiptCode();
    M.updateOrder(activeNo, patch);
    window.closeShipModal();
    if (typeof window.AKBRefreshMallPage === 'function') window.AKBRefreshMallPage();
    showToast('订单已发货，待用户凭收货码签收');
  };

  function showToast(message) {
    var toast = document.getElementById('shipToast');
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  document.getElementById('shipMask').onclick = function (event) { if (event.target === this) window.closeShipModal(); };
})();
