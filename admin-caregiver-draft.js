(function(){
  function readDraft(){try{return JSON.parse(sessionStorage.getItem('akbCaregiverDraft')||'null')}catch(error){return null}}
  function syncDraft(){
    var draft=readDraft(),id=new URLSearchParams(location.search).get('id');
    if(!draft||draft.id!==id)return;
    var identity=document.querySelector('.identity');if(!identity)return;
    var avatar=identity.querySelector('.avatar'),name=identity.querySelector('.name'),number=identity.querySelector('.id'),state=identity.querySelector('.state'),title=document.querySelector('.content-title'),sub=document.querySelector('.content-sub');
    if(avatar)avatar.textContent=draft.name.slice(0,1);if(name)name.textContent=draft.name;if(number)number.textContent='档案编号 · '+draft.id;if(title)title.textContent=draft.name+'的陪护员档案';if(sub)sub.textContent='新建档案 · 等待资质材料审核与服务信息完善';
    if(state){var labels={on:'在岗',leave:'休息',off:'停用'};state.textContent=labels[draft.state]||'在岗';state.style.background=draft.state==='on'?'#DCFCE7':draft.state==='leave'?'#FEF3C7':'#FEE2E2';state.style.color=draft.state==='on'?'#16A34A':draft.state==='leave'?'#D97706':'#DC2626';}
    var list=identity.querySelector('.side-list');if(list)list.innerHTML='<div class="side-row"><span>手机号</span><span>'+draft.phone+'</span></div><div class="side-row"><span>认证状态</span><span>'+draft.certification+'</span></div><div class="side-row"><span>工龄</span><span>'+draft.workYears+'</span></div><div class="side-row"><span>服务区域</span><span>'+draft.area+'</span></div><div class="side-row"><span>服务评分</span><span>暂无评价</span></div><div class="side-row"><span>累计服务</span><span>0 单</span></div>';
    var skillPanel=document.getElementById('skill');if(skillPanel)skillPanel.innerHTML='<div class="section-title">服务技能</div><div class="grid">'+draft.skills.map(function(skill){return '<div class="kv"><div class="k">'+skill+'</div><div class="v">待服务认证</div></div>';}).join('')+'</div>';
    var certPanel=document.getElementById('cert');if(certPanel)certPanel.innerHTML='<div class="section-title">资质证书</div><div class="empty">当前认证状态：'+draft.certification+'。请补充护理相关资质证书后提交审核。</div>';
    var orderPanel=document.getElementById('orders');if(orderPanel)orderPanel.innerHTML='<div class="section-title">订单记录</div><div class="empty">新建档案暂无服务订单</div>';
  }
  document.addEventListener('DOMContentLoaded',function(){window.setTimeout(syncDraft,0)});
})();
