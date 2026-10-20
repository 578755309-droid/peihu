(function(){
  var currentActive='';
  function init(){
    var shared=document.querySelector('link[href="admin-shell.css"]');
    if(shared)document.head.appendChild(shared);
    var side=document.querySelector('.sidebar'); if(!side)return;
    var file=(location.pathname.split('/').pop()||'admin.html').toLowerCase();
    if(file.indexOf('.')===-1)file+='.html';
    currentActive=file==='admin.html'?'dashboard':file.indexOf('admin-ops')>-1?'ops':file.indexOf('admin-finance')>-1?'finance':file.indexOf('ux-monitor')>-1?'ux-monitor':file.indexOf('agreement')>-1?'agreement':file.indexOf('admin-mall-order')>-1?'mall-orders':file.indexOf('admin-mall-products')>-1?'mall-products':file.indexOf('admin-mall-categories')>-1?'mall-categories':file.indexOf('admin-mall-distribution')>-1?'mall-dist':file==='admin-mall.html'?'mall-dashboard':file.indexOf('message-templates')>-1?'msg-templates':file.indexOf('bookings')>-1?'bookings':file.indexOf('service-categories')>-1?'catalog':file==='admin-points.html'?'points':file.indexOf('points-users')>-1?'points-users':file.indexOf('points-earn')>-1?'points-earn':file.indexOf('points-spend')>-1?'points-spend':file.indexOf('points-invite')>-1?'points-invite':file.indexOf('contract')>-1?'contracts':file.indexOf('consult')>-1?'consult':file.indexOf('feedback')>-1?'feedback':file.indexOf('order')>-1?'orders':file.indexOf('caregiver')>-1?'caregivers':file.indexOf('user')>-1?'users':'';
    side.innerHTML='<div class="sb-logo"><div class="sb-logo-title">佑小邦</div><div class="sb-logo-sub">运营管理后台 v2.1</div></div>'+
      '<nav class="sb-nav"><div class="sb-section-lbl">概览</div>'+item('ops','运营看板','admin-ops.html','<path d="M2 14l4-5 3.5 3L15 5"/><path d="M11 5h4v4"/>')+item('finance','财务看板','admin-finance.html','<circle cx="9" cy="9" r="7.2"/><path d="M6 6l3 3.6L12 6M9 9.6V14M6.6 10.4h4.8M6.6 12.6h4.8"/>')+
      '<div class="sb-section-lbl">业务管理</div>'+item('dashboard','业务概览','admin.html','<rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5"/>')+item('orders','订单管理','admin-orders.html','<rect x="3" y="2" width="12" height="14" rx="2"/><path d="M6 6h6M6 9h6M6 12h4"/>','12')+item('caregivers','陪护员管理','admin-caregivers.html','<circle cx="9" cy="6" r="3"/><path d="M2.5 16c.4-3.2 2.6-5 6.5-5s6.1 1.8 6.5 5"/>')+item('users','用户管理','admin-users.html','<circle cx="6.5" cy="6" r="3"/><circle cx="13" cy="7" r="2.3"/><path d="M1.5 16c.4-3 2.1-4.7 5-4.7s4.6 1.7 5 4.7M11.2 11.5c2.7-.2 4.6 1.1 5.2 4"/>')+item('catalog','服务管理','admin-service-categories.html','<path d="M3 4h12M3 9h12M3 14h12"/><circle cx="7" cy="4" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none"/><circle cx="6" cy="14" r="1.5" fill="currentColor" stroke="none"/>')+item('bookings','预约管理','admin-bookings.html','<rect x="2.5" y="3.5" width="13" height="12" rx="2"/><path d="M2.5 7h13M6.5 1.5v4M11.5 1.5v4M6.5 10h5"/>',bookingBadge())+
      '<div class="sb-section-lbl">商城管理</div>'+
      item('mall-dashboard','商城概览','admin-mall.html','<path d="M2.8 6.2l1.6-2.6h9.2l1.6 2.6M2.8 6.2h14.4M4.2 6.2l1 9.3h9.6l1-9.3M9 9.2v3.4"/>')+
      item('mall-categories','商品管理','admin-mall-categories.html','<rect x="2.6" y="2.6" width="5.4" height="5.4" rx="1.2"/><rect x="10" y="2.6" width="5.4" height="5.4" rx="1.2"/><rect x="2.6" y="10" width="5.4" height="5.4" rx="1.2"/><rect x="10" y="10" width="5.4" height="5.4" rx="1.2"/>')+
      item('mall-orders','商城订单','admin-mall-orders.html','<path d="M5.2 7.2h13.6l-1.1 9H6.3l-1.1-9zM8.7 7.2V5.8a3.3 3.3 0 016.6 0v1.4"/>',mallBadge())+
      item('mall-dist','分销管理','admin-mall-distribution.html','<circle cx="4.5" cy="9" r="2"/><circle cx="13.5" cy="4.5" r="2"/><circle cx="13.5" cy="13.5" r="2"/><path d="M6.3 7.9l5.4-2.5M6.3 10.1l5.4 2.5"/>')+
      '<div class="sb-section-lbl">积分管理</div>'+
      item('points','积分概览','admin-points.html','<circle cx="9" cy="9" r="7.2"/><path d="M6.6 5.6L9 8.8l2.4-3.2M9 8.8v4.6M6.9 9.8h4.2M6.9 11.8h4.2"/>')+
      '<div class="sb-section-lbl">其他</div>'+
      item('ux-monitor','用户体验监测','admin-ux-monitor.html','<circle cx="6" cy="9" r="3.6"/><path d="M6 5.4V9l2.4 1.6"/><path d="M12.5 5.5l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z"/>')+
      item('msg-templates','消息模板','admin-message-templates.html','<rect x="2" y="3.5" width="14" height="11" rx="2"/><path d="M2.8 5.5L9 10l6.2-4.5"/><path d="M15 12.5h1.5M15 15h1.5"/>')+
      item('consult','资讯内容','admin-consult.html','<path d="M3 3.5h12v9H8l-3.4 2.6c-.3.2-.6 0-.6-.4z"/><path d="M6 7h6M6 9.6h4"/>')+
      item('agreement','协议管理','admin-agreements.html','<rect x="3" y="2" width="12" height="14" rx="2"/><path d="M6 6h6M6 9h6M6 12h3"/>')+
      item('comments','评论管理','admin-comments.html','<path d="M3 4.5A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5v6A1.5 1.5 0 0113.5 12H8l-3.5 2.8c-.3.2-.5 0-.5-.4z"/><path d="M6 6.5h6M6 9h4"/>')+
      item('feedback','意见反馈','admin-feedback.html','<rect x="2" y="3.5" width="14" height="11" rx="2"/><path d="M2.8 5.5L9 10l6.2-4.5"/>',feedbackBadge())+
      '</nav>'+
      '<div class="sb-user"><div class="sb-av">管</div><div><div class="sb-uname">超级管理员</div><div class="sb-urole">admin@akb.com</div></div><button class="sb-logout" onclick="AKBUI.confirm(\'确认退出？\').then(function(ok){if(ok)location.href=\'index.html\'})">↗</button></div>';
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
    initSidebarGroups(side);
  }
  /* Vue sidebar groups preserve the generated links, badge counts and current route. */
  function initSidebarGroups(side){
    if(!window.Vue)return;
    var nav=side.querySelector('.sb-nav');if(!nav)return;
    var groups=[],group=null;
    Array.prototype.forEach.call(nav.children,function(node){
      if(node.classList.contains('sb-section-lbl')){
        group={id:'section-'+groups.length,title:node.textContent,html:'',active:false,badge:0};groups.push(group);
      }else if(group){
        if(node.classList.contains('active')){group.active=true;node.setAttribute('aria-current','page');}
        var badge=node.querySelector('.nav-badge,.badge');if(badge)group.badge+=Number(badge.textContent)||0;
        group.html+=node.outerHTML;
      }
    });
    var saved={};try{var parsed=JSON.parse(localStorage.getItem('akb_sidebar_groups_v1')||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))saved=parsed;}catch(error){}
    var open=Vue.reactive({});groups.forEach(function(g){open[g.id]=g.active||saved[g.id]!==false;});
    Vue.createApp({name:'AdminSidebarGroups',setup:function(){
      function toggle(g){open[g.id]=!open[g.id];try{localStorage.setItem('akb_sidebar_groups_v1',JSON.stringify(open));}catch(error){}}
      return function(){return Vue.h(Vue.Fragment,null,groups.map(function(g){
        return Vue.h('section',{key:g.id,class:['sb-group',{'is-open':open[g.id],'has-current':g.active}]},[
          Vue.h('button',{type:'button',class:'sb-group-toggle','aria-expanded':String(open[g.id]),'aria-controls':'sb-'+g.id,onClick:function(){toggle(g);}},[
            Vue.h('span',{class:'sb-group-name'},g.title),
            !open[g.id]&&g.badge?Vue.h('span',{class:'sb-group-badge'},String(g.badge)):null,
            Vue.h('svg',{viewBox:'0 0 16 16',class:'sb-group-chevron','aria-hidden':'true',fill:'none'},[Vue.h('path',{d:'m4 6 4 4 4-4',stroke:'currentColor','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'})])]),
          Vue.h('div',{id:'sb-'+g.id,class:'sb-group-collapse','aria-hidden':String(!open[g.id]),inert:!open[g.id]?'':null},[
            Vue.h('div',{class:'sb-group-links',innerHTML:g.html})])]);
      }));};
    }}).mount(nav);
    nav.setAttribute('aria-label','后台主导航');
    if(window.AKBUI)window.AKBUI.refresh();
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
    N1001:{avatar:'张',name:'张阿姨',phone:'138****2468',certification:'审核通过',certificationClass:'approved',workYears:'6年',employmentType:'full-time',companyName:'',skills:['住院陪护','居家陪护']},
    N1002:{avatar:'李',name:'李师傅',phone:'139****8572',certification:'审核通过',certificationClass:'approved',workYears:'4年',employmentType:'part-time',companyName:'西安康护家政服务有限公司',skills:['陪诊服务']},
    N1003:{avatar:'王',name:'王阿姨',phone:'186****3016',certification:'审核中',certificationClass:'reviewing',workYears:'3年',employmentType:'part-time',companyName:'雁塔区助老服务中心',skills:['上门助浴','居家陪护']},
    N1004:{avatar:'赵',name:'赵姐',phone:'133****6420',certification:'审核驳回',certificationClass:'rejected',workYears:'2年',employmentType:'full-time',companyName:'',skills:['住院陪护']},
    N1005:{avatar:'陈',name:'陈阿姨',phone:'177****9183',certification:'未提交',certificationClass:'unsubmitted',workYears:'1年',employmentType:'full-time',companyName:'',skills:['居家陪护']}
  };
  try{
    var storedCaregivers=JSON.parse(sessionStorage.getItem('akbNewCaregivers')||'[]');
    var certificationClasses={'审核通过':'approved','审核中':'reviewing','审核驳回':'rejected','未提交':'unsubmitted'};
    storedCaregivers.forEach(function(caregiver){
      caregiverProfiles[caregiver.id]={avatar:caregiver.name.slice(0,1),name:caregiver.name,phone:caregiver.phone,certification:caregiver.certification||'未提交',certificationClass:certificationClasses[caregiver.certification]||'unsubmitted',workYears:caregiver.workYears||'—',employmentType:caregiver.employmentType||'full-time',companyName:caregiver.companyName||'',skills:caregiver.skills||[]};
    });
  }catch(error){}
  var CG_ET_LABELS={self:'自营',personal:'个人',enterprise:'企业','full-time':'自营','part-time':'企业'};
  var CG_ET_CLASSES={self:'on',personal:'leave',enterprise:'biz','full-time':'on','part-time':'biz'};
  function cgEtLabel(t){return CG_ET_LABELS[t]||'自营';}
  function cgEtClass(t){return CG_ET_CLASSES[t]||'on';}
  function addCaregiverProfileStyles(){
    if(document.getElementById('caregiver-profile-style'))return;
    var style=document.createElement('style');
    style.id='caregiver-profile-style';
    style.textContent='.caregiver-list-scroll{overflow-x:auto!important;overflow-y:hidden!important}.caregiver-list-table{min-width:1180px}.caregiver-list-table th{white-space:nowrap}.caregiver-list-table td{white-space:nowrap}.caregiver-list-table .cg-avatar{width:36px;height:36px;border-radius:12px;background:#DDF7F1;color:#1CD8B7;display:grid;place-items:center;font-weight:700}.caregiver-list-table .cg-profile{display:flex;gap:10px;align-items:center}.caregiver-list-table .cg-name{color:#172033;font-weight:600}.caregiver-list-table .cg-id{color:#8F9BB0;font-size:10px;margin-top:2px}.cg-cert{display:inline-flex;align-items:center;padding:5px 9px;border-radius:12px;font-size:11px;font-weight:600}.cg-cert.approved{color:#16A34A;background:#DCFCE7}.cg-cert.reviewing{color:#D97706;background:#FEF3C7}.cg-cert.rejected{color:#DC2626;background:#FEE2E2}.cg-cert.unsubmitted{color:#657087;background:#E4FAF4}.identity .profile-cert{margin-left:6px}.identity .profile-cert.cg-cert{vertical-align:middle}.identity .side-row .cg-cert{padding:4px 8px}.state.biz{background:#C9F4EA;color:#1CD8B7}.skill-tags{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0 2px}.skill-tag{padding:4px 10px;border-radius:12px;background:#E4FAF4;color:#1CD8B7;font-size:11px;font-weight:600}';
    document.head.appendChild(style);
  }
  function initCaregiverManagement(){
    var table=document.querySelector('#rows')&&document.querySelector('#rows').closest('table');
    var rows=document.getElementById('rows');
    if(!table||!rows||typeof DATA==='undefined')return;
    addCaregiverProfileStyles();
    table.parentElement.classList.add('caregiver-list-scroll');
    table.classList.add('caregiver-list-table');
    table.querySelector('thead tr').innerHTML='<th>头像</th><th>陪护员</th><th>手机号</th><th>认证状态</th><th>工龄</th><th>人员类型</th><th>入驻企业</th><th>服务技能</th><th>服务评分</th><th>累计订单</th><th>在岗状态</th><th>操作</th>';
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
        var profile=caregiverProfiles[caregiver.id]||{avatar:caregiver.name.slice(0,1),certification:'未提交',certificationClass:'unsubmitted',workYears:'—',employmentType:caregiver.employmentType||'full-time',companyName:caregiver.companyName||''};
        var et=profile.employmentType||caregiver.employmentType||'full-time';
        var etLabel=cgEtLabel(et);
        var etClass=cgEtClass(et);
        var company=profile.companyName||caregiver.companyName||'';
        return '<tr><td>'+(caregiver.photo?'<img class="cg-avatar" style="object-fit:cover" src="'+caregiver.photo+'" alt="">':'<div class="cg-avatar">'+profile.avatar+'</div>')+'</td><td><div class="cg-name">'+caregiver.name+'</div><div class="cg-id">档案编号 '+caregiver.id+'</div></td><td>'+caregiver.phone+'</td><td><span class="cg-cert '+profile.certificationClass+'">'+profile.certification+'</span></td><td>'+profile.workYears+'</td><td><span class="state '+etClass+'">'+etLabel+'</span></td><td>'+(company||'<span style="color:#8F9BB0">—</span>')+'</td><td>'+caregiver.skills.join('、')+'</td><td class="rating">★ '+caregiver.rating+'</td><td>'+caregiver.orders+' 单</td><td><span class="state '+caregiver.state+'">'+labels[caregiver.state]+'</span></td><td><div class="ops"><button onclick="location.href=\'admin-caregiver-detail.html?id='+caregiver.id+'\'">查看档案</button><button onclick="alert(\'编辑陪护员\')">编辑</button></div></td></tr>';
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
    var tagBox=document.getElementById('cgSkillTags');
    if(tagBox){var pSkills=profile.skills&&profile.skills.length?profile.skills:['住院陪护'];tagBox.innerHTML=pSkills.map(function(s){return '<span class="skill-tag">'+s+'</span>';}).join('');}
    var sideList=identity.querySelector('.side-list');
    if(sideList&&!sideList.querySelector('.certification-row')){
      var etLabel=cgEtLabel(profile.employmentType);
      var companyHtml=profile.companyName?'<div class="side-row company-row"><span>入驻企业</span><span>'+profile.companyName+'</span></div>':'';
      sideList.insertAdjacentHTML('beforeend','<div class="side-row employment-row"><span>人员类型</span><span>'+etLabel+'</span></div>'+companyHtml+'<div class="side-row certification-row"><span>认证状态</span><span class="cg-cert '+profile.certificationClass+'">'+profile.certification+'</span></div><div class="side-row work-years-row"><span>工龄</span><span>'+profile.workYears+'</span></div>');
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
      style.textContent='.caregiver-order-scroll{overflow-x:auto;padding-bottom:5px}.caregiver-order-table{min-width:1160px}.caregiver-order-table th{white-space:nowrap}.caregiver-order-table td{vertical-align:middle;white-space:nowrap}.caregiver-order-table .order-sub{display:block;margin-top:3px;color:#8F9BB0;font-size:10px;font-weight:600}.caregiver-order-table .order-type{color:#172033;font-weight:600}.caregiver-order-table .price{color:#1CD8B7;font-weight:700}.caregiver-order-table .rating-score{color:#D97706;font-weight:700}.caregiver-order-table .rating-empty{color:#9AA7BA}.caregiver-order-table .report-link{border:0;background:none;padding:0;color:#1CD8B7;font:700 12px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer;white-space:nowrap}.caregiver-order-table .report-link:hover{text-decoration:underline}';
      document.head.appendChild(style);
    }
    panel.innerHTML='<div class="section-title">订单记录</div><div class="caregiver-order-scroll"><table class="table caregiver-order-table"><thead><tr><th>订单号</th><th>服务类型</th><th>单价</th><th>计价类型</th><th>客户名称</th><th>电话号码</th><th>下单时间</th><th>完成时间</th><th>服务评价</th><th>状态</th><th>操作</th></tr></thead><tbody>'+
      '<tr><td>AKB-20260412-001</td><td><span class="order-type">住院陪护</span><span class="order-sub">12小时/天 · 3天</span></td><td class="price">¥360</td><td>按天</td><td>王女士</td><td>138****2468</td><td>2026-04-11 16:24:36</td><td>—</td><td><span class="rating-empty">服务进行中</span></td><td><span class="tag">服务中</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260412-001\'">查看日报</button></td></tr>'+
      '<tr><td>AKB-20260405-086</td><td><span class="order-type">住院陪护</span><span class="order-sub">12小时/天 · 2天</span></td><td class="price">¥360</td><td>按天</td><td>刘女士</td><td>177****9183</td><td>2026-04-04 10:18:24</td><td>2026-04-06 20:12:07</td><td><span class="rating-score">★ 5.0</span><span class="order-sub">服务细致周到</span></td><td><span class="tag">已完成</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260405-086\'">查看日报</button></td></tr>'+
      '<tr><td>AKB-20260328-042</td><td><span class="order-type">居家陪护</span><span class="order-sub">24小时/天 · 1天</span></td><td class="price">¥520</td><td>按天</td><td>孙大爷</td><td>158****5509</td><td>2026-03-27 09:45:16</td><td>2026-03-28 20:06:33</td><td><span class="rating-score">★ 4.9</span><span class="order-sub">沟通及时</span></td><td><span class="tag">已完成</span></td><td><button class="report-link" onclick="location.href=\'daily-report.html?order=AKB-20260328-042\'">查看日报</button></td></tr>'+
      '</tbody></table></div>';
  }
  function item(key,label,href,path,badge){return '<a class="nav-link '+(key===currentActive?'active':'')+'" href="'+href+'"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>'+label+(badge?'<span class="nav-badge">'+badge+'</span>':'')+'</a>';}
  function mallBadge(){
    try{
      var list=JSON.parse(localStorage.getItem('akb_admin_mall_orders')||'null');
      if(Array.isArray(list)){
        var n=list.filter(function(o){return o.state==='待发货';}).length;
        return n?String(n):'';
      }
    }catch(e){}
    return '';
  }
  function feedbackBadge(){
    try{
      var list=JSON.parse(localStorage.getItem('ankebang_feedbacks')||'null');
      if(Array.isArray(list)){
        var n=list.filter(function(f){return f.status==='待处理';}).length;
        return n?String(n):'';
      }
    }catch(e){}
    return '';
  }
  function bookingBadge(){
    try{
      var list=JSON.parse(localStorage.getItem('akb_bookings')||'null');
      if(Array.isArray(list)){
        var n=list.filter(function(o){return o.status==='pending';}).length;
        return n?String(n):'';
      }
    }catch(e){}
    return '';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

  /* 全局表格分页：统一注入 admin-pagination.js（对所有后台表格自动分页） */
  (function(){
    var s=document.createElement('script');
    s.src='admin-pagination.js';
    document.head.appendChild(s);
  })();

  /* 全局表格固定列：左侧固定名称列、右侧固定操作列 */
  (function(){
    var s=document.createElement('script');
    s.src='admin-sticky-table.js';
    document.head.appendChild(s);
  })();

  /* 全局交互增强：筛选重置/搜索防抖/弹层规范/防重复提交/统计卡键盘可达 */
  (function(){
    var l=document.createElement('link');
    l.rel='stylesheet';l.href='admin-ux.css';
    document.head.appendChild(l);
    var s=document.createElement('script');
    s.src='admin-ux.js';
    document.head.appendChild(s);
  })();
})();
