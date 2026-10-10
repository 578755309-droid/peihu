(function () {
  var style = document.createElement('style');
  style.textContent = '.order-full-table .manual-op{display:inline-flex!important;align-items:center;height:26px;padding:0 8px!important;border:1px solid #BFD4F5!important;border-radius:6px!important;background:#F5F9FF!important;color:#224CD3!important}.intervention-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,32,65,.42)}.intervention-mask.show{display:flex}.intervention-dialog{width:min(760px,calc(100vw - 48px));max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 24px 60px rgba(12,33,73,.24)}.intervention-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #E5EEF9}.intervention-eyebrow{margin-bottom:4px;color:#7290BA;font-size:12px;font-weight:800}.intervention-head h2{margin:0;color:#172033;font-size:20px;font-weight:900}.intervention-close{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:9px;background:#F2F6FC;color:#62738C;font-size:24px;line-height:1;cursor:pointer}.intervention-body{overflow-y:auto;padding:18px 24px 22px}.intervention-order{padding:12px 14px;border-radius:10px;background:#F5F9FF;color:#536882;font-size:12px;font-weight:700}.intervention-order b{color:#172033;font-size:13px}.intervention-options{display:flex;flex-wrap:wrap;gap:8px;padding:18px 0 12px}.intervention-option{height:34px;padding:0 12px;border:1px solid #D6E4F5;border-radius:8px;background:#fff;color:#53647B;font:700 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.intervention-option.active{border-color:#224CD3;background:#EDF3FF;color:#224CD3;box-shadow:inset 0 0 0 1px #224CD3}.intervention-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:2px 0 16px}.intervention-field{display:flex;flex-direction:column;gap:7px}.intervention-field.full{grid-column:1/-1}.intervention-label{color:#64758D;font-size:12px;font-weight:800}.intervention-field input,.intervention-field select,.intervention-field textarea,#interventionRemark{width:100%;min-height:36px;border:1px solid #D6E4F5;border-radius:8px;padding:0 10px;background:#fff;color:#25364D;font:600 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;outline:none}.intervention-field textarea,#interventionRemark{height:72px;padding:9px 10px;resize:vertical}.intervention-field input:focus,.intervention-field select:focus,#interventionRemark:focus{border-color:#224CD3;box-shadow:0 0 0 3px rgba(34,76,211,.08)}#interventionRemark{margin-top:7px}.intervention-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;border-top:1px solid #E5EEF9}.intervention-tip{color:#8A9AB0;font-size:11px;font-weight:700}.intervention-cancel,.intervention-confirm{height:34px;padding:0 14px;border-radius:8px;font:800 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.intervention-cancel{margin-right:8px;border:1px solid #D6E4F5;background:#fff;color:#617188}.intervention-confirm{border:1px solid #224CD3;background:#224CD3;color:#fff}.intervention-toast{position:fixed;z-index:1010;left:50%;bottom:30px;display:none;transform:translateX(-50%);padding:10px 15px;border-radius:9px;background:#172033;color:#fff;font-size:12px;font-weight:700;box-shadow:0 8px 25px rgba(0,0,0,.2)}.intervention-toast.show{display:block}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', '<div class="intervention-mask" id="interventionMask" aria-hidden="true"><section class="intervention-dialog" role="dialog" aria-modal="true" aria-labelledby="interventionTitle"><header class="intervention-head"><div><div class="intervention-eyebrow" id="interventionOrderNo">订单人工介入</div><h2 id="interventionTitle">选择处理操作</h2></div><button class="intervention-close" type="button" onclick="closeOrderIntervention()" aria-label="关闭">×</button></header><div class="intervention-body"><div class="intervention-order" id="interventionOrder"></div><div class="intervention-options" id="interventionOptions"></div><div class="intervention-form" id="interventionForm"></div><label class="intervention-label" for="interventionRemark">处理说明</label><textarea id="interventionRemark" placeholder="请填写本次人工介入的原因或处理说明"></textarea></div><footer class="intervention-foot"><span class="intervention-tip">操作将记录管理员、处理时间与说明</span><div><button class="intervention-cancel" type="button" onclick="closeOrderIntervention()">取消</button><button class="intervention-confirm" type="button" onclick="submitOrderIntervention()">确认处理</button></div></footer></section></div><div class="intervention-toast" id="interventionToast"></div>');

  var plans = {
    '待支付': ['关闭订单'],
    '待服务': ['指派/更换陪护员', '调整服务时间', '修改服务地址', '修改就诊人', '取消订单'],
    '服务中': ['更换陪护员', '补录日报', '取消订单'],
    '退款/售后': ['审核通过', '驳回申请', '设置退款金额', '补充处理说明', '完成退款'],
    '已取消': ['查看取消原因', '复制订单重新创建']
  };
  var activeOrder = null;
  var activeAction = '';

  function mallPlans(state) {
    return {
      '待支付': ['关闭订单', '修改配送方式', '取消订单'],
      '待配送': ['标记配送中', '修改配送方式', '修改收货信息', '取消订单'],
      '配送中': ['标记待收货确认', '修改配送方式', '修改物流信息', '标记配送异常'],
      '待收货确认': ['人工确认收货', '修改收货码', '发起售后', '修改订单状态'],
      '已完成': ['发起售后', '修改订单状态'],
      '退款/售后': ['审核通过', '驳回申请', '设置退款金额', '完成退款', '修改订单状态'],
      '已取消': ['复制订单重新创建']
    }[state] || ['修改订单状态'];
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

  function renderFields() {
    var form = document.getElementById('interventionForm');
    var full = '';
    if (activeOrder && activeOrder.type === '商城订单') {
      if (activeAction === '修改配送方式') {
        full = field('配送方式', '<select id="mallDeliveryType"><option>立即送达</option><option>跑腿送达</option><option>快递送达</option></select>');
      } else if (activeAction === '修改收货信息') {
        full = field('收货人', '<input id="mallReceiver" value="' + (activeOrder.receiver || activeOrder.user || '') + '">') + field('联系电话', '<input id="mallReceiverPhone" value="' + (activeOrder.receiverPhone || activeOrder.userPhone || '') + '">') + field('收货地址', '<input id="mallAddress" value="' + (activeOrder.address || '') + '">', 'full');
      } else if (activeAction === '修改物流信息') {
        full = field('物流公司', '<input id="mallLogisticsCompany" value="' + (activeOrder.logisticsCompany || '') + '">') + field('物流单号', '<input id="mallLogisticsNo" value="' + (activeOrder.logisticsNo || '') + '">');
      } else if (activeAction === '修改收货码') {
        full = field('收货码', '<input id="mallReceiveCode" maxlength="8" value="' + (activeOrder.receiveCode || '') + '">');
      } else if (activeAction === '修改订单状态') {
        full = field('订单状态', '<select id="mallManualState"><option>待支付</option><option>待配送</option><option>配送中</option><option>待收货确认</option><option>已完成</option><option>退款/售后</option><option>已取消</option></select>');
      } else if (activeAction === '设置退款金额') {
        full = field('退款金额（元）', '<input id="manualRefund" type="number" min="0" value="' + String(activeOrder.amount || '').replace(/[^0-9.]/g, '') + '">') + field('退款方式', '<select><option>原路退回</option><option>人工转账</option></select>');
      }
      form.innerHTML = full;
      if (document.getElementById('mallDeliveryType')) document.getElementById('mallDeliveryType').value = activeOrder.deliveryType || '立即送达';
      if (document.getElementById('mallManualState')) document.getElementById('mallManualState').value = activeOrder.state;
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
    } else if (activeAction === '设置退款金额') {
      full = field('退款金额（元）', '<input id="manualRefund" type="number" min="0" value="' + String(activeOrder.amount || '').replace(/[^0-9.]/g, '') + '">') + field('退款方式', '<select><option>原路退回</option><option>人工转账</option></select>');
    } else if (activeAction === '完成退款') {
      full = field('实际退款金额（元）', '<input id="manualRefund" type="number" min="0" value="' + String(activeOrder.amount || '').replace(/[^0-9.]/g, '') + '">') + field('退款流水号', '<input id="manualRefundNo" placeholder="请输入退款流水号">');
    } else if (activeAction === '查看取消原因') {
      full = '<div class="intervention-field full"><label class="intervention-label">取消原因</label><div class="intervention-order">用户临时调整服务计划，已于 2026-04-07 11:03 取消订单。</div></div>';
    }
    form.innerHTML = full;
  }

  window.openOrderIntervention = function (no) {
    activeOrder = findOrder(no);
    if (!activeOrder) return;
    var actions = activeOrder.type === '商城订单' ? mallPlans(activeOrder.state) : (plans[activeOrder.state] || []);
    if (!actions.length) { showToast('当前订单暂无可执行的人工介入操作'); return; }
    document.getElementById('interventionOrderNo').textContent = '订单人工介入 · ' + activeOrder.no;
    document.getElementById('interventionOrder').innerHTML = '<b>' + activeOrder.type + ' · ' + activeOrder.item + '</b>　当前状态：' + activeOrder.state + '　用户：' + activeOrder.user;
    document.getElementById('interventionOptions').innerHTML = actions.map(function (action, index) { return '<button type="button" class="intervention-option ' + (index === 0 ? 'active' : '') + '" data-action="' + action + '">' + action + '</button>'; }).join('');
    activeAction = actions[0];
    document.getElementById('interventionRemark').value = '';
    renderFields();
    document.querySelectorAll('.intervention-option').forEach(function (button) { button.onclick = function () { document.querySelectorAll('.intervention-option').forEach(function (item) { item.classList.remove('active'); }); button.classList.add('active'); activeAction = button.dataset.action; renderFields(); }; });
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
      if (activeAction === '关闭订单' || activeAction === '取消订单') { activeOrder.state = '已取消'; message = '商城订单已取消'; }
      if (activeAction === '标记配送中') { activeOrder.state = '配送中'; message = '已标记为配送中'; }
      if (activeAction === '标记待收货确认') { activeOrder.state = '待收货确认'; activeOrder.receiptStatus = '待用户确认'; message = '已进入待收货确认'; }
      if (activeAction === '标记配送异常') { activeOrder.state = '退款/售后'; activeOrder.receiptStatus = '配送异常待处理'; message = '已标记配送异常'; }
      if (activeAction === '人工确认收货') { activeOrder.state = '已完成'; activeOrder.receiptStatus = '后台人工确认'; activeOrder.confirmedBy = '管理员'; activeOrder.deliveredAt = '刚刚'; message = '已人工确认收货'; }
      if (activeAction === '发起售后') { activeOrder.state = '退款/售后'; activeOrder.receiptStatus = '售后处理中'; message = '已发起售后处理'; }
      if (activeAction === '审核通过') { activeOrder.refundState = '售后审核通过'; message = '售后申请已审核通过'; }
      if (activeAction === '驳回申请') { activeOrder.state = '已完成'; activeOrder.refundState = '售后申请已驳回'; message = '售后申请已驳回'; }
      if (activeAction === '设置退款金额') { activeOrder.refundAmount = document.getElementById('manualRefund').value; activeOrder.refundState = '退款金额已设置'; message = '退款金额已设置'; }
      if (activeAction === '完成退款') { activeOrder.refundState = '退款完成'; message = '商城订单退款已完成'; }
      if (activeAction === '修改配送方式') { activeOrder.deliveryType = document.getElementById('mallDeliveryType').value; activeOrder.deliveryFee = '已含在商品售价内'; message = '配送方式已修改'; }
      if (activeAction === '修改收货信息') { activeOrder.receiver = document.getElementById('mallReceiver').value.trim(); activeOrder.receiverPhone = document.getElementById('mallReceiverPhone').value.trim(); activeOrder.address = document.getElementById('mallAddress').value.trim(); message = '收货信息已修改'; }
      if (activeAction === '修改物流信息') { activeOrder.logisticsCompany = document.getElementById('mallLogisticsCompany').value.trim() || '—'; activeOrder.logisticsNo = document.getElementById('mallLogisticsNo').value.trim() || '—'; message = '物流信息已修改'; }
      if (activeAction === '修改收货码') { activeOrder.receiveCode = document.getElementById('mallReceiveCode').value.trim(); message = '收货码已修改'; }
      if (activeAction === '修改订单状态') { activeOrder.state = document.getElementById('mallManualState').value; message = '商城订单状态已修改'; }
      var mallOverrides = {};
      try { mallOverrides = JSON.parse(localStorage.getItem('akb_admin_mall_order_overrides_v1') || '{}') || {}; } catch (error) { mallOverrides = {}; }
      mallOverrides[activeOrder.no] = { state: activeOrder.state, deliveryType: activeOrder.deliveryType, deliveryFee: activeOrder.deliveryFee, receiver: activeOrder.receiver, receiverPhone: activeOrder.receiverPhone, address: activeOrder.address, logisticsCompany: activeOrder.logisticsCompany, logisticsNo: activeOrder.logisticsNo, receiveCode: activeOrder.receiveCode, receiptStatus: activeOrder.receiptStatus, confirmedBy: activeOrder.confirmedBy, deliveredAt: activeOrder.deliveredAt, refundState: activeOrder.refundState, refundAmount: activeOrder.refundAmount };
      localStorage.setItem('akb_admin_mall_order_overrides_v1', JSON.stringify(mallOverrides));
      closeOrderIntervention();
      if (typeof window.AKBRefreshAdminMallOverrides === 'function') window.AKBRefreshAdminMallOverrides();
      if (typeof window.render === 'function') window.render();
      showToast(message);
      return;
    }
    if (activeAction === '关闭订单' || activeAction === '取消订单') { activeOrder.state = '已取消'; message = '订单已取消'; }
    if (activeAction === '驳回申请') { activeOrder.state = '服务中'; message = '售后申请已驳回，订单恢复服务中'; }
    if (activeAction === '完成退款') { activeOrder.refundState = '退款完成'; message = '退款已完成'; }
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
