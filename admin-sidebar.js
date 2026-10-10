(function(){
  var currentActive='';
  function init(){
    var shared=document.querySelector('link[href="admin-shell.css"]');
    if(shared)document.head.appendChild(shared);
    var side=document.querySelector('.sidebar'); if(!side)return;
    var file=(location.pathname.split('/').pop()||'admin.html').toLowerCase();
    currentActive=file==='admin.html'?'dashboard':file.indexOf('service-categories')>-1?'catalog':file.indexOf('order')>-1?'orders':file.indexOf('caregiver')>-1?'caregivers':file.indexOf('user')>-1?'users':'';
    side.innerHTML='<div class="sb-logo"><div class="sb-logo-title">多康陪护</div><div class="sb-logo-sub">运营管理后台 v2.1</div></div>'+
      '<nav class="sb-nav"><div class="sb-section-lbl">概览</div>'+item('dashboard','数据总览','admin.html','<rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>')+
      '<div class="sb-section-lbl">业务管理</div>'+item('orders','订单管理','admin-orders.html','<rect x="3" y="2" width="12" height="14" rx="2"/><path d="M6 6h6M6 9h6M6 12h4"/>','12')+item('caregivers','陪护员管理','admin-caregivers.html','<circle cx="9" cy="6" r="3"/><path d="M2.5 16c.4-3.2 2.6-5 6.5-5s6.1 1.8 6.5 5"/>')+item('users','用户管理','admin-users.html','<circle cx="6.5" cy="6" r="3"/><circle cx="13" cy="7" r="2.3"/><path d="M1.5 16c.4-3 2.1-4.7 5-4.7s4.6 1.7 5 4.7M11.2 11.5c2.7-.2 4.6 1.1 5.2 4"/>')+item('catalog','分类服务管理','admin-service-categories.html','<path d="M3 4h12M3 9h12M3 14h12"/><circle cx="7" cy="4" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none"/><circle cx="6" cy="14" r="1.5" fill="currentColor" stroke="none"/>')+
      '<div class="sb-section-lbl">系统</div>'+item('settings','系统设置','profile.html','<circle cx="9" cy="9" r="2.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.6 3.6L5 5M13 13l1.4 1.4M3.6 14.4L5 13M13 5l1.4-1.4"/>')+'</nav>'+
      '<div class="sb-user"><div class="sb-av">管</div><div><div class="sb-uname">超级管理员</div><div class="sb-urole">admin@akb.com</div></div><button class="sb-logout" onclick="if(confirm(\'确认退出？\'))location.href=\'index.html\'">↗</button></div>';
    if(file.indexOf('user-detail')>-1||file.indexOf('caregiver-detail')>-1){
      var baseTab=side.parentElement.querySelector('.tab[data-tab="base"]');
      var basePanel=side.parentElement.querySelector('#base');
      if(baseTab)baseTab.remove();
      if(basePanel)basePanel.remove();
      var first=side.parentElement.querySelector('.tab');
      if(first){first.classList.add('active');var firstPanel=side.parentElement.querySelector('#'+first.dataset.tab);if(firstPanel)firstPanel.classList.add('active');}
    }
    if(file==='admin-caregivers.html') initCaregiverManagement();
    if(file==='admin-caregiver-detail.html') initCaregiverOrderRecords();
    if(file==='admin-caregiver-detail.html') initCaregiverProfile();
    initTerminalLinks();
  }
  function initTerminalLinks(){
    var topbar=document.querySelector('.topbar');
    if(!topbar||topbar.querySelector('.pc-terminal-links'))return;
    var links=document.createElement('div');
    links.className='pc-terminal-links';
    links.innerHTML='<a class="pc-terminal-link nurse-terminal" href="nurse-home.html">护理移动端</a><a class="pc-terminal-link user-terminal" href="home.html">用户移动端</a>';
    var actions=topbar.querySelector('.tb-actions,.top-actions');
    var avatar=actions&&actions.querySelector('.tb-av,.top-av');
    if(actions)actions.insertBefore(links,avatar||null);
    else topbar.appendChild(links);
  }
  var caregiverProfiles={
    N1001:{avatar:'张',name:'张阿姨',phone:'138****2468',certification:'审核通过',certificationClass:'approved',workYears:'6年'},
    N1002:{avatar:'李',name:'李师傅',phone:'139****8572',certification:'审核通过',certificationClass:'approved',workYears:'4年'},
    N1003:{avatar:'王',name:'王阿姨',phone:'186****3016',certification:'审核中',certificationClass:'reviewing',workYears:'3年'},
    N1004:{avatar:'赵',name:'赵姐',phone:'133****6420',certification:'审核驳回',certificationClass:'rejected',workYears:'2年'},
    N1005:{avatar:'陈',name:'陈阿姨',phone:'177****9183',certification:'未提交',certificationClass:'unsubmitted',workYears:'1年'}
  };
  try{
    var storedCaregivers=JSON.parse(sessionStorage.getItem('akbNewCaregivers')||'[]');
    var certificationClasses={'审核通过':'approved','审核中':'reviewing','审核驳回':'rejected','未提交':'unsubmitted'};
    storedCaregivers.forEach(function(caregiver){
      caregiverProfiles[caregiver.id]={avatar:caregiver.name.slice(0,1),name:caregiver.name,phone:caregiver.phone,certification:caregiver.certification||'未提交',certificationClass:certificationClasses[caregiver.certification]||'unsubmitted',workYears:caregiver.workYears||'—'};
    });
  }catch(error){}
  function addCaregiverProfileStyles(){
    if(document.getElementById('caregiver-profile-style'))return;
    var style=document.createElement('style');
    style.id='caregiver-profile-style';
    style.textContent='.caregiver-list-scroll{overflow-x:auto!important;overflow-y:hidden!important}.caregiver-list-table{min-width:1180px}.caregiver-list-table th{white-space:nowrap}.caregiver-list-table td{white-space:nowrap}.caregiver-list-table .cg-avatar{width:36px;height:36px;border-radius:10px;background:#E7F1FD;color:#224CD3;display:grid;place-items:center;font-weight:900}.caregiver-list-table .cg-profile{display:flex;gap:10px;align-items:center}.caregiver-list-table .cg-name{color:#172033;font-weight:800}.caregiver-list-table .cg-id{color:#8F9BB0;font-size:10px;margin-top:2px}.cg-cert{display:inline-flex;align-items:center;padding:5px 9px;border-radius:16px;font-size:11px;font-weight:800}.cg-cert.approved{color:#16A34A;background:#DCFCE7}.cg-cert.reviewing{color:#D97706;background:#FEF3C7}.cg-cert.rejected{color:#DC2626;background:#FEE2E2}.cg-cert.unsubmitted{color:#657087;background:#EEF5FC}.identity .profile-cert{margin-left:6px}.identity .profile-cert.cg-cert{vertical-align:middle}.identity .side-row .cg-cert{padding:4px 8px}';
    document.head.appendChild(style);
  }
  function initCaregiverManagement(){
    var table=document.querySelector('#rows')&&document.querySelector('#rows').closest('table');
    var rows=document.getElementById('rows');
    if(!table||!rows||typeof DATA==='undefined')return;
    addCaregiverProfileStyles();
    table.parentElement.classList.add('caregiver-list-scroll');
    table.classList.add('caregiver-list-table');
    table.querySelector('thead tr').innerHTML='<th>头像</th><th>陪护员</th><th>手机号</th><th>认证状态</th><th>工龄</th><th>服务技能</th><th>服务评分</th><th>累计订单</th><th>在岗状态</th><th>操作</th>';
    var labels={on:'在岗',leave:'休息',off:'停用'};
    function renderCaregivers(){
      var stateSelect=document.getElementById('state');
      var skillSelect=document.getElementById('skill');
      var selectedState=stateSelect.value;
      var selectedSkill=skillSelect.value;
      var list=DATA.filter(function(caregiver){return(selectedState==='all'||caregiver.state===selectedState)&&(selectedSkill==='all'||caregiver.skills.indexOf(selectedSkill)>-1);});
      document.getElementById('count').textContent=list.length;
      document.getElementById('total').textContent=DATA.length;
      document.getElementById('onDuty').textContent=DATA.filter(function(caregiver){return caregiver.state==='on';}).length;
      document.getElementById('orders').textContent=DATA.reduce(function(sum,caregiver){return sum+caregiver.orders;},0);
      rows.innerHTML=list.map(function(caregiver){
        var profile=caregiverProfiles[caregiver.id]||{avatar:caregiver.name.slice(0,1),certification:'未提交',certificationClass:'unsubmitted',workYears:'—'};
        return '<tr><td><div class="cg-avatar">'+profile.avatar+'</div></td><td><div class="cg-name">'+caregiver.name+'</div><div class="cg-id">档案编号 '+caregiver.id+'</div></td><td>'+caregiver.phone+'</td><td><span class="cg-cert '+profile.certificationClass+'">'+profile.certification+'</span></td><td>'+profile.workYears+'</td><td>'+caregiver.skills.join('、')+'</td><td class="rating">★ '+caregiver.rating+'</td><td>'+caregiver.orders+' 单</td><td><span class="state '+caregiver.state+'">'+labels[caregiver.state]+'</span></td><td><div class="ops"><button onclick="location.href=\'admin-caregiver-detail.html?id='+caregiver.id+'\'">查看档案</button><button onclick="alert(\'编辑陪护员\')">编辑</button></div></td></tr>';
      }).join('');
    }
    document.getElementById('state').onchange=renderCaregivers;
    document.getElementById('skill').onchange=renderCaregivers;
    renderCaregivers();
  }
  function initCaregiverProfile(){
    var params=new URLSearchParams(location.search);
    var profile=caregiverProfiles[params.get('id')||'N1001']||caregiverProfiles.N1001;
    var identity=document.querySelector('.identity');
    if(!identity)return;
    addCaregiverProfileStyles();
    var avatar=identity.querySelector('.avatar');
    var name=identity.querySelector('.name');
    var id=identity.querySelector('.id');
    var phoneRow=identity.querySelector('.side-row');
    if(avatar)avatar.textContent=profile.avatar;
    if(name)name.textContent=profile.name;
    if(id)id.textContent='档案编号 · '+(params.get('id')||'N1001');
    if(phoneRow){var phoneValue=phoneRow.querySelector('span:last-child');if(phoneValue)phoneValue.textContent=profile.phone;}
    var sideList=identity.querySelector('.side-list');
    if(sideList&&!sideList.querySelector('.certification-row')){
      sideList.insertAdjacentHTML('beforeend','<div class="side-row certification-row"><span>认证状态</span><span class="cg-cert '+profile.certificationClass+'">'+profile.certification+'</span></div><div class="side-row work-years-row"><span>工龄</span><span>'+profile.workYears+'</span></div>');
    }
    var contentTitle=document.querySelector('.content-title');
    if(contentTitle)contentTitle.textContent=profile.name+'的陪护员档案';
  }
  function initCaregiverOrderRecords(){
    var panel=document.getElementById('orders');
    if(!panel)return;
    if(!document.getElementById('caregiver-order-record-style')){
      var style=document.createElement('style');
      style.id='caregiver-order-record-style';
      style.textContent='.caregiver-order-scroll{overflow-x:auto;padding-bottom:5px}.caregiver-order-table{min-width:1160px}.caregiver-order-table th{white-space:nowrap}.caregiver-order-table td{vertical-align:middle;white-space:nowrap}.caregiver-order-table .order-sub{display:block;margin-top:3px;color:#8F9BB0;font-size:10px;font-weight:600}.caregiver-order-table .order-type{color:#172033;font-weight:800}.caregiver-order-table .price{color:#224CD3;font-weight:900}.caregiver-order-table .rating-score{color:#D97706;font-weight:900}.caregiver-order-table .rating-empty{color:#9AA7BA}.caregiver-order-table .report-link{border:0;background:none;padding:0;color:#224CD3;font:700 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;white-space:nowrap}.caregiver-order-table .report-link:hover{text-decoration:underline}';
      document.head.appendChild(style);
    }
    panel.innerHTML='<div class="section-title">订单记录</div><div class="caregiver-order-scroll"><table class="table caregiver-order-table"><thead><tr><th>订单号</th><th>服务类型</th><th>单价</th><th>计价类型</th><th>客户名称</th><th>电话号码</th><th>下单时间</th><th>完成时间</th><th>服务评价</th><th>状态</th><th>操作</th></tr></thead><tbody>'+
      '<tr><td>AKB-20260412-001</td><td><span class="order-type">住院陪护</span><span class="order-sub">12小时/天 · 3天</span></td><td class="price">¥360</td><td>按天</td><td>王女士</td><td>138****2468</td><td>2026-04-11 16:24:36</td><td>—</td><td><span class="rating-empty">服务进行中</span></td><td><span class="tag">服务中</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260412-001\'">查看日报</button></td></tr>'+
      '<tr><td>AKB-20260405-086</td><td><span class="order-type">住院陪护</span><span class="order-sub">12小时/天 · 2天</span></td><td class="price">¥360</td><td>按天</td><td>刘女士</td><td>177****9183</td><td>2026-04-04 10:18:24</td><td>2026-04-06 20:12:07</td><td><span class="rating-score">★ 5.0</span><span class="order-sub">服务细致周到</span></td><td><span class="tag">已完成</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260405-086\'">查看日报</button></td></tr>'+
      '<tr><td>AKB-20260328-042</td><td><span class="order-type">居家陪护</span><span class="order-sub">24小时/天 · 1天</span></td><td class="price">¥520</td><td>按天</td><td>孙大爷</td><td>158****5509</td><td>2026-03-27 09:45:16</td><td>2026-03-28 20:06:33</td><td><span class="rating-score">★ 4.9</span><span class="order-sub">沟通及时</span></td><td><span class="tag">已完成</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260328-042\'">查看日报</button></td></tr>'+
      '</tbody></table></div>';
  }
  function item(key,label,href,path,badge){return '<a class="nav-link '+(key===currentActive?'active':'')+'" href="'+href+'"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>'+label+(badge?'<span class="nav-badge">'+badge+'</span>':'')+'</a>';}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
