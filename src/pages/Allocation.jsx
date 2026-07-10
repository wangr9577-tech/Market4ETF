import React, { useState } from 'react'
import Chart from '../components/charts/Chart'
import {
  currentRegime, regimePortfolios, efficientFrontier, rebalanceHistory
} from '../data/mockData'
import {
  ringPieOption, scatterOption, radarOption, COLORS
} from '../utils/chartOptions'

/* ========== 常量 ========== */

const REGIMES = [
  { key: 'bull', label: '🐂 牛市', cls: 'active-bull', color: COLORS.red },
  { key: 'bear', label: '🐻 熊市', cls: 'active-bear', color: COLORS.green },
  { key: 'sideways', label: '〰️ 震荡', cls: 'active-sideways', color: COLORS.orange },
  { key: 'high-vol', label: '⚡ 高波动', cls: 'active-highvol', color: COLORS.purple },
]

const PROFILES = {
  bull: { ret: 25.4, vol: 18.2, sharpe: 1.35, mdd: -15.6, sortino: 1.72, calmar: 1.63 },
  bear: { ret: 5.2, vol: 6.5, sharpe: 0.85, mdd: -4.2, sortino: 1.05, calmar: 1.24 },
  sideways: { ret: 8.5, vol: 10.2, sharpe: 1.05, mdd: -8.5, sortino: 1.32, calmar: 1.00 },
  'high-vol': { ret: 3.5, vol: 8.5, sharpe: 0.65, mdd: -5.5, sortino: 0.82, calmar: 0.64 },
}

// 因子暴露模拟数据
const FACTOR_EXPOSURE = {
  bull: [30, 90, 70, 85, 20],
  bear: [80, 20, 85, 30, 90],
  sideways: [60, 40, 75, 50, 70],
  'high-vol': [70, 30, 80, 40, 85],
}

// BL主观观点矩阵数据
const blViews = [
  { view: '沪深300 > 中证500 by 3%', conf: '80%', source: '估值面' },
  { view: '黄金ETF > 债券ETF by 2%', conf: '60%', source: '宏观对冲' },
  { view: '红利ETF绝对收益 8%', conf: '70%', source: '股息率模型' },
]

// 全量ETF池
const coreETFs = Array.from(
  new Map(
    Object.values(regimePortfolios).flatMap(p => p.etfs).map(e => [e.code, e])
  ).values()
)

const dummyETFs = [
  { code: '510050', name: '上证50ETF' }, { code: '159915', name: '创业板ETF' },
  { code: '512880', name: '证券ETF' }, { code: '512000', name: '券商ETF' },
  { code: '512200', name: '房地产ETF' }, { code: '512690', name: '酒ETF' },
  { code: '159928', name: '消费ETF' }, { code: '512660', name: '军工ETF' },
  { code: '512760', name: '芯片ETF' }, { code: '159995', name: '芯片ETF' },
  { code: '515050', name: '5GETF' }, { code: '515790', name: '光伏ETF' },
  { code: '159992', name: '创新药ETF' }, { code: '512010', name: '医药ETF' },
  { code: '512170', name: '医疗ETF' }, { code: '513050', name: '中概互联' },
  { code: '513180', name: '恒生科技' }, { code: '513100', name: '纳指ETF' },
  { code: '513500', name: '标普500ETF' }, { code: '511260', name: '十年国债' },
  { code: '159937', name: '中证500ETF' }, { code: '510500', name: '中证500' },
  { code: '159949', name: '创业板50' }, { code: '512480', name: '半导体ETF' },
  { code: '159806', name: '新能源ETF' }, { code: '515030', name: '新能车ETF' },
  { code: '516110', name: '汽车ETF' }, { code: '512800', name: '银行ETF' },
  { code: '512980', name: '传媒ETF' }, { code: '512670', name: '国防军工' },
  { code: '518880', name: '黄金ETF' }, { code: '511010', name: '国债ETF' }
]

const allETFs = [...coreETFs, ...dummyETFs.filter(d => !coreETFs.find(c => c.code === d.code))]

/* ========== 子组件 ========== */

/** 紧凑 KPI 数字 */
const KPICell = ({ label, value, color, unit = '' }) => (
  <div className="alloc-kpi-cell">
    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
    <div style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1.2 }}>
      {value}<span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>{unit}</span>
    </div>
  </div>
)

/** 权重对比条 */
const WeightBar = ({ weight, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 80 }}>
    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
      <div style={{ width: `${weight}%`, height: '100%', borderRadius: 3, background: color || COLORS.blue, transition: 'width 0.4s ease' }} />
    </div>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--text)', minWidth: 28, textAlign: 'right' }}>{weight}%</span>
  </div>
)

/* ========== 主组件 ========== */

export default function Allocation() {
  const [tab, setTab] = useState(0)        // 0=组合配置, 1=优化与对比
  const [regime, setRegime] = useState(currentRegime.regime)

  const portfolio = regimePortfolios[regime]
  const profile = PROFILES[regime]
  const currentRegimeInfo = REGIMES.find(r => r.key === regime)

  // ---- 环形图 ----
  const pieOpt = {
    ...ringPieOption(portfolio.etfs, portfolio.label),
    legend: { show: false },
    series: [{
      ...ringPieOption(portfolio.etfs).series[0],
      radius: ['45%', '72%'], center: ['50%', '50%'],
      label: {
        show: true, fontSize: 9, color: COLORS.textMuted,
        formatter: '{b}\n{d}%', position: 'outside',
        lineHeight: 13,
      },
      labelLine: { length: 8, length2: 6 },
    }],
  }

  // ---- 因子暴露雷达图 ----
  const factorIndicators = [
    { name: '价值', max: 100 },
    { name: '成长', max: 100 },
    { name: '质量', max: 100 },
    { name: '动量', max: 100 },
    { name: '低波', max: 100 },
  ]
  const factorRadarOpt = {
    ...radarOption(factorIndicators, []),
    radar: {
      indicator: factorIndicators,
      shape: 'polygon', splitNumber: 3,
      center: ['50%', '55%'], radius: '60%',
      axisName: { color: COLORS.textMuted, fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(100,120,200,0.12)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(20,29,82,0.3)'] } },
      axisLine: { lineStyle: { color: 'rgba(100,120,200,0.12)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: FACTOR_EXPOSURE[regime], name: currentRegimeInfo.label,
        lineStyle: { color: currentRegimeInfo.color, width: 2 },
        itemStyle: { color: currentRegimeInfo.color },
        areaStyle: { color: currentRegimeInfo.color + '30' },
      }],
    }],
  }

  // ---- 有效前沿 ----
  const frontierOpt = {
    ...scatterOption(efficientFrontier.points, efficientFrontier.optimal),
    grid: { top: 25, right: 15, bottom: 30, left: 45 },
  }

  // ---- 四Regime对比雷达 ----
  const compareIndicators = [
    { name: '收益预期', max: 30 },
    { name: '抗跌能力', max: 100 },
    { name: '夏普比率', max: 2 },
    { name: '低波动', max: 100 },
    { name: '稳定性', max: 2 },
  ]
  const regimeRadarData = [
    { name: '牛市', value: [PROFILES.bull.ret, 100 - Math.abs(PROFILES.bull.mdd) * 3, PROFILES.bull.sharpe, 100 - PROFILES.bull.vol * 3, PROFILES.bull.calmar], color: COLORS.red },
    { name: '熊市', value: [PROFILES.bear.ret, 100 - Math.abs(PROFILES.bear.mdd) * 3, PROFILES.bear.sharpe, 100 - PROFILES.bear.vol * 3, PROFILES.bear.calmar], color: COLORS.green },
    { name: '震荡', value: [PROFILES.sideways.ret, 100 - Math.abs(PROFILES.sideways.mdd) * 3, PROFILES.sideways.sharpe, 100 - PROFILES.sideways.vol * 3, PROFILES.sideways.calmar], color: COLORS.orange },
    { name: '高波动', value: [PROFILES['high-vol'].ret, 100 - Math.abs(PROFILES['high-vol'].mdd) * 3, PROFILES['high-vol'].sharpe, 100 - PROFILES['high-vol'].vol * 3, PROFILES['high-vol'].calmar], color: COLORS.purple },
  ]
  const compareRadarOpt = {
    ...radarOption(compareIndicators, []),
    radar: {
      indicator: compareIndicators,
      shape: 'polygon', splitNumber: 4,
      center: ['50%', '55%'], radius: '65%',
      axisName: { color: COLORS.textMuted, fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(100,120,200,0.12)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(20,29,82,0.3)'] } },
      axisLine: { lineStyle: { color: 'rgba(100,120,200,0.12)' } },
    },
    legend: { show: true, bottom: 0, itemWidth: 10, itemHeight: 8, textStyle: { fontSize: 10, color: COLORS.textMuted } },
    series: [{
      type: 'radar',
      data: regimeRadarData.map(d => ({
        value: d.value, name: d.name,
        lineStyle: { color: d.color, width: 1.5 },
        itemStyle: { color: d.color },
        areaStyle: { color: d.color + '18' },
      })),
    }],
  }

  // ---- 各Regime权重对比柱状图 ----
  const etfNames = [...new Set(Object.values(regimePortfolios).flatMap(p => p.etfs.map(e => e.name)))]
  const regimeBarOpt = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: "'Inter', sans-serif", color: COLORS.text },
    grid: { top: 25, right: 10, bottom: 30, left: 70 },
    tooltip: { trigger: 'axis', backgroundColor: COLORS.bgAlt, borderColor: COLORS.border, textStyle: { color: COLORS.text, fontSize: 11 } },
    legend: { show: true, top: 0, right: 0, itemWidth: 10, itemHeight: 8, textStyle: { fontSize: 9, color: COLORS.textMuted } },
    xAxis: { type: 'value', max: 40, axisLabel: { fontSize: 10, color: COLORS.textMuted, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(100,120,200,0.08)' } } },
    yAxis: { type: 'category', data: etfNames, axisLabel: { fontSize: 9, color: COLORS.textMuted }, axisLine: { show: false }, axisTick: { show: false } },
    series: REGIMES.map(r => ({
      name: r.label.replace(/[🐂🐻⚡]/g, '').replace('〰️ ', ''),
      type: 'bar', stack: null,
      data: etfNames.map(name => {
        const etf = regimePortfolios[r.key].etfs.find(e => e.name === name)
        return etf ? etf.weight : 0
      }),
      itemStyle: { color: r.color + 'CC', borderRadius: [0, 2, 2, 0] },
      barMaxWidth: 8,
    })),
  }

  return (
    <div className="alloc-page">
      {/* ==================== REGIME SELECTOR + KPIs ==================== */}
      <div className="alloc-header">
        {/* Regime选择器 */}
        <div className="alloc-regime-bar">
          {REGIMES.map(r => (
            <button
              key={r.key}
              className={`regime-tab ${regime === r.key ? r.cls : ''}`}
              onClick={() => setRegime(r.key)}
              style={{ padding: '4px 14px', fontSize: 12 }}
            >
              {r.label}
            </button>
          ))}
        </div>
        {/* KPI 指标 */}
        <div className="alloc-kpi-row">
          <KPICell label="预期收益" value={`${profile.ret}%`} color={COLORS.green} />
          <KPICell label="波动率" value={`${profile.vol}%`} color="var(--text)" />
          <KPICell label="夏普比率" value={profile.sharpe} color={COLORS.gold} />
          <KPICell label="最大回撤" value={`${profile.mdd}%`} color={COLORS.red} />
          <KPICell label="Sortino" value={profile.sortino} color={COLORS.blue} />
          <KPICell label="Calmar" value={profile.calmar} color={COLORS.cyan} />
        </div>
        {/* Tab切换 + 状态 */}
        <div className="alloc-tabs-row">
          <button className={`market-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>
            🎯 组合配置
          </button>
          <button className={`market-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
            📐 优化与对比
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            当前环境:
            <span className={`regime-badge ${regime === 'high-vol' ? 'high-vol' : regime}`} style={{ padding: '1px 8px', fontSize: 10 }}>
              {portfolio.label}
            </span>
          </span>
        </div>
      </div>

      {/* ==================== TAB 0: 组合配置 ==================== */}
      {tab === 0 && (
        <div className="alloc-grid-0">
          
          {/* 左上: ETF持仓明细表 (2列宽) */}
          <div className="bento-card alloc-table-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="title-dot" />
                {portfolio.label} — 核心持仓明细
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{portfolio.etfs.length}只资产</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="factor-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: 70, padding: '12px 8px', fontSize: 12 }}>代码</th>
                    <th style={{ padding: '12px 8px', fontSize: 12 }}>名称</th>
                    <th style={{ width: 60, padding: '12px 8px', fontSize: 12 }}>类型</th>
                    <th style={{ width: 60, padding: '12px 8px', fontSize: 12 }}>费率</th>
                    <th style={{ width: 60, padding: '12px 8px', fontSize: 12 }}>规模</th>
                    <th style={{ width: 60, padding: '12px 8px', fontSize: 12 }}>跟踪</th>
                    <th style={{ width: 110, padding: '12px 8px', fontSize: 12 }}>配置权重</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.etfs.map((etf, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: COLORS.blue, fontSize: 13, padding: '12px 8px' }}>{etf.code}</td>
                      <td style={{ fontWeight: 600, fontSize: 13, padding: '12px 8px', color: 'var(--text)' }}>{etf.name}</td>
                      <td style={{ padding: '12px 8px' }}><span style={{ fontSize: 11, padding: '3px 6px', borderRadius: 4, background: 'rgba(100,120,200,0.1)', color: 'var(--text-secondary)' }}>{etf.type}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '12px 8px' }}>{etf.fee.toFixed(2)}%</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '12px 8px' }}>{etf.scale}亿</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '12px 8px' }}>{etf.tracking.toFixed(2)}%</td>
                      <td style={{ padding: '12px 8px' }}><WeightBar weight={etf.weight} color={currentRegimeInfo?.color} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右上1: 权重环形图 */}
          <div className="bento-card alloc-pie-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />权重分布</span>
            </div>
            <Chart option={pieOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右上2: 因子暴露雷达图 */}
          <div className="bento-card alloc-radar-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />组合因子暴露</span>
            </div>
            <Chart option={factorRadarOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 左下: 全量ETF池 */}
          <div className="bento-card alloc-pool-card">
             <div className="card-title" style={{ fontSize: 13, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="title-dot" />全量候选ETF池监控
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>共 {allETFs.length} 只</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px', overflowY: 'auto', alignContent: 'flex-start' }}>
              {allETFs.map((etf, i) => {
                const isActive = portfolio.etfs.some(e => e.code === etf.code)
                return (
                  <span key={i} style={{
                    fontSize: 12, fontFamily: 'var(--font-mono)',
                    padding: '4px 10px', borderRadius: 4,
                    background: isActive ? 'rgba(64,158,255,0.12)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? COLORS.blue : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(64,158,255,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                    cursor: 'default'
                  }}>
                    {etf.code} {etf.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* 中下: BL观点 */}
          <div className="bento-card alloc-bl-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />B-L 主观观点矩阵</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="factor-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px', fontSize: 12 }}>主观观点 (Views)</th>
                    <th style={{ width: 55, padding: '12px 8px', fontSize: 12 }}>置信度</th>
                    <th style={{ width: 70, padding: '12px 8px', fontSize: 12 }}>信号源</th>
                  </tr>
                </thead>
                <tbody>
                  {blViews.map((v, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12, color: 'var(--text-bright)', padding: '12px 8px' }}>{v.view}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: COLORS.gold, padding: '12px 8px' }}>{v.conf}</td>
                      <td style={{ padding: '12px 8px' }}><span style={{ fontSize: 10, padding: '3px 6px', borderRadius: 4, background: 'rgba(100,120,200,0.1)', color: 'var(--text-secondary)' }}>{v.source}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右下: 调仓记录 */}
          <div className="bento-card alloc-history-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />最新调仓流水</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {rebalanceHistory.slice(0, 5).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 12, alignItems: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 80, flexShrink: 0, fontSize: 13 }}>{item.date.slice(5)}</span>
                  <span style={{ flex: 1, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 1: 优化与对比 ==================== */}
      {tab === 1 && (
        <div className="alloc-grid-1">
          {/* 左上：有效前沿 */}
          <div className="bento-card alloc-frontier">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />Markowitz 有效前沿</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>★ 最优组合: 风险{efficientFrontier.optimal.risk}% / 收益{efficientFrontier.optimal.return}%</span>
            </div>
            <Chart option={frontierOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右上：四Regime组合对比雷达 */}
          <div className="bento-card alloc-compare-radar">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />四环境组合对比</span>
            </div>
            <Chart option={compareRadarOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 下方：各Regime权重分布对比 */}
          <div className="bento-card alloc-weight-compare">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />各环境ETF权重对比</span>
            </div>
            <Chart option={regimeBarOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右下：指标对比表 */}
          <div className="bento-card alloc-metrics-table">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="title-dot" />四环境指标横评</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="factor-table" style={{ width: '100%', flex: 1, height: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: 65, padding: '14px 8px', fontSize: 12 }}>环境</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>收益</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>波动</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>夏普</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>回撤</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>Sortino</th>
                    <th style={{ textAlign: 'center', padding: '14px 8px', fontSize: 12 }}>Calmar</th>
                  </tr>
                </thead>
                <tbody>
                  {REGIMES.map((r, i) => {
                    const p = PROFILES[r.key]
                    const isActive = r.key === regime
                    return (
                      <tr key={i} style={{ background: isActive ? 'rgba(64,158,255,0.06)' : 'transparent', cursor: 'pointer' }} onClick={() => setRegime(r.key)}>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                            <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? r.color : 'var(--text)' }}>
                              {r.label.replace(/[🐂🐻⚡]/g, '').replace('〰️ ', '')}
                            </span>
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', color: COLORS.green, fontSize: 13, padding: '14px 8px' }}>{p.ret}%</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', fontSize: 13, padding: '14px 8px' }}>{p.vol}%</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', color: COLORS.gold, fontSize: 14, fontWeight: 700, padding: '14px 8px' }}>{p.sharpe}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', color: COLORS.red, fontSize: 13, padding: '14px 8px' }}>{p.mdd}%</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', fontSize: 13, padding: '14px 8px' }}>{p.sortino}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', fontSize: 13, padding: '14px 8px' }}>{p.calmar}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
