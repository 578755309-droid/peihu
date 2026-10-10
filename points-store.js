(function () {
  const KEY = 'ankebang_points_state';
  const initialState = {
    version: 2,
    balance: 70,
    income: 90,
    expense: 20,
    inviteCode: 'AKB-8Q6M',
    invitees: [
      { name: '张*婷', date: '2026-09-03', status: '已注册', points: 30 },
      { name: '刘*宇', date: '2026-09-01', status: '已注册', points: 30 },
      { name: '周*阳', date: '2026-08-26', status: '已注册', points: 30 }
    ],
    records: [
      { id: 'invite-1', type: 'income', title: '邀请好友注册', detail: '好友 张*婷', amount: 30, date: '2026-09-03' },
      { id: 'spend-1', type: 'expense', title: '订单积分抵扣', detail: '住院陪护订单', amount: -20, date: '2026-09-02' },
      { id: 'invite-2', type: 'income', title: '邀请好友注册', detail: '好友 刘*宇', amount: 30, date: '2026-09-01' },
      { id: 'invite-3', type: 'income', title: '邀请好友注册', detail: '好友 周*阳', amount: 30, date: '2026-08-26' }
    ]
  };

  function cloneInitial() { return JSON.parse(JSON.stringify(initialState)); }
  function get() {
    try {
      const state = JSON.parse(localStorage.getItem(KEY));
      return state && state.version === 2 && Array.isArray(state.records) ? state : cloneInitial();
    } catch (e) { return cloneInitial(); }
  }
  function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
  function spend(points, detail) {
    const state = get();
    const amount = Math.min(Math.max(0, Math.floor(points)), state.balance);
    if (!amount) return 0;
    state.balance -= amount;
    state.expense += amount;
    state.records.unshift({ id: 'spend-' + Date.now(), type: 'expense', title: '订单积分抵扣', detail: detail || '服务订单', amount: -amount, date: '刚刚' });
    save(state);
    return amount;
  }
  window.AKBPoints = { get, save, spend };
})();
