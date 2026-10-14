/* 佑小邦运营后台 · 积分管理共享数据模块
 * 全局积分规则（邀请奖励 / 消费返积分 / 商城与服务订单的积分抵扣开关与抵扣上限）、
 * 用户积分、获取明细 / 使用明细 / 邀请明细，localStorage 持久化。
 * 规则口径（与小程序端一致）：1 积分 = 1 元；
 * 抵扣上限 = 订单金额中可用积分抵扣的最大百分比，商品 / 服务可单独覆盖。
 */
(function (w) {
  var CONFIG_KEY = 'akb_admin_points_config';
  var USER_KEY = 'akb_admin_points_users';
  var EARN_KEY = 'akb_admin_points_earn';
  var SPEND_KEY = 'akb_admin_points_spend';
  var INVITE_KEY = 'akb_admin_points_invite';

  /* ── 全局积分规则（默认值与小程序端文案一致：邀请好友各得 30 分、消费 10 元返 1 分、抵扣上限 10%） ── */
  var DEFAULT_CONFIG = {
    inviteReward: 30,        // 每邀请 1 位好友注册，双方各得积分
    consumePerYuan: 10,      // 每消费 X 元返 1 积分
    mallEnabled: true,       // 商城订单是否可用积分抵扣
    mallCapPercent: 10,      // 商城订单抵扣上限（订单金额的 %）
    serviceEnabled: true,    // 服务订单是否可用积分抵扣
    serviceCapPercent: 10    // 服务订单抵扣上限（订单金额的 %）
  };

  function normalizeConfig(c) {
    c = c || {};
    var out = {};
    Object.keys(DEFAULT_CONFIG).forEach(function (k) {
      var v = c[k];
      if (k === 'mallEnabled' || k === 'serviceEnabled') out[k] = v !== false;
      else if (k === 'mallCapPercent' || k === 'serviceCapPercent') out[k] = clampPercent(v != null ? v : DEFAULT_CONFIG[k]);
      else out[k] = Math.max(0, Number(v != null ? v : DEFAULT_CONFIG[k]) || 0);
    });
    return out;
  }
  function clampPercent(v) {
    v = Number(v) || 0;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    return v;
  }

  /* ── 用户积分（演示数据） ── */
  var DEFAULT_USERS = [
    { id: 'U1001', name: '王女士', phone: '138****2468', balance: 126, totalEarned: 196, totalSpent: 70, inviteCount: 3, joinedAt: '2026-08-12' },
    { id: 'U1002', name: '刘女士', phone: '139****8572', balance: 60, totalEarned: 90, totalSpent: 30, inviteCount: 1, joinedAt: '2026-08-20' },
    { id: 'U1003', name: '孙大爷', phone: '158****5509', balance: 30, totalEarned: 30, totalSpent: 0, inviteCount: 1, joinedAt: '2026-09-02' },
    { id: 'U1004', name: '周女士', phone: '137****4521', balance: 45, totalEarned: 75, totalSpent: 30, inviteCount: 2, joinedAt: '2026-09-05' },
    { id: 'U1005', name: '郑先生', phone: '159****7712', balance: 12, totalEarned: 12, totalSpent: 0, inviteCount: 0, joinedAt: '2026-09-18' },
    { id: 'U1006', name: '吴先生', phone: '188****6630', balance: 96, totalEarned: 156, totalSpent: 60, inviteCount: 2, joinedAt: '2026-09-22' },
    { id: 'U1007', name: '赵阿姨', phone: '186****3016', balance: 8, totalEarned: 8, totalSpent: 0, inviteCount: 0, joinedAt: '2026-10-01' },
    { id: 'U1008', name: '李女士', phone: '139****2287', balance: 71, totalEarned: 101, totalSpent: 30, inviteCount: 3, joinedAt: '2026-10-08' }
  ];

  /* ── 获取明细 ── */
  var DEFAULT_EARN = [
    { id: 'E001', date: '2026-10-12', time: '16:40', userId: 'U1006', userName: '吴先生', type: '消费返积分', detail: '商城订单 AKB-M2026-101203 · 实付 ¥168', points: 16 },
    { id: 'E002', date: '2026-10-11', time: '10:32', userId: 'U1006', userName: '吴先生', type: '邀请好友', detail: '好友 曹女士 完成注册', points: 30 },
    { id: 'E003', date: '2026-10-10', time: '19:22', userId: 'U1008', userName: '李女士', type: '消费返积分', detail: '服务订单 AKB-20261010-036 · 实付 ¥298', points: 29 },
    { id: 'E004', date: '2026-10-09', time: '14:22', userId: 'U1001', userName: '王女士', type: '消费返积分', detail: '服务订单 AKB-20261008-012 · 实付 ¥1,560', points: 156 },
    { id: 'E005', date: '2026-10-08', time: '11:05', userId: 'U1001', userName: '王女士', type: '邀请好友', detail: '好友 许先生 完成注册', points: 30 },
    { id: 'E006', date: '2026-10-07', time: '09:18', userId: 'U1004', userName: '周女士', type: '消费返积分', detail: '商城订单 AKB-M2026-100760 · 实付 ¥299', points: 29 },
    { id: 'E007', date: '2026-10-05', time: '20:15', userId: 'U1002', userName: '刘女士', type: '消费返积分', detail: '商城订单 AKB-M2026-100520 · 实付 ¥239', points: 23 },
    { id: 'E008', date: '2026-10-03', time: '15:48', userId: 'U1003', userName: '孙大爷', type: '邀请好友', detail: '好友 钱大爷 完成注册', points: 30 },
    { id: 'E009', date: '2026-10-02', time: '08:40', userId: 'U1004', userName: '周女士', type: '邀请好友', detail: '好友 冯女士 完成注册', points: 30 },
    { id: 'E010', date: '2026-10-01', time: '12:10', userId: 'U1007', userName: '赵阿姨', type: '消费返积分', detail: '商城订单 AKB-M2026-100110 · 实付 ¥86', points: 8 }
  ];

  /* ── 使用明细 ── */
  var DEFAULT_SPEND = [
    { id: 'S001', date: '2026-10-12', time: '17:02', userId: 'U1001', userName: '王女士', orderType: '服务订单', orderNo: 'AKB-20261012-041', points: 30, amount: 30, detail: '住院陪护 · 抵扣 ¥30' },
    { id: 'S002', date: '2026-10-11', time: '09:36', userId: 'U1006', userName: '吴先生', orderType: '商城订单', orderNo: 'AKB-M2026-101190', points: 20, amount: 20, detail: '电子血压计 · 抵扣 ¥20' },
    { id: 'S003', date: '2026-10-10', time: '21:08', userId: 'U1002', userName: '刘女士', orderType: '服务订单', orderNo: 'AKB-20261010-038', points: 30, amount: 30, detail: '贵宾陪诊 · 抵扣 ¥30' },
    { id: 'S004', date: '2026-10-09', time: '14:50', userId: 'U1001', userName: '王女士', orderType: '商城订单', orderNo: 'AKB-M2026-100940', points: 10, amount: 10, detail: '医用无菌口罩 x2 · 抵扣 ¥10' },
    { id: 'S005', date: '2026-10-08', time: '16:30', userId: 'U1004', userName: '周女士', orderType: '服务订单', orderNo: 'AKB-20261008-027', points: 30, amount: 30, detail: '上门助浴 · 抵扣 ¥30' },
    { id: 'S006', date: '2026-10-06', time: '11:24', userId: 'U1008', userName: '李女士', orderType: '商城订单', orderNo: 'AKB-M2026-100620', points: 30, amount: 30, detail: '家用雾化器 · 抵扣 ¥30' }
  ];

  /* ── 邀请明细 ── */
  var DEFAULT_INVITE = [
    { id: 'I001', date: '2026-10-11', time: '10:32', inviterId: 'U1006', inviter: '吴先生', invitee: '曹女士', inviteePhone: '133****2201', status: '已注册', reward: 30 },
    { id: 'I002', date: '2026-10-10', time: '18:20', inviterId: 'U1001', inviter: '王女士', invitee: '许先生', inviteePhone: '135****8843', status: '待注册', reward: 0 },
    { id: 'I003', date: '2026-10-08', time: '11:05', inviterId: 'U1001', inviter: '王女士', invitee: '许先生', inviteePhone: '137****3325', status: '已注册', reward: 30 },
    { id: 'I004', date: '2026-10-03', time: '15:48', inviterId: 'U1003', inviter: '孙大爷', invitee: '钱大爷', inviteePhone: '136****7719', status: '已注册', reward: 30 },
    { id: 'I005', date: '2026-10-02', time: '08:40', inviterId: 'U1004', inviter: '周女士', invitee: '冯女士', inviteePhone: '139****5528', status: '已注册', reward: 30 },
    { id: 'I006', date: '2026-09-28', time: '13:12', inviterId: 'U1008', inviter: '李女士', invitee: '何女士', inviteePhone: '150****6634', status: '已注册', reward: 30 },
    { id: 'I007', date: '2026-09-25', time: '19:36', inviterId: 'U1008', inviter: '李女士', invitee: '邓先生', inviteePhone: '151****9017', status: '已注册', reward: 30 },
    { id: 'I008', date: '2026-09-20', time: '10:04', inviterId: 'U1002', inviter: '刘女士', invitee: '蒋大爷', inviteePhone: '130****4402', status: '已注册', reward: 30 }
  ];

  /* ── 工具 ── */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function read(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      if (v) return v;
    } catch (e) {}
    return clone(fallback);
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function exportCsv(filename, header, rows) {
    var lines = [header].concat(rows).map(function (r) {
      return r.map(function (cell) { return '"' + String(cell == null ? '' : cell).replace(/"/g, '""') + '"'; }).join(',');
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv' }));
    a.download = filename;
    a.click();
  }

  /* ── 对外 API ── */
  function getConfig() {
    return normalizeConfig(read(CONFIG_KEY, DEFAULT_CONFIG));
  }
  function saveConfig(patch) {
    var next = normalizeConfig(Object.assign({}, getConfig(), patch || {}));
    write(CONFIG_KEY, next);
    return next;
  }

  function normalizeUser(u) {
    return {
      id: u.id || '',
      name: u.name || '—',
      phone: u.phone || '—',
      balance: Number(u.balance) || 0,
      totalEarned: Number(u.totalEarned) || 0,
      totalSpent: Number(u.totalSpent) || 0,
      inviteCount: Number(u.inviteCount) || 0,
      joinedAt: u.joinedAt || ''
    };
  }
  function getUsers() {
    var list = read(USER_KEY, DEFAULT_USERS);
    if (!Array.isArray(list) || !list.length) list = clone(DEFAULT_USERS);
    return list.map(normalizeUser);
  }

  function getEarnRecords() {
    var list = read(EARN_KEY, DEFAULT_EARN);
    return (Array.isArray(list) ? list : clone(DEFAULT_EARN)).slice().sort(function (a, b) {
      return String(b.date + b.time).localeCompare(String(a.date + a.time));
    });
  }
  function getSpendRecords() {
    var list = read(SPEND_KEY, DEFAULT_SPEND);
    return (Array.isArray(list) ? list : clone(DEFAULT_SPEND)).slice().sort(function (a, b) {
      return String(b.date + b.time).localeCompare(String(a.date + a.time));
    });
  }
  function getInviteRecords() {
    var list = read(INVITE_KEY, DEFAULT_INVITE);
    return (Array.isArray(list) ? list : clone(DEFAULT_INVITE)).slice().sort(function (a, b) {
      return String(b.date + b.time).localeCompare(String(a.date + a.time));
    });
  }

  /* 用户维度明细：弹窗展示某位用户的获取 / 使用 / 邀请记录 */
  function userDetail(userId) {
    return {
      user: getUsers().filter(function (u) { return u.id === userId; })[0] || null,
      earn: getEarnRecords().filter(function (r) { return r.userId === userId; }),
      spend: getSpendRecords().filter(function (r) { return r.userId === userId; }),
      invite: getInviteRecords().filter(function (r) { return r.inviterId === userId; })
    };
  }

  function summarize() {
    var users = getUsers();
    var earn = getEarnRecords();
    var spend = getSpendRecords();
    var invite = getInviteRecords();
    var totalEarned = earn.reduce(function (s, r) { return s + (Number(r.points) || 0); }, 0);
    var totalSpent = spend.reduce(function (s, r) { return s + (Number(r.points) || 0); }, 0);
    var pendingInvite = invite.filter(function (r) { return r.status !== '已注册'; }).length;
    return {
      userCount: users.length,
      totalEarned: totalEarned,
      totalSpent: totalSpent,
      totalBalance: users.reduce(function (s, u) { return s + u.balance; }, 0),
      inviteCount: invite.length,
      pendingInvite: pendingInvite,
      todayEarned: earn.filter(function (r) { return r.date === new Date().toISOString().slice(0, 10); }).reduce(function (s, r) { return s + (Number(r.points) || 0); }, 0)
    };
  }

  w.AKBPointsAdmin = {
    getConfig: getConfig,
    saveConfig: saveConfig,
    getUsers: getUsers,
    getEarnRecords: getEarnRecords,
    getSpendRecords: getSpendRecords,
    getInviteRecords: getInviteRecords,
    userDetail: userDetail,
    summarize: summarize,
    exportCsv: exportCsv,
    esc: esc
  };
})(window);
