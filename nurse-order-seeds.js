/* Existing nurse order examples, shared with the corresponding detail route. */
window.AKBNurseOrderSeeds=[
    {id:'AKB-N-2026-041701',status:'pending-confirm',state:'待确认',name:'张三',meta:'男 · 67岁 · 高血压病史',type:'住院陪护',place:'北京红十字医院 · 内科5楼3床',time:'今日 11:00 - 23:00',income:'¥224/天',avatar:'张',careNeeds:{independence:'半自理',tube:'有',infection:'无'},actions:['accept']},
    {id:'AKB-N-2026-041642',status:'pending-start',state:'待上岗',name:'王奶奶',meta:'女 · 76岁 · 术后重症观察',type:'重症陪护',place:'北京协和医院 · 外科8楼12床',time:'今日 11:00 - 23:00',income:'¥320/天',avatar:'王',careNeeds:{independence:'完全失能',tube:'有',infection:'无'},actions:['start','contract','detail']},
    {id:'AKB-N-2026-041508',status:'in-progress',state:'服务中',name:'李先生',meta:'男 · 59岁 · 术后康复期',type:'术后康复',place:'解放军总医院 · 骨科3楼7床',time:'今日 08:30 - 20:30',income:'¥280/天',avatar:'李',careNeeds:{independence:'半自理',tube:'无',infection:'无'},actions:['log','detail']},
    {id:'AKB-N-2026-041229',status:'pending-complete',state:'待完成',name:'赵阿姨',meta:'女 · 72岁 · 日常起居照护',type:'居家陪护',place:'雁塔区雁南一路88号',time:'今日 08:00 - 20:00',income:'¥260/天',avatar:'赵',careNeeds:{independence:'完全自理',tube:'无',infection:'无'},actions:['submit','detail']},
    {id:'AKB-N-2026-040918',status:'completed',state:'已完成',name:'刘先生',meta:'男 · 70岁 · 协助助浴',type:'上门助浴',place:'高新区科技路36号',time:'昨日 14:00 - 15:00',income:'¥129/次',avatar:'刘',careNeeds:{independence:'半自理',tube:'无',infection:'无'},actions:['detail','history']},
    {id:'AKB-N-2026-040807',status:'cancelled',state:'已取消',name:'陈女士',meta:'女 · 64岁 · 门诊复诊',type:'陪诊服务',place:'北京协和医院 · 门诊部',time:'2026-04-08 09:00',income:'¥180/次',avatar:'陈',careNeeds:{independence:'完全自理',tube:'无',infection:'无'},reason:'客户临时调整就诊计划',compensation:'平台确认无赔付',actions:['cancel-detail']}
  ];
