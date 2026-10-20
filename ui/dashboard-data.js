/* Read-only dashboard aggregation. Never changes order records or payment state. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AKBDashboardData=api;})(typeof window!=='undefined'?window:globalThis,function(){
  function money(value){const n=Number(String(value==null?'':value).replace(/[¥￥,\s]/g,''));return Number.isFinite(n)?Math.max(0,n):0;}
  function receivable(order){
    if(['已取消','已退款'].includes(order.state))return 0;
    const amount=money(order.amount);
    if(order.refundState==='已退款')return Math.max(0,amount-money(order.refundAmount||amount));
    return amount;
  }
  function dateKey(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
  function receivableWeek(orders,now){
    const end=new Date(now||Date.now());end.setHours(12,0,0,0);
    const rows=Array.from({length:7},(_,i)=>{const d=new Date(end);d.setDate(d.getDate()-6+i);return {key:dateKey(d),label:(d.getMonth()+1)+'/'+d.getDate(),amount:0,count:0};});
    const days=new Map(rows.map(row=>[row.key,row]));
    for(const order of orders||[]){const key=String(order.date||order.createdAt||'').slice(0,10),row=days.get(key);if(!row)continue;const amount=receivable(order);row.amount=Math.round((row.amount+amount)*100)/100;if(!['已取消','已退款'].includes(order.state))row.count++;}
    return rows;
  }
  return {money,receivable,receivableWeek};
});
