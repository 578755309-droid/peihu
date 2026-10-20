/* DOM regression smoke; optionally compare against an unchanged checkout. No network requests. */
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),baseline=process.argv[2];
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
for(const file of files){const html=fs.readFileSync(path.join(root,file),'utf8');
 for(const src of ['vendor/vue.global.prod.js','ui/icons.js','ui/vue-ui.js','common-ui.js'])assert.equal((html.match(new RegExp('src="'+src.replaceAll('.','\\.')+'"','g'))||[]).length,1,file+': '+src);
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/src\s*=|application\/json/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2],{filename:file});}
}
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
class LocalLoader extends ResourceLoader{constructor(dir){super();this.dir=dir;}fetch(url){const u=new URL(url);if(u.host!=='peihu.test')return Promise.resolve(Buffer.from(''));const file=path.join(this.dir,decodeURIComponent(u.pathname));return Promise.resolve(fs.existsSync(file)&&fs.statSync(file).isFile()?fs.readFileSync(file):Buffer.from(''));}}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function open(dir,file){let errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type==='unhandled exception')errors.push(e.detail?.message||e.message);});vc.on('error',(...args)=>errors.push(args.map(String).join(' ')));
 const dom=new JSDOM(fs.readFileSync(path.join(dir,file),'utf8'),{url:'https://peihu.test/'+file,runScripts:'dangerously',resources:new LocalLoader(dir),pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.document.execCommand=()=>true;}});
 await new Promise(resolve=>{const timer=setTimeout(resolve,3000);dom.window.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});});await pause(80);
 const diagnostics=dom.window.AKBUI?.diagnostics;if(dom.window.AKBUI){dom.window.AKBUI.destroy();await pause(20);}dom.window.close();return {errors:[...new Set(errors)],diagnostics};}
(async()=>{const core=['home.html','visit-services.html','mall.html','cart.html','profile.html','hospital-care.html','orders.html','order-detail.html','nurse-home.html','nurse-profile.html','nurse-certification.html','admin.html','admin-orders.html','admin-bookings.html','admin-mall-products.html','admin-service-categories.html','admin-order-detail.html'];
 const failures=[];for(const file of core){const before=baseline?await open(path.resolve(baseline),file):{errors:[]};const after=await open(root,file);const added=after.errors.filter(e=>!before.errors.includes(e));if(added.length)failures.push({file,added});if(!after.diagnostics)failures.push({file,added:['Vue layer did not mount']});console.log(file,': icons',after.diagnostics?.icons,'dialogs',after.diagnostics?.dialogs,'new errors',added.length);}
 assert.deepEqual(failures,[]);console.log('PASS:',files.length,'page bootstrap and syntax checks;',core.length,'DOM regression pages. External CDN scripts are intentionally excluded from this test.');
})().catch(e=>{console.error(e);process.exit(1)});
