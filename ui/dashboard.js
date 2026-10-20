/* Vue dashboard components shared by operations, finance, business and mall. */
(function(w){
  'use strict';
  const {createApp,h,ref,reactive,computed,onMounted,onUnmounted,watch,nextTick}=Vue;
  const charts=new Map(),counters=new Map();let uid=0,mutation,scheduled=false;
  const palette={teal:'#12B89C',blue:'#5B8DEF',amber:'#EAA23B',violet:'#8B78DF'};
  const reduced=()=>!!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const format=(v,currency)=>currency?'¥'+Number(v).toLocaleString('zh-CN',{maximumFractionDigits:2}):Number(v).toLocaleString('zh-CN',{maximumFractionDigits:2});
  function curve(points){if(!points.length)return '';let d='M'+points[0].x+','+points[0].y;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],mid=(a.x+b.x)/2;d+=' C'+mid+','+a.y+' '+mid+','+b.y+' '+b.x+','+b.y;}return d;}
  const Trend={name:'DashboardTrend',props:['config'],setup(props){
    const host=ref(null),width=ref(900),active=ref(null),focused=ref(false),id='dashboard-trend-'+(++uid);let resize,measure;
    const model=computed(()=>{
      const c=props.config,values=(c.values||[]).map(v=>Math.max(0,Number(v)||0)),W=width.value,H=286,pad={l:60,r:24,t:32,b:38};
      const max=Math.max(0,...values),raw=max===0?1:max*1.15,power=Math.pow(10,Math.floor(Math.log10(raw))),step=Math.ceil(raw/power/4)*power;
      const ceiling=Math.max(1,step*4),plotW=W-pad.l-pad.r,plotH=H-pad.t-pad.b;
      const points=values.map((v,i)=>({x:pad.l+(values.length===1?.5:i/Math.max(1,values.length-1))*plotW,y:pad.t+plotH-v/ceiling*plotH,value:v,label:c.labels[i]||''}));
      const line=curve(points),base=H-pad.b,area=points.length?line+' L'+points[points.length-1].x+','+base+' L'+points[0].x+','+base+' Z':'';
      return {W,H,pad,points,line,area,ceiling,base,total:values.reduce((a,b)=>a+b,0),currency:c.unit==='currency',color:c.color||palette.teal};
    });
    onMounted(()=>{measure=()=>{width.value=Math.max(520,Math.round(host.value.getBoundingClientRect().width)||900);};measure();if(w.ResizeObserver){resize=new ResizeObserver(measure);resize.observe(host.value);}else w.addEventListener('resize',measure);});
    onUnmounted(()=>{if(resize)resize.disconnect();else if(measure)w.removeEventListener('resize',measure);});
    watch(()=>props.config.values,()=>{active.value=null;});
    function choose(index,keyboard){active.value=index;focused.value=!!keyboard;}
    return()=>{const m=model.value,c=props.config,selected=active.value==null?null:m.points[active.value];const nodes=[];
      nodes.push(h('defs',null,[h('linearGradient',{id,x1:0,y1:0,x2:0,y2:1},[h('stop',{offset:'0%','stop-color':m.color,'stop-opacity':.18}),h('stop',{offset:'100%','stop-color':m.color,'stop-opacity':.015})])]));
      for(let i=0;i<=4;i++){const y=m.pad.t+(m.base-m.pad.t)*i/4,value=m.ceiling*(1-i/4);nodes.push(h('line',{x1:m.pad.l,x2:m.W-m.pad.r,y1:y,y2:y,class:'db-chart-grid'}));nodes.push(h('text',{x:m.pad.l-12,y:y+4,'text-anchor':'end',class:'db-chart-tick'},value>=10000?(value/10000).toFixed(1).replace(/\.0$/,'')+'万':Number(value.toFixed(1)).toLocaleString('zh-CN')));}
      nodes.push(h('path',{key:'area-'+c.name+'-'+m.line,d:m.area,fill:'url(#'+id+')',class:'db-chart-area'}));
      nodes.push(h('path',{key:'line-'+c.name+'-'+m.line,d:m.line,stroke:m.color,fill:'none','stroke-width':2.5,'stroke-linecap':'round',pathLength:1000,class:'db-chart-line'}));
      if(selected)nodes.push(h('line',{x1:selected.x,x2:selected.x,y1:m.pad.t,y2:m.base,stroke:m.color,'stroke-dasharray':'4 5','stroke-opacity':.45}));
      m.points.forEach((p,i)=>{const isActive=active.value===i;nodes.push(h('g',{key:i,class:'db-chart-point',style:{'--point-delay':(i*55)+'ms'}},[
        h('circle',{cx:p.x,cy:p.y,r:isActive?9:0,fill:m.color,'fill-opacity':.12}),h('circle',{cx:p.x,cy:p.y,r:4,fill:'#fff',stroke:m.color,'stroke-width':2}),
        h('text',{x:p.x,y:Math.max(18,p.y-13),'text-anchor':'middle',class:'db-chart-value'},format(p.value,m.currency)),
        h('text',{x:p.x,y:m.H-12,'text-anchor':'middle',class:'db-chart-tick'},p.label),
        h('rect',{x:p.x-(m.W-m.pad.l-m.pad.r)/Math.max(2,m.points.length)/2,y:m.pad.t,width:(m.W-m.pad.l-m.pad.r)/Math.max(2,m.points.length),height:m.base-m.pad.t,fill:'transparent',tabindex:0,role:'button','aria-label':p.label+'，'+c.name+' '+format(p.value,m.currency),onMouseenter:()=>choose(i,false),onFocus:()=>choose(i,true),onClick:()=>choose(i,true),onKeydown:e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:-1)+m.points.length)%m.points.length;choose(next,true);nextTick(()=>host.value.querySelectorAll('rect[role="button"]')[next].focus());}}})]));});
      return h('div',{ref:host,class:'db-trend',style:{'--chart-accent':m.color},onMouseleave:()=>{if(!focused.value)active.value=null;}},[
        h('div',{class:'db-trend-summary'},[h('div',null,[h('span',{class:'db-summary-label'},c.summaryLabel||'本期合计'),h('strong',{class:'db-summary-value'},format(m.total,m.currency)),h('span',{class:'db-summary-unit'},m.currency?'元':'单')]),h('span',{class:'db-date-range'},(c.labels[0]||'')+' — '+(c.labels[c.labels.length-1]||''))]),
        h('div',{class:'db-chart-wrap'},[h('svg',{viewBox:'0 0 '+m.W+' '+m.H,width:'100%',height:m.H,'data-keep-svg':'','aria-label':c.name+'趋势图',class:'db-chart-svg'},nodes),selected?h('div',{class:'db-chart-tooltip',role:'status',style:{left:Math.min(78,Math.max(8,selected.x/m.W*100))+'%',top:Math.max(12,selected.y-58)+'px'}},[h('span',null,selected.label+' · '+c.name),h('strong',null,format(selected.value,m.currency))]):null]),
        h('div',{class:'db-trend-foot'},[h('span',{class:'db-legend'},[h('i',{style:{background:m.color}}),c.name+(m.currency?'（元）':'（单）')]),h('span',null,c.note||'悬停或使用方向键查看每日数据')])]);
    };
  }};
  const Counter={name:'DashboardCounter',props:['text'],setup(props){const display=ref(props.text);let frame;onMounted(()=>{const raw=props.text,match=raw.match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)([^\d]*)$/);if(!match||reduced())return;const value=Number(match[2].replace(/,/g,'')),precision=(match[2].split('.')[1]||'').length,start=performance.now();
    function tick(now){const t=Math.min(1,(now-start)/680),n=value*(1-Math.pow(1-t,3));display.value=t===1?raw:match[1]+n.toLocaleString('zh-CN',{minimumFractionDigits:precision,maximumFractionDigits:precision})+match[3];if(t<1)frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);});onUnmounted(()=>cancelAnimationFrame(frame));return()=>h('span',{'aria-hidden':'true'},display.value);}};
  function enhance(){
    const cardSelector='.metric-card,.mall-metric,.chart-card,.stat-card,.mall-panel';let i=0;
    document.querySelectorAll(cardSelector).forEach(el=>{if(!el.dataset.dbReady){el.dataset.dbReady='true';el.style.setProperty('--db-delay',Math.min(i++*45,270)+'ms');el.classList.add('db-enter');}});
    document.querySelectorAll('.metric-val,.mm-val').forEach(el=>{if(el.childElementCount||counters.has(el)||!/[0-9]/.test(el.textContent))return;const text=el.textContent;el.setAttribute('aria-label',text);const app=createApp({render:()=>h(Counter,{text})});app.mount(el);counters.set(el,app);});
    for(const [el,app]of counters)if(!el.isConnected){app.unmount();counters.delete(el);}
  }
  w.AKBDashboard={palette,mountTrend(target,config){const el=typeof target==='string'?document.querySelector(target):target;if(!el)return;let entry=charts.get(el);if(entry){Object.assign(entry.config,config);return;}
    const data=reactive(Object.assign({labels:[],values:[],name:'趋势'},config));const app=createApp({render:()=>h(Trend,{config:data})});app.mount(el);charts.set(el,{app,config:data});el.classList.add('dashboard-chart');
  },refresh:enhance,destroy(){if(mutation)mutation.disconnect();for(const entry of charts.values())entry.app.unmount();for(const app of counters.values())app.unmount();charts.clear();counters.clear();}};
  function init(){document.body.classList.add('has-dashboard');enhance();mutation=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;enhance();});});mutation.observe(document.querySelector('.page')||document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  w.addEventListener('pagehide',event=>{if(!event.persisted)w.AKBDashboard.destroy();});
})(window);
