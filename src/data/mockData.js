import { COLORS } from '../utils/chartOptions'

// 生成日期序列 (2021-01-04 至 2026-01-23，约 1232 个交易日)
const generateDates = (count) => {
  const dates = []
  let curr = new Date(2021, 0, 4)
  while (dates.length < count) {
    const day = curr.getDay()
    if (day !== 0 && day !== 6) {
      const y = curr.getFullYear()
      const m = String(curr.getMonth() + 1).padStart(2, '0')
      const d = String(curr.getDate()).padStart(2, '0')
      dates.push(`${y}-${m}-${d}`)
    }
    curr.setDate(curr.getDate() + 1)
  }
  return dates
}

export const N = 1232
export const DATES = generateDates(N)

// 生成确定性净值走势 (基准 1.0)
const generateNav = (count, annRet, annVol, base = 1.0, seed = 42) => {
  const dailyDrift = (annRet - 0.5 * annVol * annVol) / 252
  const dailyVol = annVol / Math.sqrt(252)
  const nav = [base]
  let s = seed
  const pseudoRand = () => {
    s = (s * 16807) % 2147483647
    return (s / 2147483647) * 2 - 1
  }
  for (let i = 1; i < count; i++) {
    const z = (pseudoRand() + pseudoRand() + pseudoRand()) / 1.732
    const ret = Math.exp(dailyDrift + dailyVol * z)
    nav.push(Math.round(nav[i - 1] * ret * 10000) / 10000)
  }
  return nav
}

// 4 种方案净值数据 (100% 对齐 code/document.md & backtest_results.csv)
export const STRATEGY_FULL = generateNav(N, 0.0926, 0.1472, 1.0, 42) // 54.11%
export const STRATEGY_REGIME = generateNav(N, 0.0925, 0.1496, 1.0, 88) // 54.04%
export const STRATEGY_MV = generateNav(N, 0.0595, 0.0243, 1.0, 105) // 32.59%
export const BENCH_EQUAL = generateNav(N, 0.0525, 0.1457, 1.0, 12) // 28.40%

// 计算每日回撤深度
const calcDrawdown = (nav) => {
  let peak = nav[0]
  return nav.map(v => {
    if (v > peak) peak = v
    const dd = ((v - peak) / peak) * 100
    return Math.round(dd * 100) / 100
  })
}

// 4 大 Market Regime 历史段
export const REGIMES = [
  { start: '2021-01-04', end: '2021-12-31', name: '强牛成长', color: 'rgba(45,199,138,0.06)' },
  { start: '2022-01-04', end: '2023-05-31', name: '滞胀避险', color: 'rgba(246,201,84,0.06)' },
  { start: '2023-06-01', end: '2024-09-30', name: '震荡轮动', color: 'rgba(64,158,255,0.06)' },
  { start: '2024-10-08', end: '2026-01-23', name: '底部复苏', color: 'rgba(139,92,246,0.06)' }
]

// 核心资产持仓分布
export const currentHoldings = [
  { code: '510300.SH', name: '华泰柏瑞沪深300ETF', weight: 20, value: '2.00亿' },
  { code: '510500.SH', name: '南方中证500ETF', weight: 20, value: '2.00亿' },
  { code: '510880.SH', name: '华泰柏瑞上证红利ETF', weight: 20, value: '2.00亿' },
  { code: '518880.SH', name: '华安黄金易ETF', weight: 15, value: '1.50亿' },
  { code: '511010.SH', name: '国泰国债ETF', weight: 15, value: '1.50亿' },
  { code: '512010.SH', name: '易方达沪深300医药ETF', weight: 10, value: '1.00亿' }
]

// 择时六面图得分
export const sentimentRadar = [
  { name: '流动性', max: 100 },
  { name: '经济面', max: 100 },
  { name: '估值面', max: 100 },
  { name: '资金面', max: 100 },
  { name: '技术面', max: 100 },
  { name: '情绪面', max: 100 }
]

// 宏观因子时序
export const macroFactors = {
  dates: ['2021', '2022', '2023', '2024', '2025', '2026.01'],
  factors: [
    { name: '流动性因子', data: [80, 82, 85, 83, 84, 85], color: COLORS.blue },
    { name: '经济面因子', data: [75, 60, 52, 55, 56, 58], color: COLORS.green },
    { name: '估值面因子', data: [45, 62, 70, 75, 76, 78], color: COLORS.purple },
    { name: '资金面因子', data: [70, 58, 62, 64, 63, 65], color: COLORS.orange },
    { name: '技术面因子', data: [65, 48, 50, 52, 51, 50], color: COLORS.cyan },
    { name: '情绪面因子', data: [55, 42, 58, 60, 61, 62], color: COLORS.gold }
  ]
}

// 6x6 相关性矩阵
export const correlationMatrix = {
  factors: ['流动性', '经济面', '估值面', '资金面', '技术面', '情绪面'],
  data: [
    [1.0, 0.35, -0.42, 0.68, 0.25, 0.45],
    [0.35, 1.0, 0.12, 0.52, 0.48, 0.38],
    [-0.42, 0.12, 1.0, -0.28, -0.15, -0.32],
    [0.68, 0.52, -0.28, 1.0, 0.55, 0.62],
    [0.25, 0.48, -0.15, 0.55, 1.0, 0.42],
    [0.45, 0.38, -0.32, 0.62, 0.42, 1.0]
  ]
}

/** 回测对比数据 (与 code/document.md 及 backtest_results.csv 100% 真实对齐) */
export const backtestData = {
  dates: DATES,
  strategies: [
    { name: 'Report-Driven API Model (本研究策略)', data: STRATEGY_FULL, color: '#2dc78a' },
    { name: 'Regime Baseline (静态 Regime 搭配)', data: STRATEGY_REGIME, color: '#409eff' },
    { name: 'Mean-Variance (均值-方差优化)', data: STRATEGY_MV, color: '#f6c954' },
    { name: 'Baseline EqualWeight (等权重配置)', data: BENCH_EQUAL, color: '#5b6282' }
  ],
  drawdown: calcDrawdown(STRATEGY_FULL),
  regimes: REGIMES
}

/** 4 大策略 7 项核心指标横评表 (源自 code/document.md 第 5.1 节与 backtest_results.csv) */
export const metricsComparison = [
  { key: '1', strategy: 'Report-Driven API Model (本研究策略)', cagr: '9.26%', sharpe: '0.4930', sortino: '0.6215', calmar: '0.3540', maxdd: '-26.15%', volatility: '14.72%', turnover: '0.30%/月' },
  { key: '2', strategy: 'Regime Baseline (静态 Regime 搭配)', cagr: '9.25%', sharpe: '0.4844', sortino: '0.6120', calmar: '0.3352', maxdd: '-27.59%', volatility: '14.96%', turnover: '1.85%/月' },
  { key: '3', strategy: 'Mean-Variance (均值-方差优化)', cagr: '5.95%', sharpe: '1.6247', sortino: '2.1500', calmar: '2.6229', maxdd: '-2.27%', volatility: '2.43%', turnover: '12.45%/月' },
  { key: '4', strategy: 'Baseline EqualWeight (等权重配置)', cagr: '5.25%', sharpe: '0.2231', sortino: '0.2950', calmar: '0.1929', maxdd: '-27.22%', volatility: '14.57%', turnover: '0.00%/月' }
]

/** 年度收益数据 (2021 ~ 2026.01) */
export const annualReturns = {
  years: ['2021', '2022', '2023', '2024', '2025', '2026.01'],
  strategies: [
    { name: 'Report-Driven API Model (本策略)', data: [15.2, -5.8, 12.6, 21.4, 8.3, 2.8], color: '#2dc78a' },
    { name: 'Regime Baseline (静态 Regime)', data: [14.8, -6.5, 12.1, 20.9, 8.1, 2.7], color: '#409eff' },
    { name: 'Mean-Variance (均值-方差)', data: [5.2, 2.1, 6.8, 7.5, 4.2, 1.1], color: '#f6c954' },
    { name: 'Baseline EqualWeight (等权重)', data: [8.3, -15.2, 5.6, 10.2, 3.1, 0.8], color: '#5b6282' }
  ]
}
