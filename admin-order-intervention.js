(function () {
  var style = document.createElement('style');
  style.textContent = '.order-full-table .manual-op{display:inline-flex!important;align-items:center;height:26px;padding:0 8px!important;border:1px solid #BFD4F5!important;border-radius:6px!important;background:#F5F9FF!important;color:#224CD3!important}.intervention-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,32,65,.42)}.intervention-mask.show{display:flex}.intervention-dialog{width:min(760px,calc(100vw - 48px));max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 24px 60px rgba(12,33,73,.24)}.intervention-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #E5EEF9}.intervention-eyebrow{margin-bottom:4px;color:#7290BA;font-size:12px;font-weight:800}.intervention-head h2{margin:0;color:#172033;font-size:20px;font-weight:900}.intervention-close{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:9px;background:#F2F6FC;color:#62738C;font-size:24px;line-height:1;cursor:pointer}.intervention-body{overflow-y:auto;padding:18px 24px 22px}.intervention-order{padding:12px 14px;border-radius:10px;background:#F5F9FF;color:#536882;font-size:12px;font-weight:700}.intervention-order b{color:#172033;font-size:13px}.intervention-options{display:flex;flex-wrap:wrap;gap:8px;padding:18px 0 12px}.intervention-option{height:34px;padding:0 12px;border:1px solid #D6E4F5;border-radius:8px;background:#fff;color:#53647B;font:700 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.intervention-option.active{border-color:#224CD3;background:#EDF3FF;color:#224CD3;box-shadow:inset 0 0 0 1px #224CD3}.intervention-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:2px 0 16px}.intervention-field{display:flex;flex-direction:column;gap:7px}.intervention-field.full{grid-column:1/-1}.intervention-label{color:#64758D;font-size:12px;font-weight:800}.intervention-field input,.intervention-field select,.intervention-field textarea,#interventionRemark{width:100%;min-height:36px;border:1px solid #D6E4F5;border-radius:8px;padding:0 10px;background:#fff;color:#25364D;font:600 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;outline:none}.intervention-field textarea,#interventionRemark{height:72px;padding:9px 10px;resize:vertical}.intervention-field input:focus,.intervention-field select:focus,#interventionRemark:focus{border-color:#224CD3;box-shadow:0 0 0 3px rgba(34,76,211,.08)}#interventionRemark{margin-top:7px}.intervention-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;border-top:1px solid #E5EEF9}.intervention-tip{color:#8A9AB0;font-size:11px;font-weight:700}.intervention-cancel,.intervention-confirm{height:34px;padding:0 14px;border-radius:8px;font:800 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.intervention-cancel{margin-right:8px;border:1px solid #D6E4F5;background:#fff;color:#617188}.intervention-confirm{border:1px solid #224CD3;background:#224CD3;color:#fff}.intervention-toast{position:fixed;z-index:1010;left:50%;bottom:30px;display:none;transform:translateX(-50%);padding:10px 15px;border-radius:9px;background:#172033;color:#fff;font-size:12px;font-weight:700;box-shadow:0 8px 25px rgba(0,0,0,.2)}.intervention-toast.show{display:block}.intervention-refund{display:grid;gap:12px;margin-top:12px;padding:14px 16px;border:1px solid #E5EEF9;border-radius:12px;background:#FBFDFF}.intervention-refund-head{display:flex;align-items:center;gap:8px;color:#172033;font-size:13px;font-weight:900}.intervention-refund-head .badge{padding:2px 8px;border-radius:99px;background:#FEE2E2;color:#DC2626;font-size:11px;font-weight:800}.intervention-refund-head .time{margin-left:auto;color:#8A9AB0;font-size:11px;font-weight:700}.intervention-refund-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.intervention-refund-item{display:flex;flex-direction:column;gap:6px}.intervention-refund-item.full{grid-column:1/-1}.intervention-refund-item .k{color:#8A9AB0;font-size:11px;font-weight:800}.intervention-refund-item .v{color:#25364D;font-size:12px;font-weight:700;line-height:1.65;white-space:pre-wrap;word-break:break-word}.intervention-refund-item .v.amount{color:#DC2626;font-size:17px;font-weight:900}.intervention-photos{display:flex;flex-wrap:wrap;gap:8px}.intervention-photo{position:relative;width:86px;height:86px;border:1px solid #D6E4F5;border-radius:10px;overflow:hidden;background:#F2F6FC;cursor:zoom-in}.intervention-photo img{display:block;width:100%;height:100%;object-fit:cover}.intervention-photo span{position:absolute;left:0;right:0;bottom:0;padding:2px 0;background:rgba(12,32,65,.62);color:#fff;font-size:10px;font-weight:700;text-align:center}.intervention-photo-empty{padding:10px 12px;border:1px dashed #D6E4F5;border-radius:10px;background:#FBFDFF;color:#8A9AB0;font-size:12px;font-weight:700}.intervention-photo-tip{margin-top:6px;color:#8A9AB0;font-size:11px;font-weight:700}.intervention-lightbox{position:fixed;inset:0;z-index:1020;display:none;align-items:center;justify-content:center;padding:32px;background:rgba(8,22,48,.74)}.intervention-lightbox.show{display:flex}.intervention-lightbox img{max-width:min(760px,92vw);max-height:88vh;border-radius:12px;background:#fff;box-shadow:0 24px 60px rgba(0,0,0,.42)}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', '<div class="intervention-mask" id="interventionMask" aria-hidden="true"><section class="intervention-dialog" role="dialog" aria-modal="true" aria-labelledby="interventionTitle"><header class="intervention-head"><div><div class="intervention-eyebrow" id="interventionOrderNo">订单人工介入</div><h2 id="interventionTitle">选择处理操作</h2></div><button class="intervention-close" type="button" onclick="closeOrderIntervention()" aria-label="关闭">×</button></header><div class="intervention-body"><div class="intervention-order" id="interventionOrder"></div><div class="intervention-refund" id="interventionRefund" style="display:none"></div><div class="intervention-options" id="interventionOptions"></div><div class="intervention-form" id="interventionForm"></div><label class="intervention-label" id="interventionRemarkLabel" for="interventionRemark">处理说明</label><textarea id="interventionRemark" placeholder="请填写本次人工介入的原因或处理说明"></textarea></div><footer class="intervention-foot"><span class="intervention-tip">操作将记录管理员、处理时间与说明</span><div><button class="intervention-cancel" type="button" onclick="closeOrderIntervention()">取消</button><button class="intervention-confirm" type="button" onclick="submitOrderIntervention()">确认处理</button></div></footer></section></div><div class="intervention-toast" id="interventionToast"></div><div class="intervention-lightbox" id="interventionLightbox" onclick="this.classList.remove(\'show\')"><img id="interventionLightboxImg" alt="退款凭证预览"></div>');

  var plans = {
    '待支付': ['关闭订单'],
    '支付中': ['关闭订单'],
    '已支付': ['取消订单'],
    '待服务': ['指派/更换陪护员', '调整服务时间', '修改服务地址', '修改就诊人', '取消订单'],
    '服务中': ['更换陪护员', '补录日报', '取消订单'],
    '退款/售后': ['审核通过', '审核驳回'],
    '已取消': ['查看取消原因', '复制订单重新创建']
  };
  var activeOrder = null;
  var activeAction = '';

  function mallPlans(state) {
    return {
      '待支付': ['关闭订单', '取消订单'],
      '支付中': ['关闭订单', '取消订单'],
      '已支付': ['取消订单'],
      '待发货': ['发货', '标记配送中', '修改收货信息', '取消订单'],
      '配送中': ['标记待收货确认', '修改物流信息', '标记配送异常'],
      '待收货确认': ['人工确认收货', '修改收货码', '发起售后'],
      '已完成': ['发起售后'],
      '退款/售后': ['审核通过', '审核驳回'],
      '已取消': ['复制订单重新创建']
    }[state] || [];
  }

  function findOrder(no) {
    var order = ORDERS.find(function (item) { return item.no === no; });
    if (!order || order.type !== '商城订单') return order;
    try {
      var overrides = JSON.parse(localStorage.getItem('akb_admin_mall_order_overrides_v1') || '{}') || {};
      return Object.assign(order, overrides[no] || {});
    } catch (error) { return order; }
  }
  function field(label, control, full) { return '<div class="intervention-field ' + (full || '') + '"><label class="intervention-label">' + label + '</label>' + control + '</div>'; }

  function esc(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* 用户提交的退款申请信息（服务订单 / 商城订单） */
  function refundAppOf(order) {
    if (order && order.type === '商城订单') {
      return {
        reason: order.refundReason || '用户未填写退款原因',
        amount: String(order.refundAmount || order.amount || '').replace(/[^0-9.]/g, ''),
        description: order.refundRemark || '用户未填写补充描述。',
        photos: order.refundPhotos || [],
        appliedAt: order.refundAppliedAt || order.orderedAt || '—'
      };
    }
    if (order && order.refundApp) return order.refundApp;
    return {
      reason: '服务内容不符合预期',
      amount: String((order && order.amount) || '').replace(/[^0-9.]/g, ''),
      description: '用户未填写补充描述。',
      photos: [],
      appliedAt: (order && order.orderedAt) || '—'
    };
  }
  function refundAmountValue() { return String(refundAppOf(activeOrder).amount || '').replace(/[^0-9.]/g, ''); }

  function renderRefundInfo() {
    var box = document.getElementById('interventionRefund');
    if (!activeOrder || activeOrder.state !== '退款/售后') {
      box.style.display = 'none';
      box.innerHTML = '';
      return;
    }
    var app = refundAppOf(activeOrder);
    var photos = app.photos || [];
    var photosHTML = photos.length
      ? '<div class="intervention-photos">' + photos.map(function (src, index) {
          return '<div class="intervention-photo" onclick="openRefundPhoto(\'' + esc(src) + '\')"><img src="' + esc(src) + '" alt="退款凭证 ' + (index + 1) + '"><span>凭证 ' + (index + 1) + '</span></div>';
        }).join('') + '</div><div class="intervention-photo-tip">点击缩略图可查看大图</div>'
      : '<div class="intervention-photo-empty">用户未上传凭证照片</div>';
    box.innerHTML = '<div class="intervention-refund-head">用户退款申请信息<span class="badge">待审核</span><span class="time">提交于 ' + esc(app.appliedAt) + '</span></div>' +
      '<div class="intervention-refund-grid">' +
        '<div class="intervention-refund-item"><div class="k">退款原因</div><div class="v">' + esc(app.reason) + '</div></div>' +
        '<div class="intervention-refund-item"><div class="k">申请退款金额</div><div class="v amount">¥' + esc(app.amount) + '</div></div>' +
        '<div class="intervention-refund-item full"><div class="k">补充描述</div><div class="v">' + esc(app.description || '用户未填写') + '</div></div>' +
        '<div class="intervention-refund-item full"><div class="k">凭证照片（' + photos.length + '）</div>' + photosHTML + '</div>' +
      '</div>';
    box.style.display = '';
  }

  window.openRefundPhoto = function (src) {
    document.getElementById('interventionLightboxImg').src = src;
    document.getElementById('interventionLightbox').classList.add('show');
  };

  function setRemarkLabel(action) {
    var label = document.getElementById('interventionRemarkLabel');
    var remark = document.getElementById('interventionRemark');
    if (action === '审核通过') { label.textContent = '审核说明（选填）'; remark.placeholder = '可填写退款说明，将同步给用户'; }
    else if (action === '审核驳回') { label.textContent = '驳回处理说明'; remark.placeholder = '请填写驳回原因与处理说明，将同步给用户'; }
    else { label.textContent = '处理说明'; remark.placeholder = '请填写本次人工介入的原因或处理说明'; }
  }

  function renderFields() {
    var form = document.getElementById('interventionForm');
    var full = '';
    if (activeOrder && activeOrder.type === '商城订单') {
      if (activeAction === '发货') {
        var isExp = activeOrder.deliveryType === '快递送达';
        var isRun = activeOrder.deliveryType === '跑腿送达';
        var noLabel = isExp ? '快递单号' : (isRun ? '跑腿订单号' : '配送单号');
        var ship = activeOrder.shipInfo || {};
        var comps = ['顺丰速运', '京东物流', '中通快递', '圆通速递', 'EMS'];
        var dt = activeOrder.deliveryType || '立即送达';
        full = field('配送方式', '<select id="mallShipDelivery" onchange="mallShipDeliveryChange()"><option' + (dt === '立即送达' ? ' selected' : '') + '>立即送达</option><option' + (dt === '跑腿送达' ? ' selected' : '') + '>跑腿送达</option><option' + (dt === '快递送达' ? ' selected' : '') + '>快递送达</option></select>');
        if (isExp) {
          full += field('快递公司', '<select id="mallShipCompany">' + comps.map(function (c) { return '<option' + (ship.company === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>');
        }
        full += field(noLabel, '<input id="mallShipNo" value="' + esc(ship.trackingNo || '') + '" placeholder="请输入' + noLabel + '">', isExp ? '' : 'full');
        full += field('配送人', '<input id="mallShipCourier" value="' + esc(ship.courier || '') + '" placeholder="请输入配送员姓名">');
        full += field('配送人手机号', '<input id="mallShipCourierPhone" value="' + esc(ship.courierPhone || '') + '" maxlength="11" placeholder="请输入 11 位手机号">');
      } else if (activeAction === '修改配送方式') {
        full = field('配送方式', '<select id="mallDeliveryType"><option>立即送达</option><option>跑腿送达</option><option>快递送达</option></select>');
      } else if (activeAction === '修改收货信息') {
        full = field('收货人', '<input id="mallReceiver" value="' + (activeOrder.receiver || activeOrder.user || '') + '">') + field('联系电话', '<input id="mallReceiverPhone" value="' + (activeOrder.receiverPhone || activeOrder.userPhone || '') + '">') + field('收货地址', '<input id="mallAddress" value="' + (activeOrder.address || '') + '">', 'full');
      } else if (activeAction === '修改物流信息') {
        full = field('物流公司', '<input id="mallLogisticsCompany" value="' + (activeOrder.logisticsCompany || '') + '">') + field('物流单号', '<input id="mallLogisticsNo" value="' + (activeOrder.logisticsNo || '') + '">');
      } else if (activeAction === '修改收货码') {
        full = field('收货码', '<input id="mallReceiveCode" maxlength="8" value="' + (activeOrder.receiveCode || '') + '">');
      } else if (activeAction === '审核通过') {
        full = field('退款金额（元）', '<input id="manualRefund" type="number" min="0" step="0.01" value="' + refundAmountValue() + '">') + field('退款方式', '<select id="manualRefundMethod"><option>原路退回</option><option>人工转账</option><option>退至平台余额</option></select>');
      }
      form.innerHTML = full;
      if (document.getElementById('mallDeliveryType')) document.getElementById('mallDeliveryType').value = activeOrder.deliveryType || '立即送达';
      return;
    }
    if (activeAction === '指派/更换陪护员' || activeAction === '更换陪护员') {
      full = field('陪护员', '<select id="manualNurse"><option>张阿姨 · 138****2468</option><option>李师傅 · 139****8572</option><option>王阿姨 · 186****3016</option><option>陈阿姨 · 177****9183</option></select>') + field('生效时间', '<input id="manualEffective" type="datetime-local" value="2026-04-12T08:00">');
    } else if (activeAction === '调整服务时间') {
      full = field('开始时间', '<input id="manualStart" type="datetime-local" value="2026-04-13T08:00">') + field('结束时间', '<input id="manualEnd" type="datetime-local" value="2026-04-15T08:00">');
    } else if (activeAction === '修改服务地址') {
      full = field('地址类型', '<select id="manualAddressType"><option>家</option><option>医院</option></select>') + field('服务地址', '<input id="manualAddress" value="北京市朝阳区望京街道 88 号 2 单元 1602">', 'full');
    } else if (activeAction === '修改就诊人') {
      full = field('选择就诊人', '<select id="manualPatient"><option>张爷爷 · 男 · 68岁</option><option>李先生 · 男 · 72岁</option><option>赵阿姨 · 女 · 61岁</option></select>') + field('联系电话', '<input id="manualPatientPhone" value="138****2468">');
    } else if (activeAction === '补录日报') {
      full = field('日报日期', '<input id="manualReportDate" type="date" value="2026-04-12">') + field('服务状态', '<select id="manualReportStatus"><option>服务正常</option><option>已处理异常</option></select>') + field('日报内容', '<textarea id="manualReport" placeholder="填写当日服务事项、健康情况和异常说明"></textarea>', 'full');
    } else if (activeAction === '审核通过') {
      full = field('退款金额（元）', '<input id="manualRefund" type="number" min="0" step="0.01" value="' + refundAmountValue() + '">') + field('退款方式', '<select id="manualRefundMethod"><option>原路退回</option><option>人工转账</option><option>退至平台余额</option></select>');
    } else if (activeAction === '审核驳回') {
      full = '';
    } else if (activeAction === '查看取消原因') {
      full = '<div class="intervention-field full"><label class="intervention-label">取消原因</label><div class="intervention-order">用户临时调整服务计划，已于 2026-04-07 11:03 取消订单。</div></div>';
    }
    form.innerHTML = full;
  }

  window.mallShipDeliveryChange = function () {
    var keep = {};
    ['mallShipNo', 'mallShipCourier', 'mallShipCourierPhone'].forEach(function (id) { var el = document.getElementById(id); if (el) keep[id] = el.value; });
    activeOrder.deliveryType = document.getElementById('mallShipDelivery').value;
    renderFields();
    Object.keys(keep).forEach(function (id) { var el = document.getElementById(id); if (el) el.value = keep[id]; });
  };

  window.openOrderIntervention = function (no, preset) {
    activeOrder = findOrder(no);
    if (!activeOrder) return;
    var actions = activeOrder.type === '商城订单' ? mallPlans(activeOrder.state) : (plans[activeOrder.state] || []);
    if (!actions.length) { showToast('当前订单暂无可执行的人工介入操作'); return; }
    var initAction = (preset && actions.indexOf(preset) > -1) ? preset : actions[0];
    document.getElementById('interventionOrderNo').textContent = '订单人工介入 · ' + activeOrder.no;
    document.getElementById('interventionOrder').innerHTML = '<b>' + activeOrder.type + ' · ' + activeOrder.item + '</b>　当前状态：' + activeOrder.state + '　用户：' + activeOrder.user;
    document.getElementById('interventionOptions').innerHTML = actions.map(function (action) { return '<button type="button" class="intervention-option ' + (action === initAction ? 'active' : '') + '" data-action="' + action + '">' + action + '</button>'; }).join('');
    activeAction = initAction;
    document.getElementById('interventionRemark').value = '';
    renderRefundInfo();
    setRemarkLabel(activeAction);
    renderFields();
    document.querySelectorAll('.intervention-option').forEach(function (button) { button.onclick = function () { document.querySelectorAll('.intervention-option').forEach(function (item) { item.classList.remove('active'); }); button.classList.add('active'); activeAction = button.dataset.action; setRemarkLabel(activeAction); renderFields(); }; });
    document.getElementById('interventionMask').classList.add('show');
    document.getElementById('interventionMask').setAttribute('aria-hidden', 'false');
  };

  window.closeOrderIntervention = function () {
    document.getElementById('interventionMask').classList.remove('show');
    document.getElementById('interventionMask').setAttribute('aria-hidden', 'true');
    activeOrder = null;
    activeAction = '';
  };

  window.submitOrderIntervention = function () {
    if (!activeOrder || !activeAction) return;
    var message = '已完成“' + activeAction + '”';
    if (activeOrder.type === '商城订单') {
      if (activeAction === '发货') {
        var delSel = document.getElementById('mallShipDelivery');
        if (delSel) activeOrder.deliveryType = delSel.value;
        var isExp2 = activeOrder.deliveryType === '快递送达';
        var isRun2 = activeOrder.deliveryType === '跑腿送达';
        var shipNo = document.getElementById('mallShipNo').value.trim();
        var shipCourier = document.getElementById('mallShipCourier').value.trim();
        var shipPhone = document.getElementById('mallShipCourierPhone').value.trim();
        if ((isExp2 || isRun2) && !shipNo) { showToast('请填写' + (isExp2 ? '快递单号' : '跑腿订单号')); return; }
        if (!shipCourier) { showToast('请填写配送人姓名'); return; }
        if (!/^1\d{10}$/.test(shipPhone)) { showToast('请填写正确的 11 位配送人手机号'); return; }
        var company = isExp2 ? document.getElementById('mallShipCompany').value : '';
        activeOrder.state = '待收货确认';
        activeOrder.receiptStatus = '待用户确认';
        activeOrder.shipInfo = { company: company, trackingNo: shipNo, courier: shipCourier, courierPhone: shipPhone };
        if (isExp2) { activeOrder.logisticsCompany = company; activeOrder.logisticsNo = shipNo; }
        message = '订单已发货，待用户凭收货码签收';
      }
      if (activeAction === '关闭订单' || activeAction === '取消订单') { activeOrder.state = '已取消'; message = '商城订单已取消'; }
      if (activeAction === '标记配送中') { activeOrder.state = '配送中'; message = '已标记为配送中'; }
      if (activeAction === '标记待收货确认') { activeOrder.state = '待收货确认'; activeOrder.receiptStatus = '待用户确认'; message = '已进入待收货确认'; }
      if (activeAction === '标记配送异常') { activeOrder.state = '退款/售后'; activeOrder.receiptStatus = '配送异常待处理'; message = '已标记配送异常'; }
      if (activeAction === '人工确认收货') { activeOrder.state = '已完成'; activeOrder.receiptStatus = '后台人工确认'; activeOrder.confirmedBy = '管理员'; activeOrder.deliveredAt = '刚刚'; message = '已人工确认收货'; }
      if (activeAction === '发起售后') { activeOrder.state = '退款/售后'; activeOrder.receiptStatus = '售后处理中'; message = '已发起售后处理'; }
      if (activeAction === '审核通过') {
        var refundInput = document.getElementById('manualRefund');
        var methodInput = document.getElementById('manualRefundMethod');
        var refundValue = refundInput ? refundInput.value.trim() : '';
        if (!refundValue || isNaN(Number(refundValue)) || Number(refundValue) <= 0) { showToast('请填写有效的退款金额'); return; }
        activeOrder.refundAmount = refundValue;
        activeOrder.refundMethod = methodInput ? methodInput.value : '原路退回';
        activeOrder.refundState = '审核通过 · 退款完成';
        activeOrder.refundReviewNote = document.getElementById('interventionRemark').value.trim() || '审核通过';
        activeOrder.refundReviewedAt = '刚刚';
        activeOrder.refundAt = '刚刚';
        activeOrder.state = '已退款';
        message = '退款申请已审核通过：¥' + refundValue + ' · ' + activeOrder.refundMethod;
      }
      if (activeAction === '审核驳回') {
        var rejectNote = document.getElementById('interventionRemark').value.trim();
        if (!rejectNote) { showToast('请填写驳回处理说明'); return; }
        activeOrder.refundState = '审核驳回';
        activeOrder.refundReviewNote = rejectNote;
        activeOrder.refundReviewedAt = '刚刚';
        activeOrder.state = '待收货确认';
        message = '退款申请已驳回，订单继续履约';
      }
      if (activeAction === '修改配送方式') { activeOrder.deliveryType = document.getElementById('mallDeliveryType').value; activeOrder.deliveryFee = '已含在商品售价内'; message = '配送方式已修改'; }
      if (activeAction === '修改收货信息') { activeOrder.receiver = document.getElementById('mallReceiver').value.trim(); activeOrder.receiverPhone = document.getElementById('mallReceiverPhone').value.trim(); activeOrder.address = document.getElementById('mallAddress').value.trim(); activeOrder.addressModified = true; activeOrder.addressModifiedAt = new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'); activeOrder.addressModifiedBy = '管理员'; message = '收货信息已修改'; }
      if (activeAction === '修改物流信息') { activeOrder.logisticsCompany = document.getElementById('mallLogisticsCompany').value.trim() || '—'; activeOrder.logisticsNo = document.getElementById('mallLogisticsNo').value.trim() || '—'; message = '物流信息已修改'; }
      if (activeAction === '修改收货码') { activeOrder.receiveCode = document.getElementById('mallReceiveCode').value.trim(); message = '收货码已修改'; }
      var mallOverrides = {};
      try { mallOverrides = JSON.parse(localStorage.getItem('akb_admin_mall_order_overrides_v1') || '{}') || {}; } catch (error) { mallOverrides = {}; }
      mallOverrides[activeOrder.no] = { state: activeOrder.state, deliveryType: activeOrder.deliveryType, deliveryFee: activeOrder.deliveryFee, receiver: activeOrder.receiver, receiverPhone: activeOrder.receiverPhone, address: activeOrder.address, addressModified: activeOrder.addressModified, addressModifiedAt: activeOrder.addressModifiedAt, addressModifiedBy: activeOrder.addressModifiedBy, logisticsCompany: activeOrder.logisticsCompany, logisticsNo: activeOrder.logisticsNo, receiveCode: activeOrder.receiveCode, receiptStatus: activeOrder.receiptStatus, confirmedBy: activeOrder.confirmedBy, deliveredAt: activeOrder.deliveredAt, refundState: activeOrder.refundState, refundAmount: activeOrder.refundAmount, refundMethod: activeOrder.refundMethod, refundReviewNote: activeOrder.refundReviewNote, refundReviewedAt: activeOrder.refundReviewedAt, refundAt: activeOrder.refundAt, shipInfo: activeOrder.shipInfo };
      localStorage.setItem('akb_admin_mall_order_overrides_v1', JSON.stringify(mallOverrides));
      closeOrderIntervention();
      if (typeof window.AKBRefreshAdminMallOverrides === 'function') window.AKBRefreshAdminMallOverrides();
      if (typeof window.render === 'function') window.render();
      showToast(message);
      return;
    }
    if (activeAction === '关闭订单' || activeAction === '取消订单') { activeOrder.state = '已取消'; message = '订单已取消'; }
    if (activeAction === '审核通过') {
      var refundInput = document.getElementById('manualRefund');
      var methodInput = document.getElementById('manualRefundMethod');
      var refundValue = refundInput ? refundInput.value.trim() : '';
      if (!refundValue || Number(refundValue) <= 0) { showToast('请填写有效的退款金额'); return; }
      activeOrder.refundAmount = refundValue;
      activeOrder.refundMethod = methodInput ? methodInput.value : '原路退回';
      activeOrder.refundState = '审核通过 · 退款中';
      activeOrder.refundReviewNote = document.getElementById('interventionRemark').value.trim() || '审核通过';
      activeOrder.refundReviewedAt = '刚刚';
      activeOrder.state = '已取消';
      message = '退款申请已审核通过：¥' + refundValue + ' · ' + activeOrder.refundMethod;
    }
    if (activeAction === '审核驳回') {
      var rejectNote = document.getElementById('interventionRemark').value.trim();
      if (!rejectNote) { showToast('请填写驳回处理说明'); return; }
      activeOrder.refundState = '审核驳回';
      activeOrder.refundReviewNote = rejectNote;
      activeOrder.refundReviewedAt = '刚刚';
      activeOrder.state = '已完成';
      message = '退款申请已驳回';
    }
    if (activeAction === '复制订单重新创建') { message = '已复制订单信息，可据此创建新订单'; }
    if (activeAction === '指派/更换陪护员' || activeAction === '更换陪护员') {
      var nurse = document.getElementById('manualNurse');
      if (nurse) { activeOrder.nurse = nurse.value.split(' · ')[0]; activeOrder.nursePhone = nurse.value.split(' · ')[1] || '—'; }
    }
    if (activeAction === '调整服务时间') {
      var start = document.getElementById('manualStart'); var end = document.getElementById('manualEnd');
      if (start && end) activeOrder.time = start.value.replace('T', ' ') + ' - ' + end.value.replace('T', ' ');
    }
    activeOrder.interventionNote = '管理员已' + activeAction + ' · 刚刚';
    closeOrderIntervention();
    window.render();
    showToast(message);
  };

  function showToast(message) {
    var toast = document.getElementById('interventionToast');
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  document.getElementById('interventionMask').onclick = function (event) { if (event.target === this) window.closeOrderIntervention(); };
})();
