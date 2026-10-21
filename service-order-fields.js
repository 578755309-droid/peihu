/* Canonical service form snapshot and read-only field presentation shared by all three surfaces. */
(function(w){
 'use strict';
 const projects={hospital:'住院陪护',home:'居家陪护',bath:'上门助浴',vip:'贵宾陪诊',premium:'优享陪诊',medicine:'代买药','exam-booking':'代约检查',result:'代看检查结果',admission:'代办住院手续',discharge:'代办出院手续','ring-pickup':'三环内接/送患者',airport:'机场接/送患者',report:'代取报告',station:'西安北站接送患者'};
 const labels={independence:{independent:'完全自理',partial:'半自理',dependent:'完全失能'},tube:{none:'无',has:'有'},infection:{none:'无',has:'有'},skinBreak:{none:'无',has:'有'}};
 const escort=['ring-pickup','airport','station'];
 function mask(id){const v=String(id||'');return v.length===18?v.slice(0,6)+'********'+v.slice(-4):v;}
 function list(){try{const v=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');return Array.isArray(v)?v:[];}catch(e){return [];}}
 function read(id){return list().find(o=>o.id===id||o.no===id)||null;}
 function infer(o){return o.serviceDetails?.projectId||o.visitServiceId||o.serviceKey||Object.keys(projects).find(k=>String(o.type||o.project||'').includes(projects[k]))||'unknown';}
 function normalize(o){
  const s=o.serviceDetails||{},p=Object.assign({},s.patient||o.patientSnapshot||{}),parts=String(o.person||'').split('｜'),id=infer(o);
  p.name=p.name||parts[0]||o.name||'';p.gender=p.gender||parts[2]||'';if(p.age==null)p.age=(parts[1]||'').replace('岁','');p.condition=p.condition||o.patientCondition||'';p.idMasked=mask(p.idMasked||p.idNo||'');delete p.idNo;
  return {id:o.id||o.no,projectId:id,projectName:o.type||projects[id]||'服务',patient:p,contact:o.contact??s.contact??'',phone:o.phone??s.phone??'',date:o.serviceDate!==undefined?o.serviceDate:(s.date||''),timeSlot:s.timeSlot||o.timeSlot||'',time:o.time||s.time||'',dailyType:s.dailyType||o.dailyType||'',quantity:o.quantity||'',careNeeds:(s.careNeeds||o.careNeeds||{}),addresses:s.addresses||[{label:'服务地址',detail:o.addressDetail||o.address||''},...(o.address2?[{label:'送达地址',detail:o.address2}]:[])],department:s.department||o.serviceDept||'',ward:s.ward||o.ward||'',examItem:o.examItem||s.examItem||'',examPhotos:o.examPhotos||s.examPhotos||[],reportName:o.reportName||s.reportName||'',pax:o.pax||s.pax||'',note:o.note??s.note??'',sessions:o.sessions||[],cardId:o.cardId||'',consent:o.consent||s.consent||null};
 }
 function groups(o,surface){const m=normalize(o),isEscort=escort.includes(m.projectId),isCare=['hospital','home','bath'].includes(m.projectId),rows=[],row=(id,label,value,kind)=>({id,label,value:value===0?'0':value||'未填写',kind});
  rows.push({title:isEscort?'接送人信息':isCare?'服务对象信息':'就诊人信息',rows:[row('patient.name',isEscort?'接送人':'姓名',m.patient.name),row('patient.gender','性别',m.patient.gender),row('patient.age','年龄',m.patient.age!==''&&m.patient.age!=null?m.patient.age+'岁':''),row('patient.idMasked','身份证号码',m.patient.idMasked),row('patient.condition','健康情况及服务需求',m.patient.condition)]});
  rows.push({title:'联系信息',rows:[...(!isEscort?[row('contact','联系人姓名',m.contact)]:[]),row('phone',isEscort?'联系电话':'联系人电话',m.phone)]});
  const schedule=[row('project','服务项目',m.projectName),row('date','服务日期',m.date||(m.projectId==='bath'&&Array.isArray(o.sessions)?'待预约':'')),...(m.timeSlot?[row('timeSlot','服务时段',m.timeSlot)]:[]),row('time','服务安排',m.time),...(m.dailyType?[row('dailyType','陪护类型',m.dailyType==='half'?'12小时陪护':m.dailyType==='full'?'24小时陪护':m.dailyType)]:[]),row('quantity','服务数量',m.quantity)];
  if(['vip','premium','exam-booking'].includes(m.projectId)||m.examItem)schedule.push(row('examItem','检查项目',m.examItem));
  if(['admission','discharge'].includes(m.projectId)||m.department)schedule.push(row('department','服务科室',m.department));
  if(m.projectId==='hospital'||m.ward)schedule.push(row('ward','科室与床位号',m.ward));
  if(m.projectId==='report'||m.reportName)schedule.push(row('reportName','报告名称',m.reportName));
  if(isEscort||m.pax)schedule.push(row('pax','乘车人数',m.pax?m.pax+'人':''));
  if(m.projectId==='result'||m.examPhotos.length)schedule.push(row('examPhotos','已有检查单',m.examPhotos.length?m.examPhotos:[], 'photos'));
  schedule.push(row('note',m.projectId==='home'?'其他诉求':'备注',m.note||'无'));rows.push({title:'服务信息',rows:schedule});
  rows.push({title:'服务地址',rows:m.addresses.map((a,i)=>row('address.'+i,a.label||'服务地址',[a.detail,a.contact,a.phone].filter(Boolean).join(' · ')))});
  if(isCare)rows.push({title:'护理需求',rows:['independence','tube','infection','skinBreak'].map((k,i)=>row('care.'+k,['自理能力','管路','传染性疾病','皮肤破损'][i],(labels[k][m.careNeeds[k]]||m.careNeeds[k]||'未填写')+(k==='infection'&&m.careNeeds.infectionName?'（'+m.careNeeds.infectionName+'）':'')))});
  if(m.sessions.length)rows.push({title:'按次预约明细',rows:m.sessions.map((s,i)=>row('session.'+i,'第'+(s.seq||i+1)+'次',[s.date,s.time,s.addressDetail,s.contact,s.phone].filter(Boolean).join(' · ')))});
  else if(m.projectId==='bath'&&(String(m.projectName)+String(o.project||'')).includes('10次套餐'))rows.push({title:'按次预约明细',rows:[row('session.empty','预约记录','暂未预约，可在服务前补充预约')]});
  if(!['待支付','待付款'].includes(o.state)&&o.status!=='payment'&&(o.nurse||o.nurse2))rows.push({title:'服务人员',rows:[row('nurse','护理员',[o.nurse,o.nursePhone].filter(Boolean).join(' · ')),...(o.nurse2?[row('nurse2','第二位护理员',[o.nurse2,o.nursePhone2].filter(Boolean).join(' · '))]:[])]});
  if(m.cardId)rows.push({title:'兑换信息',rows:[row('cardId','使用兑换卡',m.cardId)]});
  if(m.consent)rows.push({title:'知情同意确认',rows:[row('consent.name','同意书',m.consent.name),row('consent.version','确认版本',m.consent.version),row('consent.acceptedAt','确认时间',m.consent.acceptedAt)]});
  return rows;
 }
 function addressText(o){const m=normalize(o);return m.addresses.map(a=>a.detail).filter(Boolean).join(' → ');}
 /* Compact product-specific rows for order list cards; only filled values are returned. */
 function summary(o,surface){
  const m=normalize(o),isEscort=escort.includes(m.projectId),rows=[],add=(label,value)=>{if(value!==''&&value!=null&&value!=='未填写')rows.push({label,value});};
  if(isEscort){add('接送人',m.patient.name);if(m.pax)add('乘车人数',m.pax+'人');}
  if(['vip','premium','exam-booking'].includes(m.projectId)||m.examItem)add('检查项目',m.examItem);
  if(['admission','discharge'].includes(m.projectId)||m.department)add('服务科室',m.department);
  if(m.projectId==='hospital'||m.ward)add('科室床位',m.ward);
  if(m.projectId==='report'||m.reportName)add('报告名称',m.reportName);
  if(m.projectId==='result'||m.examPhotos.length)add('已有检查单',m.examPhotos.length?m.examPhotos.length+' 张':'');
  if(m.dailyType)add('陪护类型',m.dailyType==='half'?'12小时陪护':m.dailyType==='full'?'24小时陪护':m.dailyType);
  if(['hospital','home','bath'].includes(m.projectId)){
   const c=m.careNeeds,care=[];
   if(labels.independence[c.independence])care.push(labels.independence[c.independence]);
   if(c.tube==='has')care.push('有管路');
   if(c.infection==='has')care.push('有传染性疾病'+(c.infectionName?'（'+c.infectionName+'）':''));
   if(c.skinBreak==='has')care.push('有皮肤破损');
   if(care.length)add('护理需求',care.join(' · '));
  }
  if(m.sessions.length)add('按次预约','已预约 '+m.sessions.length+'/10 次'+(m.sessions[0]&&m.sessions[0].date?' · 下次 '+m.sessions[0].date:''));
  else if(m.projectId==='bath'&&(String(m.projectName)+String(o.project||'')).includes('10次套餐'))add('按次预约','未预约 · 可按次补充');
  if(m.cardId)add('兑换卡',m.cardId);
  if((surface==='nurse'||surface==='admin')&&m.note)add('服务需求',m.note);
  return rows.slice(0,4);
 }
 w.AKBServiceOrderFields={projects,mask,list,read,infer,normalize,groups,labels,summary,addressText};
})(window);
