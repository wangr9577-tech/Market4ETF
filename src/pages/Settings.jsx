import React, { useState } from 'react'
import { COLORS } from '../utils/chartOptions'

const PARAMS = [
  { key: '1', module: 'HMM状态识别', name: '观察期窗口', value: '252天', type: 'Integer' },
  { key: '2', module: 'HMM状态识别', name: '平滑系数 (lambda)', value: '0.05', type: 'Float' },
  { key: '3', module: 'HMM状态识别', name: '最大隐藏状态数', value: '4', type: 'Integer' },
  { key: '4', module: 'HMM状态识别', name: '转移概率更新周期', value: '30天', type: 'Integer' },
  { key: '5', module: 'Black-Litterman', name: '基准权重先验', value: '市盈率倒数', type: 'Enum' },
  { key: '6', module: 'Black-Litterman', name: '观点置信度上限', value: '0.8', type: 'Float' },
  { key: '7', module: 'Black-Litterman', name: '协方差半衰期', value: '60天', type: 'Integer' },
  { key: '8', module: 'Black-Litterman', name: '风险厌恶系数 (δ)', value: '2.5', type: 'Float' },
  { key: '9', module: '风险控制', name: '最大单日回撤阈值', value: '-3.0%', type: 'Float' },
  { key: '10', module: '风险控制', name: '连续亏损止损天数', value: '5天', type: 'Integer' },
  { key: '11', module: '风险控制', name: '波动率偏离度警报', value: '+1.5σ', type: 'Float' },
  { key: '12', module: '资产配置', name: '单资产权重上限', value: '40%', type: 'Float' },
  { key: '13', module: '资产配置', name: '单行业暴露上限', value: '30%', type: 'Float' },
  { key: '14', module: '交易执行', name: '滑点假设', value: '0.001', type: 'Float' },
  { key: '15', module: '交易执行', name: '单笔最大订单金额', value: '¥5,000,000', type: 'Float' },
  { key: '16', module: '系统底层', name: '缓存刷新频率', value: '300s', type: 'Integer' },
  { key: '17', module: '系统底层', name: '日志保留周期', value: '90天', type: 'Integer' },
]

const DATA_SOURCES = [
  { key: '1', source: 'Wind API', type: '宏观基本面', status: '正常', lastUpdate: '10分钟前', latency: '45ms' },
  { key: '2', source: 'Tushare', type: '日线行情', status: '正常', lastUpdate: '5分钟前', latency: '120ms' },
  { key: '3', source: '同花顺iFinD', type: '估值因子', status: '正常', lastUpdate: '1小时前', latency: '60ms' },
  { key: '4', source: '雪球情绪', type: '另类数据', status: '延迟', lastUpdate: '4小时前', latency: 'timeout' },
  { key: '5', source: '内部DB', type: '用户行为', status: '正常', lastUpdate: '实时', latency: '5ms' },
  { key: '6', source: '彭博终端', type: '海外宏观', status: '正常', lastUpdate: '30分钟前', latency: '210ms' },
  { key: '7', source: '路孚特Eikon', type: '大宗商品', status: '正常', lastUpdate: '15分钟前', latency: '150ms' },
]

const USERS = [
  { key: '1', name: 'Admin', role: '系统管理员', lastLogin: '2025-06-30 09:12' },
  { key: '2', name: 'Trader_01', role: '投资经理', lastLogin: '2025-06-29 14:30' },
  { key: '3', name: 'Risk_Control', role: '风控专员', lastLogin: '2025-06-30 08:45' },
  { key: '4', name: 'Quant_Dev', role: '量化开发', lastLogin: '2025-06-28 16:20' },
  { key: '5', name: 'Compliance_01', role: '合规审查', lastLogin: '2025-06-25 10:15' },
  { key: '6', name: 'Research_AI', role: '算法模型', lastLogin: '实时在线' },
]

const LOGS = [
  { time: '14:32:01', level: 'INFO', msg: "Data source 'Wind API' sync completed successfully." },
  { time: '14:30:15', level: 'WARN', msg: "'雪球情绪' API latency high (1200ms)." },
  { time: '14:28:40', level: 'INFO', msg: "Re-evaluating Black-Litterman posterior weights." },
  { time: '14:25:12', level: 'INFO', msg: "HMM emission probabilities updated." },
  { time: '14:15:00', level: 'INFO', msg: "User 'Trader_01' logged in from 192.168.1.10." },
  { time: '14:00:05', level: 'INFO', msg: "Scheduled daily risk check passed. No threshold breached." },
  { time: '12:00:00', level: 'INFO', msg: "Mid-day market snapshot captured." },
  { time: '11:30:00', level: 'INFO', msg: "Morning trading session closed." },
  { time: '09:30:00', level: 'INFO', msg: "Market opened. Streaming live data." },
  { time: '08:00:00', level: 'INFO', msg: "System initialization sequence complete." },
]

const CustomSwitch = ({ checked }) => (
  <label className="custom-switch">
    <input type="checkbox" defaultChecked={checked} />
    <span className="switch-slider"></span>
  </label>
)

export default function Settings() {
  const [tab, setTab] = useState(0) // 0: 核心配置与权限, 1: 数据与系统监控

  return (
    <div className="settings-page">
      {/* ==================== 顶部信息与Tab栏 ==================== */}
      <div className="settings-header">
        <div className="settings-tabs-row">
          <button className={`market-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>
            ⚙️ 核心配置与权限
          </button>
          <button className={`market-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>
            📡 数据与系统监控
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>当前系统版本：<span style={{ color: COLORS.blue, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>v3.4.1 (Stable)</span></span>
            <span>运行时间：<span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>128天 14小时</span></span>
          </div>
        </div>
      </div>

      {/* ==================== TAB 0: 核心配置与权限 ==================== */}
      {tab === 0 && (
        <div className="settings-grid-0">
          
          {/* 左列：参数配置 */}
          <div className="bento-card set-params-card">
            <div className="card-title" style={{ fontSize: 14, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="title-dot" />策略与底层模型核心参数
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="factor-table" style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ width: '25%', padding: '12px 10px' }}>所属模块</th>
                    <th style={{ padding: '12px 10px' }}>参数名</th>
                    <th style={{ width: '20%', padding: '12px 10px' }}>当前值</th>
                    <th style={{ width: '15%', padding: '12px 10px' }}>类型</th>
                  </tr>
                </thead>
                <tbody>
                  {PARAMS.map((p, i) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 10px' }}>
                        <span style={{ fontSize: 12, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, color: 'var(--text-muted)' }}>{p.module}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text)', padding: '10px 10px' }}>{p.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: COLORS.cyan, fontWeight: 700, padding: '10px 10px', fontSize: 14 }}>{p.value}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', padding: '10px 10px' }}>{p.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右上：系统开关 */}
          <div className="bento-card set-toggles-card">
            <div className="card-title" style={{ fontSize: 14, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="title-dot" />系统功能全局热开关
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
              {[
                { label: '自动交易执行', desc: '根据组合权重自动生成订单', checked: true },
                { label: '风险预警广播', desc: '回撤超限时推送邮件与短息', checked: true },
                { label: '雪球情绪因子', desc: '将外部情绪数据纳入HMM考量', checked: true },
                { label: '超高频实时行情', desc: '开启WebSocket秒级同步', checked: false },
                { label: '因子暴露度硬约束', desc: '风格因子暴露禁止超过限定阈值', checked: true },
                { label: '数据库只读模式', desc: '禁止除调仓外的所有写入操作', checked: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: item.checked ? 'var(--text)' : 'var(--text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{item.desc}</div>
                  </div>
                  <CustomSwitch checked={item.checked} />
                </div>
              ))}
            </div>
          </div>

          {/* 右下：用户管理 */}
          <div className="bento-card set-users-card">
            <div className="card-title" style={{ fontSize: 14, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="title-dot" />系统会话与操作白名单
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="factor-table" style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 10px' }}>会话用户</th>
                    <th style={{ width: '30%', padding: '12px 10px' }}>系统角色</th>
                    <th style={{ width: '35%', padding: '12px 10px' }}>最后心跳时间</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: u.name.includes('Admin') ? COLORS.gold : 'var(--text)', padding: '10px 10px' }}>{u.name}</td>
                      <td style={{ padding: '10px 10px' }}><span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, background: 'rgba(100,120,200,0.1)', color: 'var(--text-secondary)' }}>{u.role}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: u.lastLogin.includes('实时') ? COLORS.green : 'var(--text-muted)', padding: '10px 10px' }}>{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 1: 数据与系统监控 ==================== */}
      {tab === 1 && (
        <div className="settings-grid-1">
          
          {/* 顶部横幅：KPI */}
          <div className="set-kpi-row">
            <div className="bento-card" style={{ flex: 1, padding: '16px 24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>总线特征库规模</div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.blue }}>131,300 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>条记录</span></div>
            </div>
            <div className="bento-card" style={{ flex: 1, padding: '16px 24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>数据源活跃状态</div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.gold }}>7 / 7 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>在线</span></div>
            </div>
            <div className="bento-card" style={{ flex: 1, padding: '16px 24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>平均接口延迟</div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.green }}>45.2 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>ms</span></div>
            </div>
            <div className="bento-card" style={{ flex: 1, padding: '16px 24px' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>模型集群负载</div>
              <div style={{ fontSize: 26, fontFamily: 'var(--font-mono)', fontWeight: 700, color: COLORS.text }}>14.5% <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>CPU</span></div>
            </div>
          </div>

          <div className="settings-subgrid">
            {/* 左下：外部数据源监控 */}
            <div className="bento-card set-data-card">
              <div className="card-title" style={{ fontSize: 14, marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="title-dot" />API接入层状态诊断
                </span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="factor-table" style={{ width: '100%', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ width: '20%', padding: '12px 10px' }}>提供商</th>
                      <th style={{ padding: '12px 10px' }}>数据类别</th>
                      <th style={{ width: '15%', padding: '12px 10px' }}>连通性</th>
                      <th style={{ width: '20%', padding: '12px 10px' }}>数据鲜活度</th>
                      <th style={{ width: '15%', padding: '12px 10px' }}>时延</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DATA_SOURCES.map((d, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, padding: '12px 10px' }}>{d.source}</td>
                        <td style={{ color: 'var(--text-muted)', padding: '12px 10px' }}>{d.type}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.status === '正常' ? COLORS.green : COLORS.orange }} />
                            <span style={{ fontSize: 13, color: d.status === '正常' ? COLORS.green : COLORS.orange }}>{d.status}</span>
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '12px 10px' }}>{d.lastUpdate}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: d.latency === 'timeout' ? COLORS.red : 'var(--text)', padding: '12px 10px' }}>{d.latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右下：日志流 */}
            <div className="bento-card set-logs-card" style={{ background: '#0a0d18', border: '1px solid #1a223a' }}>
              <div className="card-title" style={{ fontSize: 14, marginBottom: 16, borderBottom: '1px solid #1a223a', paddingBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="title-dot" />sys_daemon stdout
                </span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: COLORS.green }}>● LIVE</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4, lineHeight: 1.6 }}>
                {LOGS.map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{log.time}]</span>
                    <span style={{ 
                      color: log.level === 'INFO' ? COLORS.blue : COLORS.orange, 
                      fontWeight: 600, width: 45, flexShrink: 0 
                    }}>{log.level}</span>
                    <span style={{ color: log.level === 'WARN' ? COLORS.gold : 'var(--text-secondary)' }}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 8, animation: 'pulse 1.5s infinite' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[14:35:02]</span>
                  <span style={{ color: COLORS.blue, fontWeight: 600 }}>_</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
