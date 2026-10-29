const assert=require('node:assert/strict'),vm=require('vm'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');const map=new Map();const storage={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
const w={dispatchEvent(){},AKBNurseCertification:{read:()=>({status:'审核通过',caregiverId:'N-QA',name:'测试陪诊员'})}};
vm.runInNewContext(fs.readFileSync(path.join(root,'youkang-store.js'),'utf8'),{window:w,localStorage:storage,Event:class{},console,URL});const S=w.AKBYoukang;
const originalCreate=S.createOrder;
const purchaseInfo=sex=>({sex,patientId:sex==='男'?'P1001':'P1002',name:'测试体检人',idNo:sex==='男'?'110101195803180013':'110101197204080026',phone:'19900000000',age:sex==='男'?68:54,intentDate:new Date(Date.now()+86400000).toISOString().slice(0,10)});
S.createOrder=(uid,sex,requestId)=>{const order=originalCreate(uid,sex,requestId);if(order.state==='待支付'){assert.throws(()=>S.savePurchase(order.id,'WRONG',purchaseInfo(sex)),/不属于/);S.savePurchase(order.id,uid,purchaseInfo(sex));}return S.state().orders.find(o=>o.id===order.id);};
assert.throws(()=>S.validatePurchase({...purchaseInfo('男'),patientId:''}),/请选择体检人/);
assert.throws(()=>S.validatePurchase({...purchaseInfo('男'),patientId:'MISSING'}),/请选择体检人/);
assert.equal(S.validatePurchase({...purchaseInfo('男'),name:'fake',idNo:'invalid',age:''}).patient.name,'张爷爷');
assert.throws(()=>S.validatePurchase({...purchaseInfo('男'),phone:''}),/联系人电话/);
assert.throws(()=>S.validatePurchase({...purchaseInfo('男'),intentDate:'2020-01-01'}),/意向体检日期/);
assert.throws(()=>S.validatePurchase({...purchaseInfo('男'),sex:'女'}),/不一致/);

assert.equal(S.state().items.filter(i=>i.sex==='男').length,16);assert.equal(S.state().items.filter(i=>i.sex==='女').length,16);
assert.equal(S.state().items.filter(i=>i.sex==='男').reduce((a,i)=>a+i.price,0),133550);assert.equal(S.state().items.filter(i=>i.sex==='女').reduce((a,i)=>a+i.price,0),132550);
assert.equal(S.expiration('2024-02-29T12:00:00.000Z'),'2026-02-28T12:00:00.000Z');
let a=S.createOrder('U10001','男','A-checkout');assert.equal(S.current().vip,false);assert.equal(a.amount,169800);assert.equal(S.createOrder('U10001','男','A-checkout').id,a.id);a=S.pay(a.id,'U10001');assert.equal(S.current().vip,true);assert.equal(S.state().cards.length,1);assert.ok(S.state().orders.find(o=>o.id===a.id).patient.idNo);assert.equal(S.state().orders.find(o=>o.id===a.id).booking,undefined);assert.equal(S.state().orders.find(o=>o.id===a.id).state,'待预约');S.pay(a.id,'U10001');assert.equal(S.state().cards.length,1);
assert.throws(()=>S.bindRef('U10001','YK-U10001'),/不能推荐自己/);assert.throws(()=>S.bindRef('U10002','YK-U10003'),/未开通VIP/);
const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);const caregiver={id:'N-QA',name:'测试陪诊员'};
function use(o,uid){const card=S.state().cards.find(c=>c.id===o.cardId);const f={name:'测试体检人',phone:'19900000000',age:40,sex:o.sex,date:tomorrow,slot:'08:00–09:00'};assert.throws(()=>S.assign(o.id,caregiver),/已预约/);assert.throws(()=>S.book(card.id,'U10001',f),/不属于/);let booked=S.book(card.id,uid,f);assert.throws(()=>S.book(card.id,uid,f),/不可预约/);assert.throws(()=>S.assign(o.id,{id:'INVALID',name:'未认证'}),/已认证/);S.assign(booked.id,caregiver);assert.throws(()=>S.start(booked.id,'WRONG'),/未分配/);assert.equal(S.state().orders.find(o=>o.id===booked.id).state,'待接单');assert.throws(()=>S.start(booked.id,caregiver.id),/尚不能/);assert.throws(()=>S.accept(booked.id,'WRONG'),/未分配/);S.accept(booked.id,caregiver.id);const started=S.start(booked.id,caregiver.id);assert.throws(()=>S.complete(o.id,caregiver.id,'000000','完成'),/核销码/);assert.equal(S.state().orders.find(x=>x.id===o.id).state,'服务中');S.complete(o.id,caregiver.id,started.verificationCode,'固定体检项目及陪诊服务已完成');S.complete(o.id,caregiver.id,started.verificationCode,'重复');return booked;}
const referred=[];
for(let i=0;i<6;i++){const u=S.register('一级客户'+i,'YK-U10001');referred.push(u);const order=S.pay(S.createOrder(u.id,i%2?'女':'男','C'+i).id,u.id);if(i===0){assert.equal(S.stats('U10001').valid,0);assert.equal(S.state().rewards.length,0);}use(order,u.id);assert.equal(S.stats('U10001').valid,i+1);assert.equal(S.state().rewards.length,Math.floor((i+1)/3));}
assert.equal(S.state().cards.filter(c=>c.source==='reward').length,2);
// A second paid purchase by the same direct client does not count another customer.
use(S.pay(S.createOrder(referred[0].id,'男','REPEAT').id,referred[0].id),referred[0].id);assert.equal(S.stats('U10001').valid,6);assert.equal(S.state().rewards.length,2);
// A -> B -> C counts only for B, never for A.
const second=S.register('二级客户','YK-'+referred[0].id);use(S.pay(S.createOrder(second.id,'女','SECOND').id,second.id),second.id);assert.equal(S.stats('U10001').valid,6);assert.equal(S.stats(referred[0].id).valid,1);
assert.throws(()=>S.bindRef('U10002','YK-'+referred[0].id),/已有一级/);assert.throws(()=>S.bindRef('U10001','YK-'+referred[0].id),/已购买|循环/);
// Catalog edits render for future orders; existing order snapshots and fixed price remain stable.
const before=S.state().orders[0].items[0].name,rows=S.state().items;rows[0].name='一般检查（后台确认）';rows[0].meaning='体检中心确认的说明';S.updateItems(rows);assert.equal(S.state().orders[0].items[0].name,before);assert.equal(S.createOrder('U10003','男','SNAPSHOT').items[0].name,rows[0].name);assert.equal(S.createOrder('U10003','男','SNAPSHOT').amount,169800);
const gift=S.state().cards.find(c=>c.source==='reward');const g=S.book(gift.id,'U10001',{name:'奖励体检人',age:38,phone:'19900000000',date:tomorrow,slot:'09:00–10:00',sex:'女'});S.assign(g.id,caregiver);S.accept(g.id,caregiver.id);const st=S.start(g.id,caregiver.id);S.complete(g.id,caregiver.id,st.verificationCode,'免费卡体检完成');assert.equal(S.stats('U10001').valid,6);assert.equal(S.state().rewards.length,2);assert.equal(g.amount,0);
// Expiry and invalid dates are rejected before card consumption.
const fresh=S.state().cards.find(c=>c.source==='reward'&&c.status==='可预约');assert.throws(()=>S.book(fresh.id,'U10001',{name:'测试',age:40,phone:'19900000000',date:'2035-01-01',slot:'08:00–09:00',sex:'男'}),/日期/);assert.equal(S.state().cards.find(c=>c.id===fresh.id).status,'可预约');
const saved=JSON.parse(storage.getItem('ankebang_service_orders'));assert.ok(saved.some(o=>o.serviceKey==='health-check'&&o.state==='已完成'));
console.log('PASS fixed pricing, 32 projects, paid VIP, idempotent checkout, appointment-before-service, assigned nurse verification, 3/6-client rewards, direct-only counting, duplicate exclusion, free-card use, expiry and project snapshots');

const incomplete=originalCreate('U10001','男','MISSING-FORM');assert.throws(()=>S.pay(incomplete.id,'U10001'),/先填写体检人信息/);assert.equal(S.state().orders.find(o=>o.id===incomplete.id).state,'待支付');

assert.equal(S.bookingReturnTarget('/orders?type=service&tab=pending-service','','https://test.local',false),'/orders?type=service&tab=pending-service');
assert.equal(S.bookingReturnTarget('/my-cards?tab=green','','https://test.local',false),'/my-cards?tab=green');
assert.equal(S.bookingReturnTarget('/my-cards?tab=green','','https://test.local',true),'orders.html?type=service&tab=pending-service');
assert.equal(S.bookingReturnTarget('https://other.test/orders','','https://test.local',false),'my-cards.html?tab=green');
assert.equal(S.bookingReturnTarget('/youkang?view=order','','https://test.local',false),'my-cards.html?tab=green');
