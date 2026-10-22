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
    const pending=document.getElementById('pendingCard');
    const empty=document.getElementById('noOrder');
    let values=[0,0,0],next=null;
    if(s.effective){
     let orders=[];try{orders=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');}catch(e){}
     const own=Array.isArray(orders)?orders.filter(C.matchesOrder):[];
     /* 与“我的订单”页共用同一套示例订单，认证通过的护理员工作台也有数据 */
     const seeds=(w.AKBNurseOrderSeeds||[]).map(o=>Object.assign({},o));
     const pool=own.length?own:seeds;
     const count=states=>pool.filter(o=>states.indexOf(o.state)>=0).length;
     values=[count(['待服务','待上岗']),count(['服务中']),count(['待完成'])];
     next=pool.find(o=>o.state==='待确认')||pool.find(o=>o.state==='待服务')||null;
    }
    document.querySelectorAll('.work-queue .queue-value').forEach((el,i)=>{el.textContent=values[i]||0;});
    if(pending&&empty){
     pending.style.display=next?'':'none';
     empty.style.display=next?'none':'block';
     empty.textContent=s.effective?'暂无新订单':'认证通过后即可接单';
    }
    if(next&&pending){
     pending.dataset.orderId=next.id||'';
     const set=(sel,v)=>{const el=pending.querySelector(sel);if(el&&v!=null)el.textContent=v;};
     set('.patient-av',(next.avatar||next.name||'护').charAt(0));
     set('.patient-name',next.name||'服务对象');
     set('.patient-meta',next.meta||'');
     set('.patient-tag',next.type||'陪护服务');
     const place=String(next.place||''),parts=place.split('·');
     const chips=pending.querySelectorAll('.info-chip .chip-val');
     if(chips[0])chips[0].textContent=parts[0].trim()||'—';
     if(chips[1])chips[1].textContent=parts[1]?parts[1].trim():'—';
     if(chips[2])chips[2].textContent=String(next.time||'').replace(/^今日\s*/,'')||'—';
     if(chips[3])chips[3].textContent=next.income||'—';
     const needs=next.careNeeds||{},needVals=pending.querySelectorAll('.care-need-value');
     ['independence','tube','infection'].forEach((k,i)=>{if(needVals[i]&&needs[k]!=null)needVals[i].textContent=needs[k];});
    }
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
