(function (window) {
  window.AKBAdminOverviewData = {
    orders: [
      { no: 'AKB-20260416-003', orderedAt: '04/16 09:12:45', type: '陪诊服务', item: '贵宾陪诊 · 1次', user: '王女士', userPhone: '138****2468', nurse: '待分配', nursePhone: '—', time: '04/17 09时', amount: '¥298', state: '支付中', pay: { method: '微信支付' } },
      { no: 'AKB-20260416-004', orderedAt: '04/16 08:05:12', type: '上门助浴', item: '助浴 · 1次', user: '王女士', userPhone: '138****2468', nurse: '待分配', nursePhone: '—', time: '04/16 14时', amount: '¥168', state: '已支付', pay: { method: '微信支付', deduct: '¥0', actual: '¥168', received: '¥168', at: '04/16 08:06:38' } },
      { no: 'AKB-20260412-001', orderedAt: '04/11 16:24:36', type: '住院陪护', item: '12小时/天 · 3天', user: '王女士', userPhone: '138****2468', nurse: '张阿姨', nursePhone: '138****2468', time: '04/12 08时 - 04/14 20时', amount: '¥1,080', state: '服务中', pay: { method: '微信支付', deduct: '¥30', actual: '¥1,050', received: '¥1,050', at: '04/11 16:26:10' } },
      { no: 'AKB-20260412-002', orderedAt: '04/11 14:08:19', type: '居家陪护', item: '24小时/天 · 2天', user: '李先生', userPhone: '139****8572', nurse: '待分配', nursePhone: '—', time: '04/13 08时 - 04/15 08时', amount: '¥1,040', state: '待服务', pay: { method: '微信支付', deduct: '¥0', actual: '¥1,040', received: '¥1,040', at: '04/11 14:10:33' } },
      { no: 'AKB-20260415-005', orderedAt: '04/15 10:22:15', type: '上门助浴', item: '助浴 · 1次', user: '刘先生', userPhone: '133****6420', nurse: '待分配', nursePhone: '—', time: '04/15 14时', amount: '¥168', state: '待服务', pay: { method: '微信支付', deduct: '¥0', actual: '¥168', received: '¥168', at: '04/15 10:24:05' } },
      { no: 'AKB-20260411-018', orderedAt: '04/10 19:36:42', type: '陪诊服务', item: '贵宾陪诊 · 1次', user: '赵阿姨', userPhone: '186****3016', nurse: '李师傅', nursePhone: '139****8572', time: '04/11 09时', amount: '¥298', state: '已完成', pay: { method: '微信支付', deduct: '¥28', actual: '¥270', received: '¥270', at: '04/10 19:38:05' } },
      { no: 'AKB-20260410-007', orderedAt: '04/09 11:22:08', type: '上门助浴', item: '助浴 · 1次', user: '陈先生', userPhone: '133****6420', nurse: '王阿姨', nursePhone: '186****3016', time: '04/10 14时', amount: '¥168', state: '退款/售后', pay: { method: '微信支付', deduct: '¥0', actual: '¥168', received: '¥168', at: '04/09 11:24:41' },
        refundApp: {
          reason: '服务内容不符合预期',
          amount: '168',
          description: '助浴人员到场后比约定时间晚到 40 分钟，且中途离开约半小时，未按服务标准完成全程陪护，申请全额退款。',
          photos: [
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photo%20of%20home%20bathroom%20shower%20chair%20and%20safety%20handrail%2C%20natural%20light%2C%20phone%20snapshot&image_size=landscape_4_3',
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close-up%20photo%20of%20a%20paper%20service%20receipt%20on%20a%20wooden%20table%2C%20warm%20indoor%20light&image_size=landscape_4_3'
          ],
          appliedAt: '04/10 16:38'
        } },
      { no: 'AKB-20260415-006', orderedAt: '04/15 16:30:22', type: '上门助浴', item: '上门助浴服务 · 10次套餐', user: '张爷爷', userPhone: '138****2468', nurse: '陈护理师', nursePhone: '138****2468', time: '共10次 · 首次 04/16 09时', amount: '¥3,992', state: '待服务', pay: { method: '微信支付', deduct: '¥0', actual: '¥3,992', received: '¥3,992', at: '04/15 16:32:10' },
        sessions: [
          { seq: 1, date: '04/16', time: '09:00-11:00', addressDetail: '西安市雁塔区雁南一路 88号 2单元 1602', contact: '张爷爷', phone: '138****2468' },
          { seq: 2, date: '04/18', time: '09:00-11:00', addressDetail: '西安市雁塔区雁南一路 88号 2单元 1602', contact: '张爷爷', phone: '138****2468' },
          { seq: 3, date: '04/20', time: '14:00-16:00', addressDetail: '西安市雁塔区雁南一路 88号 2单元 1602', contact: '张爷爷', phone: '138****2468' }
        ] },
      { no: 'AKB-2026-660033', orderedAt: '10/15 10:22:36', type: '上门助浴', item: '上门助浴服务 · 10次套餐', user: '王大爷', userPhone: '139****6677', nurse: '陈护理师', nursePhone: '138****2468', time: '共10次 · 首次 10/16 09时', amount: '¥3,992', state: '退款处理中', pay: { method: '微信支付', deduct: '¥0', actual: '¥3,992', received: '¥3,992', at: '10/15 10:24:02' },
        sessions: [
          { seq: 1, date: '10/16', time: '09:00-11:00', addressDetail: '西安市未央区凤城八路 66号 1单元 801', contact: '王大爷', phone: '139****6677' }
        ],
        refundState: '待审核',
        refundApp: {
          reason: '行程或服务计划变更',
          amount: '3,592.80',
          maxAmount: '3,592.80',
          description: '家人临时决定接老人去外地休养，后续9次助浴服务无法继续在原地址进行，申请按未使用次数退款。',
          photos: [
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=photo%20of%20a%20family%20gathering%20in%20living%20room%20discussing%20travel%20plans%2C%20warm%20light%2C%20phone%20snapshot&image_size=landscape_4_3',
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close-up%20photo%20of%20a%20handwritten%20note%20on%20a%20table%20about%20canceling%20service%2C%20natural%20indoor%20light&image_size=landscape_4_3'
          ],
          appliedAt: '10/18 09:26'
        },
        refundLog: [
          { title: '提交退款申请', at: '10/18 09:26', desc: '退款原因：行程或服务计划变更 · 申请金额 ¥3,592.80', operator: '用户', done: true }
        ] },
      { no: 'AKB-20260409-031', orderedAt: '04/08 17:05:51', type: '陪诊服务', item: '代取报告 · 1次', user: '刘女士', userPhone: '177****9183', nurse: '赵姐', nursePhone: '133****6420', time: '04/09 10时', amount: '¥89', state: '待支付' },
      { no: 'AKB-20260408-023', orderedAt: '04/07 10:48:27', type: '居家陪护', item: '12小时/天 · 1天', user: '孙大爷', userPhone: '158****5509', nurse: '陈阿姨', nursePhone: '177****9183', time: '04/08 08时 - 04/08 20时', amount: '¥520', state: '已取消' },
      { no: 'AKB-M20260416-001', orderedAt: '04/16 10:18:42', type: '商城订单', item: '电子体温计 · 1件', product: '电子体温计', quantity: 1, user: '王女士', userPhone: '138****2468', receiver: '王女士', receiverPhone: '138****2468', deliveryType: '立即送达', deliveryFee: '已含在商品售价内', receiveCode: '4286', receiptStatus: '待用户确认', deliveredAt: '—', confirmedBy: '—', nurse: '安科邦商城', nursePhone: '—', time: '待配送', amount: '¥39', state: '待支付', address: '西安市雁塔区 · 王女士', addressType: '收货地址', logisticsCompany: '—', logisticsNo: '—' },
      { no: 'AKB-M20260415-002', orderedAt: '04/15 15:26:09', type: '商城订单', item: '电子血压计 · 1件', product: '电子血压计', quantity: 1, user: '张先生', userPhone: '139****8572', receiver: '张先生', receiverPhone: '139****8572', deliveryType: '跑腿送达', deliveryFee: '已含在商品售价内', receiveCode: '7391', receiptStatus: '待配送', deliveredAt: '—', confirmedBy: '—', nurse: '安科邦商城', nursePhone: '—', time: '待配送', amount: '¥239', state: '待配送', address: '北京市朝阳区 · 张先生', addressType: '收货地址', logisticsCompany: '—', logisticsNo: '—' },
      { no: 'AKB-M20260413-003', orderedAt: '04/13 09:42:17', type: '商城订单', item: '家用雾化器 · 1件', product: '家用雾化器', quantity: 1, user: '李女士', userPhone: '136****4921', receiver: '李女士', receiverPhone: '136****4921', deliveryType: '快递送达', deliveryFee: '已含在商品售价内', receiveCode: '6315', receiptStatus: '待用户确认', deliveredAt: '2026-04-16 11:20', confirmedBy: '—', nurse: '安科邦商城', nursePhone: '—', time: '待收货确认', amount: '¥199', state: '待收货确认', address: '北京市海淀区 · 李女士', addressType: '收货地址', logisticsCompany: '顺丰速运', logisticsNo: 'SF1234567890' },
      { no: 'AKB-M20260409-004', orderedAt: '04/09 11:05:36', type: '商城订单', item: '医用无菌口罩 · 2件', product: '医用无菌口罩', quantity: 2, user: '刘先生', userPhone: '133****6420', receiver: '刘先生', receiverPhone: '133****6420', deliveryType: '立即送达', deliveryFee: '已含在商品售价内', receiveCode: '8024', receiptStatus: '已确认', deliveredAt: '2026-04-12 16:30', confirmedBy: '用户确认', nurse: '安科邦商城', nursePhone: '—', time: '已于 04/12 签收', amount: '¥58', state: '已完成', address: '西安市高新区 · 刘先生', addressType: '收货地址', logisticsCompany: '—', logisticsNo: '—' },
      { no: 'AKB-M20260407-005', orderedAt: '04/07 16:20:11', type: '商城订单', item: '家用胎心仪 · 1件', product: '家用胎心仪', quantity: 1, user: '陈女士', userPhone: '137****7812', receiver: '陈女士', receiverPhone: '137****7812', deliveryType: '跑腿送达', deliveryFee: '已含在商品售价内', receiveCode: '5168', receiptStatus: '售后处理中', deliveredAt: '—', confirmedBy: '—', nurse: '安科邦商城', nursePhone: '—', time: '用户申请退款', amount: '¥299', state: '退款/售后', address: '北京市东城区 · 陈女士', addressType: '收货地址', logisticsCompany: '—', logisticsNo: '—' }
    ],
    caregivers: [
      { id: 'N1001', name: '张阿姨', state: 'on' },
      { id: 'N1002', name: '李师傅', state: 'on' },
      { id: 'N1003', name: '王阿姨', state: 'leave' },
      { id: 'N1004', name: '赵姐', state: 'off' },
      { id: 'N1005', name: '陈阿姨', state: 'on' }
    ]
  };
})(window);
