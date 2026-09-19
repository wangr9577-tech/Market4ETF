import React from 'react'
import Chart from '../components/charts/Chart'
import {
  backtestData, metricsComparison, annualReturns
} from '../data/mockData'
import {
  navLineOption, drawdownOption, groupBarOption, COLORS
} from '../utils/chartOptions'

export default function Backtest() {

  // 净值走势图
  const navOpt = {
    ...navLineOption(backtestData.dates, backtestData.strategies, backtestData.regimes),
    grid: { top: 25, right: 15, bottom: 25, left: 45 },
    legend: { ...navLineOption(backtestData.dates, backtestData.strategies, backtestData.regimes).legend, top: 0, right: 10, left: 'auto' }
  }

  // 每日回撤曲线图
  const drawdownOpt = {
    ...drawdownOption(backtestData.dates, backtestData.drawdown),
    grid: { top: 20, right: 15, bottom: 25, left: 58 }
  }

  // 分年度收益柱状图
  const annualBarOpt = {
    ...groupBarOption(annualReturns.years, annualReturns.strategies),
    grid: { top: 25, right: 10, bottom: 25, left: 52 },
    legend: { show: true, top: 0, right: 0, textStyle: { fontSize: 16, color: COLORS.textMuted }, itemWidth: 10, itemHeight: 6 }
  }

  return (
    <div className="backtest-page" style={{ height: 'calc(100vh - 64px - 32px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>

      {/* ================= 1. Top Header Strip & Real KPI Snapshot ================= */}
      <div className="card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, whiteSpace: 'nowrap' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', whiteSpace: 'nowrap' }}>
            1232 交易日回测全景 (2021-2026)
          </span>
          <span style={{ fontSize: 16, color: COLORS.green, background: 'rgba(45,199,138,0.12)', padding: '1px 6px', borderRadius: 3, fontWeight: 600, whiteSpace: 'nowrap' }}>
            ● 双边万三扣费
          </span>
        </div>

        {/* Right Real Stats (code/document.md & backtest_results.csv) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: 14 }}>
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>5 年累计收益</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.green, fontFamily: 'var(--font-mono)' }}>
              +54.11% <span style={{ fontSize: 16, color: COLORS.green }}>(超额 +25.7%)</span>
            </div>
          </div>

          <div style={{ borderRight: '1px solid var(--border)', paddingRight: 14 }}>
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>年化 / 夏普</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.gold, fontFamily: 'var(--font-mono)' }}>
              9.26% <span style={{ fontSize: 18, color: COLORS.purple }}>/ 0.493</span>
            </div>
          </div>

          <div style={{ borderRight: '1px solid var(--border)', paddingRight: 14 }}>
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>最大回撤 / 卡玛</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.orange, fontFamily: 'var(--font-mono)' }}>
              -26.15% <span style={{ fontSize: 18, color: COLORS.blue }}>/ 0.354</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>月均换手率</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: COLORS.cyan, fontFamily: 'var(--font-mono)' }}>
              0.30% <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>(万三扣费)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= 2. Main Panorama Body ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        
        {/* Top Row: Nav Curve (65%) + Metrics Table (35%) */}
        <div style={{ flex: 1.4, display: 'flex', gap: 10, minHeight: 0 }}>
          
          {/* Left Card: 4 Strategies Net Value Curve */}
          <div className="bento-card" style={{ flex: 1.35, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-bright)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>4 种策略 5 年净值走势对比 <span style={{ fontSize: 17, color: 'var(--text-muted)', fontWeight: 400 }}>(含 4 大 Regime 色带)</span></span>
              <span style={{ fontSize: 16, color: COLORS.blue, whiteSpace: 'nowrap' }}>扣费回测基准</span>
            </div>
            <div style={{ flex: 1, height: '100%', minHeight: 180 }}>
              <Chart option={navOpt} style={{ height: '100%', width: '100%', minHeight: 180 }} />
            </div>
          </div>

          {/* Right Card: 7 Metrics Comparison Table */}
          <div className="bento-card" style={{ flex: 1.25, padding: '10px 14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-bright)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>4 种策略核心绩效指标横评</span>
              <span style={{ fontSize: 16, color: COLORS.green, background: 'rgba(22, 163, 74, 0.1)', padding: '1px 5px', borderRadius: 3, fontWeight: 600, whiteSpace: 'nowrap' }}>基准对比</span>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1fr) 68px 58px 58px 80px 62px', gap: 6, background: '#f8fafc', padding: '6px 8px', borderRadius: 4, fontSize: 17, color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                <span>策略模型名称</span>
                <span style={{ textAlign: 'right' }}>年化</span>
                <span style={{ textAlign: 'right' }}>夏普</span>
                <span style={{ textAlign: 'right' }}>卡玛</span>
                <span style={{ textAlign: 'right' }}>最大回撤</span>
                <span style={{ textAlign: 'right' }}>月换手</span>
              </div>

              {/* Table Rows */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '2px 0' }}>
                {(metricsComparison || []).map((m, idx) => {
                  const isBest = idx === 0
                  const sharpeVal = parseFloat(m.sharpe).toFixed(3)
                  const calmarVal = parseFloat(m.calmar).toFixed(3)
                  const turnoverVal = m.turnover.replace('/月', '')
                  return (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1fr) 68px 58px 58px 80px 62px', gap: 6, alignItems: 'center', padding: '4px 8px', fontSize: 17.5, borderRadius: 4, borderBottom: '1px solid #f1f5f9', background: isBest ? 'rgba(22, 163, 74, 0.08)' : 'transparent', whiteSpace: 'nowrap' }}>
                      <span style={{ color: isBest ? COLORS.green : 'var(--text-bright)', fontWeight: isBest ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isBest ? `[推荐] ${m.strategy}` : m.strategy}
                      </span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: COLORS.green }}>{m.cagr}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: COLORS.gold, fontWeight: 700 }}>{sharpeVal}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: COLORS.purple }}>{calmarVal}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: COLORS.orange }}>{m.maxdd}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{turnoverVal}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Drawdown (50%) + Annual Returns Bar (50%) */}
        <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
          
          {/* Left Bottom: Drawdown curve */}
          <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--text-bright)', marginBottom: 2, whiteSpace: 'nowrap' }}>
              每日回撤深度曲线 (% Drawdown)
            </div>
            <div style={{ flex: 1, height: '100%', minHeight: 140 }}>
              <Chart option={drawdownOpt} style={{ height: '100%', width: '100%', minHeight: 140 }} />
            </div>
          </div>

          {/* Right Bottom: Annual Returns Bar */}
          <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--text-bright)', marginBottom: 2, whiteSpace: 'nowrap' }}>
              分年度收益率对比柱状图
            </div>
            <div style={{ flex: 1, height: '100%', minHeight: 140 }}>
              <Chart option={annualBarOpt} style={{ height: '100%', width: '100%', minHeight: 140 }} />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
