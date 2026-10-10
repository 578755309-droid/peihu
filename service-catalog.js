(function(w){
  var defaults={categories:[
    {id:'hospital',name:'住院陪护',sort:1,status:'on',description:'住院期间的专业陪护与生活照料'},
    {id:'home',name:'居家陪护',sort:2,status:'on',description:'提供居家场景的日常照护服务'},
    {id:'visit',name:'陪诊服务',sort:3,status:'on',description:'覆盖挂号、就诊、检查及取报告等服务'},
    {id:'bath',name:'上门助浴',sort:4,status:'on',description:'上门提供安全、舒适的助浴服务'}
  ],services:[
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
  function normalize(v){var prices={vip:298,premium:698,medicine:99,'exam-booking':169,result:169,admission:300,discharge:300,'ring-pickup':150,airport:380,report:89,station:200};v.categories=v.categories||[];defaults.categories.forEach(function(base){var current=v.categories.filter(function(item){return item.id===base.id;})[0];if(!current)v.categories.push(JSON.parse(JSON.stringify(base)));else if(current.status==null)current.status='on';});(v.services||[]).forEach(function(s){if(s.pricing==null)s.pricing='per_order';if(s.price==null&&prices[s.id]!=null)s.price=prices[s.id];});return v}
  function get(){try{var v=JSON.parse(localStorage.getItem('akb-service-catalog'));if(v&&v.categories&&v.services)return normalize(v)}catch(e){}return normalize(JSON.parse(JSON.stringify(defaults)))}
  function save(v){localStorage.setItem('akb-service-catalog',JSON.stringify(v));return v}
  w.AKBServiceCatalog={get:get,save:save,defaults:defaults};
})(window);
