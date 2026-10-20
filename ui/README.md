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
