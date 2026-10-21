/* ── 陪护员入驻审核：护理员端提交的申请在此审核，通过后按「新增陪护员」同一数据结构建档 ── */
(function () {
  var KEY = 'akbNurseApplications';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function readApps() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      var list = Array.isArray(raw) ? raw : (raw && raw.status ? [raw] : []);
      return list.filter(function (a) { return a && typeof a.status === 'string' && a.name; }).map(function (a) {
        if (!Array.isArray(a.skills)) a.skills = [];
        if (!Array.isArray(a.certs)) a.certs = [];
        return a;
      });
    } catch (e) { return []; }
  }
  function writeApps(apps) { localStorage.setItem(KEY, JSON.stringify(apps[0] || null)); }
  function readStoredCaregivers() {
    var list = [];
    try { var a = JSON.parse(localStorage.getItem('akbNewCaregivers') || '[]'); if (Array.isArray(a)) list = list.concat(a); } catch (e) {}
    try {
      var b = JSON.parse(sessionStorage.getItem('akbNewCaregivers') || '[]');
      if (Array.isArray(b)) b.forEach(function (x) { if (!list.some(function (y) { return y.id === x.id; })) list.push(x); });
    } catch (e) {}
    return list;
  }
  /* 后台列表直接点「审核」时，用档案信息构造审核对象，支持没有留存申请记录的历史陪护员 */
  function rowAuditApp(name, id, status) {
    var cg = readStoredCaregivers().find(function (x) { return (id && x.id === id) || x.name === name; });
    var d = (typeof DATA !== 'undefined' && Array.isArray(DATA)) ? DATA.find(function (x) { return (id && x.id === id) || x.name === name; }) : null;
    if (!cg && d) cg = { id: d.id, name: d.name, phone: d.phone, skills: d.skills, workYears: d.workYears, employmentType: d.employmentType, companyName: d.companyName, certification: d.certification };
    if (!cg) return null;
    /* 工龄优先取带数字的档案值，留档缺工时回退基础档案，避免审核后显示成默认年限 */
    var workYears = String(cg.workYears || '').replace(/[^0-9]/g, '');
    if (!workYears && d) workYears = String(d.workYears || '').replace(/[^0-9]/g, '');
    return { name: cg.name, phone: cg.phone || '', skills: cg.skills || [], certs: cg.certs || [], status: status || cg.certification || '审核驳回', caregiverId: cg.id || id || '', gender: cg.gender || '女', age: cg.age || '', idNo: cg.idNo || '', workYears: workYears, employmentType: cg.employmentType || 'personal', companyName: cg.companyName || '', area: cg.area || '', photo: cg.photo || '', submittedAt: cg.submittedAt || '—', rating: cg.rating || '—', orders: cg.orders || 0, __row: true };
  }
  /* 行内审核时直接改写陪护员档案的认证状态，保证列表与派单名单即时一致 */
  function persistCertification(id, status, reason) {
    if (!id) return;
    var list = readStoredCaregivers();
    var hit = list.find(function (x) { return x.id === id; });
    if (!hit) return;
    hit.certification = status;
    if (reason) hit.rejectReason = reason; else delete hit.rejectReason;
    try {
      localStorage.setItem('akbNewCaregivers', JSON.stringify(list));
      sessionStorage.setItem('akbNewCaregivers', JSON.stringify(list));
    } catch (e) {}
    if (typeof DATA !== 'undefined' && Array.isArray(DATA)) {
      var d = DATA.find(function (x) { return x.id === id; });
      if (d) d.certification = status;
    }
  }
  window.getNurseApplications = function () { return readApps(); };
  window.auditPendingCount = function () { return readApps().filter(function (a) { return a.status === '审核中'; }).length; };
  function refreshBadge() {
    var b = document.getElementById('auditBadge');
    if (b) { var n = auditPendingCount(); b.textContent = n ? String(n) : ''; b.style.display = n ? '' : 'none'; }
  }
  /* 样式 */
  var style = document.createElement('style');
  style.textContent = '.cg-audit-mask{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(12,33,65,.45)}.cg-audit-mask.show{display:flex}.cg-audit-dialog{width:min(760px,calc(100vw - 48px));max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;border-radius:6px;background:#fff;box-shadow:0 26px 64px rgba(10,30,63,.25)}.cg-audit-head{display:flex;align-items:flex-start;justify-content:space-between;padding:21px 24px 17px;border-bottom:1px solid #D9F6EE}.cg-audit-head h2{margin:0;color:#172033;font-size:20px;font-weight:700}.cg-audit-head p{margin:5px 0 0;color:#8A9AB0;font-size:12px}.cg-audit-close{display:grid;place-items:center;width:32px;height:32px;border:0;border-radius:6px;background:#F1F6FC;color:#62738C;font-size:24px;cursor:pointer}.cg-audit-toolbar{display:flex;align-items:center;gap:10px;padding:14px 24px 0}.cg-audit-toolbar select{height:34px;border:1px solid #CFF5ED;border-radius:6px;padding:0 8px;background:#fff;color:#25364D;font:600 12px inherit;outline:none}.cg-audit-body{overflow-y:auto;padding:16px 24px 24px;display:flex;flex-direction:column;gap:12px}.cg-audit-card{border:1px solid #D8E7F8;border-radius:6px;padding:14px 16px;background:#FAFCFF}.cg-audit-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.cg-audit-name{font-size:15px;font-weight:700;color:#172033}.cg-audit-sub{margin-top:4px;color:#637895;font-size:12px}.cg-audit-meta{margin-top:8px;color:#8A9AB0;font-size:11px}.cg-audit-badge{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap}.cg-audit-badge.pending{background:#FEF3C7;color:#D97706}.cg-audit-badge.approved{background:#DCFCE7;color:#16A34A}.cg-audit-badge.rejected{background:#FEE2E2;color:#DC2626}.cg-audit-skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.cg-audit-skill{padding:3px 8px;border-radius:6px;background:#DDF7F1;color:#0FA98C;font-size:11px;font-weight:600}.cg-audit-actions{display:flex;gap:8px;margin-top:12px}.cg-audit-actions button{height:32px;padding:0 14px;border-radius:6px;font:800 12px inherit;cursor:pointer}.cg-audit-view{border:1px solid #CBF1E8;background:#fff;color:#0FA98C}.cg-audit-approve{border:1px solid #1CD8B7;background:#1CD8B7;color:#fff}.cg-audit-reject{border:1px solid #F3C9CB;background:#fff;color:#D9534F}.cg-audit-detail{border-top:1px dashed #D8E7F8;margin-top:12px;padding-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.cg-audit-detail .d-item{font-size:12px}.cg-audit-detail .d-item .k{color:#8A9AB0;margin-bottom:3px}.cg-audit-detail .d-item .v{color:#25364D;font-weight:600;word-break:break-all}.cg-audit-certs{margin-top:12px;display:flex;flex-direction:column;gap:8px}.cg-audit-cert{display:flex;align-items:center;gap:10px;padding:9px 11px;border:1px solid #E3EEFB;border-radius:6px;background:#fff}.cg-audit-cert img{width:40px;height:40px;border-radius:6px;object-fit:cover;border:1px solid #E3EEFB}.cg-audit-cert .cert-ico{display:grid;place-items:center;width:40px;height:40px;border-radius:6px;background:#DDF7F1;color:#1CD8B7;font-size:12px;font-weight:700}.cg-audit-cert .c-name{font-size:12px;font-weight:600;color:#25364D}.cg-audit-cert .c-sub{margin-top:2px;font-size:11px;color:#8A9AB0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:420px}.cg-audit-reject-box{margin-top:12px;display:flex;gap:8px}.cg-audit-reject-box input{flex:1;height:34px;border:1px solid #E8CACC;border-radius:6px;padding:0 10px;font:600 12px inherit;outline:none}.cg-audit-reject-box input:focus{border-color:#D9534F}.cg-audit-empty{padding:36px 0;text-align:center;color:#8A9AB0;font-size:13px}@media(max-width:850px){.cg-audit-detail{grid-template-columns:repeat(2,minmax(0,1fr))}}';
  document.head.appendChild(style);
  /* 弹窗骨架 */
  document.body.insertAdjacentHTML('beforeend', '<div class="cg-audit-mask" id="cgAuditMask" aria-hidden="true"><section class="cg-audit-dialog" role="dialog" aria-modal="true" aria-labelledby="cgAuditTitle"><header class="cg-audit-head"><div><h2 id="cgAuditTitle">陪护员入驻审核</h2><p>护理员端提交的认证申请在此审核，通过后自动创建陪护员档案。</p></div><button class="cg-audit-close" type="button" onclick="closeCaregiverAudit()" aria-label="关闭">×</button></header><div class="cg-audit-toolbar"><select id="cgAuditFilter" onchange="renderCaregiverAudit()"><option value="审核中">待审核</option><option value="all">全部状态</option><option value="审核通过">已通过</option><option value="审核驳回">已驳回</option></select></div><div class="cg-audit-body" id="cgAuditBody"></div></section></div>');
  var rejectTarget = '';
  window.openCaregiverAudit = function () { window.__rowAuditApp = null; var f = document.getElementById('cgAuditFilter'); if (f) f.value = '审核中'; var m = document.getElementById('cgAuditMask'); if (!m) return; m.classList.add('show'); renderCaregiverAudit(); };
  /* 列表行内「审核」：优先取该陪护员留存的入驻申请，历史无申请时用档案信息补一个审核对象 */
  window.openCaregiverAuditFor = function (name, id, status) {
    var app = readApps().find(function (a) { return (id && a.caregiverId === id) || a.name === name; });
    if (!app) app = rowAuditApp(name, id, status);
    if (!app) { alert('未找到该陪护员的认证资料'); return; }
    window.__rowAuditApp = app.__row ? app : null;
    window.__auditExpand = app.name;
    rejectTarget = '';
    var f = document.getElementById('cgAuditFilter');
    if (f) f.value = 'all';
    var m = document.getElementById('cgAuditMask');
    if (!m) return;
    m.classList.add('show');
    renderCaregiverAudit();
  };
  window.closeCaregiverAudit = function () { document.getElementById('cgAuditMask').classList.remove('show'); window.__rowAuditApp = null; refreshBadge(); };
  var maskEl = document.getElementById('cgAuditMask');
  if (maskEl) maskEl.addEventListener('click', function (e) { if (e.target === this) closeCaregiverAudit(); });
  function typeName(v) { return { self: '自营', personal: '个人', enterprise: '企业' }[v] || '—'; }
  function certLine(c) {
    var parts = [];
    if (c.certNo) parts.push('编号 ' + c.certNo);
    if (c.imageName) parts.push('图片 ' + c.imageName);
    if (c.fileName) parts.push('文件 ' + c.fileName);
    return parts.length ? parts.join(' · ') : '未上传材料';
  }
  function renderApp(app, expanded) {
    var html = '<div class="cg-audit-card" data-app="' + esc(app.name) + '">';
    html += '<div class="cg-audit-top"><div><div class="cg-audit-name">' + esc(app.name) + ' <span style="color:#8A9AB0;font-weight:600;font-size:12px">' + esc(app.phone) + '</span></div><div class="cg-audit-sub">' + typeName(app.employmentType) + ' · ' + esc(app.area || '—') + (app.caregiverId ? ' · 已建档 ' + esc(app.caregiverId) : '') + '</div></div><span class="cg-audit-badge ' + (app.status === '审核通过' ? 'approved' : app.status === '审核驳回' ? 'rejected' : 'pending') + '">' + esc(app.status) + '</span></div>';
    html += '<div class="cg-audit-skills">' + (app.skills || []).map(function (s) { return '<span class="cg-audit-skill">' + esc(s) + '</span>'; }).join('') + '</div>';
    html += '<div class="cg-audit-meta">提交于 ' + esc(app.submittedAt || '—') + (app.reviewedAt ? ' · 审核完成 ' + esc(app.reviewedAt) : '') + (app.status === '审核驳回' && app.rejectReason ? ' · 驳回原因：' + esc(app.rejectReason) : '') + '</div>';
    if (expanded) {
      html += '<div class="cg-audit-detail">';
      html += '<div class="d-item"><div class="k">个人照片</div><div class="v">' + (app.photo ? '<img src="' + app.photo + '" alt="个人照片" style="width:56px;height:56px;border-radius:6px;object-fit:cover;display:block">' : '未上传') + '</div></div>';
      html += '<div class="d-item"><div class="k">性别 / 年龄</div><div class="v">' + esc(app.gender) + ' / ' + esc(app.age || '—') + '</div></div>';
      html += '<div class="d-item"><div class="k">身份证号</div><div class="v">' + esc(app.idNo) + '</div></div>';
      html += '<div class="d-item"><div class="k">工龄</div><div class="v">' + esc(app.workYears) + ' 年</div></div>';
      html += '<div class="d-item"><div class="k">人员类型</div><div class="v">' + typeName(app.employmentType) + (app.employmentType === 'enterprise' && app.companyName ? ' · ' + esc(app.companyName) : '') + '</div></div>';
      html += '<div class="d-item"><div class="k">服务区域</div><div class="v">' + esc(app.area || '—') + '</div></div>';
      html += '<div class="d-item"><div class="k">服务技能</div><div class="v">' + (app.skills || []).join('、') + '</div></div>';
      html += '</div>';
      html += '<div class="cg-audit-certs">' + ((app.certs || []).length ? (app.certs || []).map(function (c) {
        var ico = c.image ? '<img src="' + c.image + '" alt="">' : '<span class="cert-ico">证</span>';
        return '<div class="cg-audit-cert">' + ico + '<div style="min-width:0;flex:1"><div class="c-name">' + esc(c.type) + '</div><div class="c-sub">' + esc(certLine(c)) + '</div></div></div>';
      }).join('') : '<div class="cg-audit-cert"><span class="cert-ico">证</span><div style="min-width:0;flex:1"><div class="c-name">证照材料</div><div class="c-sub">暂无上传记录</div></div></div>') + '</div>';
      if (rejectTarget === app.name) {
        html += '<div class="cg-audit-reject-box"><input id="cgRejectReason" placeholder="请填写驳回原因（必填）"><button class="cg-audit-reject" type="button" onclick="confirmRejectApp()">确认驳回</button></div>';
      }
    }
    html += '<div class="cg-audit-actions"><button class="cg-audit-view" type="button" onclick="toggleAuditDetail(\'' + esc(app.name) + '\')">' + (expanded ? '收起详情' : '查看详情') + '</button>';
    /* 审核中与已驳回都可重新审核，驳回的申请通过后自动恢复为可用陪护员 */
    if (app.status === '审核中' || app.status === '审核驳回') {
      html += '<button class="cg-audit-approve" type="button" onclick="approveApp(\'' + esc(app.name) + '\')">审核通过</button><button class="cg-audit-reject" type="button" onclick="startRejectApp(\'' + esc(app.name) + '\')">驳回</button>';
    }
    html += '</div></div>';
    return html;
  }
  window.renderCaregiverAudit = function () {
    var filterEl = document.getElementById('cgAuditFilter');
    var filter = filterEl ? filterEl.value : '审核中';
    var apps = readApps();
    var row = window.__rowAuditApp;
    if (row && !apps.some(function (a) { return (row.caregiverId && a.caregiverId === row.caregiverId) || a.name === row.name; })) apps.push(row);
    apps = apps.filter(function (a) { return filter === 'all' ? true : a.status === filter; });
    var box = document.getElementById('cgAuditBody');
    if (!apps.length) { box.innerHTML = '<div class="cg-audit-empty">暂无' + (filter === 'all' ? '' : filter) + '的入驻申请</div>'; return; }
    box.innerHTML = apps.map(function (a) { return renderApp(a, a.status === '审核中' || a.__row ? true : (window.__auditExpand === a.name)); }).join('');
  };
  window.toggleAuditDetail = function (name) {
    window.__auditExpand = window.__auditExpand === name ? '' : name;
    rejectTarget = '';
    renderCaregiverAudit();
  };
  /* 审核通过：与「新增陪护员」统一建档（已有档案则更新，保持同一数据结构） */
  window.approveApp = function (name) {
    var apps = readApps();
    var app = apps.find(function (a) { return a.name === name; });
    var isRow = false;
    if (!app && window.__rowAuditApp && window.__rowAuditApp.name === name) { app = window.__rowAuditApp; isRow = true; }
    if (!app || ['审核中', '审核驳回'].indexOf(app.status) < 0) return;
    var today = new Date().toISOString().slice(0, 10);
    var record = {
      name: app.name, phone: app.phone, skills: app.skills || [], state: 'on',
      gender: app.gender || '女', age: app.age || '—',
      workYears: (parseInt(app.workYears, 10) || 0) + '年',
      certification: '审核通过', area: app.area || '', idNo: app.idNo || '',
      employmentType: app.employmentType || 'personal', companyName: app.companyName || '',
      photo: app.photo || '', photoName: app.photoName || '',
      certs: (app.certs || []).map(function (c) { return { type: c.type, certNo: c.certNo || '', imageName: c.imageName || '', image: c.image || '', fileName: c.fileName || '', fileSize: c.fileSize || 0 }; })
    };
    var saved;
    try { saved = JSON.parse(sessionStorage.getItem('akbNewCaregivers') || localStorage.getItem('akbNewCaregivers') || '[]'); if (!Array.isArray(saved)) saved = []; } catch (e) { saved = []; }
    var isUpdate = false;
    if (app.caregiverId) {
      /* 再次审核通过（含已驳回/审核中）：更新已有档案，无留档时补建 */
      var dHit = (typeof DATA !== 'undefined' && Array.isArray(DATA)) ? DATA.find(function (x) { return x.id === app.caregiverId; }) : null;
      var hit = saved.find(function (x) { return x.id === app.caregiverId; });
      if (!hit) {
        hit = Object.assign({ rating: (dHit && dHit.rating) || '—', orders: (dHit && dHit.orders) || 0 }, dHit || {}, { id: app.caregiverId });
        saved.push(hit);
      }
      Object.assign(hit, record);
      if (dHit) Object.assign(dHit, record);
      record.id = app.caregiverId;
      isUpdate = true;
    } else {
      var used=saved.concat(typeof DATA!=='undefined'?DATA:[]).map(function(r){return parseInt(String(r.id).replace(/^N/,''),10)||0;});
      record.id='N'+String(Math.max.apply(null,[1005].concat(used))+1);
      record.rating = '—'; record.orders = 0;
      saved.push(record);
      app.caregiverId = record.id;
      if (typeof DATA !== 'undefined' && !DATA.some(function (item) { return item.id === record.id; })) DATA.push(record);
    }
    sessionStorage.setItem('akbNewCaregivers', JSON.stringify(saved));
    localStorage.setItem('akbNewCaregivers', JSON.stringify(saved));
    sessionStorage.setItem('akbCaregiverDraft', JSON.stringify(record));
    app.status = '审核通过';
    app.hasApprovedCertification = true;
    app.reviewedAt = today;
    delete app.rejectReason;
    if (isRow) window.__rowAuditApp = app; else writeApps(apps);
    renderCaregiverAudit();
    refreshBadge();
    if (typeof window.refreshCaregiverTable === 'function') window.refreshCaregiverTable();
    if (window.showActionResult) showActionResult('审核通过', app.name + ' 的认证已通过，' + (isUpdate ? '已更新' : '已创建') + '陪护员档案 ' + record.id + '，可在派单时选择。');
    else alert('审核通过：陪护员档案 ' + record.id + ' 已生效，可在派单时选择');
  };
  window.startRejectApp = function (name) { rejectTarget = name; renderCaregiverAudit(); var input = document.getElementById('cgRejectReason'); if (input) input.focus(); };
  window.confirmRejectApp = function () {
    var input = document.getElementById('cgRejectReason');
    var reason = input ? input.value.trim() : '';
    if (!reason) { alert('请填写驳回原因'); input && input.focus(); return; }
    var apps = readApps();
    var app = apps.find(function (a) { return a.name === rejectTarget; });
    var isRow = false;
    if (!app && window.__rowAuditApp && window.__rowAuditApp.name === rejectTarget) { app = window.__rowAuditApp; isRow = true; }
    if (!app || ['审核中', '审核驳回'].indexOf(app.status) < 0) return;
    app.status = '审核驳回';
    app.rejectReason = reason;
    app.reviewedAt = new Date().toISOString().slice(0, 10);
    if (isRow) { window.__rowAuditApp = app; persistCertification(app.caregiverId, '审核驳回', reason); } else writeApps(apps);
    rejectTarget = '';
    renderCaregiverAudit();
    refreshBadge();
    if (typeof window.refreshCaregiverTable === 'function') window.refreshCaregiverTable();
    if (window.showActionResult) showActionResult('已驳回', app.name + ' 的认证申请已驳回，护理员端可查看驳回原因并重新提交。');
  };
  window.addEventListener('storage',function(e){if(e.key===KEY||e.key===null){refreshBadge();if(document.getElementById('cgAuditMask').classList.contains('show'))renderCaregiverAudit();}});
  refreshBadge();
})();
