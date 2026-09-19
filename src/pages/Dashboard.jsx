import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiseOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  CompassOutlined,
  RightOutlined
} from '@ant-design/icons'
import Chart from '../components/charts/Chart'
import { COLORS } from '../utils/chartOptions'
import { STRATEGY_FULL, DATES, REGIMES } from '../data/mockData'

const currentHoldings = [
  { etf: '沪深300ETF (510300)', weight: '20%', color: COLORS.blue },
  { etf: '中证500ETF (510500)', weight: '20%', color: COLORS.cyan },
  { etf: '上证红利ETF (510880)', weight: '20%', color: COLORS.gold },
  { etf: '华安黄金ETF (518880)', weight: '15%', color: COLORS.orange },
  { etf: '国泰国债ETF (511010)', weight: '15%', color: COLORS.purple },
  { etf: '医药卫生ETF (512010)', weight: '10%', color: COLORS.green }
]

export default function Dashboard() {
  const navigate = useNavigate()

  const navOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border-radius: 6px;',
      textStyle: { color: '#0f172a', fontSize: 19 },
      formatter: (params) => `${params[0].name}<br/>累计净值: <b>${params[0].value}</b>`
    },
    grid: { top: 20, right: 15, bottom: 28, left: 45 },
    xAxis: { type: 'category', data: DATES, axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { fontSize: 16, color: 'var(--text-muted)', margin: 10 } },
    yAxis: { type: 'value', min: 0.9, axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { fontSize: 16, color: 'var(--text-muted)' } },
    series: [{
      type: 'line',
      data: STRATEGY_FULL,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: COLORS.green },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(22, 163, 74, 0.2)' }, { offset: 1, color: 'rgba(22, 163, 74, 0.01)' }] } }
    }]
  }

  const pieOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border-radius: 6px;',
      textStyle: { color: '#0f172a', fontSize: 19 },
      formatter: '{b}: <b>{c}%</b>'
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      label: { show: false },
      itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
      data: currentHoldings.map(d => ({ name: d.etf, value: parseInt(d.weight), itemStyle: { color: d.color } }))
    }]
  }

  return (
    <div style={{ height: 'calc(100vh - 64px - 32px)', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>

      {/* Row 1: KPI Top Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flexShrink: 0 }}>
        
        {/* KPI 1 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>累计收益率 (1232日)</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.green, fontFamily: 'var(--font-mono)' }}>+54.11%</div>
            <div style={{ fontSize: 17, color: COLORS.green, whiteSpace: 'nowrap' }}>超额等权 +25.7%</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(22, 163, 74, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiseOutlined style={{ fontSize: 24, color: COLORS.green }} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>年化收益 / 夏普比率</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.gold, fontFamily: 'var(--font-mono)' }}>9.26% <span style={{ fontSize: 21, color: COLORS.purple }}>/ 0.493</span></div>
            <div style={{ fontSize: 17, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>扣减 2.0% 无风险利率</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThunderboltOutlined style={{ fontSize: 24, color: COLORS.gold }} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>最大回撤 / 卡玛比率</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.orange, fontFamily: 'var(--font-mono)' }}>-26.15% <span style={{ fontSize: 21, color: COLORS.blue }}>/ 0.354</span></div>
            <div style={{ fontSize: 17, color: COLORS.blue, whiteSpace: 'nowrap' }}>优于等权 (-27.2%)</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SafetyCertificateOutlined style={{ fontSize: 24, color: COLORS.orange }} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Market Regime 识别</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.blue, whiteSpace: 'nowrap' }}>【震荡轮动】</div>
            <div style={{ fontSize: 17, color: COLORS.green, whiteSpace: 'nowrap' }}>置信度 84.0% (DFM)</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(22, 119, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompassOutlined style={{ fontSize: 24, color: COLORS.blue }} />
          </div>
        </div>

      </div>

      {/* Row 2: Main Body (Net Value Curve + Asset Allocation Pie) */}
      <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>
        
        {/* Left Net Value Curve (65% Width) */}
        <div className="bento-card" style={{ flex: 1.6, padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <span>策略 5 年全景净值走势</span>
            <span style={{ fontSize: 17, color: COLORS.green }}>● 双边万三扣费</span>
          </div>
          <div style={{ flex: 1, height: '100%', minHeight: 180 }}>
            <Chart option={navOption} style={{ height: '100%', width: '100%', minHeight: 180 }} />
          </div>
        </div>

        {/* Right Asset Allocation Pie (35% Width) */}
        <div className="bento-card" style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4, whiteSpace: 'nowrap' }}>
            当前 ETF 推荐持仓分布
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 180 }}>
            <div style={{ flex: 1, height: '100%', minHeight: 180 }}>
              <Chart option={pieOption} style={{ height: '100%', width: '100%', minHeight: 180 }} />
            </div>
            <div style={{ width: 175, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {currentHoldings.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', fontSize: 18 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: item.color, marginRight: 6, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.etf}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-bright)' }}>{item.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flexShrink: 0 }}>
        
        <div onClick={() => navigate('/market')} className="bento-card" style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0f7ff', border: '1px solid #bae0ff' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue, whiteSpace: 'nowrap' }}>市场分析 (Market)</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap' }}>六面图指标 + AI舆情漏斗</div>
          </div>
          <RightOutlined style={{ fontSize: 18, color: COLORS.blue }} />
        </div>

        <div onClick={() => navigate('/allocation')} className="bento-card" style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f6ffed', border: '1px solid #b7eb8f' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, whiteSpace: 'nowrap' }}>资产配置 (Allocation)</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap' }}>Regime策略 + 14只ETF</div>
          </div>
          <RightOutlined style={{ fontSize: 18, color: COLORS.green }} />
        </div>

        <div onClick={() => navigate('/backtest')} className="bento-card" style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.gold, whiteSpace: 'nowrap' }}>回测分析 (Backtest)</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap' }}>4 方案核心绩效横评</div>
          </div>
          <RightOutlined style={{ fontSize: 18, color: COLORS.gold }} />
        </div>

        <div onClick={() => navigate('/settings')} className="bento-card" style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f0ff', border: '1px solid #d3adf7' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.purple, whiteSpace: 'nowrap' }}>系统设置 (Settings)</div>
            <div style={{ fontSize: 17, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap' }}>超参数与创新点总览</div>
          </div>
          <RightOutlined style={{ fontSize: 18, color: COLORS.purple }} />
        </div>

      </div>

    </div>
  )
}
