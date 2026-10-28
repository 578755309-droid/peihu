/* Role entry uses the existing certification record; visiting never creates an identity. */
(function(w){
 'use strict';
 const C=w.AKBNurseCertification;
 function destination(){return C.effective()?'nurse-home.html':'nurse-certification.html?from=profile';}
 function refresh(){
  const s=C.summary(),a=s.app;
  const entry=document.getElementById('caregiverRoleSwitch');
  if(entry){
   entry.href=destination();entry.dataset.certification=s.effective?'approved':a?.status||'unverified';
   document.getElementById('caregiverRoleHint').textContent=s.effective?'已开通 · 进入陪护工作台':!a?'未开通 · 认证通过后可接单':a.status==='审核中'?'认证审核中 · 查看申请进度':'认证未通过 · 修改资料后重新提交';
  }
  const name=document.querySelector('.nurse-name-lg');
  if(name){
   name.textContent=a?.name||'未认证用户';
   const avatar=document.querySelector('.nurse-av-lg');if(avatar)avatar.textContent=(a?.name||'护').charAt(0);
   const no=document.querySelector('.nurse-no');if(no)no.textContent=s.effective?[(a.caregiverId?'工号 '+a.caregiverId:'已认证'),(a.skills||[]).join(' / ')].filter(Boolean).join(' · '):s.label;
   // Legacy demo tasks belong only to their explicit caregiver, never a newly approved applicant.
   if(!s.effective||a.caregiverId!=='AKB-N-00234'){
    const pending=document.getElementById('pendingCard');if(pending)pending.style.display='none';
    const empty=document.getElementById('noOrder');if(empty){empty.style.display='block';empty.textContent=s.effective?'暂无新订单':'认证通过后即可接单';}
    document.querySelector('.home-schedule-section')?.setAttribute('hidden','');
    let orders=[];try{orders=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');}catch(e){}
    const own=Array.isArray(orders)?orders.filter(C.matchesOrder):[];
    const values=[own.filter(o=>o.state==='待服务').length,own.filter(o=>o.state==='服务中'||o.state==='待完成').length,own.filter(o=>o.state==='服务中'||o.state==='待完成').length];
    document.querySelectorAll('.work-queue .queue-value').forEach((el,i)=>{el.textContent=values[i]||0;});
   }
  }
  // Account information must not fall back to the old sample caregiver.
  if(document.body.dataset.page==='nurse-profile'){
   const n=document.querySelector('.identity .name');if(n)n.textContent=a?.name||'未认证用户';
   const av=document.querySelector('.identity .avatar');if(av)av.textContent=(a?.name||'护').charAt(0);
   if(!a){document.querySelectorAll('.profile-grid .profile-value').forEach(el=>{el.textContent='—';});}
   const section=document.querySelector('.profile-section');if(section)section.onclick=()=>{location.href='nurse-certification.html';};
   const edit=document.querySelector('.hero-action');if(edit)edit.onclick=()=>{location.href='nurse-certification.html';};
  }
 }
 w.AKBRoleSwitch={destination,refresh};
 w.addEventListener('storage',e=>{if(['akbNurseApplications','ankebang_service_orders',null].includes(e.key))refresh();});
 w.addEventListener('focus',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})(window);
