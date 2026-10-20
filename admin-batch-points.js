/* 批量设置积分抵扣弹窗（商品管理 / 分类服务管理共用）
 * 用法：openBatchPointsModal({ countLabel, deduct, cap, onApply })
 *  - countLabel  弹窗内展示的适用范围文案，如「已选择 3 款商品」
 *  - deduct/cap  打开时的默认值（deduct: follow|on|off；cap: 空=跟随全局）
 *  - onApply     点击「应用设置」回调：function({deduct, cap}) => true 应用成功
 */
(function () {
  var style = document.createElement('style');
  style.textContent = '.bpt-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,32,65,.42)}.bpt-mask.show{display:flex}.bpt-dialog{width:min(480px,calc(100vw - 48px));border-radius:12px;background:#fff;box-shadow:0 24px 60px rgba(12,33,73,.24);overflow:hidden}.bpt-head{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #D9F6EE}.bpt-eyebrow{margin-bottom:4px;color:#7290BA;font-size:12px;font-weight:600}.bpt-head h2{margin:0;color:#172033;font-size:19px;font-weight:700}.bpt-close{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:12px;background:#F2F6FC;color:#62738C;font-size:22px;line-height:1;cursor:pointer}.bpt-body{padding:18px 24px 22px}.bpt-scope{padding:12px 14px;border-radius:12px;background:#F5F9FF;color:#536882;font-size:12px;font-weight:600}.bpt-scope b{color:#1CD8B7;font-size:14px}.bpt-fields{display:grid;gap:12px;margin-top:16px}.bpt-field{display:flex;flex-direction:column;gap:7px}.bpt-field label{color:#64758D;font-size:12px;font-weight:600}.bpt-field select,.bpt-field input{width:100%;height:38px;box-sizing:border-box;border:1px solid #CBF1E8;border-radius:12px;padding:0 10px;background:#fff;color:#25364D;font:600 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;outline:none}.bpt-field select:focus,.bpt-field input:focus{border-color:#1CD8B7;box-shadow:0 0 0 3px rgba(28,216,183,.08)}.bpt-hint{margin-top:12px;color:#8A9AB0;font-size:11px;font-weight:600;line-height:1.7}.bpt-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;border-top:1px solid #D9F6EE}.bpt-tip{color:#8A9AB0;font-size:11px;font-weight:600}.bpt-cancel,.bpt-confirm{height:34px;padding:0 14px;border-radius:12px;font:800 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.bpt-cancel{margin-right:8px;border:1px solid #CBF1E8;background:#fff;color:#617188}.bpt-confirm{border:1px solid #1CD8B7;background:#1CD8B7;color:#fff}.bpt-toast{position:fixed;z-index:1010;left:50%;bottom:30px;display:none;transform:translateX(-50%);padding:10px 15px;border-radius:12px;background:#172033;color:#fff;font-size:12px;font-weight:600;box-shadow:0 8px 25px rgba(0,0,0,.2)}.bpt-toast.show{display:block}';
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend',
    '<div class="bpt-mask" id="bptMask" aria-hidden="true"><section class="bpt-dialog" role="dialog" aria-modal="true" aria-labelledby="bptTitle">' +
      '<header class="bpt-head"><div><div class="bpt-eyebrow">积分抵扣 · 批量设置</div><h2 id="bptTitle">批量设置积分抵扣</h2></div>' +
      '<button class="bpt-close" type="button" onclick="closeBatchPointsModal()" aria-label="关闭">×</button></header>' +
      '<div class="bpt-body"><div class="bpt-scope" id="bptScope"></div>' +
      '<div class="bpt-fields">' +
        '<div class="bpt-field"><label>是否可用积分抵扣</label>' +
          '<select id="bptDeduct"><option value="follow">跟随全局规则</option><option value="on">开启（可使用积分抵扣）</option><option value="off">关闭（不可使用积分抵扣）</option></select></div>' +
        '<div class="bpt-field"><label>抵扣上限（订单金额的 %，留空 = 跟随全局）</label>' +
          '<input id="bptCap" type="number" min="1" max="100" placeholder="例如 10"></div>' +
      '</div>' +
      '<div class="bpt-hint">规则口径：1 积分 = 1 元；抵扣上限指订单金额中最多可用积分抵扣的比例。设置仅覆盖已勾选项，未单独设置的商品 / 服务继续跟随「积分管理」中的全局规则。</div></div>' +
      '<footer class="bpt-foot"><span class="bpt-tip">应用后立即生效，并同步至小程序端</span><div>' +
      '<button class="bpt-cancel" type="button" onclick="closeBatchPointsModal()">取消</button>' +
      '<button class="bpt-confirm" type="button" onclick="applyBatchPoints()">应用设置</button></div></footer>' +
    '</section></div><div class="bpt-toast" id="bptToast"></div>');

  var onApply = null;

  window.openBatchPointsModal = function (opts) {
    opts = opts || {};
    if (typeof opts.onApply !== 'function') return;
    onApply = opts.onApply;
    document.getElementById('bptScope').innerHTML = opts.countLabel || '';
    document.getElementById('bptDeduct').value = opts.deduct || 'follow';
    document.getElementById('bptCap').value = opts.cap == null ? '' : opts.cap;
    document.getElementById('bptMask').classList.add('show');
    document.getElementById('bptMask').setAttribute('aria-hidden', 'false');
  };

  window.closeBatchPointsModal = function () {
    document.getElementById('bptMask').classList.remove('show');
    document.getElementById('bptMask').setAttribute('aria-hidden', 'true');
    onApply = null;
  };

  window.applyBatchPoints = function () {
    if (typeof onApply !== 'function') { window.closeBatchPointsModal(); return; }
    var deduct = document.getElementById('bptDeduct').value;
    var capRaw = document.getElementById('bptCap').value.trim();
    var cap = capRaw === '' ? null : Number(capRaw);
    if (capRaw !== '' && (!(cap >= 1) || cap > 100)) { showToast('抵扣上限需为 1 - 100 之间的数字，留空则跟随全局'); return; }
    if (onApply({ deduct: deduct, cap: cap }) !== false) {
      window.closeBatchPointsModal();
      showToast('批量设置已应用并保存');
    }
  };

  function showToast(message) {
    var toast = document.getElementById('bptToast');
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  document.getElementById('bptMask').onclick = function (event) { if (event.target === this) window.closeBatchPointsModal(); };
})();
