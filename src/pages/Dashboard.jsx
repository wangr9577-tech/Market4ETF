import React from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from '../components/charts/Chart'
import { COLORS } from '../utils/chartOptions'

// Mock Data
const regimeProb = [
  { name: '牛市', value: 45, color: COLORS.green },
  { name: '震荡', value: 38, color: COLORS.blue },
  { name: '熊市', value: 12, color: COLORS.orange },
  { name: '高波动', value: 5, color: COLORS.purple }
]

const recommendedEtfs = [
  { etf: '沪深300ETF', weight: '30%', color: COLORS.blue },
  { etf: '中证1000ETF', weight: '20%', color: COLORS.green },
  { etf: '红利ETF', weight: '15%', color: COLORS.orange },
  { etf: '黄金ETF', weight: '15%', color: COLORS.gold },
  { etf: '国债ETF', weight: '20%', color: COLORS.purple }
]

const hmmTimelineData = {
  years: ['2020', '2021', '2022', '2023', '2024', '2025'],
  series: [
    { name: '牛市', color: COLORS.green, blocks: [[0, 25], [60, 65], [80, 100]] },
    { name: '震荡市', color: COLORS.blue, blocks: [[25, 45], [55, 60], [65, 80]] },
    { name: '熊市', color: COLORS.orange, blocks: [[45, 55], [60, 75]] },
    { name: '高波动', color: COLORS.purple, blocks: [[20, 25], [35, 40], [50, 55], [75, 80], [90, 95]] }
  ]
}

const KpiCard = ({ icon, label, value, subtext, subcolor, trend }) => (
  <div className="bento-card col-span-3" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: subcolor }}>
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: subcolor, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
        较上期: <span style={{ color: subcolor }}>{subtext} {trend}</span>
      </div>
    </div>
  </div>
)

const QuickAccessButton = ({ icon, title, bg, onClick }) => (
  <div onClick={onClick} className="bento-card col-span-3" style={{ padding: '6px 12px', background: bg, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>
      {icon}
    </div>
    <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{title}</div>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1 }}>›</div>
  </div>
)

export default function Dashboard() {
  const navigate = useNavigate();
  const pieOption = (data) => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: ['45%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: data.map(d => ({ name: d.name || d.etf, value: parseInt(d.value || d.weight), itemStyle: { color: d.color } }))
    }]
  })

  return (
    <div className="bento" style={{ paddingBottom: 24, gridTemplateRows: 'auto' }}>
      
      {/* ================= Row 1: Top Metrics ================= */}
      {/* 1. 当前市场环境 */}
      <div className="bento-card col-span-4" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, color: 'var(--text-bright)', fontWeight: 600 }}>当前市场环境</div>
        <div style={{ display: 'flex', marginTop: 12, alignItems: 'center' }}>
          {/* Circular Graphic */}
          <div style={{ width: 110, height: 110, borderRadius: '50%', border: `2px solid rgba(64,158,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'inset 0 0 20px rgba(64,158,255,0.2)' }}>
            <div style={{ position: 'absolute', width: '75%', height: '75%', border: `1px dashed rgba(64,158,255,0.5)`, borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              <svg width="80" height="30" viewBox="0 0 100 40">
                <path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke={COLORS.blue} strokeWidth="2" />
                <path d="M0,20 Q25,40 50,20 T100,20" fill="none" stroke={COLORS.cyan} strokeWidth="1" opacity="0.6" />
              </svg>
            </div>
          </div>
          <div style={{ marginLeft: 20, flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>当前市场</div>
            <div style={{ color: COLORS.gold, fontSize: 12, letterSpacing: 2, margin: '2px 0 4px 0' }}>★★★★<span style={{color: 'var(--text-muted)'}}>☆</span></div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.green }}>震荡市</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>置信度</div>
                <div style={{ fontSize: 16, color: COLORS.green, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>84%</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>风险等级</div>
                <div style={{ fontSize: 16, color: COLORS.gold, fontWeight: 600 }}>中风险</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 'auto', paddingTop: 8 }}>
          ◷ 更新时间: 2025-05-19 15:30:45
        </div>
      </div>

      {/* 2. 市场状态概率 */}
      <div className="bento-card col-span-4" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, color: 'var(--text-bright)', fontWeight: 600, marginBottom: 8 }}>市场状态概率</div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          <div style={{ flex: 1, height: '100%', position: 'relative' }}>
            <Chart option={pieOption(regimeProb)} style={{ height: '140px', width: '100%' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>市场状态</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>概率分布</div>
            </div>
          </div>
          <div style={{ width: 120, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {regimeProb.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
                <span style={{ width: 8, height: 8, background: p.color, borderRadius: 2, marginRight: 8 }} />
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{p.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-bright)' }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 推荐组合 */}
      <div className="bento-card col-span-4" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14, color: 'var(--text-bright)', fontWeight: 600, marginBottom: 8 }}>推荐组合（当前策略）</div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: 4, marginBottom: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <span style={{ flex: 1 }}>ETF</span>
              <span style={{ width: 40, textAlign: 'right' }}>权重</span>
            </div>
            {recommendedEtfs.map((e, i) => (
              <div key={i} style={{ display: 'flex', padding: '4px 0', fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ flex: 1 }}>{e.etf}</span>
                <span style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{e.weight}</span>
              </div>
            ))}
            <div style={{ display: 'flex', paddingTop: 4, marginTop: 4, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-bright)' }}>
              <span style={{ flex: 1 }}>合计</span>
              <span style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>100%</span>
            </div>
          </div>
          <div style={{ flex: 1.2, height: '100%', position: 'relative' }}>
             <Chart option={pieOption(recommendedEtfs)} style={{ height: '120px', width: '100%' }} />
             <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px 6px', marginTop: 4 }}>
                {recommendedEtfs.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 9, color: 'var(--text-muted)' }}>
                    <span style={{ width: 6, height: 6, background: e.color, marginRight: 4 }} /> {e.etf}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ================= Row 2: KPI Cards ================= */}
      <KpiCard icon="📈" label="预计年化收益" value="8.4%" subtext="+0.6%" subcolor={COLORS.green} trend="⬆" />
      <KpiCard icon="🛡️" label="预计波动率" value="12.6%" subtext="-0.8%" subcolor={COLORS.blue} trend="⬇" />
      <KpiCard icon="〽️" label="Sharpe" value="1.03" subtext="+0.07" subcolor={COLORS.purple} trend="⬆" />
      <KpiCard icon="📉" label="最大回撤预测" value="-10.0%" subtext="-1.2%" subcolor={COLORS.orange} trend="⬇" />


      {/* ================= Row 3: Timeline ================= */}
      <div className="bento-card col-span-12" style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, color: 'var(--text-bright)', fontWeight: 600 }}>市场状态时间轴 <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>(HMM识别结果)</span></div>
          <div style={{ display: 'flex', gap: 16 }}>
             {hmmTimelineData.series.map((s, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                 <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, marginRight: 6 }} /> {s.name}
               </div>
             ))}
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: 60, paddingBottom: 20, paddingTop: 4 }}>
          {hmmTimelineData.series.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: 0, width: 50, fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</div>
              <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                {s.blocks.map((b, bi) => (
                  <div key={bi} style={{ position: 'absolute', left: `${b[0]}%`, width: `${b[1]-b[0]}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                ))}
              </div>
            </div>
          ))}

          {/* X Axis */}
          <div style={{ position: 'absolute', bottom: 0, left: 60, right: 0, height: 20, display: 'flex', borderTop: '1px solid var(--border)' }}>
             {hmmTimelineData.years.map((y, i) => (
               <div key={i} style={{ flex: 1, borderLeft: '1px solid var(--border)', position: 'relative' }}>
                 <span style={{ position: 'absolute', left: 4, top: 4, fontSize: 11, color: 'var(--text-muted)' }}>{y}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ================= Row 4: Quick Access ================= */}
      <div className="col-span-12" style={{ fontSize: 14, color: 'var(--text-bright)', fontWeight: 600, marginTop: 0, marginBottom: 0 }}>快速入口</div>
      
      <QuickAccessButton 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>} 
        title="查看市场分析" bg="linear-gradient(135deg, #184c8a, #0b2b54)" onClick={() => navigate('/market')} 
      />
      <QuickAccessButton 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} 
        title="查看资产配置" bg="linear-gradient(135deg, #186b51, #0a3d2c)" onClick={() => navigate('/allocation')} 
      />
      <QuickAccessButton 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} 
        title="查看回测分析" bg="linear-gradient(135deg, #4d3388, #2a1b54)" onClick={() => navigate('/backtest')} 
      />
      <QuickAccessButton 
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>} 
        title="系统设置" bg="linear-gradient(135deg, #b3561b, #70300a)" onClick={() => navigate('/settings')} 
      />

    </div>
  )
}
