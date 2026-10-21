/* Compatibility API. Vue components live in ui/vue-ui.js; business callers retain their existing contracts. */
(function () {
  'use strict';
  /* 上传图片预处理：等比压缩到页面宽度（默认750px），返回 dataURL；PNG 保留透明底，其余转 JPEG */
  window.akbFitImage = window.akbFitImage || function (file, cb, maxW) {
    var limit = maxW || 750;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        if (img.width <= limit) { cb(reader.result); return; }
        var h = Math.round(img.height * limit / img.width);
        var canvas = document.createElement('canvas');
        canvas.width = limit; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, limit, h);
        var isPng = file.type === 'image/png';
        cb(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.85));
      };
      img.onerror = function () { cb(reader.result); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  var toastAlert=function(message){return window.AKBUI.toast(message);};
  try{Object.defineProperty(window,'alert',{configurable:true,get:function(){return toastAlert;},set:function(){}});}
  catch(error){window.alert=toastAlert;}
})();

/* Shared remark fields: opt-in class/data attribute or a semantic remark label. */
(function(w){
  'use strict';
  var LIMIT=200;
  function isRemark(el){
    if(el.matches('.akb-remark,[data-remark]'))return true;
    var label=el.id&&Array.from(document.querySelectorAll('label[for]')).find(function(label){return label.htmlFor===el.id;});
    var parentLabel=el.parentElement&&el.parentElement.querySelector('label');
    var hint=[el.id,el.name,el.placeholder,label&&label.textContent,parentLabel&&parentLabel.textContent].filter(Boolean).join(' ');
    return /备注|其他诉求|其他需求|补充说明|(?:^|[\s_-])(?:remark|memo|note)(?:$|[\s_-])|(?:Remark|Note)$|otherNeeds/i.test(hint);
  }
  function enhance(el){
    if(el.dataset.remarkReady||!isRemark(el))return;
    el.dataset.remarkReady='true';el.classList.add('akb-remark');el.maxLength=LIMIT;
    var count=document.createElement('div');count.className='akb-remark-count';
    count.id='remark-count-'+(++serial);el.insertAdjacentElement('afterend',count);
    el.setAttribute('aria-describedby',((el.getAttribute('aria-describedby')||'')+' '+count.id).trim());
    function sync(){count.textContent=el.value.length+' / '+LIMIT;count.classList.toggle('at-limit',el.value.length>=LIMIT);}
    function input(e){if(e&&e.isComposing)return;if(el.value.length>LIMIT)el.value=el.value.slice(0,LIMIT);sync();}
    el.addEventListener('focus',sync);el.addEventListener('input',input);el.addEventListener('change',input);el.addEventListener('compositionend',input);
    el.form&&el.form.addEventListener('reset',function(){setTimeout(sync,0);});sync();
  }
  var serial=0;
  function scan(root){if(root.nodeType!==1&&root!==document)return;if(root.matches&&root.matches('textarea'))enhance(root);root.querySelectorAll('textarea').forEach(enhance);}
  function boot(){scan(document);new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(scan);});}).observe(document.body,{childList:true,subtree:true});}
  w.AKBRemarkField={limit:LIMIT,enhance:enhance,scan:scan};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window);
