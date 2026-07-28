import React from 'react'
import { Tag, Badge, Calendar } from 'antd'
import Chart from '../components/charts/Chart'
import { rebalanceCalendar, investorProfiles } from '../data/mockData'
import { ringPieOption, COLORS } from '../utils/chartOptions'
import dayjs from 'dayjs'

const FLOW_STEPS = [
  { title: '数据采集', desc: '宏观/估值/行情/情绪', icon: '📡' },
  { title: '因子计算', desc: '标准化 + 特征工程', icon: '🔢' },
  { title: 'Regime识别', desc: 'HMM + XGBoost', icon: '🧠' },
  { title: 'ETF筛选', desc: '候选池构建', icon: '🎯' },
  { title: '权重优化', desc: 'BL + Risk Parity', icon: '⚖️' },
  { title: '风控检查', desc: '回撤/波动率约束', icon: '🛡️' },
  { title: '输出建议', desc: '组合配置报告', icon: '📋' },
]

const TRIGGER_RULES = [
  {
    title: '时间触发', icon: '⏰', color: 'var(--accent-blue)',
    desc: '每月最后一个交易日执行定期检查与再平衡',
    details: ['固定月度频率', '避免过度交易', '系统性执行'],
  },
  {
    title: '状态触发', icon: '🔄', color: 'var(--sideways)',
    desc: 'HMM检测到市场状态切换时立即触发调仓',
    details: ['Regime切换即调仓', '无需等待月末', '响应市场变化'],
  },
  {
    title: '风险触发', icon: '🚨', color: 'var(--bull)',
    desc: '组合回撤超8%或波动率超历史80%分位时触发',
    details: ['回撤 > 8% 降仓', '波动率超限预警', '极端行情保护'],
  },
]

const TYPE_TAG_COLORS = { time: 'blue', state: 'orange', risk: 'red' }
const TYPE_LABELS = { time: '定期', state: '状态', risk: '风险' }

export default function Deploy() {
  // 日历数据标注
  const calendarMap = {}
  rebalanceCalendar.forEach((item) => { calendarMap[item.date] = item })

  const dateCellRender = (date) => {
    const key = date.format('YYYY-MM-DD')
    const event = calendarMap[key]
    if (!event) return null
    return (
      <div style={{ fontSize: '0.65rem', lineHeight: 1.3 }}>
        <Tag color={TYPE_TAG_COLORS[event.type]} style={{ fontSize: '0.6rem', padding: '0 4px' }}>
          {TYPE_LABELS[event.type]}
        </Tag>
      </div>
    )
  }

  return (
    <div className="stack">
      <div className="page-header">
        <h1>落地方案</h1>
        <p>从数据采集到投顾输出的自动化流水线 · 可部署于银行财富管理与基金投顾场景</p>
      </div>

      {/* 系统架构流程图 */}
      <div className="card card-no-hover">
        <div className="card-title">系统自动化流水线</div>
        <div className="flow-steps">
          {FLOW_STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flow-step">
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{step.icon}</div>
                <div className="flow-step-title">{step.title}</div>
                <div className="flow-step-desc">{step.desc}</div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flow-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 调仓规则 */}
      <div className="grid-3">
        {TRIGGER_RULES.map((rule, i) => (
          <div className="card" key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>{rule.icon}</span>
              <span style={{ fontWeight: 700, color: rule.color, fontSize: '1rem' }}>{rule.title}</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              {rule.desc}
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {rule.details.map((d, j) => (
                <li key={j} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: rule.color, flexShrink: 0 }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 调仓日历 + 调仓记录 */}
      <div className="grid-2">
        <div className="card card-no-hover">
          <div className="card-title">2025年调仓日历</div>
          <div style={{ maxHeight: 380, overflow: 'auto' }}>
            <Calendar
              fullscreen={false}
              cellRender={(date) => dateCellRender(date)}
              defaultValue={dayjs('2025-06-15')}
            />
          </div>
        </div>

        <div className="card card-no-hover">
          <div className="card-title">调仓操作记录</div>
          <div className="rebalance-timeline">
            {rebalanceCalendar.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" style={{ background: TYPE_TAG_COLORS[item.type] === 'blue' ? 'var(--accent-blue)' : TYPE_TAG_COLORS[item.type] === 'orange' ? 'var(--sideways)' : 'var(--bull)' }} />
                <div className="timeline-content">
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-action">
                    <Tag color={TYPE_TAG_COLORS[item.type]} style={{ marginRight: 8 }}>
                      {TYPE_LABELS[item.type]}触发
                    </Tag>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 模拟投顾报告 */}
      <div className="card card-no-hover">
        <div className="card-title">📋 模拟投顾报告（2025-06-30）</div>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-bright)', marginBottom: 4 }}>当前市场研判：震荡市</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>HMM模型识别结果 · 置信度 78%</p>
            </div>
            <Tag color="orange" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>〰️ 震荡</Tag>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>操作建议</div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.83rem', color: 'var(--text-primary)' }}>
                <li style={{ padding: '4px 0' }}>✅ 维持均衡配置，宽基30% + 红利20%</li>
                <li style={{ padding: '4px 0' }}>✅ 保留黄金ETF 15% 对冲尾部风险</li>
                <li style={{ padding: '4px 0' }}>✅ 债券ETF 15% 提供组合稳定锚</li>
                <li style={{ padding: '4px 0' }}>⚠️ 关注PMI数据，若连续下行则切换至防御配置</li>
              </ul>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>风险提示</div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.83rem', color: 'var(--text-primary)' }}>
                <li style={{ padding: '4px 0', color: 'var(--sideways)' }}>⚠️ 市场情绪偏中性，需警惕方向选择</li>
                <li style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>📊 PE百分位42%，估值合理</li>
                <li style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>💰 融资余额稳定，无明显异常</li>
                <li style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>📉 30日波动率处于50%分位，中性</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 投资者适配 */}
      <div className="card card-no-hover">
        <div className="card-title">投资者风险适配</div>
        <div className="grid-3" style={{ marginTop: 8 }}>
          {investorProfiles.map((profile, i) => {
            const colors = ['var(--bear)', 'var(--accent-blue)', 'var(--bull)']
            const pieData = Object.entries(profile.allocation).map(([name, value]) => ({ name, weight: value }))

            return (
              <div key={i} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', border: `1px solid ${colors[i]}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>{['🛡️', '⚖️', '🚀'][i]}</span>
                  <span style={{ fontWeight: 700, color: colors[i], fontSize: '1rem' }}>{profile.type}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{profile.desc}</p>

                <Chart
                  option={ringPieOption(pieData, profile.type)}
                  style={{ width: '100%', height: 200 }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>目标收益</span><br /><span style={{ fontFamily: 'var(--font-mono)', color: colors[i] }}>{profile.target.return}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>最大回撤</span><br /><span style={{ fontFamily: 'var(--font-mono)' }}>{profile.target.maxdd}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Sharpe</span><br /><span style={{ fontFamily: 'var(--font-mono)' }}>{profile.target.sharpe}</span></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
