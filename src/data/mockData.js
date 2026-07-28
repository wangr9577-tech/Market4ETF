/**
 * Mock 数据层
 * 后端就绪后替换为真实 API 调用
 */

// ============ 工具函数 ============

/** 生成时间序列日期 */
function generateDates(startYear, endYear) {
  const dates = []
  for (let y = startYear; y <= endYear; y++) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= 28; d += 7) {
        dates.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
      }
    }
  }
  return dates
}

/** 生成随机游走净值 */
function generateNav(length, annualReturn = 0.12, volatility = 0.15) {
  const nav = [1.0]
  const dt = 1 / 252
  for (let i = 1; i < length; i++) {
    const drift = annualReturn * dt
    const shock = volatility * Math.sqrt(dt) * (Math.random() * 2 - 1 + Math.random() * 2 - 1) / 1.4
    nav.push(nav[i - 1] * (1 + drift + shock))
  }
  return nav.map((v) => Math.round(v * 10000) / 10000)
}

/** 从净值序列计算回撤 */
function calcDrawdown(nav) {
  const dd = []
  let peak = nav[0]
  for (const v of nav) {
    if (v > peak) peak = v
    dd.push(Math.round(((v - peak) / peak) * 10000) / 100)
  }
  return dd
}

// ============ 数据常量 ============

const DATES = generateDates(2019, 2025)
const N = DATES.length

// 策略净值
const STRATEGY_FULL = generateNav(N, 0.16, 0.13)
const STRATEGY_NO_REBALANCE = generateNav(N, 0.08, 0.18)
const STRATEGY_NO_INNOVATION = generateNav(N, 0.1, 0.16)
const BENCH_HS300 = generateNav(N, 0.06, 0.2)
const BENCH_6040 = generateNav(N, 0.07, 0.1)

// Regime序列（大约划分）
function generateRegimes(n) {
  const regimes = []
  const states = ['bull', 'sideways', 'bear', 'high-vol']
  let current = 0
  let count = 0
  for (let i = 0; i < n; i++) {
    regimes.push(states[current])
    count++
    if (count > 20 + Math.random() * 30) {
      current = (current + Math.floor(Math.random() * 3) + 1) % 4
      count = 0
    }
  }
  return regimes
}

const REGIMES = generateRegimes(N)

// ============ 导出的 Mock 数据 ============

/** 当前市场状态 */
export const currentRegime = {
  regime: 'sideways',
  label: '震荡市',
  confidence: 0.78,
  date: '2025-06-30',
}

/** KPI 指标 */
export const kpiData = [
  { label: '年化收益率', value: '18.6%', type: 'positive', change: '+3.2% vs 基准' },
  { label: '夏普比率', value: '1.62', type: 'gold', change: '> 1.5 优秀' },
  { label: '最大回撤', value: '-12.3%', type: 'negative', change: '< 15% 可控' },
  { label: '年化波动率', value: '13.8%', type: 'neutral', change: '中等波动' },
]

/** 净值走势数据 */
export const navData = {
  dates: DATES,
  series: [
    { name: '完整策略', data: STRATEGY_FULL, color: '#3B82F6' },
    { name: '沪深300', data: BENCH_HS300, color: '#6B7280' },
    { name: '60/40组合', data: BENCH_6040, color: '#F5A623' },
  ],
  regimes: REGIMES,
}

/** 当前持仓 */
export const currentHoldings = [
  { name: '沪深300ETF', code: '510300', weight: 30, type: '宽基' },
  { name: '红利ETF', code: '510880', weight: 20, type: '红利' },
  { name: '消费ETF', code: '159928', weight: 15, type: '行业' },
  { name: '黄金ETF', code: '518880', weight: 15, type: '商品' },
  { name: '国债ETF', code: '511010', weight: 15, type: '债券' },
  { name: '证券ETF', code: '512880', weight: 5, type: '行业' },
]

/** 情绪分数 */
export const sentimentScore = 58

/** 最近调仓 */
export const rebalanceHistory = [
  { date: '2025-06-02', action: '降低证券ETF 10% → 5%，增加国债ETF', reason: '状态触发：进入震荡市', color: '#F5A623' },
  { date: '2025-05-06', action: '增加半导体ETF 10%，降低黄金ETF', reason: '定期调仓：月度检查', color: '#3B82F6' },
  { date: '2025-04-15', action: '紧急降低股票仓位20%', reason: '风险触发：组合回撤超8%', color: '#E04848' },
  { date: '2025-04-01', action: '切换至牛市组合配置', reason: '状态触发：HMM识别牛市', color: '#2DC78A' },
  { date: '2025-03-03', action: '小幅调整行业ETF比例', reason: '定期调仓：月度检查', color: '#3B82F6' },
]

/** 宏观因子数据 */
export const macroFactors = {
  dates: DATES.filter((_, i) => i % 4 === 0),
  factors: [
    { name: 'GDP同比 (%)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 4.5 + Math.sin(i / 10) * 2 + Math.random() * 0.5) },
    { name: 'PMI', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 50 + Math.sin(i / 8) * 3 + Math.random()) },
    { name: 'M2同比 (%)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 8 + Math.sin(i / 12) * 2 + Math.random() * 0.3) },
    { name: 'CPI (%)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 2 + Math.sin(i / 6) * 1.5 + Math.random() * 0.3) },
    { name: '十年期国债 (%)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 2.8 + Math.sin(i / 15) * 0.5 + Math.random() * 0.1) },
  ],
}

/** 估值因子 */
export const valuationFactors = {
  dates: DATES.filter((_, i) => i % 4 === 0),
  factors: [
    { name: '沪深300 PE', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 12 + Math.sin(i / 10) * 3 + Math.random()) },
    { name: '中证500 PE', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 22 + Math.sin(i / 8) * 5 + Math.random() * 2) },
    { name: '创业板 PE', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 35 + Math.sin(i / 7) * 10 + Math.random() * 3) },
    { name: 'PE百分位', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 40 + Math.sin(i / 10) * 30 + Math.random() * 10) },
  ],
}

/** 情绪因子 */
export const sentimentFactors = {
  dates: DATES.filter((_, i) => i % 4 === 0),
  factors: [
    { name: '融资余额 (亿)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 14000 + Math.sin(i / 8) * 2000 + Math.random() * 500) },
    { name: '换手率 (%)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 1.5 + Math.sin(i / 5) * 0.8 + Math.random() * 0.3) },
    { name: '成交额 (亿)', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 8000 + Math.sin(i / 6) * 3000 + Math.random() * 1000) },
  ],
}

/** 技术因子 */
export const techFactors = {
  dates: DATES.filter((_, i) => i % 4 === 0),
  factors: [
    { name: 'RSI', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 50 + Math.sin(i / 5) * 20 + Math.random() * 10) },
    { name: 'ADX', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 25 + Math.sin(i / 7) * 15 + Math.random() * 5) },
    { name: 'ATR', data: Array.from({ length: Math.ceil(N / 4) }, (_, i) => 40 + Math.sin(i / 6) * 20 + Math.random() * 8) },
  ],
}

/** PE百分位当前值 */
export const pePercentile = 42

/** 情绪雷达数据 */
export const sentimentRadar = [
  { name: '融资余额', value: 65 },
  { name: '北向资金', value: 45 },
  { name: '换手率', value: 72 },
  { name: '成交额', value: 58 },
  { name: '波动率', value: 38 },
]

/** 因子相关性矩阵 */
export const correlationMatrix = {
  factors: ['GDP', 'PMI', 'PE', 'PB', 'M2', '融资余额', 'RSI'],
  data: [
    [1, 0.65, -0.3, -0.25, 0.45, 0.35, 0.2],
    [0.65, 1, -0.2, -0.15, 0.55, 0.4, 0.3],
    [-0.3, -0.2, 1, 0.85, -0.1, 0.5, 0.6],
    [-0.25, -0.15, 0.85, 1, -0.05, 0.45, 0.55],
    [0.45, 0.55, -0.1, -0.05, 1, 0.3, 0.15],
    [0.35, 0.4, 0.5, 0.45, 0.3, 1, 0.7],
    [0.2, 0.3, 0.6, 0.55, 0.15, 0.7, 1],
  ],
}

/** Regime历史 */
export const regimeHistory = {
  dates: DATES,
  regimes: REGIMES,
  indexClose: BENCH_HS300.map((v) => v * 3500),
}

/** HMM转移矩阵 */
export const hmmTransition = {
  states: ['牛市', '熊市', '震荡', '高波动'],
  matrix: [
    [0.85, 0.05, 0.08, 0.02],
    [0.03, 0.82, 0.10, 0.05],
    [0.10, 0.08, 0.75, 0.07],
    [0.04, 0.12, 0.14, 0.70],
  ],
}

/** 各Regime的ETF组合 */
export const regimePortfolios = {
  bull: {
    label: '牛市',
    etfs: [
      { code: '510300', name: '沪深300ETF', weight: 35, type: '宽基', fee: 0.15, scale: 1200, tracking: 0.02 },
      { code: '512100', name: '中证1000ETF', weight: 25, type: '宽基', fee: 0.20, scale: 300, tracking: 0.05 },
      { code: '159915', name: '创业板ETF', weight: 20, type: '宽基', fee: 0.15, scale: 500, tracking: 0.03 },
      { code: '512480', name: '半导体ETF', weight: 10, type: '行业', fee: 0.50, scale: 200, tracking: 0.08 },
      { code: '512880', name: '证券ETF', weight: 10, type: '行业', fee: 0.50, scale: 180, tracking: 0.06 },
    ],
  },
  bear: {
    label: '熊市',
    etfs: [
      { code: '510880', name: '红利ETF', weight: 30, type: '红利', fee: 0.20, scale: 400, tracking: 0.03 },
      { code: '511010', name: '国债ETF', weight: 30, type: '债券', fee: 0.10, scale: 800, tracking: 0.01 },
      { code: '518880', name: '黄金ETF', weight: 20, type: '商品', fee: 0.15, scale: 350, tracking: 0.02 },
      { code: '510300', name: '沪深300ETF', weight: 20, type: '宽基', fee: 0.15, scale: 1200, tracking: 0.02 },
    ],
  },
  sideways: {
    label: '震荡市',
    etfs: [
      { code: '510300', name: '沪深300ETF', weight: 30, type: '宽基', fee: 0.15, scale: 1200, tracking: 0.02 },
      { code: '510880', name: '红利ETF', weight: 20, type: '红利', fee: 0.20, scale: 400, tracking: 0.03 },
      { code: '159928', name: '消费ETF', weight: 20, type: '行业', fee: 0.50, scale: 250, tracking: 0.05 },
      { code: '518880', name: '黄金ETF', weight: 15, type: '商品', fee: 0.15, scale: 350, tracking: 0.02 },
      { code: '511010', name: '国债ETF', weight: 15, type: '债券', fee: 0.10, scale: 800, tracking: 0.01 },
    ],
  },
  'high-vol': {
    label: '高波动',
    etfs: [
      { code: '518880', name: '黄金ETF', weight: 30, type: '商品', fee: 0.15, scale: 350, tracking: 0.02 },
      { code: '511010', name: '国债ETF', weight: 30, type: '债券', fee: 0.10, scale: 800, tracking: 0.01 },
      { code: '510880', name: '红利ETF', weight: 20, type: '红利', fee: 0.20, scale: 400, tracking: 0.03 },
      { code: '511880', name: '货币ETF', weight: 20, type: '现金', fee: 0.05, scale: 600, tracking: 0.00 },
    ],
  },
}

/** 有效前沿数据 */
export const efficientFrontier = {
  points: Array.from({ length: 50 }, (_, i) => {
    const risk = 5 + i * 0.5
    const ret = 2 + Math.sqrt(risk) * 3.5 - (risk > 20 ? (risk - 20) * 0.15 : 0) + (Math.random() - 0.5) * 2
    return { risk: Math.round(risk * 100) / 100, return: Math.round(ret * 100) / 100 }
  }),
  optimal: { risk: 13.8, return: 18.6, label: '最优组合' },
}

/** 回测对比数据 */
export const backtestData = {
  dates: DATES,
  strategies: [
    { name: '完整策略 (HMM+BL+风控)', data: STRATEGY_FULL, color: '#3B82F6' },
    { name: '无动态调仓 (买入持有)', data: STRATEGY_NO_REBALANCE, color: '#9CA3AF' },
    { name: '基础版 (KMeans+均值方差)', data: STRATEGY_NO_INNOVATION, color: '#F5A623' },
    { name: '沪深300', data: BENCH_HS300, color: '#6B7280' },
    { name: '60/40组合', data: BENCH_6040, color: '#8B5CF6' },
  ],
  drawdown: calcDrawdown(STRATEGY_FULL),
  regimes: REGIMES,
}

/** 指标对比表 */
export const metricsComparison = [
  { key: '1', strategy: '完整策略', cagr: '18.6%', sharpe: '1.62', sortino: '2.15', calmar: '1.51', maxdd: '-12.3%', volatility: '13.8%', turnover: '4.2次/年' },
  { key: '2', strategy: '无动态调仓', cagr: '8.2%', sharpe: '0.65', sortino: '0.82', calmar: '0.38', maxdd: '-21.5%', volatility: '18.3%', turnover: '0次/年' },
  { key: '3', strategy: '基础版', cagr: '12.1%', sharpe: '0.98', sortino: '1.25', calmar: '0.72', maxdd: '-16.8%', volatility: '15.6%', turnover: '6.8次/年' },
  { key: '4', strategy: '沪深300', cagr: '5.8%', sharpe: '0.35', sortino: '0.42', calmar: '0.18', maxdd: '-31.2%', volatility: '20.1%', turnover: '-' },
  { key: '5', strategy: '60/40组合', cagr: '7.1%', sharpe: '0.78', sortino: '0.95', calmar: '0.55', maxdd: '-12.9%', volatility: '10.2%', turnover: '1次/年' },
]

/** 年度收益数据 */
export const annualReturns = {
  years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025H1'],
  strategies: [
    { name: '完整策略', data: [22.5, 28.3, 15.2, -5.8, 12.6, 21.4, 8.3], color: '#3B82F6' },
    { name: '无动态调仓', data: [15.2, 18.6, 8.3, -15.2, 5.6, 10.2, 3.1], color: '#9CA3AF' },
    { name: '沪深300', data: [36.1, 27.2, -5.2, -21.6, -11.4, 14.7, 1.2], color: '#6B7280' },
  ],
}

/** 月度收益热力图 */
export const monthlyReturns = (() => {
  const data = []
  for (let y = 2019; y <= 2025; y++) {
    const maxM = y === 2025 ? 6 : 12
    for (let m = 0; m < maxM; m++) {
      data.push([m, y - 2019, Math.round((Math.random() * 12 - 4) * 100) / 100])
    }
  }
  return data
})()

/** 消融实验 */
export const ablationData = [
  { name: '完整方案', sharpe: 1.62, maxdd: -12.3, cagr: 18.6, removed: '无', icon: '✅' },
  { name: '去掉HMM', sharpe: 1.15, maxdd: -16.1, cagr: 14.2, removed: 'HMM状态识别', icon: '❌' },
  { name: '去掉BL', sharpe: 1.28, maxdd: -14.5, cagr: 15.8, removed: 'Black-Litterman', icon: '❌' },
  { name: '去掉风控', sharpe: 1.35, maxdd: -19.2, cagr: 17.1, removed: '风险控制模块', icon: '❌' },
  { name: '去掉情绪', sharpe: 1.42, maxdd: -13.8, cagr: 16.5, removed: '情绪因子', icon: '❌' },
  { name: '固定权重', sharpe: 0.85, maxdd: -18.6, cagr: 10.5, removed: '动态优化', icon: '❌' },
]

/** 滚动指标 */
export const rollingMetrics = {
  dates: DATES.filter((_, i) => i % 2 === 0),
  sharpe: Array.from({ length: Math.ceil(N / 2) }, (_, i) => 1.2 + Math.sin(i / 15) * 0.8 + Math.random() * 0.3),
  maxdd: Array.from({ length: Math.ceil(N / 2) }, (_, i) => -(5 + Math.abs(Math.sin(i / 10)) * 12 + Math.random() * 3)),
}

/** 调仓日历 */
export const rebalanceCalendar = [
  { date: '2025-01-31', type: 'time', desc: '月度定期调仓' },
  { date: '2025-02-28', type: 'time', desc: '月度定期调仓' },
  { date: '2025-03-15', type: 'state', desc: '状态切换：震荡→牛市' },
  { date: '2025-03-31', type: 'time', desc: '月度定期调仓' },
  { date: '2025-04-15', type: 'risk', desc: '风险触发：回撤超限' },
  { date: '2025-04-30', type: 'time', desc: '月度定期调仓' },
  { date: '2025-05-30', type: 'time', desc: '月度定期调仓' },
  { date: '2025-06-02', type: 'state', desc: '状态切换：牛市→震荡' },
  { date: '2025-06-30', type: 'time', desc: '月度定期调仓' },
]

/** 投资者适配 */
export const investorProfiles = [
  {
    type: '保守型',
    desc: '追求稳健收益，风险承受能力较低',
    allocation: { 债券: 40, 黄金: 20, 红利: 20, 宽基: 15, 现金: 5 },
    target: { return: '6-8%', maxdd: '<8%', sharpe: '>1.0' },
  },
  {
    type: '稳健型',
    desc: '兼顾收益与风险，追求长期稳定增长',
    allocation: { 宽基: 35, 红利: 20, 行业: 15, 黄金: 15, 债券: 15 },
    target: { return: '10-15%', maxdd: '<15%', sharpe: '>1.2' },
  },
  {
    type: '积极型',
    desc: '追求高收益，能承受较大波动',
    allocation: { 宽基: 40, 行业: 25, 成长: 15, 红利: 10, 黄金: 10 },
    target: { return: '15-25%', maxdd: '<25%', sharpe: '>1.0' },
  },
]
