import React, { useState } from 'react'
import Chart from '../components/charts/Chart'
import {
  currentHoldings
} from '../data/mockData'
import {
  COLORS
} from '../utils/chartOptions'

const REGIMES = [
  { key: 'bull', label: '强牛成长', color: COLORS.green, beta: '0.90', weightBase: '沪深300(35%) + 创业板(35%) + 科创50(15%) + 国债(15%)' },
  { key: 'sideways', label: '震荡轮动', color: COLORS.blue, beta: '0.82', weightBase: '沪深300(20%) + 中证500(20%) + 红利(20%) + 黄金(15%) + 国债(15%) + 医药(10%)' },
  { key: 'bear', label: '滞胀避险', color: COLORS.gold, beta: '0.65', weightBase: '黄金(30%) + 国债(30%) + 货币(20%) + 红利(20%)' },
  { key: 'recovery', label: '底部复苏', color: COLORS.purple, beta: '0.75', weightBase: '中证500(30%) + 新能源(20%) + 芯片(20%) + 红利(20%) + 国债(10%)' }
]

/* 14 只 ETF 真实 30 日走势序列与 20 日收益率 */
const etfGroup1 = [
  { code: '510300.SH', name: '沪深300ETF', cat: '宽基股票', sub: '核心蓝筹', chg: '+4.52%', data: [3.42, 3.44, 3.41, 3.48, 3.50, 3.52, 3.55, 3.53, 3.58, 3.60, 3.62, 3.65] },
  { code: '510500.SH', name: '中证500ETF', cat: '宽基股票', sub: '中盘成长', chg: '+6.18%', data: [5.20, 5.23, 5.18, 5.28, 5.32, 5.36, 5.40, 5.38, 5.45, 5.49, 5.52, 5.58] },
  { code: '588000.SH', name: '科创50ETF', cat: '宽基股票', sub: '硬科技成长', chg: '+9.35%', data: [0.85, 0.86, 0.84, 0.89, 0.91, 0.93, 0.96, 0.95, 0.99, 1.02, 1.04, 1.08] },
  { code: '159915.SZ', name: '创业板ETF', cat: '宽基股票', sub: '创新高成长', chg: '+7.80%', data: [1.80, 1.82, 1.79, 1.86, 1.89, 1.92, 1.95, 1.93, 1.99, 2.02, 2.05, 2.09] },
  { code: '159928.SZ', name: '主要消费ETF', cat: '行业主题', sub: '必选消费', chg: '+3.15%', data: [0.78, 0.79, 0.78, 0.80, 0.81, 0.81, 0.82, 0.82, 0.83, 0.84, 0.84, 0.85] }
]

const etfGroup2 = [
  { code: '512010.SH', name: '医药卫生ETF', cat: '行业主题', sub: '医药医疗', chg: '+2.45%', data: [0.38, 0.38, 0.37, 0.39, 0.39, 0.40, 0.40, 0.41, 0.41, 0.42, 0.42, 0.43] },
  { code: '512480.SH', name: '半导体ETF', cat: '行业主题', sub: '半导体芯片', chg: '+11.20%', data: [0.75, 0.77, 0.74, 0.80, 0.83, 0.85, 0.89, 0.88, 0.92, 0.96, 0.98, 1.04] },
  { code: '159806.SZ', name: '新能源车ETF', cat: '行业主题', sub: '新能源产业链', chg: '+5.60%', data: [1.45, 1.47, 1.44, 1.49, 1.51, 1.53, 1.55, 1.54, 1.58, 1.60, 1.62, 1.65] },
  { code: '512660.SH', name: '中证军工ETF', cat: '行业主题', sub: '国防军工', chg: '+4.10%', data: [0.98, 0.99, 0.97, 1.01, 1.02, 1.03, 1.04, 1.04, 1.06, 1.07, 1.08, 1.09] },
  { code: '510880.SH', name: '上证红利ETF', cat: '策略股票', sub: '高股息红利', chg: '+3.85%', data: [2.85, 2.86, 2.85, 2.88, 2.89, 2.90, 2.91, 2.91, 2.93, 2.94, 2.95, 2.96] }
]

const etfGroup3 = [
  { code: '518880.SH', name: '黄金ETF', cat: '商品对冲', sub: '实物黄金', chg: '+8.45%', data: [5.40, 5.43, 5.42, 5.48, 5.52, 5.56, 5.60, 5.62, 5.68, 5.72, 5.75, 5.82] },
  { code: '159985.SZ', name: '豆粕ETF', cat: '商品对冲', sub: '农产品期货', chg: '+1.92%', data: [1.42, 1.43, 1.42, 1.44, 1.44, 1.45, 1.45, 1.46, 1.46, 1.47, 1.47, 1.48] },
  { code: '511010.SH', name: '国债ETF', cat: '固定收益', sub: '长期国债', chg: '+1.15%', data: [104.2, 104.3, 104.3, 104.4, 104.5, 104.5, 104.6, 104.7, 104.7, 104.8, 104.9, 105.0] },
  { code: '511990.SH', name: '货币ETF', cat: '现金管理', sub: '场内货币基金', chg: '+0.45%', data: [100.0, 100.0, 100.0, 100.0, 100.1, 100.1, 100.1, 100.1, 100.2, 100.2, 100.2, 100.3] }
]

/* 微型 SVG Sparkline 迷你趋势折线图组件 (尺寸 80px * 22px) */
const MiniSparkline = ({ data, color = COLORS.green, width = 80, height = 22 }) => {
  if (!data || data.length === 0) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

const WeightBar = ({ weight, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4 }}>
      <div style={{ width: `${weight}%`, height: '100%', borderRadius: 4, background: color || COLORS.blue, transition: 'width 0.4s ease' }} />
    </div>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', width: 36, textAlign: 'right' }}>{weight}%</span>
  </div>
)

export default function Allocation() {
  const [regimeKey, setRegimeKey] = useState('sideways')

  const currentRegimeObj = REGIMES.find(r => r.key === regimeKey) || REGIMES[1]

  const holdingsMap = {
    bull: [
      { code: '510300.SH', name: '沪深300ETF', cat: '宽基', weight: 35, color: COLORS.green },
      { code: '159915.SZ', name: '创业板ETF', cat: '宽基', weight: 35, color: COLORS.cyan },
      { code: '588000.SH', name: '科创50ETF', cat: '成长', weight: 15, color: COLORS.purple },
      { code: '511010.SH', name: '国债ETF', cat: '固收', weight: 15, color: COLORS.gold }
    ],
    sideways: (currentHoldings || []).map((h, i) => ({
      code: h.code,
      name: h.name,
      cat: i < 2 ? '宽基' : i < 4 ? '红利/商品' : '固收/医药',
      weight: h.weight,
      color: [COLORS.blue, COLORS.green, COLORS.orange, COLORS.gold, COLORS.purple, COLORS.cyan][i % 6]
    })),
    bear: [
      { code: '518880.SH', name: '黄金ETF', cat: '避险', weight: 30, color: COLORS.gold },
      { code: '511010.SH', name: '国债ETF', cat: '固收', weight: 30, color: COLORS.blue },
      { code: '511990.SH', name: '货币ETF', cat: '现金', weight: 20, color: COLORS.purple },
      { code: '510880.SH', name: '红利ETF', cat: '策略', weight: 20, color: COLORS.green }
    ],
    recovery: [
      { code: '510500.SH', name: '中证500ETF', cat: '宽基', weight: 30, color: COLORS.blue },
      { code: '159806.SZ', name: '新能源ETF', cat: '主题', weight: 20, color: COLORS.green },
      { code: '512480.SH', name: '半导体ETF', cat: '主题', weight: 20, color: COLORS.purple },
      { code: '510880.SH', name: '红利ETF', cat: '策略', weight: 20, color: COLORS.gold },
      { code: '511010.SH', name: '国债ETF', cat: '固收', weight: 10, color: COLORS.cyan }
    ]
  }

  const activeHoldings = holdingsMap[regimeKey] || holdingsMap.sideways

  const pieData = activeHoldings.map(h => ({
    name: h.name,
    value: h.weight,
    color: h.color
  }))

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
      data: pieData.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
    }]
  }

  return (
    <div className="alloc-page" style={{ height: 'calc(100vh - 64px - 32px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 10 }}>

      {/* ================= 1. Top Regime Selector Strip ================= */}
      <div className="card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 20, color: 'var(--text-bright)', fontWeight: 700, whiteSpace: 'nowrap' }}>Regime 配置策略:</span>
          {REGIMES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRegimeKey(r.key)}
              style={{
                padding: '5px 14px',
                borderRadius: 5,
                border: `1px solid ${regimeKey === r.key ? r.color : '#e2e8f0'}`,
                background: regimeKey === r.key ? `${r.color}15` : '#ffffff',
                color: regimeKey === r.key ? r.color : 'var(--text-secondary)',
                fontSize: 19,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                boxShadow: regimeKey === r.key ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          <span>风控平滑 β_t: <span style={{ color: currentRegimeObj.color, fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 19 }}>{currentRegimeObj.beta}</span></span>
          <span>调仓采样: <span style={{ color: COLORS.green, fontWeight: 700 }}>Dirichlet 分布</span></span>
          <span>标的池: <span style={{ color: COLORS.blue, fontWeight: 700 }}>14 只代表性 ETF</span></span>
        </div>
      </div>

      {/* ================= 2. Top Half (1.4 Flex): Baseline Table & Pie Chart ================= */}
      <div style={{ flex: 1.4, display: 'flex', gap: 10, minHeight: 0 }}>
        
        {/* Left Table (58% Width) */}
        <div className="bento-card" style={{ flex: 1.4, padding: '10px 14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <span>【{currentRegimeObj.label}】Baseline权重表</span>
            <span style={{ fontSize: 17, color: COLORS.blue, fontWeight: 600 }}>微调权重</span>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', background: '#f8fafc', padding: '5px 8px', borderRadius: 4, fontSize: 18, color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 110 }}>ETF 代码</span>
              <span style={{ flex: 1 }}>标的名称</span>
              <span style={{ width: 90 }}>资产分类</span>
              <span style={{ width: 150 }}>推荐权重</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '2px 0' }}>
              {activeHoldings.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', fontSize: 19, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                  <span style={{ width: 110, fontFamily: 'var(--font-mono)', color: COLORS.blue, fontWeight: 700 }}>{item.code}</span>
                  <span style={{ flex: 1, color: 'var(--text-bright)', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ width: 90, fontSize: 18, color: 'var(--text-muted)' }}>{item.cat}</span>
                  <span style={{ width: 150 }}><WeightBar weight={item.weight} color={item.color} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pie Card (42% Width) */}
        <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4, whiteSpace: 'nowrap' }}>
            持仓权重分布环形图
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 160 }}>
            <div style={{ flex: 1, height: '100%', minHeight: 160, position: 'relative' }}>
              <Chart option={pieOption} style={{ height: '100%', width: '100%', minHeight: 160 }} />
            </div>
            <div style={{ width: 150, display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 8 }}>
              {activeHoldings.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 18, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 9, height: 9, background: h.color, borderRadius: 2, marginRight: 6, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-bright)', fontWeight: 700, fontSize: 19 }}>{h.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ================= 3. Bottom Half (1.1 Flex): 14 只标的 ETF 资源池 ================= */}
      <div style={{ flex: 1.1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, minHeight: 0 }}>
        
        {/* Column 1: 宽基与成长股票 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', background: '#f0f7ff', border: '1px solid #bae0ff' }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.blue, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae0ff', paddingBottom: 4, whiteSpace: 'nowrap' }}>
            <span>宽基与成长 ETF (5只)</span>
            <span style={{ fontSize: 16, background: '#e6f4ff', color: COLORS.blue, padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>30日走势</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {etfGroup1.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#ffffff', borderRadius: 5, border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: COLORS.blue, background: '#e6f4ff', padding: '1px 5px', borderRadius: 3, flexShrink: 0 }}>{item.code}</span>
                  <span style={{ fontSize: 18.5, fontWeight: 600, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <MiniSparkline data={item.data} color={COLORS.blue} width={65} height={18} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: COLORS.green, width: 48, textAlign: 'right' }}>{item.chg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: 行业与策略股票 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', background: '#f9f0ff', border: '1px solid #d3adf7' }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.purple, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d3adf7', paddingBottom: 4, whiteSpace: 'nowrap' }}>
            <span>行业与策略 ETF (5只)</span>
            <span style={{ fontSize: 16, background: '#f9f0ff', color: COLORS.purple, padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>30日走势</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {etfGroup2.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#ffffff', borderRadius: 5, border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: COLORS.purple, background: '#f9f0ff', padding: '1px 5px', borderRadius: 3, flexShrink: 0 }}>{item.code}</span>
                  <span style={{ fontSize: 18.5, fontWeight: 600, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <MiniSparkline data={item.data} color={COLORS.purple} width={65} height={18} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: COLORS.green, width: 48, textAlign: 'right' }}>{item.chg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: 固收与现金 */}
        <div className="bento-card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.gold, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ffe58f', paddingBottom: 4, whiteSpace: 'nowrap' }}>
            <span>固收与现金 ETF (4只)</span>
            <span style={{ fontSize: 16, background: '#fffbe6', color: COLORS.gold, padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>30日走势</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {etfGroup3.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#ffffff', borderRadius: 5, border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: COLORS.gold, background: '#fffbe6', padding: '1px 5px', borderRadius: 3, flexShrink: 0 }}>{item.code}</span>
                  <span style={{ fontSize: 18.5, fontWeight: 600, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <MiniSparkline data={item.data} color={COLORS.gold} width={65} height={18} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: COLORS.green, width: 48, textAlign: 'right' }}>{item.chg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
