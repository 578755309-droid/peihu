/* Vue 3 islands: shared UI components + a DOM-preserving bridge for legacy business forms. */
(function (global) {
  'use strict';
  const {createApp,h,ref,reactive,markRaw,Fragment,Teleport,Transition,watch,nextTick,onUnmounted}=global.Vue;
  const registry=global.AKBIcons;
  const state=reactive({queue:[],toast:null,legacy:[]});
  let sequence=0,toastTimer,started=false,observer,scheduled=false,rootApp;
  const mountedIcons=new Map(),mounts=new WeakMap(),legacyRecords=new Map(),focusStack=[];
  let oldOverflow='';
  const focusable='button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  const Icon={name:'AkbIcon',props:['name','source'],setup(props){return()=>props.name&&registry[props.name]
    ?h('path',{d:registry[props.name],fill:'none',stroke:'inherit','stroke-width':1.75,'stroke-linecap':'round','stroke-linejoin':'round'})
    :h(Fragment,null,(props.source||[]).map(renderSource));}};
  function icon(name,attrs){return h('svg',Object.assign({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','aria-hidden':'true',class:'akb-ui-icon'},attrs),[h(Icon,{name})]);}
  function snapshot(el){return {tag:el.localName,attrs:Object.fromEntries(Array.from(el.attributes).map(a=>[a.name,a.value])),children:Array.from(el.childNodes).map(n=>n.nodeType===1?snapshot(n):n.nodeType===3?n.nodeValue:null).filter(n=>n!==null)};}
  function renderSource(node){return typeof node==='string'?node:h(node.tag,node.attrs,node.children.map(renderSource));}
  function messageOptions(message,options){return Object.assign({},typeof message==='object'&&message!==null?message:{message:String(message==null?'':message)},options||{});}
  function request(kind,message,options){const o=messageOptions(message,options);return new Promise(resolve=>{
    const selection=kind==='prompt'&&document.getSelection&&document.getSelection();
    const range=selection&&selection.rangeCount?selection.getRangeAt(0).cloneRange():null;
    let settled=false;const item=markRaw({id:++sequence,kind,options:o,value:o.value==null?'':String(o.value),finish(value){if(settled)return;settled=true;const at=state.queue.indexOf(item);if(at<0)return;state.queue.splice(at,1);if(range&&range.commonAncestorContainer.isConnected){nextTick(()=>{const current=document.getSelection();current.removeAllRanges();current.addRange(range);resolve(value);});}else resolve(value);}});
    state.queue.push(item);
  });}
  const API={
    version:'3.5.22',components:{Icon},
    toast(message,duration,options){const o=options||{};clearTimeout(toastTimer);state.toast={id:++sequence,message:String(message==null?'':message),icon:o.icon||'info'};toastTimer=setTimeout(()=>{state.toast=null;},Number(duration)>0?Number(duration):Math.min(6500,Math.max(2600,String(message||'').length*95)));},
    confirm(message,options){return request('confirm',message,options);},
    prompt(message,value,options){return request('prompt',message,Object.assign({value:value==null?'':value},options));},
    alert(message,options){return request('alert',message,options);},
    modal:{open(id){const el=typeof id==='string'?document.getElementById(id):id;if(!el)return false;
      el.classList.add('show');if(getComputedStyle(el).display==='none'){el.style.display='flex';el.dataset.akbInlineOpen='true';}scan();return true;},
      close(id){const el=typeof id==='string'?document.getElementById(id):id;if(el)closeLegacy(el);}},
    refresh(){scan();},
    destroy(){
      started=false;if(observer)observer.disconnect();clearTimeout(toastTimer);
      document.removeEventListener('keydown',keyHandler,true);
      for(const item of state.queue.slice())item.finish(item.kind==='confirm'?false:null);
      if(rootApp)rootApp.unmount();
      for(const app of mountedIcons.values())app.unmount();mountedIcons.clear();
      legacyRecords.clear();state.legacy.splice(0);state.toast=null;
      while(focusStack.length)deactivate(focusStack[focusStack.length-1]);
      const root=document.getElementById('akb-vue-ui');if(root)root.remove();
    },
    get diagnostics(){return {vue:global.Vue.version,icons:mountedIcons.size,dialogs:legacyRecords.size};}
  };
  global.AKBUI=API;
  global.showToast=function(message,duration){return API.toast(message,duration);};
  global.showConfirm=function(message,options){return API.confirm(message,options);};

  function visible(el){if(!el.isConnected||el.hidden)return false;const css=getComputedStyle(el);return css.display!=='none'&&css.visibility!=='hidden'&&css.pointerEvents!=='none'&&(css.opacity!=='0'||/\b(show|open|active|visible)\b/.test(el.className));}
  function candidates(panel){return Array.from(panel.querySelectorAll(focusable)).filter(el=>!el.hidden&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden');}
  function activate(record){if(focusStack.includes(record)||!record.panel)return;record.previous=document.activeElement;
    if(!focusStack.length){oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
    focusStack.push(record);record.panel.setAttribute('tabindex',record.panel.getAttribute('tabindex')||'-1');
    const target=record.panel.querySelector('[autofocus]')||candidates(record.panel)[0]||record.panel;
    target.focus({preventScroll:true});
  }
  function deactivate(record){const at=focusStack.indexOf(record);if(at<0)return;const wasTop=at===focusStack.length-1;focusStack.splice(at,1);
    if(!focusStack.length)document.body.style.overflow=oldOverflow;
    if(wasTop){const top=focusStack[focusStack.length-1];const target=top?(top.panel.contains(record.previous)?record.previous:top.panel):record.previous;
      if(target&&target.isConnected&&typeof target.focus==='function')target.focus({preventScroll:true});}
  }
  function keyHandler(event){const top=focusStack[focusStack.length-1];if(!top)return;
    if(event.key==='Escape'&&!event.isComposing){event.preventDefault();event.stopImmediatePropagation();top.close();return;}
    if(event.key!=='Tab')return;const list=candidates(top.panel);if(!list.length){event.preventDefault();top.panel.focus();return;}
    const first=list[0],last=list[list.length-1];
    if(event.shiftKey&&(document.activeElement===first||!top.panel.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||!top.panel.contains(document.activeElement))){event.preventDefault();first.focus();}
  }
  function closeLegacy(el){
    const usesClass=/\b(show|open|active|visible)\b/.test(el.className);
    const buttons=el.querySelectorAll('button,[role="button"],[onclick]');
    const close=Array.from(buttons).find(node=>/(close|cancel|关闭|取消)/i.test((node.className||'')+' '+(node.getAttribute('aria-label')||'')+' '+(node.getAttribute('onclick')||''))&&!/confirm|submit/i.test(node.getAttribute('onclick')||''));
    if(close){close.click();}else{el.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
    // Give original close handlers first refusal; never invoke a submit/confirm action.
    if(visible(el)){el.classList.remove('show','open','visible','active');if(!usesClass&&visible(el))el.style.display='none';}
    if(el.dataset.akbInlineOpen){el.style.display='none';delete el.dataset.akbInlineOpen;}
    const record=legacyRecords.get(el);if(record)record.open=visible(el);
  }
  const LegacyDialog={name:'AkbLegacyDialogBridge',props:['entry'],setup(props){
    const e=props.entry,focusRecord={panel:e.panel,close:()=>closeLegacy(e.el)};
    watch(()=>e.open,open=>{e.panel.setAttribute('aria-hidden',open?'false':'true');if(open)activate(focusRecord);else deactivate(focusRecord);},{immediate:true,flush:'post'});
    onUnmounted(()=>deactivate(focusRecord));return()=>null;
  }};
  const Dialog={name:'AkbDialog',props:['item'],setup(props){
    const value=ref(props.item.value),panel=ref(null);let focusRecord;
    nextTick(()=>{if(!panel.value)return;focusRecord={panel:panel.value,close:cancel};activate(focusRecord);});
    onUnmounted(()=>{if(focusRecord)deactivate(focusRecord);});
    function cancel(){props.item.finish(props.item.kind==='confirm'?false:null);}
    function accept(){props.item.finish(props.item.kind==='prompt'?value.value:true);}
    return()=>{const item=props.item,o=item.options,id='akb-dialog-title-'+item.id,msgId='akb-dialog-message-'+item.id;
      return h('div',{class:'akb-ui-layer akb-dialog-backdrop',onClick:event=>{if(event.target===event.currentTarget&&o.cancelOnBackdrop!==false)cancel();}},[
        h('section',{ref:panel,class:'akb-dialog',role:'dialog','aria-modal':'true','aria-labelledby':id,'aria-describedby':msgId,tabindex:-1},[
          h('h2',{class:'akb-dialog-heading',id},[icon(o.danger?'warning':'info'),o.title||(item.kind==='confirm'?'请确认操作':item.kind==='prompt'?'填写信息':'温馨提示')]),
          h('div',{class:'akb-dialog-message',id:msgId},o.message||''),
          item.kind==='prompt'?h('input',{class:'akb-dialog-input',value:value.value,'aria-label':o.inputLabel||o.message||'请输入',placeholder:o.placeholder||'',autofocus:true,onInput:event=>{value.value=event.target.value;},onKeydown:event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();accept();}}}):null,
          h('div',{class:'akb-dialog-actions'},[
            item.kind!=='alert'?h('button',{type:'button',class:'akb-ui-button','data-act':'cancel',onClick:cancel},o.cancelText||'取消'):null,
            h('button',{type:'button',class:['akb-ui-button',o.danger?'danger':'primary'],'data-act':'ok',onClick:accept},o.okText||(item.kind==='alert'?'知道了':'确认'))])])]);};
  }};

  function identify(svg){
    if(svg.dataset.icon&&registry[svg.dataset.icon])return svg.dataset.icon;
    const nav=svg.closest('.nav-item,.nav-link,.sb-link,.link');
    if(nav){const href=nav.getAttribute('href')||'';const routes=[['home.html','home'],['visit-services','service'],['cart.html','bag'],['messages','message'],['profile','user'],['orders','service'],['mall','bag'],['hospital','hospital']];for(const [route,name]of routes)if(href.includes(route))return name;}
    const parent=svg.closest('button,[role="button"],a,.cat-item,.city-pill,.top-search,.back-btn,.menu-ico,.notif-btn,.hero-top-actions,.banner-arrow,.ai-fab')||svg.parentElement;
    if(!parent)return null;
    const hint=(parent.className||'')+' '+(parent.getAttribute('aria-label')||'')+' '+(parent.getAttribute('title')||'');
    const matches=[[/back|返回/,'left'],[/close|关闭/,'close'],[/search|搜索/,'search'],[/city|location|定位/,'location'],[/notif|bell|通知/,'bell'],[/phone|call|电话/,'phone'],[/upload|上传/,'upload'],[/trash|delete|删除/,'trash'],[/setting|设置/,'settings'],[/send-btn|发送/,'send'],[/ai-fab/,'message']];
    for(const [pattern,name]of matches)if(pattern.test(hint))return name;
    if(parent.matches('.cat-item')){const text=parent.textContent;return text.includes('住院')?'hospital':text.includes('居家')?'home':text.includes('助浴')?'bath':'service';}
    return null;
  }
  function enhanceIcon(svg){
    if(mountedIcons.has(svg)||svg.closest('.akb-ui-layer,.akb-vue-glyph,.akb-upload,.status-bar,.svc-tile-img,.svc-img,.banner-illu,.product-art,.detail-art,.chart,.sparkline,.chart-wrap,[data-keep-svg]')||svg.querySelector('text,foreignObject,animate'))return;
    // Preserve charts, illustrations and their business-driven geometry.
    const box=(svg.getAttribute('viewBox')||'').split(/[ ,]+/).map(Number);if(box.length===4&&(box[2]>64||box[3]>64))return;
    const source=Array.from(svg.children).map(snapshot),name=identify(svg);
    if(name){const original=svg.querySelector('[stroke]:not([stroke="none"])');const color=svg.getAttribute('stroke')||(original&&original.getAttribute('stroke'))||'currentColor';svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke',color);}
    svg.classList.add('akb-ui-icon');if(!svg.hasAttribute('aria-label'))svg.setAttribute('aria-hidden','true');
    svg.setAttribute('data-akb-vue-icon',name||'preserved');
    const app=createApp({name:'AkbIconIsland',render:()=>h(Icon,{name,source})});mountedIcons.set(svg,app);app.mount(svg);
  }
  const glyphs={'＋':'plus','+':'plus','−':'minus','－':'minus','-':'minus','×':'close','✕':'close','✖':'close','☎':'phone','📞':'phone','🔍':'search','✅':'success','⚠️':'warning','📍':'location'};
  function enhanceGlyph(el){if(el.querySelector('svg')||el.closest('.akb-ui-layer')||el.dataset.akbGlyph)return;
    const name=glyphs[el.textContent.trim()];if(!name)return;el.dataset.akbGlyph=name;
    if(el.tagName==='BUTTON'&&!el.hasAttribute('aria-label'))el.setAttribute('aria-label',({plus:el.className.includes('product-add')?'加入购物车':'增加',minus:'减少',close:'关闭',phone:'联系',search:'搜索'})[name]||'提示');
    const host=document.createElement('span');host.className='akb-vue-glyph';el.textContent='';el.appendChild(host);const app=createApp({render:()=>icon(name)});app.mount(host);mounts.set(host,app);
  }
  const modalSelector='.overlay,.modal-mask,.modal-overlay,.patient-modal-mask,.picker-mask,.import-mask,.lightbox,.rf-mask,.city-overlay,.book-overlay,.photo-overlay,.cfm-mask,.sheet-mask,.pay-overlay,.fb-mask,.modal,[class*="-mask"],[class*="-overlay"],[class*="-lightbox"]';
  function scan(){if(!started)return;
    document.querySelectorAll('svg').forEach(enhanceIcon);
    document.querySelectorAll('button,.ico,.icon,.menu-ico,.shortcut-ico,.toast-icon').forEach(enhanceGlyph);
    document.querySelectorAll(modalSelector).forEach(el=>{
      if(el.closest('.akb-ui-layer')||el.parentElement.closest(modalSelector))return;
      let e=legacyRecords.get(el);
      const panel=el.matches('.modal')?(el.querySelector('.modal-content,.modal-box,.dialog,.sheet')||el):el.firstElementChild;
      if(!panel||/^(IMG|SVG|INPUT)$/.test(panel.tagName))return;
      if(e&&e.panel!==panel){const index=state.legacy.indexOf(e);if(index>=0)state.legacy.splice(index,1);legacyRecords.delete(el);e=null;}
      if(!e){
        panel.setAttribute('data-akb-dialog-panel','');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
        if(!panel.hasAttribute('aria-label')&&!panel.hasAttribute('aria-labelledby')){const title=panel.querySelector('h1,h2,h3,[class$="title"]');panel.setAttribute('aria-label',title?title.textContent.trim():'弹窗');}
        if(panel!==el)el.classList.add('akb-ui-legacy');e=reactive({id:++sequence,el:markRaw(el),panel:markRaw(panel),open:visible(el)});legacyRecords.set(el,e);state.legacy.push(e);
      }else e.open=visible(el);
    });
    for(const [el,e]of legacyRecords)if(!el.isConnected){legacyRecords.delete(el);const index=state.legacy.indexOf(e);if(index>=0)state.legacy.splice(index,1);}
    for(const [svg,app]of mountedIcons)if(!svg.isConnected){app.unmount();mountedIcons.delete(svg);}
  }
  function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;scan();});}
  function start(){if(started)return;started=true;const root=document.createElement('div');root.id='akb-vue-ui';document.body.appendChild(root);
    rootApp=createApp({name:'AkbUiRoot',render(){return h(Fragment,null,[
      ...state.legacy.map(entry=>h(LegacyDialog,{key:entry.id,entry})),
      h(Teleport,{to:'body'},[
        h(Transition,{name:'akb-fade'},()=>state.queue[0]?h(Dialog,{key:state.queue[0].id,item:state.queue[0]}):null),
        h(Transition,{name:'akb-fade'},()=>state.toast?h('div',{key:state.toast.id,class:'akb-ui-layer akb-ui-toast',role:'status','aria-live':'polite'},[icon(state.toast.icon),h('span',null,state.toast.message)]):null)])]);}});rootApp.mount(root);
    document.addEventListener('keydown',keyHandler,true);
    observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
    scan();
  }

  function mountComponent(target,component){const el=typeof target==='string'?document.querySelector(target):target;if(!el)return null;const previous=mounts.get(el);if(previous)previous.unmount();const app=createApp(component);app.mount(el);mounts.set(el,app);return el;}
  global.AKBContact={render(target,opts){const o=opts||{},showName=o.showName!==false,nameId=o.nameId||'contactName',phoneId=o.phoneId||'contactPhone';
    const el=mountComponent(target,{name:'AkbContact',render(){function field(id,label,placeholder,type){return h('div',{class:'akb-contact-item'},[
      h('label',{class:'akb-contact-label',id:id+'Label',for:id},label),h('input',{class:'akb-contact-input',id,type,maxlength:type==='tel'?11:20,inputmode:type==='tel'?'numeric':undefined,autocomplete:type==='tel'?'tel':'name',placeholder})]);}
      return h(Fragment,null,[showName?field(nameId,o.nameLabel||'联系人姓名',o.namePlaceholder||'请填写联系人姓名','text'):null,field(phoneId,o.phoneLabel||'联系电话',o.phonePlaceholder||'请填写11位手机号','tel')]);}});
    if(el){el.classList.add('akb-contact');el.classList.toggle('single',!showName);}return el;
  }};
  global.AKBImageUpload={render(target,opts){const o=opts||{},photos=ref([]);const max=o.max||3;let file;
    const el=mountComponent(target,{name:'AkbImageUpload',setup(){function add(event){const input=event.target,f=input.files&&input.files[0];if(!f||photos.value.length>=max)return;
      const done=src=>{if(photos.value.length<max)photos.value.push(src);};if(global.akbFitImage)global.akbFitImage(f,done);else{const reader=new FileReader();reader.onload=()=>done(reader.result);reader.readAsDataURL(f);}input.value='';}
      return()=>h(Fragment,null,[...photos.value.map((src,i)=>h('img',{key:src+'-'+i,class:'akb-upload-thumb',src,alt:'已上传图片 '+(i+1),title:'点击移除',tabindex:0,role:'button','aria-label':'移除图片 '+(i+1),onClick:()=>photos.value.splice(i,1),onKeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();photos.value.splice(i,1);}}})),
        photos.value.length<max?h('button',{type:'button',class:'akb-upload-btn',onClick:()=>file.click()},[icon('plus'),o.label||'添加图片']):null,
        h('input',{ref:node=>{file=node;},type:'file',accept:'image/*',style:{display:'none'},onChange:add})]);}});
    if(el)el.classList.add('akb-upload');return {get:()=>photos.value.slice()};
  }};
  global.addEventListener('pagehide',event=>{if(!event.persisted)API.destroy();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window);
