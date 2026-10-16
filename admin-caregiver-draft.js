(function(){
  function readDraft(){try{return JSON.parse(sessionStorage.getItem('akbCaregiverDraft')||'null')}catch(error){return null}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function syncDraft(){
    var draft=readDraft(),id=new URLSearchParams(location.search).get('id');
    if(!draft||draft.id!==id)return;
    var identity=document.querySelector('.identity');if(!identity)return;
    var avatar=identity.querySelector('.avatar'),name=identity.querySelector('.name'),number=identity.querySelector('.id'),state=identity.querySelector('.state'),title=document.querySelector('.content-title'),sub=document.querySelector('.content-sub');
    if(avatar)avatar.textContent=draft.name.slice(0,1);if(name)name.textContent=draft.name;if(number)number.textContent='档案编号 · '+draft.id;if(title)title.textContent=draft.name+'的陪护员档案';if(sub)sub.textContent='新建档案 · 等待资质材料审核与服务信息完善';
    if(state){var labels={on:'在岗',leave:'休息',off:'停用'};state.textContent=labels[draft.state]||'在岗';state.style.background=draft.state==='on'?'#DCFCE7':draft.state==='leave'?'#FEF3C7':'#FEE2E2';state.style.color=draft.state==='on'?'#16A34A':draft.state==='leave'?'#D97706':'#DC2626';}
    var list=identity.querySelector('.side-list');if(list){var etLabel=({self:'自营',personal:'个人',enterprise:'企业','full-time':'自营','part-time':'企业'})[draft.employmentType]||'自营';list.innerHTML='<div class="side-row"><span>手机号</span><span>'+draft.phone+'</span></div><div class="side-row"><span>人员类型</span><span>'+etLabel+'</span></div>'+(draft.companyName?'<div class="side-row"><span>入驻企业</span><span>'+draft.companyName+'</span></div>':'')+'<div class="side-row"><span>认证状态</span><span>'+draft.certification+'</span></div><div class="side-row"><span>工龄</span><span>'+draft.workYears+'</span></div><div class="side-row"><span>服务区域</span><span>'+draft.area+'</span></div><div class="side-row"><span>服务评分</span><span>暂无评价</span></div><div class="side-row"><span>累计服务</span><span>0 单</span></div>';}
    var basePanel=document.getElementById('base');if(basePanel){var etLabel=({self:'自营',personal:'个人',enterprise:'企业','full-time':'自营','part-time':'企业'})[draft.employmentType]||'自营';basePanel.innerHTML='<div class="section-title">人员基本信息</div><div class="grid"><div class="kv"><div class="k">姓名</div><div class="v">'+draft.name+'</div></div><div class="kv"><div class="k">性别</div><div class="v">'+draft.gender+'</div></div><div class="kv"><div class="k">人员类型</div><div class="v">'+etLabel+'</div></div><div class="kv"><div class="k">身份证号</div><div class="v">'+(draft.idNo?draft.idNo.replace(/^(.{6}).+(.{4})$/,'$1**********$2'):'未填写')+'</div></div><div class="kv"><div class="k">年龄</div><div class="v">'+draft.age+' 岁</div></div><div class="kv"><div class="k">入驻企业单位</div><div class="v">'+(draft.companyName||'—')+'</div></div><div class="kv"><div class="k">服务区域</div><div class="v">'+draft.area+'</div></div><div class="kv"><div class="k">在岗状态</div><div class="v">'+({on:'正常在岗',leave:'休息中',off:'已停用'}[draft.state]||'正常在岗')+'</div></div><div class="kv"><div class="k">工龄</div><div class="v">'+draft.workYears+'</div></div></div>';}
    var skillPanel=document.getElementById('skill');if(skillPanel)skillPanel.innerHTML='<div class="section-title">服务技能</div><div class="grid">'+draft.skills.map(function(skill){return '<div class="kv"><div class="k">'+skill+'</div><div class="v">待服务认证</div></div>';}).join('')+'</div>';
    var certPanel=document.getElementById('cert');
    if(certPanel){
      if(draft.certs&&draft.certs.length){
        certPanel.innerHTML='<div class="section-title">资质证书</div><table class="table"><tr><th>证书名称</th><th>证书图片/文件</th><th>审核状态</th></tr>'+draft.certs.map(function(c){
          var parts=[];
          if(c.image)parts.push('<span class="cert-att img" title="'+esc(c.imageName||'证书图片')+'">图</span><span class="cert-att-name">'+esc(c.imageName||'证书图片')+'</span>');
          if(c.fileName)parts.push('<span class="cert-att file" title="'+esc(c.fileName)+'">文</span><span class="cert-att-name">'+esc(c.fileName)+'</span>');
          if(!parts.length)parts.push('<span class="cert-att-name">未上传</span>');
          var nameCell=esc(c.type)+((c.type==='护士证'&&c.certNo)?'<div class="cert-no-sub">编号：'+esc(c.certNo)+'</div>':'');
          return '<tr><td>'+nameCell+'</td><td>'+parts.join(' ')+'</td><td><span class="tag">待审核</span></td></tr>';
        }).join('')+'</table>';
      }else{
        certPanel.innerHTML='<div class="section-title">资质证书</div><div class="empty">当前认证状态：'+esc(draft.certification)+'。请补充护理相关资质证书后提交审核。</div>';
      }
    }
    var orderPanel=document.getElementById('orders');if(orderPanel)orderPanel.innerHTML='<div class="section-title">订单记录</div><div class="empty">新建档案暂无服务订单</div>';
  }
  document.addEventListener('DOMContentLoaded',function(){window.setTimeout(syncDraft,0)});
})();
