# Vue 公共交互层

项目继续使用原有多页面地址、存储键、订单与支付逻辑。Vue 3.5.22 以本地生产运行时接入，不依赖运行时 CDN，不要求重建整个业务项目。

## 文件与组件

- `vendor/vue.global.prod.js`：固定版本 Vue 运行时，许可证见同目录。
- `ui/icons.js`：24px 原创图标定义，圆角、1.75px 线宽；参考电商 UI 的简洁风格，不包含京东商标。
- `ui/vue-ui.js`：`AkbIcon`、`AkbDialog`、`AkbLegacyDialogBridge`、`AkbContact`、`AkbImageUpload`。
- `ui/vue-ui.css`：12px 圆角、品牌色、按钮、提示、弹窗遮罩及过渡。
- `common-ui.js`：保留图片压缩接口和原有 alert 兼容入口。

所有页面按 Vue → 图标定义 → Vue UI → 兼容接口的顺序加载。页面原有业务脚本仍在原位执行。

## 兼容接口

```js
showToast('保存成功');
showConfirm({ title: '确认删除', message: '确认删除这条记录？', danger: true })
  .then(ok => { if (ok) deleteRecord(); });
const value = await AKBUI.prompt('请输入图片链接', 'https://'); // 取消返回 null
AKBUI.modal.open('existingOverlayId');
AKBUI.modal.close('existingOverlayId');
AKBContact.render('#contact', { nameId: 'contactName', phoneId: 'contactPhone' });
const upload = AKBImageUpload.render('#photos', { max: 3 });
upload.get(); // 已选图片 dataURL 数组
```

`AKBUI.confirm` 返回 `Promise<boolean>`；取消、遮罩及 Escape 不会触发确认回调。多个确认请求依次显示，按钮重复点击不会重复完成 Promise。输入框内容以文本渲染，输入弹窗结束后恢复富文本选区。

已有业务弹层通过 Vue 桥接组件管理打开状态、焦点、键盘和滚动锁。其表单节点、ID、提交函数保持原样；关闭时优先调用原有取消/关闭按钮，不调用提交按钮。此接入方式不是整站 SPA 重写。

公共图标自动覆盖静态及动态插入的操作 SVG、导航 SVG 和简单图标字符。常见图标使用新图标定义；专有图标由 Vue 保留原形状。状态栏、图表与业务插图保持原样；可用 `data-keep-svg` 明确排除图表。用 `data-icon="search"` 可指定图标。

颜色继承现有主题：青绿色主色、`--color-commerce` 商品价格与积分红色。不要将业务状态颜色统一替换为品牌色。

## 验证

```sh
npm ci
npm test
npm run test:pages -- /path/to/unchanged-checkout
```

DOM 验证覆盖确认取消、排队、输入、重复开关、焦点恢复、上传数量限制及关键页面初始化。页面对照测试禁用第三方 CDN；不替代真实浏览器、支付接口或业务端到端验收。


### 知情同意书与电子签停用

`consent-data.js` 将四类同意书接入协议管理现有的 `akb_agreements_v1` 浏览器本地数据。`consent.js` 提供 Vue 显式勾选、纯文本正文查看、内容变更重新确认和下架拦截。每次结算重新勾选，订单的 `consent` 字段保存文档标识、正文、版本、更新时间与确认时间；次卡按次预约保存到预约条目。此记录为前端业务确认记录，不是可信电子签名或服务端审计凭证。现有项目尚无协议和同意记录的服务端存储，跨设备同步与不可篡改留存需接入后端。

电子签合同三端入口和签署页面已停用；共享合同 API 的发起、签署和模板保存方法不再写入，原本地历史数据不删除。知情同意书正文为可编辑初始文案，实际业务文案通过协议管理维护。

验证：`node tests/consent.test.cjs`。


### 分类型订单评价

`review-store.js` 统一完成状态校验、重复提交拦截、五项评分取平均（保留一位小数）和 `akb_service_ratings_v2` 存储。分类为 care（住院/居家陪护）、visit（陪诊及就医协助）、bath（助浴）、mall（商品）。维度、标签、输入提示及成功文案由同一 profile 定义，记录保留维度名称快照；旧评价保留原分数与维度，不做推算或改写。`review-order-seeds.js` 仅提供已有示例订单的回退查询，实际本地订单优先。

商城已完成列表/详情、服务已完成列表/详情共用 `service-review.html`。文字必填且最多200字，图片最多6张，标签选填。后台评论详情读取该次评价保存的维度名称，体验监测按商城/服务区分真实评价来源。删除标记阻止重复提交，隐藏/回复等现有管理行为保留。评价仍为浏览器本地数据；跨设备同步和服务端幂等约束需要接口支持。

验证：`node tests/reviews.test.cjs`。


### 护理员认证状态

`nurse-certification-state.js` 以现有 `akbNurseApplications` 为准，无申请时显示未认证，访问页面不生成申请。首次审核期间不允许接单；已通过的认证在资料更新审核期间继续有效（`hasApprovedCertification`），后台驳回更新时仍保留原档案。个人中心、首页和认证页通过 storage/focus 事件读取最新结果。上传材料的重新渲染保留正在填写的表单及证书；待审核不重复提交，后台仅处理审核中申请。

审核通过档案同时保存在现有 sessionStorage 和 localStorage，重开页面及更新审核保留原 caregiverId，不重复建档。旧认证记录不清除。证件附件沿用现有图片/文件信息方式，不增加新的必传证件政策；5MB文件大小、身份证日期与现有18–70岁范围、0–50年工龄和企业名称进行校验。本地流程未接入真实账号认证、服务端材料存储或跨设备审核通知。

验证：`node tests/certification.test.cjs`，覆盖首次申请、上传保留输入、审核中、驳回重提、通过、重新审核与持久化档案。
