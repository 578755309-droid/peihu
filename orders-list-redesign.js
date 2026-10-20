(function () {
  var orders = [
    {id:'AKB-2026-039105',status:'payment',state:'待支付',type:'陪诊服务',project:'贵宾陪诊服务',unit:'298',unitLabel:'/次',quantity:'x1次',person:'赵阿姨｜61岁｜女｜门诊复诊',address:'北京协和医院｜门诊部',addressKind:'医院',time:'2026-04-12 09:00',nurse:'李桂芳',role:'高级陪诊师｜陪诊服务',cert:'持证上岗',years:'5年经验',amount:'298',avatar:'李',actions:['cancel','pay']},
    {id:'AKB-2026-038421',status:'pending-service',state:'待服务',type:'住院陪护',project:'住院专护服务',unit:'280',unitLabel:'/天',quantity:'x3天',person:'张爷爷｜68岁｜男｜骨折术后恢复期',address:'北京红十字医院｜内科 5楼 · 3床',addressKind:'医院',time:'2026-04-10 08:00 至 2026-04-13 20:00',nurse:'李桂芳',role:'高级护理师｜住院专护',cert:'持证上岗',years:'5年经验',amount:'840',avatar:'李',actions:['cancel','call']},
    {id:'AKB-2026-031085',status:'active',state:'服务中',type:'住院陪护',project:'重症陪护服务',unit:'480',unitLabel:'/天',quantity:'x3天',person:'王奶奶｜76岁｜女｜术后重症观察',address:'北京协和医院｜外科 8楼 · 12床',addressKind:'医院',time:'2026-04-08 08:00 至 2026-04-11 08:00',nurse:'王美玲',role:'高级护理师｜重症陪护',cert:'持证上岗',years:'8年经验',amount:'1,440',avatar:'王',actions:['renew','report','call']},
    {id:'AKB-2026-022301',status:'done',state:'已完成',type:'住院陪护',project:'基础陪护服务',unit:'280',unitLabel:'/天',quantity:'x3天',person:'李先生｜59岁｜男｜术后康复期',address:'解放军总医院｜骨科 3楼 · 7床',addressKind:'医院',time:'2026-04-01 08:00 至 2026-04-04 20:00',nurse:'张秀英',role:'护理师｜术后康复',cert:'持证上岗',years:'3年经验',amount:'840',avatar:'张',actions:['report','evaluate','again']},
    {id:'AKB-2026-041206',status:'pending-service',state:'待服务',type:'居家陪护',project:'12小时居家陪护',unit:'260',unitLabel:'/天',quantity:'x3天',person:'王女士｜72岁｜女｜日常起居照护',address:'北京市雁塔区雁南一路 88号 2单元 1602',addressKind:'家',time:'2026-04-15 08:00 至 2026-04-18 20:00',nurse:'赵阿姨',role:'高级护理师｜居家照护',cert:'持证上岗',years:'6年经验',amount:'780',avatar:'赵',actions:['cancel','call']},
    {id:'AKB-2026-040318',status:'done',state:'已完成',type:'上门助浴',project:'上门助浴服务',unit:'129',unitLabel:'/次',quantity:'x1次',person:'刘先生｜70岁｜男｜协助助浴',address:'西安市高新区科技路 36号',addressKind:'家',time:'2026-04-03 14:00',nurse:'陈护理师',role:'助浴护理师｜上门助浴',cert:'持证上岗',years:'5年经验',amount:'129',avatar:'陈',actions:['evaluate','again','call']},
    {id:'AKB-2026-041501',status:'pending-service',state:'待服务',type:'上门助浴',project:'上门助浴服务 · 10次套餐',unit:'499',unitLabel:'/次',quantity:'x10次',person:'张爷爷｜68岁｜男｜骨折术后恢复期',address:'西安市雁塔区雁南一路 88号 2单元 1602',addressKind:'家',time:'共10次 · 首次 2026-10-16',nurse:'陈护理师',role:'助浴护理师｜上门助浴',cert:'持证上岗',years:'5年经验',amount:'3,992',avatar:'陈',actions:['cancel','call'],
      sessions:[
        {seq:1,date:'2026-10-16',time:'09:00-11:00',addressDetail:'西安市雁塔区雁南一路 88号 2单元 1602',contact:'张爷爷',phone:'138****2468'},
        {seq:2,date:'2026-10-18',time:'09:00-11:00',addressDetail:'西安市雁塔区雁南一路 88号 2单元 1602',contact:'张爷爷',phone:'138****2468'},
        {seq:3,date:'2026-10-20',time:'14:00-16:00',addressDetail:'西安市高新区科技路 36号',contact:'张爷爷',phone:'138****2468'}
      ],
      sessionSummary:'已预约 3/10 次 · 下次 2026-10-16'
    },
    {id:'AKB-2026-032907',status:'refund',state:'退款处理中',type:'上门助浴',project:'上门助浴服务',unit:'129',unitLabel:'/次',quantity:'x1次',person:'孙女士｜65岁｜女｜协助助浴',address:'西安市莲湖区玉祥门 12号',addressKind:'家',time:'2026-03-29 10:00',nurse:'陈护理师',role:'助浴护理师｜上门助浴',cert:'持证上岗',years:'5年经验',amount:'129',avatar:'陈',actions:[],refundState:'待审核',refundReason:'服务时间冲突',refundAppliedAt:'2026-03-29 09:30'},
    {id:'AKB-2026-031522',status:'cancel',state:'已退款',type:'陪诊服务',project:'普通陪诊服务',unit:'198',unitLabel:'/次',quantity:'x1次',person:'周先生｜52岁｜男｜常规体检',address:'西安交通大学第一附属医院｜体检中心',addressKind:'医院',time:'2026-03-15 08:00',nurse:'李桂芳',role:'高级陪诊师｜陪诊服务',cert:'持证上岗',years:'5年经验',amount:'198',avatar:'李',actions:[],refundState:'已退款',refundType:'instant',refundAt:'2026-03-15 07:50',note:'未开始服务，用户申请退款，系统自动退款完成'}
  ];
  var mallOrders = [
    {id:'AKB-M2026-041601',status:'payment',state:'待付款',product:'电子体温计',desc:'快速测温 · 大屏易读',price:'39',quantity:1,amount:'39',date:'2026-04-16',address:'西安市雁塔区 · 王女士',image:'assets/mall/thermometer.png',tone:'purple',deliveryLabel:'立即送达',deliveryStatus:'pending',receiptCode:'7264',actions:['pay']},
    {id:'AKB-M2026-041602',status:'payment',state:'待付款',product:'家用雾化器',desc:'细雾雾化 · 便携易收纳',price:'199',quantity:1,amount:'199',date:'2026-10-16',address:'西安市雁塔区 · 刘女士',image:'assets/mall/nebulizer.png',tone:'purple',deliveryLabel:'立即送达',deliveryStatus:'pending',receiptCode:'',actions:['pay']},
    {id:'AKB-M2026-041603',status:'payment',state:'待付款',product:'助听器',desc:'轻巧隐形 · 日常交流辅助',price:'699',quantity:1,amount:'699',date:'2026-10-16',address:'上海市静安区 · 陈女士',image:'assets/mall/hearing-aid.png',tone:'orange',deliveryLabel:'跑腿送达',deliveryStatus:'pending',receiptCode:'',actions:['pay']},
    {id:'AKB-M2026-041604',status:'payment',state:'待付款',product:'医用无菌口罩',desc:'医用外科 / 一次性使用',price:'29',quantity:3,amount:'87',date:'2026-10-16',address:'北京市朝阳区 · 张先生',image:'assets/mall/medical-mask.png',tone:'blue',deliveryLabel:'快递送达',deliveryStatus:'pending',receiptCode:'',actions:['pay']},
    {id:'AKB-M2026-041528',status:'shipping',state:'待发货',product:'电子血压计',desc:'上臂式无创血压计',price:'239',quantity:1,amount:'239',date:'2026-04-15',address:'北京市朝阳区 · 张先生',image:'assets/mall/blood-pressure-monitor.png',tone:'blue',deliveryLabel:'快递送达',deliveryStatus:'processing',receiptCode:'4182',actions:['remind']},
    {id:'AKB-M2026-041302',status:'receiving',state:'待收货',product:'家用雾化器',desc:'细雾雾化 · 便携易收纳',price:'199',quantity:1,amount:'199',date:'2026-04-13',address:'北京市海淀区 · 李女士',image:'assets/mall/nebulizer.png',tone:'green',deliveryLabel:'跑腿送达',deliveryStatus:'delivered',receiptCode:'5826',logisticsNo:'PT20260413112',courier:'美团跑腿 · 张师傅',courierPhone:'138****2210',actions:['receive']},
    {id:'AKB-M2026-040912',status:'done',state:'已完成',product:'医用无菌口罩',desc:'医用外科 / 一次性使用',price:'29',quantity:2,amount:'58',date:'2026-04-09',address:'西安市高新区 · 刘先生',image:'assets/mall/medical-mask.png',tone:'orange',deliveryLabel:'快递送达',deliveryStatus:'signed',receiptCode:'9031',logisticsNo:'SF310987654321',courier:'顺丰速运 · 王师傅',courierPhone:'137****8823',actions:['buy-again']},
    {id:'AKB-M2026-040533',status:'refund',state:'退款/售后',product:'家用制氧机',desc:'医用级 · 安静运行',price:'1599',quantity:1,amount:'1599',date:'2026-04-05',address:'北京市海淀区 · 陈先生',image:'assets/mall/oxygen-concentrator.png',tone:'green',deliveryLabel:'快递送达',deliveryStatus:'delivered',receiptCode:'2157',actions:[],refundState:'待审核',refundType:'manual',refundReason:'商品质量问题',refundRemark:'使用时噪音较大，与描述不符',refundAppliedAt:'2026-04-06 10:20'},
    {id:'AKB-M2026-032891',status:'cancel',state:'已退款',product:'红外额温枪 / 耳温枪',desc:'非接触测温 · 一机两用',price:'129',quantity:1,amount:'129',date:'2026-03-28',address:'西安市雁塔区 · 吴女士',image:'assets/mall/infrared-thermometer.png',tone:'blue',deliveryLabel:'立即送达',deliveryStatus:'pending',receiptCode:'6384',actions:[],refundState:'已退款',refundType:'instant',refundAt:'2026-03-28 15:30',note:'未发货，用户申请退款，系统自动退款完成'}
  ];
  var styles = '.order-list-v2{display:flex;flex-direction:column;gap:12px;padding:12px 14px 92px}.order-card-v2{overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 5px 18px rgba(20,160,135,.08);cursor:pointer}.order-v2-main{padding:16px 16px 13px}.order-v2-top{display:flex;align-items:center;justify-content:space-between}.service-tag-v2{display:inline-flex;align-items:center;padding:4px 8px;border-radius:12px;background:#edf3ff;color:#3476e8;font-size:13px;font-weight:850}.service-tag-v2.home{background:#fff2df;color:#d87916}.service-tag-v2.bath{background:#e7f6ff;color:#2780ba}.type-v2-row{display:flex;align-items:center;gap:5px;min-width:0}.otype-v2{display:inline-flex;padding:3px 7px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap}.otype-v2.normal{background:#F1F5F9;color:#64748B}.otype-v2.renew{background:#EDE9FE;color:#7C3AED}.otype-v2.card{background:#DDF7F1;color:#0FA98C}.renew-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;display:none;align-items:flex-end;justify-content:center}.renew-mask.show{display:flex}.renew-sheet{width:100%;max-width:430px;background:#fff;border-radius:12px;padding:18px 18px calc(20px + env(safe-area-inset-bottom));max-height:88vh;overflow-y:auto;animation:renewUp .25s ease}@keyframes renewUp{from{transform:translateY(100%)}to{transform:translateY(0)}}.renew-title{text-align:center;font-size:16px;font-weight:700;color:#1A1828;position:relative;padding-bottom:12px;border-bottom:1px solid #F1F5F9}.renew-close{position:absolute;right:0;top:-2px;width:30px;height:30px;border:0;background:#F5F5F5;border-radius:12px;font-size:15px;color:#6B7280;cursor:pointer}.renew-origin{margin-top:12px;background:#F5F5F5;border-radius:12px;padding:11px 13px;font-size:13px;color:#6B6880;line-height:1.6}.renew-origin b{color:#1A1828;font-weight:600}.renew-field{margin-top:12px}.renew-label{font-size:13px;font-weight:600;color:#1A1828;margin-bottom:6px}.renew-label .lock{margin-left:5px;font-size:11px;font-weight:600;color:#AEACC0}.renew-input{width:100%;height:42px;border:1.5px solid #EDE9F5;border-radius:12px;padding:0 12px;font-size:14px;font-weight:600;color:#1A1828;outline:none;box-sizing:border-box;background:#fff}.renew-input:focus{border-color:#1CD8B7}.renew-input[readonly]{background:#FAFAFA;color:#6B6880}.renew-nurse{display:flex;align-items:center;gap:10px;background:#F0FDF9;border:1px solid #CFF5ED;border-radius:12px;padding:11px 13px}.renew-nurse-av{width:40px;height:40px;border-radius:12px;background:linear-gradient(140deg,#1CD8B7,#0FA98C);color:#fff;display:grid;place-items:center;font-size:15px;font-weight:700;flex:0 0 40px}.renew-nurse-info{flex:1;min-width:0}.renew-nurse-name{font-size:14px;font-weight:700;color:#1A1828}.renew-nurse-role{margin-left:4px;font-size:12px;color:#6B6880}.renew-nurse-tag{margin-top:3px;font-size:11px;font-weight:600;color:#0FA98C}.renew-total{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px dashed #EDE9F5}.renew-total-label{font-size:13px;color:#6B6880;font-weight:600}.renew-total-amt{font-size:20px;font-weight:700;color:#1A1828}.renew-foot{display:flex;gap:10px;margin-top:16px}.renew-btn{flex:1;height:44px;border-radius:12px;border:1px solid #E5E7EB;background:#fff;color:#6B7280;font:800 14px inherit;cursor:pointer}.renew-btn.primary{border:0;background:linear-gradient(135deg,#1CD8B7,#0FA98C);color:#fff}.renew-days{display:flex;align-items:center;gap:10px}.renew-stepper{display:inline-flex;align-items:center;border:1.5px solid #EDE9F5;border-radius:12px;overflow:hidden;background:#fff}.renew-stepper button{width:40px;height:40px;border:0;background:#F7FEFC;color:#1CD8B7;font-size:18px;font-weight:700;cursor:pointer;line-height:1}.renew-stepper button:active{background:#DDF7F1}.renew-stepper span{min-width:52px;text-align:center;font-size:16px;font-weight:700;color:#1A1828}.renew-days-unit{font-size:13px;color:#6B6880;font-weight:600}'+'.state-v2{display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border-radius:12px;font-size:13px;font-weight:600}.state-v2:before{content:"";width:7px;height:7px;border:1.5px solid currentColor;border-radius:12px}.state-v2.payment{color:#d97706;background:#fef3c7}.state-v2.pending-service{color:#8a5a15;background:#fff3d7}.state-v2.active{color:#16803e;background:#dcfce7}.state-v2.done{color:#16a34a;background:#dcfce7}.state-v2.refund{color:#1CD8B7;background:#DDF7F1}.state-v2.cancel{color:#DC2626;background:#FEE2E2}.order-v2-summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;margin-top:12px}.order-v2-left{min-width:0}.order-v2-title{font-size:21px;font-weight:700;line-height:1.22;letter-spacing:0}.order-v2-lines{margin-top:10px;display:grid;gap:7px}.order-v2-line{display:flex;align-items:center;gap:7px;color:#7b8798;font-size:14px;line-height:1.35}.line-ico{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px;color:#aab5c5}.line-ico svg{width:17px;height:17px;display:block}.price-stack{display:flex;min-width:80px;flex-direction:column;align-items:flex-end;justify-content:flex-start;text-align:right;white-space:nowrap}.unit-price{font-size:12px;color:#657087;line-height:1.1}.unit-price strong{font-size:19px;color:#111827}.unit-price span{font-size:13px;color:#263448}.quantity{margin-top:3px;color:#8b97a9;font-size:13px}.amount-v2{display:flex;align-items:baseline;gap:5px;margin-top:13px;color:#334155;font-size:13px}.amount-v2 strong{color:#111827;font-size:21px;letter-spacing:0}.v2-rule{height:1px;margin-top:12px;background:#edf0f5}.time-v2{padding:11px 0 0;color:#39475a;font-size:13px;line-height:1.45}.time-v2 b{color:#1c2735;font-weight:850}.nurse-v2{display:flex;align-items:center;gap:10px;margin-top:12px;padding:10px 11px;border:1px solid #edf0f6;border-radius:12px;background:#f5f7fb}.nurse-av-v2{display:grid;place-items:center;width:46px;height:46px;border-radius:12px;flex:0 0 46px;background:linear-gradient(140deg,#1CD8B7,#0FA98C);color:#fff;font-size:17px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 7px rgba(15,169,140,.18)}.nurse-copy-v2{min-width:0;flex:1}.nurse-name-v2{font-size:14px;font-weight:700;color:#1d2939}.nurse-role-v2{margin-left:4px;color:#7d899c;font-size:12px;font-weight:600}.nurse-badges{display:flex;gap:5px;margin-top:5px}.nurse-badge{padding:3px 6px;border-radius:12px;background:#d9faea;color:#16965a;font-size:11px;font-weight:600}.nurse-badge.experience{background:#DDF7F1;color:#1CD8B7}.call-v2{display:grid;place-items:center;width:38px;height:38px;border:1px solid #dce3ec;border-radius:12px;background:#fff;color:#1CD8B7;cursor:pointer}.call-v2 svg{width:19px;height:19px;display:block}.order-v2-actions{display:flex;justify-content:flex-end;gap:9px;padding:0 16px 14px}.order-v2-btn{height:37px;min-width:100px;padding:0 13px;border:1px solid #e4e7ed;border-radius:12px;background:#fff;color:#293548;font:800 13px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;cursor:pointer}.order-v2-btn.primary{border-color:#1CD8B7;background:#1CD8B7;color:#fff}.order-v2-btn.link{border-color:#A9EEE0;color:#1CD8B7}.order-v2-btn.danger{border-color:#f1caca;color:#d25454}.order-v2-btn:active,.call-v2:active{transform:scale(.98)}';
  var style = document.createElement('style'); style.textContent = styles; document.head.appendChild(style);
  function typeClass(order){return order.type==='居家陪护'?'home':order.type==='上门助浴'?'bath':'';}
  function otypeBadge(order){var ot=order.orderType||'普通订单';var cls=ot==='续费订单'?'renew':ot==='次卡订单'?'card':'normal';return '<span class="otype-v2 '+cls+'">'+ot+'</span>';}
  function stateText(order){return order.state==='服务中'?'服务中':order.state;}
  function action(order, kind){var ratings={};try{ratings=JSON.parse(localStorage.getItem('akb_service_ratings_v2')||'{}')||{};}catch(error){}if(kind==='evaluate'){var saved=ratings[order.id];return saved?'<button class="order-v2-btn evaluated" type="button" disabled>已评价</button>':'<button class="order-v2-btn link" type="button" onclick="location.href=\'service-review.html?no='+order.id+'\'">服务评价</button>';}if(kind==='refund'){return '<button class="order-v2-btn link" type="button" onclick="event.stopPropagation();location.href=\'bath-refund.html?no='+order.id+'\'">申请退款</button>';}if(kind==='renew'){return '<button class="order-v2-btn primary" type="button" onclick="openRenewModal(\''+order.id+'\',event)">续约</button>';}if(kind==='again'){var page=order.type==='居家陪护'?'hospital-care.html?service=home':order.type==='上门助浴'?'hospital-care.html?service=bath':order.type==='陪诊服务'?'visit-services.html':'hospital-care.html';return '<button class="order-v2-btn primary" type="button" onclick="location.href=\''+page+'\'">再次预约</button>';}if(kind==='cancel'){var amt=parseFloat(String(order.amount||'0').replace(/[^0-9.]/g,''))||0;var isCardRedeem=!!order.cardId||(order.project&&order.project.indexOf('兑换卡兑换')>-1)||amt<=0;var isPaid=order.status!=='payment'&&order.state!=='待支付'&&order.state!=='待付款';if(isPaid&&!isCardRedeem){return '<button class="order-v2-btn link" type="button" onclick="event.stopPropagation();location.href=\'bath-refund.html?no='+order.id+'\'">申请退款</button>';}return '<button class="order-v2-btn danger" type="button" onclick="cancelPendingPayment(this)">取消订单</button>';}var actions={pay:['去支付','primary','openOrderPaySheet(\'service\',this)'],call:['联系护理员','link','openActionModal(\'call\',this)'],report:['查看日报','link',"location.href='daily-report.html'"]};var item=actions[kind];return '<button class="order-v2-btn '+item[1]+'" onclick="'+item[2]+'">'+item[0]+'</button>';}
  var userIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="6.4" r="3.1"/><path d="M4 17c.7-3.1 2.7-4.8 6-4.8s5.3 1.7 6 4.8"/></svg>';
  var pinIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8.5c0 4-6 8.3-6 8.3S4 12.5 4 8.5a6 6 0 1112 0z"/><circle cx="10" cy="8.5" r="1.8"/></svg>';
  var phoneIcon='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3.4c.5-.4 1.1-.4 1.6 0l1.6 1.6c.4.4.5 1 .2 1.5l-.8 1.2c.8 1.8 2.2 3.2 4 4l1.2-.8c.5-.3 1.1-.2 1.5.2l1.6 1.6c.4.5.4 1.1 0 1.6l-.7.7c-.7.7-1.7 1-2.6.7C8.5 15 5 11.5 4.3 7.6c-.3-.9 0-1.9.7-2.6z"/></svg>';
  function contractAction(order){if(order.status!=='pending-service'||!window.AKBContract)return{btn:'',note:''};var rec=window.AKBContract.recordFor(order.id);if(!rec)return{btn:'',note:''};var signed=rec.status==='已签署';var btn='<button class="order-v2-btn '+(signed?'link':'primary')+'" type="button" onclick="location.href=\'contract.html?no='+encodeURIComponent(order.id)+'\'">'+(signed?'查看电子合同':'签署电子合同')+'</button>';var note=signed?'':'<div style="display:flex;align-items:center;gap:6px;background:#FFF7E8;border-radius:12px;padding:9px 12px;margin-top:12px"><svg viewBox="0 0 16 16" fill="none" width="15" height="15"><rect x="3" y="2" width="10" height="12" rx="2" stroke="#D97706" stroke-width="1.3"/><path d="M6 6h4M6 9h4" stroke="#D97706" stroke-width="1.2" stroke-linecap="round"/></svg><span style="font-size:13px;font-weight:600;color:#B45309">护理员已发起电子合同，请及时签署</span></div>';return{btn:btn,note:note};}
  function card(order){var sessSummary='';if(order.sessions){sessSummary=order.sessionSummary||('已预约 '+order.sessions.length+'/10 次'+(order.sessions[0]?' · 下次 '+order.sessions[0].date:''));}var timeHtml=order.sessions?('<div class="time-v2"><b>按次预约：</b>'+sessSummary+'</div>'):('<div class="time-v2"><b>服务时间：</b>'+order.time+'</div>');var contract=contractAction(order);return '<article class="order-card order-card-v2" data-status="'+order.status+'" data-order-id="'+order.id+'" data-years="'+order.years+'" onclick="openServiceOrderDetail(\''+order.id+'\',event)"><div class="order-v2-main"><div class="order-v2-top"><span class="type-v2-row"><span class="service-tag-v2 '+typeClass(order)+'">'+order.type+'</span>'+otypeBadge(order)+'</span><span class="state-v2 '+order.status+'">'+stateText(order)+'</span></div><div class="order-v2-summary"><div class="order-v2-left"><div class="order-v2-title">'+order.project+'</div><div class="order-v2-lines"><div class="order-v2-line"><span class="line-ico">'+userIcon+'</span><span>'+order.person+'</span></div><div class="order-v2-line"><span class="line-ico">'+pinIcon+'</span><span>'+order.address+'</span></div></div></div><div class="price-stack"><div class="unit-price"><strong>'+order.unit+'</strong><span>'+order.unitLabel+'</span></div><div class="quantity">'+order.quantity+'</div><div class="amount-v2"><span>实付款</span><strong>¥'+order.amount+'</strong></div></div></div><div class="v2-rule"></div>'+timeHtml+contract.note+'<div class="nurse-v2"><div class="nurse-av-v2">'+order.avatar+'</div><div class="nurse-copy-v2"><div><span class="nurse-name-v2">'+order.nurse+'</span><span class="nurse-role-v2">'+order.role+'</span></div><div class="nurse-badges"><span class="nurse-badge">'+order.cert+'</span><span class="nurse-badge experience">'+order.years+'</span></div></div><button class="call-v2" title="联系陪护员" onclick="openActionModal(\'call\',this)">'+phoneIcon+'</button></div></div><div class="order-v2-actions">'+contract.btn+order.actions.map(function(kind){return action(order,kind);}).join('')+'</div></article>';}
  window.openServiceOrderDetail=function(id,event){if(event&&event.target&&event.target.closest('button'))return;location.href='order-detail.html?no='+encodeURIComponent(id);};
  function getMallOrders(){var saved=[];try{saved=JSON.parse(localStorage.getItem('ankebang_mall_orders')||'[]');if(!Array.isArray(saved))saved=[]}catch(error){saved=[]}var ids={};var seedMap={};mallOrders.forEach(function(o){seedMap[o.id]=o});return saved.concat(mallOrders).filter(function(order){if(ids[order.id])return false;ids[order.id]=true;return true}).map(function(order){var seed=seedMap[order.id];if(seed){Object.keys(seed).forEach(function(k){if(order[k]===undefined)order[k]=seed[k]})}var st=order.status;if(order.state==='已退款')st='cancel';else if(order.state==='退款/售后')st='refund';order.actions=st==='payment'?['cancel','pay']:st==='shipping'?['remind','refund']:st==='receiving'?['refund','receive']:st==='refund'?[]:st==='cancel'?[]:st==='done'?['buy-again']:['remind'];return order})}
  function mallAction(order, kind){var actions={cancel:['取消订单','',"openActionModal('mall-cancel',this)"],pay:['去付款','primary','openOrderPaySheet(\'mall\',this)'],remind:['提醒发货','','openActionModal(\'mall-remind\',this)'],receive:['确认收货','primary',"location.href='mall-order-detail.html?no="+encodeURIComponent(order.id)+"'"],'buy-again':['再次购买','primary',"location.href='mall.html'"],refund:['申请退款','',"location.href='mall-refund.html?no="+encodeURIComponent(order.id)+"'"]};var item=actions[kind];return '<button class="mall-action '+item[1]+'" onclick="'+item[2]+'">'+item[0]+'</button>';}
  function mallCard(order){var st=order.status;if(order.state==='已退款')st='cancel';else if(order.state==='退款/售后')st='refund';var stateLabel=order.state==='已退款'?'已退款':order.state==='退款/售后'?'退款处理中':order.state;return '<article class="order-card mall-order-card" data-status="'+st+'" data-order-id="'+order.id+'" onclick="openMallOrderDetail(\''+order.id+'\',event)"><div class="mall-order-main"><div class="mall-order-top"><span class="mall-order-no">订单号 '+order.id+'</span><span class="mall-state '+st+'">'+stateLabel+'</span></div><div class="mall-product-row"><div class="mall-product-thumb '+order.tone+'"><img src="'+order.image+'" alt="'+order.product+'" onerror="this.style.display=\'none\'" /></div><div class="mall-product-copy"><div class="mall-product-name">'+order.product+'</div><div class="mall-product-desc">'+order.desc+'<br>配送至 '+order.address+'</div></div><div class="mall-product-price"><small>¥</small>'+order.price+'</div></div><div class="mall-order-meta"><span>下单时间 '+order.date+'</span><span>共 '+order.quantity+' 件&nbsp;&nbsp;实付 <strong>¥'+order.amount+'</strong></span></div></div><div class="mall-order-actions">'+order.actions.map(function(kind){return mallAction(order,kind);}).join('')+'</div></article>';}
  window.openMallOrderDetail=function(id,event){if(event&&event.target&&event.target.closest('button'))return;location.href='mall-order-detail.html?no='+encodeURIComponent(id);};
  /* 取消商城订单：写入完整订单数据（种子字段 + 取消状态），避免仅存空壳导致字段丢失 */
  window.cancelMallOrder=function(id){var saved=[];try{saved=JSON.parse(localStorage.getItem('ankebang_mall_orders')||'[]');if(!Array.isArray(saved))saved=[]}catch(e){saved=[]}var full=mallOrders.find(function(o){return o.id===id})||{};var next=Object.assign({},full,{status:'cancel',state:'已取消',note:'用户取消订单'});var idx=saved.findIndex(function(o){return o.id===id});if(idx>=0)saved[idx]=Object.assign({},saved[idx],next);else saved.unshift(next);localStorage.setItem('ankebang_mall_orders',JSON.stringify(saved));};
  function applyCurrentStatus(){var filter=activeOrderType==='mall'?document.querySelector('.mall-tab-filter'):document.querySelector('.service-tab-filter');var active=filter&&filter.querySelector('.tf.on');var status=active?(active.getAttribute('onclick').match(/'([^']+)'/)||[])[1]:(activeOrderType==='mall'?'all':'payment');filterTab(active||filter.querySelector('.tf'),status||'all');}
  /* 旧版10次套餐订单（status=paid/已付款，列表不可见）迁移为：待服务主订单 + 首次预约单 */
  function migrateLegacyBath10(saved){
    var changed=false;
    saved.forEach(function(o){
      if(o.status==='paid'&&o.project&&o.project.indexOf('10次套餐')>-1){
        o.status='pending-service';o.state='待服务';changed=true;
        var m=(o.time||'').match(/(\d{4}-\d{2}-\d{2})/);var d=m?m[1]:'';
        if(!o.sessions||!o.sessions.length){o.sessions=[{seq:1,date:d,time:'09:00-11:00',addressDetail:o.addressDetail||o.address||'',contact:o.contact||'',phone:o.phone||''}];}
        o.sessionSummary='已预约 '+o.sessions.length+'/10 次'+(o.sessions[0]&&o.sessions[0].date?' · 下次 '+o.sessions[0].date:'');
        var fid=o.id+'-01';
        if(!saved.some(function(x){return x.id===fid;})){
          saved.unshift({id:fid,status:'pending-service',state:'待服务',type:o.type,project:(o.type||'上门助浴')+'服务 · 套餐首次',unit:o.unit,unitLabel:'/次',quantity:'x1次',person:o.person,address:o.address,addressKind:o.addressKind,time:(d?d+' ':'')+'09:00-11:00',nurse:o.nurse,nursePhone:o.nursePhone,role:o.role,cert:o.cert,years:o.years,avatar:o.avatar,amount:'0',actions:['cancel','call'],createdAt:o.createdAt||Date.now(),packOrderNo:o.id,note:'10次套餐首次服务 · 已随套餐支付'});
        }
      }
    });
    return changed;
  }
  function getServiceOrders(){
    var saved=[];
    try{saved=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');if(!Array.isArray(saved))saved=[];}catch(error){saved=[];}
    if(migrateLegacyBath10(saved)){try{localStorage.setItem('ankebang_service_orders',JSON.stringify(saved));}catch(error){}}
    var ids={};
    var seedMap={};
    orders.forEach(function(o){seedMap[o.id]=o;});
    return saved.concat(orders).filter(function(order){if(ids[order.id])return false;ids[order.id]=true;return true;}).map(function(order){var seed=seedMap[order.id];if(seed){Object.keys(seed).forEach(function(k){if(order[k]===undefined)order[k]=seed[k];});}if(!order.orderType){order.orderType=(order.cardId||(order.sessions&&order.sessions.length>0)||(order.project&&(order.project.indexOf('10次套餐')>-1||order.project.indexOf('套餐首次')>-1)))?'次卡订单':'普通订单';}return order;});
  }
  function renderOrderType(type){currentListType=type;var list=document.getElementById('orderList');if(!list)return;list.className='content order-list-v2';list.innerHTML=type==='mall'?getMallOrders().map(mallCard).join(''):getServiceOrders().map(card).join('');applyCurrentStatus();}
  window.renderOrderType=renderOrderType;

  /* ── 续约：沿用原订单选项与原护理员，不走派单流程 ── */
  var currentListType='service';
  var renewNo='';
  function ensureRenewDom(){
    if(document.getElementById('akbRenewMask'))return;
    var mask=document.createElement('div');
    mask.id='akbRenewMask';mask.className='renew-mask';
    mask.innerHTML='<div class="renew-sheet">'+
      '<div class="renew-title">续约服务<button class="renew-close" onclick="closeRenewModal()">✕</button></div>'+
      '<div class="renew-origin" id="akbRenewOrigin"></div>'+
      '<div class="renew-field"><div class="renew-label">服务地址</div><input class="renew-input" id="akbRenewAddress" placeholder="填写服务地址" /></div>'+
      '<div class="renew-field"><div class="renew-label">服务开始日期<span class="lock">默认原订单结束次日</span></div><input class="renew-input" type="date" id="akbRenewDate" /></div>'+
      '<div class="renew-field" id="akbRenewDaysRow" style="display:none"><div class="renew-label">陪护天数<span class="lock">按天计费 · 可修改</span></div><div class="renew-days"><div class="renew-stepper"><button type="button" onclick="changeRenewDays(-1)" aria-label="减少天数">−</button><span id="akbRenewDays">1</span><button type="button" onclick="changeRenewDays(1)" aria-label="增加天数">＋</button></div><span class="renew-days-unit">天（24 小时/天）</span></div></div>'+
      '<div class="renew-field"><div class="renew-label">指定护理员<span class="lock">原护理员 · 无需派单</span></div><div class="renew-nurse" id="akbRenewNurse"></div></div>'+
      '<div class="renew-total"><span class="renew-total-label" id="akbRenewQty"></span><span class="renew-total-amt" id="akbRenewAmt"></span></div>'+
      '<div class="renew-foot"><button class="renew-btn" onclick="closeRenewModal()">取消</button><button class="renew-btn primary" onclick="confirmRenew()">确认续约</button></div>'+
    '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click',function(e){if(e.target===mask)closeRenewModal();});
  }
  function renewShiftDate(dateStr,n){
    var d=new Date(String(dateStr).replace(/-/g,'/'));
    d.setDate(d.getDate()+n);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function renewDefaultDate(time){
    var dates=String(time||'').match(/\d{4}-\d{2}-\d{2}/g)||[];
    return renewShiftDate(dates.length?dates[dates.length-1]:new Date().toISOString().slice(0,10),1);
  }
  window.openRenewModal=function(id,event){
    if(event&&event.stopPropagation)event.stopPropagation();
    var order=getServiceOrders().find(function(o){return o.id===id;});
    if(!order)return;
    renewNo=id;
    ensureRenewDom();
    document.getElementById('akbRenewOrigin').innerHTML='<b>'+order.project+'</b> · '+order.person+'<br>原订单 '+order.id+' · '+order.time;
    document.getElementById('akbRenewAddress').value=order.address||'';
    document.getElementById('akbRenewDate').value=renewDefaultDate(order.time);
    document.getElementById('akbRenewNurse').innerHTML='<div class="renew-nurse-av">'+(order.avatar||'陪')+'</div><div class="renew-nurse-info"><div><span class="renew-nurse-name">'+order.nurse+'</span><span class="renew-nurse-role">'+(order.role||'')+'</span></div><div class="renew-nurse-tag">沿用原订单护理员 · 无需派单</div></div>';
    var isDaily=order.unitLabel==='/天';
    renewDays=parseFloat(String(order.quantity||'').replace(/[^0-9.]/g,''))||1;
    var daysRow=document.getElementById('akbRenewDaysRow');
    if(daysRow)daysRow.style.display=isDaily?'flex':'none';
    var daysVal=document.getElementById('akbRenewDays');
    if(daysVal)daysVal.textContent=renewDays;
    updateRenewTotal();
    document.getElementById('akbRenewMask').classList.add('show');
  };
  /* 续约天数加减（商城购物步进器）：仅按天订单显示，实时联动金额 */
  var renewDays=1;
  window.changeRenewDays=function(delta){
    renewDays=Math.max(1,Math.min(60,(renewDays||1)+delta));
    var el=document.getElementById('akbRenewDays');
    if(el)el.textContent=renewDays;
    updateRenewTotal();
  };
  function updateRenewTotal(){
    var order=getServiceOrders().find(function(o){return o.id===renewNo;});
    if(!order)return;
    var unit=parseFloat(String(order.unit||'0').replace(/[^0-9.]/g,''))||0;
    var qty=order.unitLabel==='/天'?renewDays:(parseFloat(String(order.quantity||'').replace(/[^0-9.]/g,''))||1);
    var amt=qty*unit;
    var qtyEl=document.getElementById('akbRenewQty');
    if(qtyEl)qtyEl.textContent='共 '+qty+(order.unitLabel==='/天'?' 天':' 次')+' × ¥'+order.unit+order.unitLabel;
    var amtEl=document.getElementById('akbRenewAmt');
    if(amtEl)amtEl.textContent='¥'+(amt%1?amt.toFixed(2):amt.toLocaleString());
  }
  window.closeRenewModal=function(){var m=document.getElementById('akbRenewMask');if(m)m.classList.remove('show');};
  /* ── 续约支付：确认续约后进入支付抽屉，支持积分抵扣（进行中订单与我的页面续单共用同一流程） ── */
  var renewPay=null;
  function fmtAmt(n){return n%1?n.toFixed(2):n.toLocaleString();}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function renewPayCalc(){
    var amt=parseFloat(String(renewPay.order.originalAmount).replace(/[^0-9.]/g,''))||0;
    var bal=window.AKBPoints?AKBPoints.get().balance:0;
    var max=Math.min(amt,bal);
    var disc=renewPay.usePoints?max:0;
    return {amt:amt,bal:bal,max:max,disc:disc,pay:Math.max(0,amt-disc)};
  }
  function ensureRenewPayDom(){
    if(document.getElementById('akbPayMask'))return;
    if(!document.getElementById('akbPayStyle')){
      var st=document.createElement('style');st.id='akbPayStyle';
      st.textContent=['.akb-pay-rows{padding:2px 0 10px}',
        '.akb-pay-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;font-size:14px;color:#333}',
        '.akb-pay-row .lbl{color:#6B6880}',
        '.akb-pay-row .val{font-weight:600;color:#1A1828}',
        '.akb-pay-switch{width:40px;height:22px;border-radius:12px;background:#E5E0EF;border:0;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}',
        '.akb-pay-switch:after{content:\'\';position:absolute;left:2px;top:2px;width:18px;height:18px;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.15);transition:left .2s}',
        '.akb-pay-switch.on{background:#1CD8B7}',
        '.akb-pay-switch.on:after{left:20px}',
        '.akb-pay-points-txt{flex:1;margin-right:10px;font-size:13px;color:#8A879B;text-align:right;line-height:1.5}',
        '.akb-pay-points-txt b{color:#E94E4E}',
        '.akb-pay-divider{height:1px;background:#F0EDF5;margin:6px 0}',
        '.akb-pay-final .val{font-size:18px;color:#E94E4E;font-weight:700}',
        '.akb-pay-tip{font-size:12px;color:#AEACC0;text-align:center;margin:2px 0 10px}'].join('\n');
      document.head.appendChild(st);
    }
    var mask=document.createElement('div');
    mask.id='akbPayMask';mask.className='renew-mask';
    mask.innerHTML='<div class="renew-sheet">'+
      '<div class="renew-title">确认支付<button class="renew-close" onclick="closeRenewPay()">✕</button></div>'+
      '<div class="renew-origin" id="akbPayOrigin"></div>'+
      '<div class="akb-pay-rows">'+
        '<div class="akb-pay-row"><span class="lbl">应付金额</span><span class="val" id="akbPayAmt"></span></div>'+
        '<div class="akb-pay-row"><span class="lbl">积分抵扣</span><span class="akb-pay-points-txt" id="akbPayPointsTxt"></span><button type="button" class="akb-pay-switch" id="akbPaySwitch" onclick="toggleRenewPoints(this)" aria-label="使用积分抵扣"></button></div>'+
        '<div class="akb-pay-divider"></div>'+
        '<div class="akb-pay-row akb-pay-final"><span class="lbl">实付金额</span><span class="val" id="akbPayFinal"></span></div>'+
      '</div>'+
      '<div class="akb-pay-tip">模拟支付 · 确认后订单立即生效</div>'+
      '<div class="renew-foot"><button class="renew-btn" onclick="closeRenewPay()">取消</button><button class="renew-btn primary" id="akbPayBtn" onclick="confirmRenewPay()">确认支付</button></div>'+
    '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click',function(e){if(e.target===mask)closeRenewPay();});
  }
  function renderRenewPay(){
    if(!renewPay)return;
    var c=renewPayCalc();
    document.getElementById('akbPayOrigin').innerHTML='<b>'+renewPay.order.project+'</b> · '+renewPay.order.person+'<br>续约订单 · '+renewPay.order.time;
    document.getElementById('akbPayAmt').textContent='¥'+fmtAmt(c.amt);
    var txt=document.getElementById('akbPayPointsTxt');
    if(txt)txt.innerHTML=c.bal>0?(renewPay.usePoints?'已使用 <b>'+c.disc+' 积分</b> 抵扣 ¥'+fmtAmt(c.disc):'可用 '+c.bal+' 积分 · 本单最多可抵 ¥'+fmtAmt(c.max)):'暂无可用积分';
    var sw=document.getElementById('akbPaySwitch');
    if(sw)sw.classList.toggle('on',renewPay.usePoints&&c.bal>0);
    var fin=document.getElementById('akbPayFinal');
    if(fin)fin.textContent='¥'+fmtAmt(c.pay);
    var btn=document.getElementById('akbPayBtn');
    if(btn)btn.textContent='确认支付 ¥'+fmtAmt(c.pay);
  }
  window.toggleRenewPoints=function(el){
    if(!renewPay)return;
    var bal=window.AKBPoints?AKBPoints.get().balance:0;
    if(bal<=0){showToastSafe('暂无可用积分');return;}
    renewPay.usePoints=el.classList.toggle('on');
    renderRenewPay();
  };
  window.closeRenewPay=function(){var m=document.getElementById('akbPayMask');if(m)m.classList.remove('show');};
  window.confirmRenew=function(){
    var order=getServiceOrders().find(function(o){return o.id===renewNo;});
    if(!order)return;
    var date=document.getElementById('akbRenewDate').value;
    var addr=document.getElementById('akbRenewAddress').value.trim();
    if(!date){showToastSafe('请选择服务开始日期');return;}
    if(!addr){showToastSafe('请填写服务地址');return;}
    var isDaily=order.unitLabel==='/天';
    var qty=isDaily?renewDays:(parseFloat(String(order.quantity||'').replace(/[^0-9.]/g,''))||1);
    var unit=parseFloat(String(order.unit||'0').replace(/[^0-9.]/g,''))||0;
    var amt=qty*unit;
    var quantity=isDaily?('x'+qty+'天'):order.quantity;
    var time=order.unitLabel==='/天'?(date+' 08:00 至 '+renewShiftDate(date,qty-1)+' 20:00'):(date+' 08:00');
    var draft={id:'AKB-R'+String(Date.now()).slice(-8),type:order.type,project:order.project,unit:order.unit,unitLabel:order.unitLabel,quantity:quantity,person:order.person,address:addr,addressKind:order.addressKind,time:time,nurse:order.nurse,nursePhone:order.nursePhone,role:order.role,cert:order.cert,years:order.years,avatar:order.avatar,originalAmount:amt%1?amt.toFixed(2):String(amt),amount:amt%1?amt.toFixed(2):String(amt),orderType:'续费订单',renewFrom:renewNo,createdAt:Date.now(),source:'renew'};
    renewPay={order:draft,usePoints:true};
    ensureRenewPayDom();
    renderRenewPay();
    document.getElementById('akbPayMask').classList.add('show');
  };
  window.confirmRenewPay=function(){
    if(!renewPay)return;
    var c=renewPayCalc();
    if(c.disc>0&&window.AKBPoints)AKBPoints.spend(c.disc,'续约订单积分抵扣 · '+renewPay.order.project);
    var o=renewPay.order;
    o.payAmount=c.pay%1?c.pay.toFixed(2):String(c.pay);
    o.pointsUsed=c.disc;
    o.pointsDiscount=c.disc;
    o.status='pending-service';
    o.state='待服务';
    o.actions=['cancel','call'];
    var saved=[];
    try{saved=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');if(!Array.isArray(saved))saved=[];}catch(e){saved=[];}
    saved.unshift(o);
    try{localStorage.setItem('ankebang_service_orders',JSON.stringify(saved));}catch(e){}
    closeRenewPay();
    closeRenewModal();
    showToastSafe(c.disc>0?('支付成功，积分已抵扣 ¥'+fmtAmt(c.disc)+'，续约订单已生效'):'支付成功，续约订单已生效');
    window.renderOrderType(currentListType);
    renewPay=null;
  };
  /* ── 待付款订单支付：金额明细 + 积分抵扣 + 支付成功页（与详情页购买一致） ── */
  var orderPay=null;
  function orderPayCalc(){
    var amt=orderPay.amount;
    var bal=window.AKBPoints?AKBPoints.get().balance:0;
    var max=Math.min(amt,bal);
    var disc=orderPay.usePoints?max:0;
    return {amt:amt,bal:bal,max:max,disc:disc,pay:Math.max(0,amt-disc)};
  }
  function ensureOrderPayDom(){
    if(document.getElementById('orderPayMask'))return;
    var mask=document.createElement('div');
    mask.id='orderPayMask';mask.className='renew-mask';
    mask.innerHTML='<div class="renew-sheet">'+
      '<div class="renew-title" id="orderPayTitle">确认支付<button class="renew-close" onclick="closeOrderPaySheet()">✕</button></div>'+
      '<div class="renew-origin" id="orderPayOrigin"></div>'+
      '<div class="akb-pay-rows">'+
        '<div class="akb-pay-row"><span class="lbl">商品金额</span><span class="val" id="orderPayAmt"></span></div>'+
        '<div class="akb-pay-row"><span class="lbl">积分抵扣</span><span class="akb-pay-points-txt" id="orderPayPointsTxt"></span><button type="button" class="akb-pay-switch" id="orderPaySwitch" onclick="toggleOrderPayPoints(this)" aria-label="使用积分抵扣"></button></div>'+
        '<div class="akb-pay-divider"></div>'+
        '<div class="akb-pay-row akb-pay-final"><span class="lbl">实付金额</span><span class="val" id="orderPayFinal"></span></div>'+
      '</div>'+
      '<div class="akb-pay-tip">模拟支付 · 确认后订单立即生效</div>'+
      '<div class="renew-foot"><button class="renew-btn" onclick="closeOrderPaySheet()">取消</button><button class="renew-btn primary" id="orderPayBtn" onclick="confirmOrderPay()">确认支付</button></div>'+
    '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click',function(e){if(e.target===mask)closeOrderPaySheet();});
  }
  function renderOrderPay(){
    if(!orderPay)return;
    var c=orderPayCalc();
    document.getElementById('orderPayTitle').childNodes[0].textContent=orderPay.kind==='mall'?'确认付款':'确认支付';
    document.getElementById('orderPayOrigin').innerHTML='<b>'+esc(orderPay.name)+'</b><br>'+(orderPay.kind==='mall'?'商城订单 · ':'服务订单 · ')+orderPay.id;
    document.getElementById('orderPayAmt').textContent='¥'+fmtAmt(c.amt);
    var txt=document.getElementById('orderPayPointsTxt');
    if(txt)txt.innerHTML=c.bal>0?(orderPay.usePoints?'已使用 <b>'+c.disc+' 积分</b> 抵扣 ¥'+fmtAmt(c.disc):'可用 '+c.bal+' 积分 · 本单最多可抵 ¥'+fmtAmt(c.max)):'暂无可用积分';
    var sw=document.getElementById('orderPaySwitch');
    if(sw)sw.classList.toggle('on',orderPay.usePoints&&c.bal>0);
    var fin=document.getElementById('orderPayFinal');
    if(fin)fin.textContent='¥'+fmtAmt(c.pay);
    var btn=document.getElementById('orderPayBtn');
    if(btn)btn.textContent=(orderPay.kind==='mall'?'确认付款':'确认支付')+' ¥'+fmtAmt(c.pay);
  }
  window.openOrderPaySheet=function(kind,trigger){
    var cardEl=trigger&&trigger.closest?trigger.closest('.order-card'):null;
    var id=cardEl?cardEl.getAttribute('data-order-id'):'';
    var list=kind==='mall'?getMallOrders():getServiceOrders();
    var order=list.find(function(o){return o.id===id;});
    if(!order)return;
    orderPay={kind:kind,id:id,usePoints:true,
      amount:parseFloat(String(order.amount).replace(/[^0-9.]/g,''))||0,
      name:kind==='mall'?(order.product||'商城商品'):(order.project||'服务订单')};
    ensureOrderPayDom();
    renderOrderPay();
    document.getElementById('orderPayMask').classList.add('show');
  };
  window.closeOrderPaySheet=function(){var m=document.getElementById('orderPayMask');if(m)m.classList.remove('show');};
  window.toggleOrderPayPoints=function(el){
    if(!orderPay)return;
    var bal=window.AKBPoints?AKBPoints.get().balance:0;
    if(bal<=0){showToastSafe('暂无可用积分');return;}
    orderPay.usePoints=el.classList.toggle('on');
    renderOrderPay();
  };
  /* 支付成功页：结构与详情页购买支付成功保持一致（绿色对勾 + 摘要卡 + 双按钮） */
  function ensureSuccessDom(){
    if(document.getElementById('akbOrderSuccess'))return;
    if(!document.getElementById('akbOrderSuccessStyle')){
      var st=document.createElement('style');st.id='akbOrderSuccessStyle';
      st.textContent=['.akb-success-mask{position:fixed;inset:0;z-index:1400;background:#F5F5F5;display:none;flex-direction:column}',
        '.akb-success-mask.show{display:flex}.akb-success-wrap{width:100%;max-width:430px;margin:0 auto;display:flex;flex-direction:column;flex:1;min-height:0}',
        '.akb-suc-top{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:42px 20px 20px;text-align:center}',
        '.akb-circle{width:66px;height:66px;border-radius:12px;background:linear-gradient(135deg,#34D399,#10B981);display:grid;place-items:center;margin-bottom:16px;box-shadow:0 8px 28px rgba(16,185,129,.28);animation:akbPop .4s .15s both cubic-bezier(.34,1.56,.64,1)}',
        '@keyframes akbPop{from{transform:scale(0)}to{transform:scale(1)}}',
        '.akb-circle svg{width:32px;height:32px}',
        '.akb-suc-title{font-size:20px;font-weight:700;color:#1A1828;margin-bottom:8px}',
        '.akb-suc-sub{font-size:14px;color:#6B6880;line-height:1.65;max-width:300px}',
        '.akb-suc-card{background:#fff;border-radius:12px;padding:4px 18px;margin:20px 16px 0;text-align:left;box-shadow:0 2px 12px rgba(0,0,0,.1)}',
        '.akb-suc-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;font-size:14px}',
        '.akb-suc-row+.akb-suc-row{border-top:1px solid #EDE9F5}',
        '.akb-suc-key{color:#AEACC0;font-weight:600;flex-shrink:0;margin-right:12px}',
        '.akb-suc-val{color:#1A1828;font-weight:600;text-align:right;overflow-wrap:anywhere}',
        '.akb-suc-val.purple{color:#0FA98C;font-size:15px;font-weight:700}',
        '.akb-suc-val.deduct{color:#EF4444}',
        '.akb-suc-btns{display:flex;gap:12px;padding:14px 16px calc(14px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #EDE9F5}',
        '.akb-suc-btns button{flex:1;height:46px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}',
        '.akb-suc-btns .ghost{border:1px solid #E0DBEA;background:#fff;color:#6B6880}',
        '.akb-suc-btns .primary{border:0;background:linear-gradient(135deg,#1CD8B7,#0FA98C);color:#fff}'].join('\n');
      document.head.appendChild(st);
    }
    var mask=document.createElement('div');
    mask.id='akbOrderSuccess';mask.className='akb-success-mask';
    mask.innerHTML='<div class="akb-success-wrap">'+
      '<div class="akb-suc-top"><div class="akb-circle"><svg viewBox="0 0 38 38" fill="none"><path d="M9 19l7 7 13-13" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'+
      '<div class="akb-suc-title">支付成功</div><div class="akb-suc-sub" id="akbSucSub"></div></div>'+
      '<div class="akb-suc-card">'+
        '<div class="akb-suc-row"><span class="akb-suc-key" id="akbSucTypeKey">订单类型</span><span class="akb-suc-val" id="akbSucType"></span></div>'+
        '<div class="akb-suc-row"><span class="akb-suc-key">订单编号</span><span class="akb-suc-val" id="akbSucNo"></span></div>'+
        '<div class="akb-suc-row"><span class="akb-suc-key">商品金额</span><span class="akb-suc-val" id="akbSucAmt"></span></div>'+
        '<div class="akb-suc-row" id="akbSucDeductRow"><span class="akb-suc-key">积分抵扣</span><span class="akb-suc-val deduct" id="akbSucDeduct"></span></div>'+
        '<div class="akb-suc-row"><span class="akb-suc-key">实付金额</span><span class="akb-suc-val purple" id="akbSucPay"></span></div>'+
      '</div>'+
      '<div class="akb-suc-btns"><button class="ghost" id="akbSucHome">返回首页</button><button class="primary" id="akbSucDetail">查看订单详情</button></div>'+
    '</div>';
    document.body.appendChild(mask);
  }
  function showOrderPaySuccess(info){
    ensureSuccessDom();
    var m=document.getElementById('akbOrderSuccess');
    document.getElementById('akbSucSub').textContent=info.kind==='mall'?'商品将尽快为你安排配送':'订单已提交，护理员将在30分钟内与您确认';
    document.getElementById('akbSucType').textContent=info.kind==='mall'?'商城订单':'服务订单';
    document.getElementById('akbSucNo').textContent=info.id;
    document.getElementById('akbSucAmt').textContent='¥'+fmtAmt(info.amt);
    var dr=document.getElementById('akbSucDeductRow');
    if(info.disc>0){dr.style.display='';document.getElementById('akbSucDeduct').textContent='-'+info.disc+' 积分（¥'+fmtAmt(info.disc)+'）';}
    else dr.style.display='none';
    document.getElementById('akbSucPay').textContent='¥'+fmtAmt(info.pay);
    document.getElementById('akbSucHome').onclick=function(){location.href='home.html';};
    document.getElementById('akbSucDetail').onclick=function(){location.href=(info.kind==='mall'?'mall-order-detail.html?no=':'order-detail.html?no=')+encodeURIComponent(info.id);};
    m.classList.add('show');
  }
  window.confirmOrderPay=function(){
    if(!orderPay)return;
    var c=orderPayCalc();
    if(c.disc>0&&window.AKBPoints)AKBPoints.spend(c.disc,'订单支付积分抵扣 · '+orderPay.name);
    var today=new Date().toISOString().slice(0,10);
    if(orderPay.kind==='mall'){
      var saved=[];try{saved=JSON.parse(localStorage.getItem('ankebang_mall_orders')||'[]');if(!Array.isArray(saved))saved=[];}catch(e){saved=[];}
      var full=(typeof mallOrders!=='undefined'?(mallOrders.find(function(o){return o.id===orderPay.id;})||{}):{});
      var next=Object.assign({},full,{status:'shipping',state:'待发货',payAmount:c.pay,pointsUsed:c.disc,pointsDiscount:c.disc,paidAt:today});
      var idx=saved.findIndex(function(o){return o.id===orderPay.id;});
      if(idx>=0)saved[idx]=Object.assign({},saved[idx],next);else saved.unshift(next);
      try{localStorage.setItem('ankebang_mall_orders',JSON.stringify(saved));}catch(e){}
      closeOrderPaySheet();
      showOrderPaySuccess({kind:'mall',id:orderPay.id,amt:c.amt,disc:c.disc,pay:c.pay});
      window.renderOrderType('mall');
    }else{
      var saved2=[];try{saved2=JSON.parse(localStorage.getItem('ankebang_service_orders')||'[]');if(!Array.isArray(saved2))saved2=[];}catch(e){saved2=[];}
      var full2=(typeof orders!=='undefined'?(orders.find(function(o){return o.id===orderPay.id;})||{}):{});
      var next2=Object.assign({},full2,{status:'pending-service',state:'待服务',actions:['cancel','call'],payAmount:c.pay,pointsUsed:c.disc,pointsDiscount:c.disc,paidAt:today});
      var idx2=saved2.findIndex(function(o){return o.id===orderPay.id;});
      if(idx2>=0)saved2[idx2]=Object.assign({},saved2[idx2],next2);else saved2.unshift(next2);
      try{localStorage.setItem('ankebang_service_orders',JSON.stringify(saved2));}catch(e){}
      closeOrderPaySheet();
      showOrderPaySuccess({kind:'service',id:orderPay.id,amt:c.amt,disc:c.disc,pay:c.pay});
      window.renderOrderType('service');
    }
    orderPay=null;
  };
  function showToastSafe(msg){if(typeof showToast==='function')showToast(msg);}
  window.refreshOrderFilter=applyCurrentStatus;
  function build(){var params=new URLSearchParams(location.search);var type=params.get('type')==='mall'?'mall':'service';switchOrderType(type);renderOrderType(type);var renew=params.get('renew');if(renew){params.delete('renew');var qs=params.toString();try{history.replaceState(null,'',location.pathname+(qs?'?'+qs:''));}catch(e){}setTimeout(function(){openRenewModal(renew);},0);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
