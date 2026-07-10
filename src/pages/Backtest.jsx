import React, { useState } from 'react'
import Chart from '../components/charts/Chart'
import {
  backtestData, monthlyReturns, metricsComparison, annualReturns, rollingMetrics, ablationData
} from '../data/mockData'
import {
  navLineOption, drawdownOption, calendarHeatmapOption, groupBarOption, factorLineOption, COLORS
} from '../utils/chartOptions'

export default function Backtest() {
  const [tab, setTab] = useState(0) // 0: 综合表现与分析, 1: 消融实验与归因
  const [miniTab, setMiniTab] = useState('heatmap') // 'heatmap' or 'rolling'

  // ---- 图表配置 ----
  const navOpt = {
    ...navLineOption(backtestData.dates, backtestData.strategies, backtestData.regimes),
    grid: { top: 20, right: 15, bottom: 25, left: 45 },
    legend: { ...navLineOption(backtestData.dates, backtestData.strategies, backtestData.regimes).legend, top: 0, right: 10, left: 'auto' }
  }

  const drawdownOpt = {
    ...drawdownOption(backtestData.dates, backtestData.drawdown),
    grid: { top: 10, right: 15, bottom: 25, left: 45 },
  }

  const annualBarOpt = {
    ...groupBarOption(annualReturns.years, annualReturns.strategies),
    grid: { top: 25, right: 10, bottom: 20, left: 35 },
    legend: { show: false }, // 隐藏图例以节省空间，与上方表格对照
  }

  const heatmapOpt = {
    ...calendarHeatmapOption(monthlyReturns),
    grid: { top: 30, right: 10, bottom: 10, left: 40 },
  }

  const rollingOpt = {
    ...factorLineOption(rollingMetrics.dates, [
      { name: '夏普比率', data: rollingMetrics.sharpe, color: COLORS.gold, yAxisIndex: 0 },
      { name: '最大回撤(%)', data: rollingMetrics.maxdd, color: COLORS.bear, yAxisIndex: 1 }
    ]),
    grid: { top: 30, right: 40, bottom: 20, left: 30 },
  }

  const ablationBarOpt = {
    ...groupBarOption(
      ablationData.map(d => d.name),
      [
        { name: '年化收益(%)', data: ablationData.map(d => d.cagr), color: COLORS.green },
        { name: '最大回撤(%)', data: ablationData.map(d => Math.abs(d.maxdd)), color: COLORS.red }
      ]
    ),
    grid: { top: 40, right: 15, bottom: 30, left: 40 },
    legend: { top: 10 }
  }

  return (
    <div className="backtest-page">
      {/* ==================== 顶部信息与Tab栏 ==================== */}
      <div className="backtest-header">
        <div className="backtest-tabs-row">
          <button className={`market-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>
            📈 综合表现与分析
          </button>
          <button className={`market-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
            🔬 消融实验与归因
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>测试区间：<span style={{ color: COLORS.blue, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>2019-01 ~ 2025-06</span></span>
            <span>初始资金：<span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>¥1,000,000</span></span>
            <span>无风险利率：<span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>2.0%</span></span>
          </div>
        </div>
      </div>

      {/* ==================== TAB 0: 综合表现与分析 ==================== */}
      {tab === 0 && (
        <div className="backtest-grid-0">
          
          {/* 左上: 策略净值走势 */}
          <div className="bento-card bt-nav-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="title-dot" />策略净值走势（含HMM状态色带）
              </span>
            </div>
            <Chart option={navOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 左下: 每日回撤深度图 */}
          <div className="bento-card bt-drawdown-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="title-dot" />策略最大回撤深度 (%)
              </span>
            </div>
            <Chart option={drawdownOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

          {/* 右上: 核心指标与年度收益 (合在一个区块中，上下排布) */}
          <div className="bt-metrics-card">
            <div className="bento-card" style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
              <div className="card-title" style={{ fontSize: 12, marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="title-dot" />核心指标横评
                </span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="factor-table" style={{ width: '100%', fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>策略名称</th>
                      <th style={{ textAlign: 'right' }}>年化收益</th>
                      <th style={{ textAlign: 'right' }}>夏普比率</th>
                      <th style={{ textAlign: 'right' }}>最大回撤</th>
                      <th style={{ textAlign: 'right' }}>波动率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricsComparison.map((m, i) => (
                      <tr key={i} style={{ background: i === 0 ? 'rgba(64,158,255,0.08)' : 'transparent' }}>
                        <td style={{ fontWeight: i === 0 ? 700 : 500, color: i === 0 ? COLORS.blue : 'var(--text)' }}>
                          {i === 0 ? '★ ' : ''}{m.strategy}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: COLORS.green, fontWeight: i === 0 ? 700 : 400 }}>{m.cagr}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: COLORS.gold }}>{m.sharpe}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: COLORS.red }}>{m.maxdd}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{m.volatility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bento-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="title-dot" />年度收益对比 (%)
                </span>
              </div>
              <Chart option={annualBarOpt} style={{ flex: 1, minHeight: 0 }} />
            </div>
          </div>

          {/* 右下: 热力图 / 滚动风险 (Mini-tab) */}
          <div className="bento-card bt-heatmap-card">
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0, justifyContent: 'space-between', display: 'flex', width: '100%' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="title-dot" />{miniTab === 'heatmap' ? '月度收益日历热力图 (%)' : '1年滚动风险收益特征'}
               </span>
               <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.2)', padding: 2, borderRadius: 4 }}>
                  <button onClick={() => setMiniTab('heatmap')} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, background: miniTab === 'heatmap' ? 'rgba(255,255,255,0.1)' : 'transparent', color: miniTab === 'heatmap' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>热力图</button>
                  <button onClick={() => setMiniTab('rolling')} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 2, background: miniTab === 'rolling' ? 'rgba(255,255,255,0.1)' : 'transparent', color: miniTab === 'rolling' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>滚动风险</button>
               </div>
            </div>
            <Chart option={miniTab === 'heatmap' ? heatmapOpt : rollingOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

        </div>
      )}

      {/* ==================== TAB 1: 消融实验与归因 ==================== */}
      {tab === 1 && (
        <div className="backtest-grid-1">
          
          {/* 左列: 消融实验列表 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
             <div className="card-title" style={{ fontSize: 12, marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="title-dot" />模块贡献归因分析
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>从上至下为各模块移除后的表现衰减</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                {ablationData.map((item, i) => (
                  <div key={i} style={{ 
                    border: '1px solid',
                    borderColor: i === 0 ? 'rgba(64,158,255,0.3)' : 'var(--border)', 
                    background: i === 0 ? 'rgba(64,158,255,0.05)' : 'rgba(255,255,255,0.02)', 
                    padding: '12px 14px', 
                    borderRadius: 6 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? COLORS.blue : 'var(--text)' }}>
                        <span style={{ marginRight: 6 }}>{item.icon}</span>{item.name}
                      </div>
                      <div style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, color: 'var(--text-muted)' }}>
                        缺失: <span style={{ color: 'var(--text-secondary)' }}>{item.removed}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 6, marginTop: 4 }}>
                      <div style={{ flex: 1 }}><span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>夏普比率</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: COLORS.gold }}>{item.sharpe}</span></div>
                      <div style={{ flex: 1 }}><span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>年化收益</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: COLORS.green }}>{item.cagr}%</span></div>
                      <div style={{ flex: 1 }}><span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>最大回撤</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: COLORS.red }}>{item.maxdd}%</span></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* 右列: 消融实验对比柱状图 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-title" style={{ fontSize: 12, marginBottom: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="title-dot" />模块剥离对核心指标的直观影响
                </span>
             </div>
             <Chart option={ablationBarOpt} style={{ flex: 1, minHeight: 0 }} />
          </div>

        </div>
      )}

    </div>
  )
}
