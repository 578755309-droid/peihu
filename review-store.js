/* One review framework and store for care, clinic, bath and mall orders. */
(function(w){
 'use strict';const KEY='akb_service_ratings_v2';
 const profiles={
 care:{title:'陪护评价',score:'综合陪护星级',placeholder:'说说本次陪护的照护、沟通和服务体验吧',thanks:'感谢你的反馈，我们会持续提升陪护服务质量。',dims:[['punctual','服务守时'],['professional','照护专业度'],['patience','耐心与沟通'],['responsibility','责任心与细心'],['manner','个人素养与习惯']],tags:['服务态度好','有耐心','专业细致','响应及时','照护周到','沟通顺畅']},
 visit:{title:'陪诊评价',score:'综合陪诊星级',placeholder:'说说本次陪诊或就医协助的流程、沟通与服务体验吧',thanks:'感谢你的反馈，我们会持续改善陪诊与就医协助体验。',dims:[['punctual','到达守时'],['process','流程熟悉'],['communication','沟通清晰'],['assistance','协助细致'],['attitude','服务态度']],tags:['准时到达','流程熟悉','安排有序','沟通清楚','协助细致','响应及时']},
 bath:{title:'助浴评价',score:'综合助浴星级',placeholder:'说说本次助浴的操作、卫生、舒适度和照护体验吧',thanks:'感谢你的反馈，我们会持续改善上门助浴体验。',dims:[['punctual','服务守时'],['operation','操作规范'],['hygiene','清洁卫生'],['comfort','舒适体验'],['patience','耐心照护']],tags:['准时上门','操作细致','清洁卫生','水温舒适','沟通耐心','照护周到']},
 mall:{title:'商城评价',score:'综合商品星级',placeholder:'说说商品质量、描述相符程度、包装与配送体验吧',thanks:'感谢你的反馈，你的评价将帮助我们改善商品与配送体验。',dims:[['quality','商品质量'],['description','描述相符'],['packaging','包装完好'],['delivery','配送时效'],['shopping','购买体验']],tags:['质量满意','描述相符','包装完好','配送及时','购买方便','物有所值']}
 };
 function read(){try{const r=JSON.parse(localStorage.getItem(KEY)||'{}');return r&&typeof r==='object'&&!Array.isArray(r)?r:{};}catch(e){return {};}}
 function find(kind,id){const key=kind==='mall'?'ankebang_mall_orders':'ankebang_service_orders';let saved=[];try{saved=JSON.parse(localStorage.getItem(key)||'[]');}catch(e){}return (Array.isArray(saved)?saved:[]).find(o=>o.id===id)||(w.AKBReviewOrderSeeds?.[kind==='mall'?'mall':'service']||[]).find(o=>o.id===id)||null;}
 function type(order,kind){if(kind==='mall')return 'mall';const text=[order?.serviceKey,order?.type,order?.project].join(' ');if(/bath|助浴/.test(text))return 'bath';if(/visit|陪诊|就诊|检查|药|报告|手续|接送|接\/送/.test(text))return 'visit';return 'care';}
 function profile(kind){return profiles[kind]||profiles.care;}
 function eligible(order){return !!order&&(order.state?order.state==='已完成':['done','completed'].includes(order.status));}
 function has(id){const r=read()[id];return !!r&&!!(r.text||r.createdAt||r.deleted);}
 function stars(score){const n=Math.max(0,Math.min(5,Math.round(Number(score)||0)));return '★'.repeat(n)+'☆'.repeat(5-n);}
 function submit(kind,id,input){const order=find(kind,id);if(!eligible(order))throw Error('仅已完成的订单可以评价');if(has(id))throw Error('该订单已提交评价，请勿重复提交');const category=type(order,kind),p=profile(category);if(p.dims.some(([k])=>!Number.isInteger(input.dimensions[k])||input.dimensions[k]<1||input.dimensions[k]>5))throw Error('请完成全部'+p.dims.length+'项星级评分');const text=String(input.text||'').trim();if(!text)throw Error('请填写文字评价');if(text.length>200)throw Error('评价内容不能超过200字');const avg=Number((p.dims.reduce((n,[k])=>n+input.dimensions[k],0)/p.dims.length).toFixed(1));const record={orderNo:id,kind:category,orderKind:kind,service:kind==='mall'?(order.product||'商城商品'):(order.project||order.type),meta:kind==='mall'?(order.desc||'商城商品'):[order.nurse,order.type].filter(Boolean).join(' · '),cover:order.image||input.cover||'',user:order.contact||(order.person||'').split('｜')[0]||'用户',userPhone:order.phone||'',userScore:avg,total:avg,stars:stars(avg),text,dimensions:Object.fromEntries(p.dims.map(([k])=>[k,input.dimensions[k]])),dimensionLabels:p.dims.map(([key,label])=>({key,label})),tags:(input.tags||[]).filter(t=>p.tags.includes(t)),images:(input.images||[]).slice(0,6),createdAt:new Date().toISOString(),replies:[]};const all=read();all[id]=record;localStorage.setItem(KEY,JSON.stringify(all));return record;}
 w.AKBReviews={profiles,profile,read,find,type,eligible,has,stars,submit};
})(window);
