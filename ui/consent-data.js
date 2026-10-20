/* Shared agreement source; uses the same browser-local store as agreement management. */
(function(w){
 'use strict';
 const KEY='akb_agreements_v1';
 const specs=[
 ['bath','上门助浴知情同意书','上门助浴及次卡预约',[
 ['服务范围','提供订单约定的上门助浴及相关生活协助。服务项目、次数、时间、费用以订单确认页为准。'],
 ['服务前告知','请如实告知服务对象的健康状况、皮肤情况、行动能力及特殊需求，并准备安全的助浴环境。涉及健康适宜性的疑问，请先咨询医务人员。'],
 ['服务与安全','服务期间请配合安全评估及必要的家属协助。如有不适或现场条件不适宜，应及时说明并暂停服务；紧急情况应及时联系急救。助浴服务不替代医疗诊疗。'],
 ['预约与售后','次卡按实际可用次数预约。改期、取消、退款及售后请通过订单入口申请，以订单展示及平台审核结果为准。']]],
 ['care','陪护知情同意书','住院陪护与居家陪护',[
 ['服务范围','提供订单约定的生活照料、陪护及相关记录服务。服务类型、时长、地点、费用以订单确认页为准。陪护服务不替代医疗诊断、治疗或专业医疗操作。'],
 ['服务前告知','请如实填写服务对象情况、照护需求及联系人信息，并告知特殊注意事项。医疗事项请遵循医务人员指引。'],
 ['服务配合','请协助完成服务交接，保持联系人电话畅通。发生异常情况时应及时联系家属、平台及医务人员，紧急情况及时联系急救。'],
 ['变更与售后','如需调整时间、地点或服务需求，请及时通过订单或客服沟通。费用、取消及售后按订单展示的规则处理。']]],
 ['visit','陪诊知情同意书','陪诊及各类就医协助服务',[
 ['服务范围','提供订单约定的就医陪同、流程协助、检查预约、报告或药品代办及接送等相应服务，具体以所购项目为准。陪诊服务不替代医疗诊疗，不承诺号源、检查结果或诊疗效果。'],
 ['信息与材料','请提供准确的就诊人、联系人、医院及检查项目信息，并备齐所需证件和就医材料。需代办或代取时，请提供必要授权。'],
 ['就诊配合','检查准备、禁食及用药等事项请以医院和医务人员通知为准。请保持电话畅通；医院安排变化时请及时沟通。'],
 ['费用与售后','订单费用及服务范围以确认页为准，医院诊疗、检查、药品等费用以实际缴费信息为准。改期、取消及售后可通过订单或客服联系。']]],
 ['mall','商城知情同意书','商城商品购买与配送',[
 ['商品确认','下单前请核对商品名称、规格、数量、价格及商品详情，按需购买。商品适用范围、使用方法及注意事项以商品说明为准。'],
 ['使用注意','涉及健康相关商品时，请结合自身情况并遵循商品说明或专业人员指导，不应以商品替代必要的就医诊疗。'],
 ['配送与验收','请核对收货地址、联系人及配送方式。收货时请检查包装、规格和数量，如有异常请保留凭证并通过订单售后入口联系平台。'],
 ['订单与售后','实付金额以订单确认页为准。配送、取消、退换货及退款条件以商品详情、订单规则及实际售后处理结果为准。']]]
 ];
 const defaults=specs.map(([type,name,desc,sections])=>({id:'agr_consent_'+type,key:'consent_'+type,name,desc,version:'v1.0.0',status:'on',updatedAt:'2026-10-20 14:30',content:'<h1>'+name+'</h1>'+sections.map(([title,body],i)=>'<h2>'+(i+1)+'、'+title+'</h2><p>'+body+'</p>').join('')+'<p>请阅读上述内容，并在确认了解所购商品或服务的范围、注意事项及订单信息后，自主勾选同意。</p>'}));
 function read(base){let list;try{list=JSON.parse(localStorage.getItem(KEY));}catch(e){}if(!Array.isArray(list))list=(base||[]).slice();for(const doc of defaults)if(!list.some(a=>a.key===doc.key))list.push(Object.assign({},doc));return list;}
 function get(type){return read().find(a=>a.key==='consent_'+type);}
 function token(doc){return JSON.stringify([doc.key,doc.version,doc.updatedAt,doc.content,doc.status]);}
 function typeFor(value){const t=String(value||'');if(/商城|mall/.test(t))return 'mall';if(/助浴|bath/.test(t))return 'bath';if(/陪诊|就诊|检查|报告|药|接送|接\/送|住院手续|出院手续|visit/.test(t))return 'visit';return 'care';}
 w.AKBConsentData={read,get,token,typeFor,isRequired:key=>defaults.some(d=>d.key===key)};
})(window);
