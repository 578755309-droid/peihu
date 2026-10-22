/* Vue card selector: scrolling changes selection, never consumes a service. */
(function(w){
  'use strict';
  const {createApp,h,reactive,ref,onMounted,onUnmounted,nextTick}=w.Vue;
  let controller;
  w.AKBCardCarousel={mount(target,cards,selected,onSelect){
    if(controller){controller.state.cards=cards;controller.select(selected);return controller;}
    const state=reactive({cards,selected}),rail=ref(null);let timer,disposed=false;
    const current=()=>Math.max(0,state.cards.findIndex(c=>c.id===state.selected));
    function scrollToCurrent(){nextTick(()=>{if(disposed||!rail.value)return;const child=rail.value.children[current()];if(child)rail.value.scrollTo({left:child.offsetLeft-rail.value.offsetLeft,behavior:w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});}
    function choose(index,scroll){const card=state.cards[index];if(!card)return;if(state.selected!==card.id){state.selected=card.id;onSelect(card.id);}if(scroll)scrollToCurrent();}
    const app=createApp({setup(){onMounted(scrollToCurrent);onUnmounted(()=>{disposed=true;clearTimeout(timer);});return()=>h('div',{class:'redeem-carousel'},[
      h('div',{class:'redeem-carousel-rail',ref:rail,role:'region','aria-label':'选择助浴兑换卡',tabindex:0,onKeydown:e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(current()+(e.key==='ArrowRight'?1:-1),true);}},onScroll:()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!rail.value)return;const left=rail.value.scrollLeft;let nearest=0,distance=Infinity;Array.from(rail.value.children).forEach((el,i)=>{const d=Math.abs(el.offsetLeft-rail.value.offsetLeft-left);if(d<distance){distance=d;nearest=i;}});choose(nearest,false);},140);}},state.cards.map((c,i)=>{const p=c.patient||{},remaining=Math.max(0,(c.total||10)-(c.used||0));return h('button',{type:'button',key:c.id,class:['redeem-slide',{'is-selected':c.id===state.selected}],'aria-pressed':c.id===state.selected,'aria-label':'上门助浴兑换卡，'+(p.name||'未填写对象')+'，剩余'+remaining+'次，第'+(i+1)+'张，共'+state.cards.length+'张',onClick:()=>choose(i,true)},[
        h('div',{class:'redeem-slide-top'},[h('strong',null,'上门助浴 10 次兑换卡'),h('span',{class:'redeem-slide-status'},c.id===state.selected?'当前使用':'选择此卡')]),
        h('div',{class:'redeem-slide-patient'},'适用对象：'+(p.name||'—')+'（'+[p.gender,p.age!=null?p.age+'岁':''].filter(Boolean).join(' · ')+'）'),
        h('div',{class:'redeem-slide-lock'},'仅限首次购买时的服务对象使用'),
        h('div',{class:'redeem-slide-balance'},[h('span',{class:'ck-balance-copy'},[h('span',null,'剩余 '),h('b',null,String(remaining)),h('span',null,' 次')]),h('img',{class:'ck-bath-art',src:'assets/checkout-figma/6053ab0524243ecd.svg',width:140.384613,height:107.988167,alt:''})]),
        h('div',{class:'redeem-slide-number'},'卡号 '+c.id)
      ]);})),
      h('div',{class:'redeem-carousel-controls'},[h('span',{class:'redeem-carousel-hint'},state.cards.length>1?'左右滑动切换兑换卡':'当前可用兑换卡'),h('div',{class:'redeem-carousel-pager'},[h('button',{type:'button',disabled:current()===0,'aria-label':'上一张兑换卡',onClick:()=>choose(current()-1,true)},'‹'),h('span',{'aria-live':'polite'},(current()+1)+' / '+state.cards.length),h('button',{type:'button',disabled:current()===state.cards.length-1,'aria-label':'下一张兑换卡',onClick:()=>choose(current()+1,true)},'›')])])
    ]);}});app.mount(target);
    controller={state,select(id){state.selected=id;},destroy(){app.unmount();controller=null;}};return controller;
  }};
})(window);
