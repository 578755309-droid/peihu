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
