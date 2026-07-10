import React, { useState } from 'react'
import Chart from '../components/charts/Chart'
import {
  backtestData, regimePortfolios, hmmTransition, regimeHistory,
  macroFactors, valuationFactors, sentimentFactors, techFactors,
  correlationMatrix, sentimentRadar
} from '../data/mockData'
import {
  navLineOption, ringPieOption, gaugeOption, radarOption,
  heatmapOption, factorLineOption, sankeyOption, COLORS
} from '../utils/chartOptions'

/* ========== 静态数据 ========== */

const factorMonitorData = [
  { type: '宏观', name: 'GDP同比', val: '5.40%', pct: 65, signal: '中性' },
  { type: '宏观', name: 'PMI', val: '49.30', pct: 42, signal: '偏弱' },
  { type: '宏观', name: 'CPI同比', val: '0.30%', pct: 18, signal: '偏弱' },
  { type: '宏观', name: 'M2同比', val: '7.20%', pct: 35, signal: '中性' },
  { type: '估值', name: '沪深300 PE', val: '11.32', pct: 34, signal: '低估' },
  { type: '估值', name: '沪深300 PB', val: '1.22', pct: 23, signal: '低估' },
  { type: '估值', name: '中证500 PE', val: '20.41', pct: 41, signal: '中性' },
  { type: '估值', name: '创业板 PE', val: '28.63', pct: 52, signal: '中性' },
  { type: '情绪', name: '融资余额', val: '1.83万亿', pct: 61, signal: '中性' },
  { type: '情绪', name: '北向资金', val: '+45亿', pct: 58, signal: '偏多' },
  { type: '情绪', name: '换手率', val: '1.58%', pct: 67, signal: '偏强' },
  { type: '情绪', name: 'VIX', val: '16.23', pct: 29, signal: '偏弱' },
  { type: '技术', name: 'RSI(14)', val: '52.34', pct: 50, signal: '中性' },
  { type: '技术', name: 'MACD', val: '12.36', pct: 60, signal: '偏强' },
  { type: '技术', name: 'ADX', val: '22.50', pct: 45, signal: '中性' },
  { type: '技术', name: 'ATR', val: '38.21', pct: 55, signal: '中性' },
]

const regimeProb = [
  { name: '牛市', prob: 18.6, color: COLORS.red },
  { name: '震荡市', prob: 46.3, color: COLORS.orange },
  { name: '熊市', prob: 21.7, color: COLORS.green },
  { name: '高波动', prob: 13.4, color: COLORS.purple },
]

const signalColor = (s) => {
  if (s === '低估' || s === '偏多' || s === '偏强') return 'up'
  if (s === '偏弱') return 'down'
  if (s === '过热') return 'warn'
  return 'neutral'
}

const pctBarColor = (pct) => {
  if (pct <= 20) return COLORS.green
  if (pct >= 80) return COLORS.red
  if (pct >= 60) return COLORS.orange
  return COLORS.blue
}

/* ========== 子组件 ========== */

/** 紧凑百分位进度条 */
const PctBar = ({ pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, minWidth: 40 }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: pctBarColor(pct), transition: 'width 0.3s' }} />
    </div>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', minWidth: 26, textAlign: 'right' }}>{pct}%</span>
  </div>
)

/* ========== 主组件 ========== */

export default function Market() {
  const [tab, setTab] = useState(0) // 0=因子监控, 1=状态分析

  // --- 因子时序图 (Tab1 顶部大图) ---
  const factorCategories = ['宏观因子', '估值因子', '情绪因子', '技术因子']
  const factorDataSources = [macroFactors, valuationFactors, sentimentFactors, techFactors]
  const [factorTab, setFactorTab] = useState(0)
  const currentFactorData = factorDataSources[factorTab]

  const factorTimeOption = {
    ...factorLineOption(currentFactorData.dates, currentFactorData.factors),
    grid: { top: 30, right: 10, bottom: 30, left: 50 },
    legend: { show: true, top: 0, right: 0, textStyle: { color: COLORS.textMuted, fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
    dataZoom: [{ type: 'inside', start: 60, end: 100 }],
  }

  // --- 相关性热力图 ---
  const corrData = []
  const factors = correlationMatrix.factors
  for (let i = 0; i < factors.length; i++) {
    for (let j = 0; j < factors.length; j++) {
      corrData.push([i, j, correlationMatrix.data[i][j]])
    }
  }
  const corrOption = {
    ...heatmapOption(factors, factors, corrData),
    grid: { top: 5, right: 5, bottom: 35, left: 55 },
    visualMap: { show: false, min: -1, max: 1, inRange: { color: [COLORS.green, '#1a2035', COLORS.red] } },
    xAxis: { type: 'category', data: factors, axisLabel: { color: COLORS.textMuted, fontSize: 9, rotate: 30 }, axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'category', data: factors, axisLabel: { color: COLORS.textMuted, fontSize: 9 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      type: 'heatmap', data: corrData,
      itemStyle: { borderColor: 'var(--bg-card)', borderWidth: 1 },
      label: { show: true, fontSize: 9, color: COLORS.text, formatter: (p) => p.value[2].toFixed(1) },
    }],
  }

  // --- 情绪雷达 ---
  const radarOpt = {
    ...radarOption(sentimentRadar, sentimentRadar.map(s => s.value)),
    radar: {
      ...radarOption(sentimentRadar, sentimentRadar.map(s => s.value)).radar,
      center: ['50%', '55%'], radius: '68%',
      axisName: { color: COLORS.textMuted, fontSize: 9 },
    },
  }

  // --- 状态分析 Tab2 ---
  // Regime历史色带
  const historyOption = {
    ...factorLineOption(regimeHistory.dates, []),
    grid: { top: 20, right: 10, bottom: 25, left: 35 },
    xAxis: { type: 'category', data: regimeHistory.dates, show: false },
    yAxis: { type: 'value', show: false, max: 1 },
    series: [
      { name: '牛市', type: 'line', stack: 'T', areaStyle: { opacity: 0.9 }, symbol: 'none', itemStyle: { color: COLORS.red }, data: regimeHistory.regimes.map(r => r === 'bull' ? 1 : 0) },
      { name: '震荡市', type: 'line', stack: 'T', areaStyle: { opacity: 0.9 }, symbol: 'none', itemStyle: { color: COLORS.orange }, data: regimeHistory.regimes.map(r => r === 'sideways' ? 1 : 0) },
      { name: '熊市', type: 'line', stack: 'T', areaStyle: { opacity: 0.9 }, symbol: 'none', itemStyle: { color: COLORS.green }, data: regimeHistory.regimes.map(r => r === 'bear' ? 1 : 0) },
      { name: '高波动', type: 'line', stack: 'T', areaStyle: { opacity: 0.9 }, symbol: 'none', itemStyle: { color: COLORS.purple }, data: regimeHistory.regimes.map(r => r === 'high-vol' ? 1 : 0) },
    ],
    legend: { show: true, bottom: 0, itemWidth: 10, itemHeight: 8, textStyle: { fontSize: 10, color: COLORS.textMuted } },
    dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  }

  // 带Regime色带的净值走势
  const navWithRegime = {
    ...navLineOption(backtestData.dates, [backtestData.strategies[0], backtestData.strategies[3]], backtestData.regimes),
    grid: { top: 25, right: 10, bottom: 30, left: 45 },
    legend: { show: true, top: 0, right: 0, textStyle: { color: COLORS.textMuted, fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
    dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  }

  // 桑基图
  const sankeyOpt = {
    ...sankeyOption(hmmTransition.states, hmmTransition.matrix),
    series: [{
      ...sankeyOption(hmmTransition.states, hmmTransition.matrix).series[0],
      nodeWidth: 14, nodeGap: 10,
      label: { color: COLORS.text, fontSize: 10 },
    }],
  }

  // Gauge
  const gaugeOpt = gaugeOption(62, '')

  // 推荐配置
  const portfolio = regimePortfolios['sideways']
  const portfolioOpt = {
    ...ringPieOption(portfolio.etfs),
    legend: { show: false },
    series: [{
      ...ringPieOption(portfolio.etfs).series[0],
      radius: ['38%', '62%'], center: ['50%', '50%'],
      label: { show: true, fontSize: 9, color: COLORS.textMuted, formatter: '{b}\n{d}%', position: 'outside' },
    }],
  }

  return (
    <div className="market-page">
      {/* ==================== KPI HEADER STRIP ==================== */}
      <div className="market-kpi-strip">
        {/* 当前环境 */}
        <div className="mkpi-item mkpi-regime">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>当前环境</span>
          <span className="regime-badge sideways" style={{ padding: '2px 10px', fontSize: 12 }}>震荡市</span>
        </div>
        {/* 环境概率 */}
        <div className="mkpi-item mkpi-probs">
          {regimeProb.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.name}</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{p.prob}%</span>
            </div>
          ))}
        </div>
        {/* 风险评分 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>风险评分</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.gold }}>62<span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/100</span></span>
        </div>
        {/* 组合净值 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>组合净值</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-bright)' }}>1.2568</span>
        </div>
        {/* 预期收益 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>预期年化</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.green }}>8.62%</span>
        </div>
        {/* 夏普 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>夏普比率</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.blue }}>0.87</span>
        </div>
        {/* 最大回撤 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>最大回撤</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.red }}>-12.36%</span>
        </div>
        {/* 波动率 */}
        <div className="mkpi-item">
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>波动率</span>
          <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>14.23%</span>
        </div>
      </div>

      {/* ==================== TAB SWITCHER ==================== */}
      <div className="market-tabs">
        <button className={`market-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>
          📊 因子监控
        </button>
        <button className={`market-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
          🔄 状态分析
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.green, animation: 'pulse 2s infinite' }} />
          数据更新: 2025-06-30 15:00
        </span>
      </div>

      {/* ==================== TAB 0: 因子监控 ==================== */}
      {tab === 0 && (
        <div className="market-grid-factors">
          {/* 左侧：因子监控表 - 核心大表 */}
          <div className="bento-card mcard-table">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />多维因子监控面板</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', fontSize: 11 }}>
              <table className="factor-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>类型</th>
                    <th>因子</th>
                    <th style={{ width: 65 }}>最新值</th>
                    <th style={{ width: 90 }}>历史分位</th>
                    <th style={{ width: 40 }}>信号</th>
                  </tr>
                </thead>
                <tbody>
                  {factorMonitorData.map((row, i) => {
                    const showType = i === 0 || factorMonitorData[i - 1].type !== row.type
                    return (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: showType ? 600 : 400, borderBottom: showType && i > 0 ? '1px solid rgba(100,120,200,0.2)' : undefined }}>
                          {showType ? row.type : ''}
                        </td>
                        <td style={{ fontSize: 11 }}>{row.name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{row.val}</td>
                        <td><PctBar pct={row.pct} /></td>
                        <td><span className={`signal-tag ${signalColor(row.signal)}`}>{row.signal}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右上：因子时序图 */}
          <div className="bento-card mcard-timeseries">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />因子历史走势</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {factorCategories.map((cat, i) => (
                  <button key={i} className={`mini-tab ${factorTab === i ? 'active' : ''}`} onClick={() => setFactorTab(i)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Chart option={factorTimeOption} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右中左：情绪雷达 */}
          <div className="bento-card mcard-radar">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />情绪雷达</span>
            </div>
            <Chart option={radarOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右中右：因子相关性 */}
          <div className="bento-card mcard-corr">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />因子相关性矩阵</span>
            </div>
            <Chart option={corrOption} style={{ flex: 1, minHeight: 0 }} />
          </div>
        </div>
      )}

      {/* ==================== TAB 1: 状态分析 ==================== */}
      {tab === 1 && (
        <div className="market-grid-regime">
          {/* 左上：Regime历史状态色带 */}
          <div className="bento-card mreg-history">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />市场环境历史状态 (2019-2025)</span>
            </div>
            <Chart option={historyOption} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右上：净值走势+Regime色带 */}
          <div className="bento-card mreg-nav">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />策略净值 × 市场状态</span>
            </div>
            <Chart option={navWithRegime} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 左下：HMM转移矩阵 */}
          <div className="bento-card mreg-matrix">
            <div className="card-title" style={{ fontSize: 13, marginBottom: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />HMM状态转移矩阵</span>
            </div>
            <table className="factor-table" style={{ fontSize: 12, flex: 1, height: '100%' }}>
              <thead>
                <tr>
                  <th style={{ fontSize: 11, padding: '12px 8px' }}>当前＼未来</th>
                  {hmmTransition.states.map((s, i) => <th key={i} style={{ fontSize: 11, textAlign: 'center', padding: '12px 8px' }}>{s}</th>)}
                </tr>
              </thead>
              <tbody>
                {hmmTransition.states.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: 12, padding: '12px 8px' }}>{s}</td>
                    {hmmTransition.matrix[i].map((v, j) => (
                      <td key={j} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center',
                        color: i === j ? COLORS.blue : v > 0.1 ? COLORS.orange : 'var(--text-muted)',
                        fontWeight: i === j ? 700 : 400,
                        background: i === j ? 'rgba(64,158,255,0.08)' : 'transparent',
                        padding: '12px 8px'
                      }}>
                        {v.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>基于HMM模型估计的Markov状态转移概率</div>
          </div>

          {/* 中下：桑基图 */}
          <div className="bento-card mreg-sankey">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />状态转移桑基图</span>
            </div>
            <Chart option={sankeyOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右下：当前推荐配置 + 风险仪表 + 策略信号 */}
          <div className="bento-card mreg-combo">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />当前配置 · 信号</span>
            </div>
            <div style={{ display: 'flex', flex: 1, gap: 8, minHeight: 0 }}>
              {/* 左半：饼图 */}
              <div style={{ flex: 1, minHeight: 0 }}>
                <Chart option={portfolioOpt} style={{ height: '100%', minHeight: 0 }} />
              </div>
              {/* 右半：信号列表 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚆ 市场信号</span>
                  <span className="regime-badge sideways" style={{ padding: '1px 8px', fontSize: 10 }}>震荡市</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚆ 调仓信号</span>
                  <span style={{ padding: '1px 8px', fontSize: 10, borderRadius: 3, background: 'rgba(226,85,85,0.15)', color: COLORS.red }}>部分调仓</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>⚆ 调仓建议</span>
                  <span style={{ textAlign: 'right', maxWidth: 100, fontSize: 10, color: 'var(--text)' }}>增加红利ETF 降低行业仓位</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚆ 下次调仓</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>2025-07-01</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>⚆ HMM置信度</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: COLORS.blue }}>78%</span>
                </div>
                {/* 风险指标 mini grid */}
                <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                  {[
                    { label: '胜率', value: '58.6%' },
                    { label: '盈亏比', value: '1.45' },
                    { label: 'Calmar', value: '1.01' },
                    { label: '跟踪误差', value: '6.23%' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
