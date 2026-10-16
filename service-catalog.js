(function(w){
  var defaults={categories:[
    {id:'hospital',name:'住院陪护',sort:1,status:'on',description:'住院期间的专业陪护与生活照料'},
    {id:'home',name:'居家陪护',sort:2,status:'on',description:'提供居家场景的日常照护服务'},
    {id:'visit',name:'陪诊服务',sort:3,status:'on',description:'覆盖挂号、就诊、检查及取报告等服务'},
    {id:'bath',name:'上门助浴',sort:4,status:'on',description:'上门提供安全、舒适的助浴服务'}
  ],services:[
    {id:'hospital-care',category:'hospital',name:'住院陪护',summary:'住院期间的专业陪护与生活照料',description:'住院期间提供专业陪护与生活照料，按自理等级计费，特殊情况额外加收。',status:'on',sort:1,
      pricingRules:{mode:'daily',independence:{independent:300,partial:400,dependent:500},tubeExtra:50,infectionExtra:200}},
    {id:'home-care',category:'home',name:'居家陪护',summary:'居家场景的日常照护服务',description:'提供居家场景的日常照护服务，按自理等级计费，特殊情况额外加收。',status:'on',sort:1,
      pricingRules:{mode:'daily',independence:{independent:260,partial:360,dependent:460},tubeExtra:50,infectionExtra:200}},
    {id:'bath-care',category:'bath',name:'上门助浴',summary:'上门提供安全、舒适的助浴服务',description:'上门提供安全、舒适的助浴服务，按次计费，特殊情况额外加收。',status:'on',sort:1,
      pricingRules:{mode:'session',basePrice:499,independence:{independent:0,partial:100,dependent:200},tubeExtra:50,infectionExtra:100,skinBreakExtra:0}},
    {id:'vip',category:'visit',name:'贵宾陪诊',summary:'全流程就医陪同与诊后回访',description:'了解患者情况、确认医院科室、办理挂号签到，陪同检查取药并记录诊疗方案。',status:'on',sort:1},
    {id:'premium',category:'visit',name:'优享陪诊',summary:'含目标医院目标科室门诊医生预约',description:'代约目标医院目标科室门诊医生，提供全流程就医陪同与诊后回访。',status:'on',sort:2},
    {id:'medicine',category:'visit',name:'代买药',summary:'协助沟通、问诊、取药及快递寄送',description:'确认药品信息、医院及报销方式，完成挂号、问诊、缴费取药和快递寄送。',status:'on',sort:3},
    {id:'exam-booking',category:'visit',name:'代约检查',summary:'协助开检查单、缴费并预约检查',description:'沟通患者情况，办理就诊卡、挂号、开单、缴费和检查预约。',status:'on',sort:4},
    {id:'result',category:'visit',name:'代看检查结果',summary:'协助问诊、解读医嘱及后续办理',description:'代为挂号问诊，沟通检查结果和医嘱，协助后续取药、预约检查。',status:'on',sort:5},
    {id:'admission',category:'visit',name:'代办住院手续',summary:'协助获取住院证并办理入院手续',description:'门诊沟通、获取住院证，办理住院登记及入院手续。',status:'on',sort:6},
    {id:'discharge',category:'visit',name:'代办出院手续',summary:'协助出院、报销与资料邮寄',description:'协助准备出院资料、办理出院报销、打印清单并邮寄。',status:'on',sort:7},
    {id:'ring-pickup',category:'visit',name:'三环内接/送患者',summary:'安排商务车辆接送患者',description:'确认地点、时间、人数并安排五座或七座商务车辆。',status:'on',sort:8},
    {id:'airport',category:'visit',name:'机场接/送患者',summary:'司机与陪诊员协同完成接送机',description:'确认航班、人数和轮椅需求，安排车辆完成接送。',status:'on',sort:9},
    {id:'report',category:'visit',name:'代取报告',summary:'协助取检查报告并顺丰寄送',description:'确认检查及取报告日期，到医院取报告并顺丰寄送。',status:'on',sort:10},
    {id:'station',category:'visit',name:'西安北站接送患者',summary:'安排商务车辆接送患者',description:'确认列车、人数和轮椅需求，安排车辆接送至医院或酒店。',status:'on',sort:11}
  ]};
  function clone(v){return JSON.parse(JSON.stringify(v))}
  function normalize(v){
    var prices={vip:298,premium:698,medicine:99,'exam-booking':169,result:169,admission:300,discharge:300,'ring-pickup':150,airport:380,report:89,station:200};
    v.categories=v.categories||[];v.services=v.services||[];
    /* 补齐缺失的默认分类 */
    defaults.categories.forEach(function(base){var current=v.categories.filter(function(item){return item.id===base.id;})[0];if(!current)v.categories.push(clone(base));else if(current.status==null)current.status='on';});
    /* 补齐缺失的默认服务（住院陪护/居家陪护/上门助浴 携带定价规则） */
    defaults.services.forEach(function(base){
      var current=v.services.filter(function(s){return s.id===base.id;})[0];
      if(!current)v.services.push(clone(base));
      else if(base.pricingRules&&!current.pricingRules)current.pricingRules=clone(base.pricingRules);
    });
    /* 旧数据迁移：分类上的定价规则迁移到该分类下的服务项目 */
    v.categories.forEach(function(c){
      if(!c.pricingRules)return;
      var target=v.services.filter(function(s){return s.category===c.id;}).sort(function(a,b){return(a.sort||0)-(b.sort||0);})[0];
      if(!target){target={id:c.id+'-care',category:c.id,name:c.name,summary:c.description||'',description:c.description||'',status:'on',sort:1};v.services.push(target);}
      if(!target.pricingRules)target.pricingRules=clone(c.pricingRules);
      delete c.pricingRules;
    });
    /* 定价规则迁移：补充 skinBreakExtra 字段；助浴旧默认定价升级为 499/599/699 */
    v.services.forEach(function(s){
      if(!s.pricingRules)return;
      if(s.pricingRules.skinBreakExtra==null)s.pricingRules.skinBreakExtra=0;
      if(s.id==='bath-care'&&s.pricingRules.mode==='session'){
        var oldDefault=s.pricingRules.basePrice===280&&s.pricingRules.independence&&s.pricingRules.independence.partial===50&&s.pricingRules.independence.dependent===100;
        if(oldDefault){s.pricingRules.basePrice=499;s.pricingRules.independence.independent=0;s.pricingRules.independence.partial=100;s.pricingRules.independence.dependent=200;}
      }
    });
    v.services.forEach(function(s){if(s.pricing==null)s.pricing='per_order';if(s.price==null&&prices[s.id]!=null)s.price=prices[s.id];if(s.cover==null)s.cover='';if(s.detailHtml==null)s.detailHtml='';if(s.manualSales==null)s.manualSales=0;if(s.useManualSales==null)s.useManualSales=true;});
    return v;
  }
  function get(){try{var v=JSON.parse(localStorage.getItem('akb-service-catalog'));if(v&&v.categories&&v.services)return normalize(v)}catch(e){}return normalize(clone(defaults))}
  function save(v){localStorage.setItem('akb-service-catalog',JSON.stringify(v));return v}
  w.AKBServiceCatalog={get:get,save:save,defaults:defaults};
})(window);
