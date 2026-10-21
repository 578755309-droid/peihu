/* Vue 3 design components. Adapters retain existing routes, catalog and booking transaction. */
(function(w){
'use strict';
const V=w.Vue;if(!V)return;
const AssetIcon={props:{name:String},template:'<img class="care-asset-icon" :src="`assets/figma/service-${name}.svg`" width="48" height="48" alt="" aria-hidden="true">'};
const CategoryGrid={components:{AssetIcon},props:{items:Array},template:'<div class="cat-row care-categories"><a v-for="item in items" :key="item.key" class="cat-item" :href="item.href"><asset-icon :name="item.key"/><span class="cat-lbl">{{item.label}}</span></a></div>'};
const ServiceCard={props:{item:Object},template:'<a class="svc-tile service-card care-service-card" :href="item.href"><div class="svc-tile-img"><img :src="item.image" :alt="item.name" width="345" height="200"></div><div class="svc-tile-body"><div class="svc-tile-name">{{item.name}}</div><div class="svc-tile-sub">{{item.sub}}</div><div class="svc-tile-meta"><div class="svc-tile-price" v-html="item.price"></div><div class="svc-tile-sales" :data-cat="item.key">{{item.sales}}</div></div><div class="svc-tile-pts"><span class="pts-tag">积分立减30%</span><span class="pts-link">我的积分 30</span></div></div></a>'};
const BookingBanner={emits:['book'],template:'<button class="banner care-booking-banner" @click="$emit(\'book\')"><span class="banner-left"><span class="banner-title">专业照护，用心陪伴每一程</span><span class="banner-sub">陪诊 · 住院陪护 · 居家陪护 · 上门助浴</span></span><span class="care-banner-action">立即预约<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></span></button>'};
const BookingDialog={props:{open:Boolean},emits:['close','confirm'],data:()=>({busy:false}),watch:{open(v){if(v){this.busy=false;this.$nextTick(()=>this.$refs.confirm?.focus());}}},methods:{confirm(){if(this.busy)return;this.busy=true;this.$emit('confirm');},keys(e){if(e.key==='Escape')this.$emit('close');if(e.key==='Tab'){e.preventDefault();(document.activeElement===this.$refs.confirm?this.$refs.close:this.$refs.confirm).focus();}}},template:'<div v-if="open" class="care-booking-mask" @click.self="$emit(\'close\')" @keydown="keys"><section class="care-booking-dialog" role="dialog" aria-modal="true" aria-labelledby="careBookingTitle"><div class="care-booking-art"><img src="assets/figma/booking-person.png" width="250" height="214" alt=""></div><h2 id="careBookingTitle">确认一键预约？</h2><p>预约提交后，平台工作人员将在工作时间内致电联系您，为您安排合适的护理员及服务方案。</p><button ref="confirm" class="care-booking-confirm" :disabled="busy" @click="confirm">确认预约</button><button ref="close" class="care-booking-close" @click="$emit(\'close\')" aria-label="关闭预约弹窗"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="1.5"/></svg></button></section></div>'};
const DetailTabs={props:{modelValue:{type:String,default:'info'}},emits:['update:modelValue'],template:'<div class="dtabs care-detail-tabs" role="tablist" aria-label="服务详情"><button v-for="tab in [{key:\'info\',label:\'详情\'},{key:\'review\',label:\'评价\'}]" :key="tab.key" class="dtab" :class="{on:modelValue===tab.key}" role="tab" :aria-selected="modelValue===tab.key" :aria-controls="tab.key===\'info\'?\'svcTabInfo\':\'svcTabReview\'" :data-svctab="tab.key" @click="$emit(\'update:modelValue\',tab.key)">{{tab.label}}</button></div>'};
const FeaturePanels={template:'<div class="care-feature-panels"><img src="assets/figma/visit-before.png" alt="诊前协助服务说明" width="375" height="500" loading="lazy"><img src="assets/figma/visit-during.png" alt="院内全程陪同服务说明" width="375" height="500" loading="lazy"></div>'};
w.AKBCareComponents={AssetIcon,CategoryGrid,ServiceCard,BookingBanner,BookingDialog,DetailTabs,FeaturePanels};
function mount(){
if(document.body.dataset.page==='home'){
const keys=['visit','hospital','home','bath'];
const cat=document.querySelector('.cat-row');const items=[...cat.children].map((el,i)=>({key:keys[i],label:el.textContent.trim(),href:el.getAttribute('onclick').match(/'([^']+)'/)[1]}));V.createApp({components:{CategoryGrid},data:()=>({items}),template:'<category-grid :items="items"/>'}).mount(cat.parentNode.insertBefore(document.createElement('div'),cat));cat.remove();
const grid=document.querySelector('.svc-tile-grid');const cards=[...grid.children].map((el,i)=>({key:keys[i],href:el.getAttribute('onclick').match(/'([^']+)'/)[1],name:el.querySelector('.svc-tile-name').textContent,sub:el.querySelector('.svc-tile-sub').textContent,price:el.querySelector('.svc-tile-price').innerHTML,sales:el.querySelector('.svc-tile-sales').textContent,image:'assets/figma/'+keys[i]+'.png'}));V.createApp({components:{ServiceCard},data:()=>({cards}),template:'<service-card v-for="item in cards" :key="item.key" :item="item"/>'}).mount(grid);w.updateHomeSvcSales?.();
const banner=document.querySelector('.banner');V.createApp({components:{BookingBanner},template:'<booking-banner @book="book"/>',methods:{book(){w.showBookingConfirm();}}}).mount(banner.parentNode.insertBefore(document.createElement('div'),banner));banner.remove();
const host=document.createElement('div');document.body.appendChild(host);const state=V.reactive({open:false});let trigger;
function close(){state.open=false;trigger?.focus();}
V.createApp({components:{BookingDialog},setup:()=>({state,close,confirm(){close();w.confirmBooking();}}),template:'<booking-dialog :open="state.open" @close="close" @confirm="confirm"/>'}).mount(host);
w.showBookingConfirm=()=>{trigger=document.activeElement;state.open=true;};w.cancelBooking=close;
const city=document.querySelector('.city-pill');city.setAttribute('role','button');city.tabIndex=0;city.onclick=w.openCityPicker;city.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')w.openCityPicker();};city.querySelector('span').id='currentCity';
}
if(document.body.dataset.page==='hospital-care'){
const tabs=document.querySelector('.svc-tab-card .dtabs');const state=V.reactive({tab:'info'});V.createApp({components:{DetailTabs},setup:()=>({state,change(tab){state.tab=tab;w.switchSvcTab(document.querySelector('.care-detail-tabs [data-svctab="'+tab+'"]'));document.querySelectorAll('.care-detail-tabs .dtab').forEach(el=>el.classList.toggle('on',el.dataset.svctab===tab));}}),template:'<detail-tabs :model-value="state.tab" @update:model-value="change"/>'}).mount(tabs);
if(new URLSearchParams(location.search).get('service')==='visit'){
const hero=document.querySelector('#heroImg img');if(hero)hero.src='assets/figma/visit-hero.png';
const host=document.createElement('div');document.querySelector('#svcTabInfo').appendChild(host);V.createApp(FeaturePanels).mount(host);
}
}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(window);
