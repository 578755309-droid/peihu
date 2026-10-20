const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const data=require('../ui/dashboard-data.js');
const vm=require('vm'),bookingSource=fs.readFileSync(path.join(__dirname,'../hospital-care.html'),'utf8');
const copyBranch=bookingSource.match(/if \(isBath10Order\) \{([\s\S]*?)\n    \} else \{/)[1];
for(const count of [0,1,10]){const nodes={};vm.runInNewContext(copyBranch,{bathSessions:Array.from({length:count},()=>({date:'2026-10-20'})),document:{querySelector(selector){return nodes[selector]||(nodes[selector]={});}}});assert.ok(nodes['.pay-sub'].textContent.includes('共10次'));assert.ok(nodes['#payBath10Tip .pay-val'].textContent.includes(count===10?'均已预约':(10-count)+'次待预约'));}

const orders=[{date:'2026-10-20',amount:100,state:'待付款'},{date:'2026-10-20',amount:500,state:'已取消'},{date:'2026-10-20',amount:90,state:'已退款'},{date:'2026-10-20',amount:80,state:'已完成',refundState:'已退款',refundAmount:30}];
const snapshot=JSON.stringify(orders),rows=data.receivableWeek(orders,new Date(2026,9,20));assert.equal(rows.length,7);assert.equal(rows[6].amount,150);assert.equal(JSON.stringify(orders),snapshot);assert.equal(data.receivableWeek([],new Date(2026,0,2))[0].key,'2025-12-27');
const root=path.resolve(__dirname,'..');class Loader extends ResourceLoader{fetch(url){const p=path.join(root,new URL(url).pathname);return Promise.resolve(fs.existsSync(p)&&fs.statSync(p).isFile()?fs.readFileSync(p):Buffer.from(''));}}
(async()=>{for(const file of ['admin.html','admin-ops.html','admin-finance.html','admin-mall.html']){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type==='unhandled exception')errors.push(e.message)});
 const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'),{url:'https://test.local/'+file,resources:new Loader(),runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 await new Promise(r=>dom.window.addEventListener('load',r,{once:true}));await new Promise(r=>setTimeout(r,100));
 const w=dom.window,d=w.document;assert.deepEqual(errors,[],file);assert.ok(d.querySelector('.dashboard-chart svg'),file);assert.ok(!d.querySelector('.dashboard-chart').innerHTML.includes('NaN'));const groups=d.querySelectorAll('.sb-group-toggle');assert.equal(groups.length,5,file);const button=groups[groups.length-1],before=button.getAttribute('aria-expanded');button.click();await w.Vue.nextTick();assert.notEqual(button.getAttribute('aria-expanded'),before);assert.ok(w.localStorage.getItem('akb_sidebar_groups_v1'));assert.ok(d.querySelector('[aria-current="page"]'));
 if(file==='admin-mall.html')assert.ok(d.body.textContent.includes('近7天应收趋势'));
 w.AKBDashboard.destroy();w.AKBUI.destroy();dom.window.close();console.log('PASS',file,'chart, sidebar groups, active route and persisted toggle');
}console.log('PASS receivable totals, exclusions, partial refunds, date boundary and read-only aggregation');})().catch(e=>{console.error(e);process.exit(1)});
