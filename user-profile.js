/* User-side profile draft; caregiver certification stays in its existing flow. */
(function(){'use strict';
function init(){
 const S=window.AKBYoukang, user=S?S.current():{id:'10001000',name:'章北海'};
 const key='ankebang-user-profile:'+user.id;
 let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
 const initial={nickname:saved.nickname||user.name,gender:saved.gender||'',birthday:saved.birthday||'',avatar:saved.avatar||''};
 if(document.body.dataset.page==='profile'){
  const name=document.querySelector('.hero-name'),avatar=document.querySelector('.avatar');
  if(name)name.textContent=initial.nickname;
  if(avatar){avatar.textContent=initial.nickname.slice(0,1);if(initial.avatar){const img=document.createElement('img');img.src=initial.avatar;img.alt='我的头像';img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:9px';avatar.replaceChildren(img);}}
  return;
 }
 if(document.body.dataset.page!=='user-profile')return;
 Vue.createApp({data(){return {form:{...initial},userId:user.id,today:new Date().toLocaleDateString('sv-SE'),status:'',busy:false};},methods:{
  upload(event){const file=event.target.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){this.status='请选择 JPG、PNG 或 WebP 图片';return;}if(file.size>5*1024*1024){this.status='请选择 5MB 以内的图片';return;}this.busy=true;window.akbFitImage(file,(data)=>{this.form.avatar=data;this.busy=false;this.status='头像已更新，点击保存后生效';},240);},
  save(){const nickname=this.form.nickname.trim();if(!nickname){this.status='请输入昵称';return;}if(nickname.length>20){this.status='昵称最多20个字';return;}if(this.form.birthday&&this.form.birthday>this.today){this.status='生日不能晚于今天';return;}try{localStorage.setItem(key,JSON.stringify({...this.form,nickname}));location.href='profile.html';}catch(e){this.status='保存失败，请更换较小的头像后重试';}},
  back(){location.href='profile.html';}
 }}).mount('#userProfile');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
