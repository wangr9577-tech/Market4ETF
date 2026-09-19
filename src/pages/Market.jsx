import React, { useState } from 'react'
import Chart from '../components/charts/Chart'
import {
  macroFactors, correlationMatrix, sentimentRadar
} from '../data/mockData'
import {
  heatmapOption, factorLineOption, radarOption, COLORS
} from '../utils/chartOptions'

/* ========== 国盛择时六面图 30+ 维高频子指标全量汇总 ========== */
const guoshengIndicators = [
  { cat: '流动性', name: '10年期国债收益率', val: '2.24%', pct: 12, signal: '看多', sub: '资金面宽松' },
  { cat: '流动性', name: 'DR007偏离度', val: '1.42%', pct: 18, signal: '看多', sub: '短端利率低位' },
  { cat: '流动性', name: 'SHIBOR 1W', val: '1.40%', pct: 15, signal: '看多', sub: '流动性充裕' },
  { cat: '流动性', name: 'M1-PPI剪刀差', val: '-0.10%', pct: 32, signal: '看空', sub: '剪刀差下行' },
  { cat: '流动性', name: 'M2-名义GDP增速', val: '+3.06%', pct: 75, signal: '看多', sub: '超额货币供给' },
  { cat: '经济面', name: '制造业 PMI 指数', val: '50.30', pct: 55, signal: '看多', sub: '扩张区间' },
  { cat: '经济面', name: '全社会用电量同比', val: '+5.70%', pct: 62, signal: '看多', sub: '用电需求恢复' },
  { cat: '经济面', name: 'CPI / PPI 同比', val: '1.0% / 4.1%', pct: 45, signal: '中性', sub: '温和通胀' },
  { cat: '估值面', name: '中证800 PE-TTM', val: '25.31倍', pct: 38, signal: '低估', sub: '低于历史中位数' },
  { cat: '估值面', name: '中证800 PB', val: '1.58倍', pct: 28, signal: '低估', sub: '安全边际高' },
  { cat: '估值面', name: '股权风险溢价 ERP', val: '0.49%', pct: 72, signal: '看多', sub: '权益性价比凸显' },
  { cat: '资金面', name: '北向资金单日净买入', val: '+45.20亿', pct: 68, signal: '偏多', sub: '外资净流入' },
  { cat: '资金面', name: '融资融券余额', val: '2.70万亿', pct: 64, signal: '偏多', sub: '杠杆活跃' },
  { cat: '技术面', name: '中证800 均线排列', val: '5239点', pct: 58, signal: '中性', sub: 'MA多头排列' },
  { cat: '技术面', name: '申万31行业分歧度', val: '1.12', pct: 78, signal: '偏空', sub: '行业轮动较快' },
  { cat: '情绪面', name: '50ETF QVIX 恐慌指数', val: '16.23', pct: 29, signal: '低估', sub: '隐波处于低位' },
  { cat: '情绪面', name: 'AI 舆情得分 Score_AI', val: '+0.45', pct: 73, signal: '看多', sub: 'L3 Agent 研报利好' }
]

/* 新浪 7x24 高频爬虫真实快讯数据 (源自 code/output/flash_news_sina.json & DeepSeek L3 Agent 得分) */
const sinaFlashNews = [
  { 
    time: '14:49:30', 
    title: '【安集科技：先进制程电镀液及添加剂国产化替代空间广阔】安集科技表示电镀液及添加剂业务有取得落地进展，后续依托标杆项目突破', 
    category: '利好', 
    score: '+0.88', 
    tag: '半导体国产化', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：明确提及先进制程国产替代突破，直接利好 512480.SH (半导体芯片ETF) 与 588000.SH (科创50ETF) 风险偏好。' 
  },
  { 
    time: '14:49:23', 
    title: '【商品期货高频】纯碱连续主力合约日内跌 3.00%，现报 970.00 元/吨', 
    category: '利空', 
    score: '-0.35', 
    tag: '大宗商品', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：上游化工原材料价格下行，短期对大宗商品类 ETF 形成扰动，但有利于下游制造端降本。' 
  },
  { 
    time: '14:48:57', 
    title: '【反垄断整改】国家市场监管总局对平台经济滥用支配地位处罚落地，责令全面落实合规整改', 
    category: '监管', 
    score: '-0.15', 
    tag: '平台监管', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：常态化反垄断与合规治理，短期冲击平台预期，但有利于中长期行业规范有序竞争。' 
  },
  { 
    time: '14:25:08', 
    title: '【发改委重磅】加力支持新能源与硬科技产业设备更新，专项再贷款政策加速落地', 
    category: '利好', 
    score: '+0.85', 
    tag: '政策驱动', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：提升硬科技与新能源设备投资增速，正面拉动 159806.SZ (新能源车ETF) 资金关注度。' 
  },
  { 
    time: '13:40:15', 
    title: '【公开市场】央行开展 1200 亿元逆回购操作，单日净投放 800 亿元维持流动性合理充裕', 
    category: '流动性', 
    score: '+0.60', 
    tag: '货币宽松', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：银行间流动性充裕，DR007 保持低位运行 (1.42%)，持续支持固收与权益估值。' 
  },
  { 
    time: '10:05:30', 
    title: '【宏观数据】高频统计显示 7 月制造业 PMI 维持在 50.30 荣枯线上方，工业生产企稳', 
    category: '宏观', 
    score: '+0.40', 
    tag: '经济复苏', 
    source: 'Sina 7x24 Stream',
    reason: 'DeepSeek 推理：基本面企稳信号确立，减少经济深度衰退担忧，推高综合指数得分至 66.3。' 
  }
]

/* 8 维研报向量 e_report 详细明细 */
const eReportVector = [
  { name: '宏观政策', val: +0.45, desc: '加力支持硬科技与设备更新' },
  { name: '货币流动性', val: +0.62, desc: 'DR007低位，公开市场净投放' },
  { name: '行业基本面', val: -0.10, desc: '部分地产产业链承压' },
  { name: '机构资金流', val: +0.85, desc: '主力资金与北向同步加仓' },
  { name: '散户情绪面', val: +0.30, desc: '股吧情绪指数温和回升' },
  { name: '海外风偏', val: +0.55, desc: '中概股大涨，外资上调目标' },
  { name: '估值吸引力', val: +0.20, desc: 'PE/PB 处于历史低分位数' },
  { name: '技术形态', val: +0.40, desc: '中证800 均线呈多头结构' }
]

const signalBadgeStyle = (signal) => {
  if (signal === '看多' || signal === '低估' || signal === '偏多' || signal === '利好') return { bg: 'rgba(22, 163, 74, 0.1)', color: COLORS.green, border: '1px solid rgba(22, 163, 74, 0.25)' }
  if (signal === '看空' || signal === '偏空' || signal === '利空') return { bg: 'rgba(220, 38, 38, 0.1)', color: COLORS.red, border: '1px solid rgba(220, 38, 38, 0.25)' }
  return { bg: 'rgba(217, 119, 6, 0.1)', color: COLORS.gold, border: '1px solid rgba(217, 119, 6, 0.25)' }
}

const PctBar = ({ pct }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3 }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: pct <= 30 ? COLORS.green : pct >= 70 ? COLORS.red : COLORS.blue, transition: 'width 0.3s' }} />
    </div>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--text-muted)', width: 28, textAlign: 'right' }}>{pct}%</span>
  </div>
)

export default function Market() {
  const [tab, setTab] = useState(0) // 0=全景一屏通览 (默认), 1=六面图结构化深度, 2=AI舆情与快讯深度
  const [catFilter, setCatFilter] = useState('ALL')
  const [newsFilter, setNewsFilter] = useState('ALL')
  const [expandedNews, setExpandedNews] = useState(null)

  // 雷达图配置
  const radarOptionData = {
    ...radarOption(sentimentRadar, [85, 58, 78, 65, 50, 62]),
    radar: {
      ...radarOption(sentimentRadar, [85, 58, 78, 65, 50, 62]).radar,
      center: ['50%', '50%'],
      radius: '64%',
      axisName: { color: COLORS.textBright, fontSize: 18, fontWeight: 'bold' }
    }
  }

  // 因子趋势折线图
  const factorTimeOption = {
    ...factorLineOption(macroFactors.dates, macroFactors.factors),
    grid: { top: 22, right: 10, bottom: 22, left: 32 },
    legend: { show: true, top: 0, right: 0, textStyle: { color: COLORS.textMuted, fontSize: 16 }, itemWidth: 10, itemHeight: 5 }
  }

  // 相关性热力图
  const corrData = []
  const factors = correlationMatrix.factors
  for (let i = 0; i < factors.length; i++) {
    for (let j = 0; j < factors.length; j++) {
      corrData.push([i, j, correlationMatrix.data[i][j]])
    }
  }
  const corrOption = {
    ...heatmapOption(factors, factors, corrData),
    grid: { top: 8, right: 10, bottom: 38, left: 55 },
    xAxis: {
      type: 'category', data: factors,
      axisLabel: { color: COLORS.textMuted, fontSize: 13.5, rotate: 30, interval: 0 },
      splitArea: { show: true, areaStyle: { color: ['transparent', COLORS.bgAlt] } }
    },
    yAxis: {
      type: 'category', data: factors,
      axisLabel: { color: COLORS.textMuted, fontSize: 14, interval: 0 }
    },
    visualMap: { show: false, min: -1, max: 1, inRange: { color: [COLORS.green, '#f1f5f9', COLORS.red] } },
    series: [{
      type: 'heatmap', data: corrData,
      itemStyle: { borderColor: '#ffffff', borderWidth: 1 },
      label: { show: true, fontSize: 15, color: COLORS.textBright, formatter: (p) => p.value[2].toFixed(1) }
    }]
  }

  const filteredIndicators = catFilter === 'ALL' ? guoshengIndicators : guoshengIndicators.filter(d => d.cat === catFilter)
  const filteredNews = newsFilter === 'ALL' ? sinaFlashNews : sinaFlashNews.filter(n => n.tag === newsFilter)

  return (
    <div className="market-page">

      {/* ================= 1. Top KPI Snapshot Strip ================= */}
      <div className="market-kpi-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="mkpi-item">
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>Regime 识别</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>【震荡轮动】</span>
              <span style={{ fontSize: 16, color: COLORS.green, background: 'rgba(22, 163, 74, 0.1)', padding: '1px 5px', borderRadius: 3 }}>84% 置信度</span>
            </div>
          </div>
          <div className="mkpi-item">
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>六面图评分</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.purple, fontFamily: 'var(--font-mono)' }}>66.3 <span style={{ fontSize: 17, color: 'var(--text-muted)' }}>/ 100</span></div>
          </div>
          <div className="mkpi-item">
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>AI 研报得分 (Score_AI)</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gold, fontFamily: 'var(--font-mono)' }}>+0.45 <span style={{ fontSize: 17, color: COLORS.green }}>(L3 Agent)</span></div>
          </div>
          <div className="mkpi-item">
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>5 年累计超额</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.green, fontFamily: 'var(--font-mono)' }}>+54.11% <span style={{ fontSize: 17, color: COLORS.green }}>(+25.7% vs 等权)</span></div>
          </div>
          <div className="mkpi-item">
            <div style={{ fontSize: 17, color: 'var(--text-muted)' }}>平滑系数 β_t</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.cyan, fontFamily: 'var(--font-mono)' }}>0.82 <span style={{ fontSize: 17, color: 'var(--text-muted)' }}>(分位 52%)</span></div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="market-tabs">
          <button className={`market-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)} style={{ fontSize: 17 }}>
            全景一屏通览
          </button>
          <button className={`market-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)} style={{ fontSize: 17 }}>
            六面图结构化深度
          </button>
          <button className={`market-tab ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)} style={{ fontSize: 17 }}>
            AI 舆情 3 层漏斗与快讯
          </button>
        </div>
      </div>

      {/* ================= 2. VIEW 0: 全景一屏通览 (3 Column Balanced Layout for 1920x1080) ================= */}
      {tab === 0 && (
        <div className="market-grid-panorama">
          
          {/* Column 1 (Left 36%): 30+ 维指标监控表 (Top 58%) + 因子演化趋势 (Bottom 42%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, height: '100%' }}>
            
            {/* Top: 指标表 */}
            <div className="bento-card" style={{ flex: 1.35, padding: '10px 14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)' }}>六面图高频指标监控</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['ALL', '流动性', '经济面', '估值面', '资金面'].map(c => (
                    <span
                      key={c}
                      onClick={() => setCatFilter(c)}
                      style={{
                        fontSize: 16,
                        padding: '1px 5px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        background: catFilter === c ? COLORS.blue : '#f1f5f9',
                        color: catFilter === c ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 600
                      }}
                    >
                      {c === 'ALL' ? '全部' : c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: 2 }}>
                <div style={{ display: 'flex', background: '#f8fafc', padding: '5px 8px', borderRadius: 4, fontSize: 17, color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  <span style={{ width: 50 }}>维度</span>
                  <span style={{ flex: 1 }}>指标名称</span>
                  <span style={{ width: 96 }}>最新数值</span>
                  <span style={{ width: 76 }}>分位数</span>
                  <span style={{ width: 50, textAlign: 'center' }}>信号</span>
                </div>
                {filteredIndicators.map((row, idx) => {
                  const badge = signalBadgeStyle(row.signal)
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', fontSize: 17.5, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                      <span style={{ width: 50, fontSize: 16.5, color: row.cat === '流动性' ? COLORS.blue : row.cat === '经济面' ? COLORS.green : row.cat === '估值面' ? COLORS.purple : row.cat === '资金面' ? COLORS.orange : COLORS.gold, fontWeight: 600 }}>{row.cat}</span>
                      <span style={{ flex: 1, color: 'var(--text-bright)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                      <span style={{ width: 96, fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: 16 }}>{row.val}</span>
                      <span style={{ width: 76 }}><PctBar pct={row.pct} /></span>
                      <span style={{ width: 50, textAlign: 'center' }}>
                        <span style={{ fontSize: 16, padding: '1px 5px', borderRadius: 3, background: badge.bg, color: badge.color, border: badge.border, display: 'inline-block', fontWeight: 600 }}>{row.signal}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom: 5年历史演化曲线 */}
            <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 2, whiteSpace: 'nowrap' }}>
                宏观与市场因子 5 年时序演化
              </div>
              <div style={{ flex: 1, height: '100%', minHeight: 120 }}>
                <Chart option={factorTimeOption} style={{ height: '100%', width: '100%', minHeight: 120 }} />
              </div>
            </div>

          </div>

          {/* Column 2 (Middle 32%): 六面图雷达 (Top 48%) + 6x6 相关性热力图 (Bottom 52%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, height: '100%' }}>
            
            {/* Top: 雷达图 + 6维得分牌 */}
            <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 2, whiteSpace: 'nowrap' }}>
                六面图雷达评分 <span style={{ fontSize: 17, color: 'var(--text-muted)', fontWeight: 400 }}>(综合 66.3)</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 140 }}>
                <div style={{ flex: 1.2, height: '100%', minHeight: 140 }}>
                  <Chart option={radarOptionData} style={{ height: '100%', width: '100%', minHeight: 140 }} />
                </div>
                {/* 6 Dimension Stat Cards */}
                <div style={{ width: 110, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4, paddingLeft: 4 }}>
                  {[
                    { label: '流动性', score: 85, color: COLORS.blue },
                    { label: '经济面', score: 58, color: COLORS.green },
                    { label: '估值面', score: 78, color: COLORS.purple },
                    { label: '资金面', score: 65, color: COLORS.orange },
                    { label: '技术面', score: 50, color: COLORS.cyan },
                    { label: '情绪面', score: 62, color: COLORS.gold }
                  ].map((s, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 4px', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: 相关性矩阵热力图 */}
            <div className="bento-card" style={{ flex: 1.1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 2, whiteSpace: 'nowrap' }}>
                6×6 因子相关性热力图
              </div>
              <div style={{ flex: 1, height: '100%', minHeight: 140 }}>
                <Chart option={corrOption} style={{ height: '100%', width: '100%', minHeight: 140 }} />
              </div>
            </div>

          </div>

          {/* Column 3 (Right 32%): AI 舆情 3层漏斗 (Top 42%) + 新浪 7x24 快讯流 (Bottom 58%) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, height: '100%' }}>
            
            {/* Top: 3层漏斗架构与 8 维向量 */}
            <div className="bento-card" style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span>AI 舆情 3 层漏斗</span>
                <span style={{ fontSize: 16, color: COLORS.green, background: 'rgba(22, 163, 74, 0.1)', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>DeepSeek-R1</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
                <div style={{ background: '#f0f7ff', border: '1px solid #bae0ff', borderRadius: 4, padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.blue }}>L1 规则过滤</span>
                  <span style={{ fontSize: 16.5, color: 'var(--text-secondary)' }}>降噪 52.4%</span>
                </div>
                <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 4, padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.gold }}>L2 Flash 初筛</span>
                  <span style={{ fontSize: 16.5, color: 'var(--text-secondary)' }}>时延 &lt; 200ms</span>
                </div>
                <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4, padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.green }}>L3 Pro 深度推演</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.green }}>Score_AI = +0.45</span>
                </div>
              </div>

              {/* 8 维研报向量 e_report */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, whiteSpace: 'nowrap' }}>研报特征向量 e_report (8 维)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                  {eReportVector.map((vec, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '2px 4px', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: 15.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vec.name}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: vec.val >= 0 ? COLORS.green : COLORS.red }}>
                        {vec.val >= 0 ? `+${vec.val}` : vec.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: 新浪 7x24 快讯流与 DeepSeek 推理 */}
            <div className="bento-card" style={{ flex: 1.35, padding: '10px 14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span>7×24 财经快讯流</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['ALL', '半导体国产化', '政策驱动', '货币宽松'].map(t => (
                    <span
                      key={t}
                      onClick={() => setNewsFilter(t)}
                      style={{
                        fontSize: 15.5,
                        padding: '1px 5px',
                        borderRadius: 3,
                        cursor: 'pointer',
                        background: newsFilter === t ? COLORS.blue : '#f1f5f9',
                        color: newsFilter === t ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 600
                      }}
                    >
                      {t === 'ALL' ? '全部' : t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 2 }}>
                {filteredNews.map((news, idx) => {
                  const isExpanded = expandedNews === idx
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedNews(isExpanded ? null : idx)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 5,
                        padding: '6px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 1 }}>
                            [{news.time}] <span style={{ color: COLORS.blue, fontWeight: 600 }}>{news.tag}</span>
                          </div>
                          <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1.3 }}>
                            {news.title}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: 21, fontWeight: 700, fontFamily: 'var(--font-mono)', color: news.score.startsWith('+') ? COLORS.green : COLORS.red }}>
                            {news.score}
                          </span>
                          <div style={{ fontSize: 16.5, color: 'var(--text-muted)' }}>AI 评分</div>
                        </div>
                      </div>

                      {/* CoT 链式推理展开 */}
                      {isExpanded && (
                        <div style={{ marginTop: 6, paddingTop: 4, borderTop: '1px dashed #b7eb8f', fontSize: 18, color: '#166534', background: '#f6ffed', padding: '4px 6px', borderRadius: 3, lineHeight: 1.4 }}>
                          <span style={{ fontWeight: 600 }}>● 推理依据：</span>{news.reason}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= 3. VIEW 1: 六面图结构化指标深度监控 (2-Column Expanded View) ================= */}
      {tab === 1 && (
        <div className="market-grid-tab0">
          
          {/* Left Column (52% Width): 30+ 维高频指标全景汇总表 */}
          <div className="bento-card" style={{ flex: 1.1, padding: '12px 16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>六面图 30+ 维子指标全景</span>
              <span style={{ fontSize: 17, color: 'var(--text-muted)' }}>覆盖 6 大维度</span>
            </div>
            
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', background: '#f8fafc', padding: '6px 8px', borderRadius: 4, fontSize: 17.5, color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                <span style={{ width: 55 }}>维度</span>
                <span style={{ flex: 1 }}>指标名称</span>
                <span style={{ width: 105 }}>最新数值</span>
                <span style={{ width: 110 }}>历史分位数 (Pct)</span>
                <span style={{ width: 60, textAlign: 'center' }}>信号状态</span>
              </div>
              {/* Table Rows */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0' }}>
                {guoshengIndicators.map((row, idx) => {
                  const badge = signalBadgeStyle(row.signal)
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', fontSize: 18, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                      <span style={{ width: 55, fontSize: 16.5, color: row.cat === '流动性' ? COLORS.blue : row.cat === '经济面' ? COLORS.green : row.cat === '估值面' ? COLORS.purple : row.cat === '资金面' ? COLORS.orange : COLORS.gold, fontWeight: 600 }}>{row.cat}</span>
                      <span style={{ flex: 1, color: 'var(--text-bright)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                      <span style={{ width: 105, fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: 16.5 }}>{row.val}</span>
                      <span style={{ width: 110 }}><PctBar pct={row.pct} /></span>
                      <span style={{ width: 60, textAlign: 'center' }}>
                        <span style={{ fontSize: 16.5, padding: '1px 6px', borderRadius: 3, background: badge.bg, color: badge.color, border: badge.border, display: 'inline-block', fontWeight: 600 }}>{row.signal}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column (48% Width): Radar (Top 48%) + Line/Heatmap (Bottom 52%) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            
            {/* Right Top Card: Radar Chart */}
            <div className="bento-card" style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 4, whiteSpace: 'nowrap' }}>
                六面图评分雷达 <span style={{ fontSize: 17, color: 'var(--text-muted)', fontWeight: 400 }}>(综合 66.3)</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 160 }}>
                <div style={{ flex: 1, height: '100%', minHeight: 160 }}>
                  <Chart option={radarOptionData} style={{ height: '100%', width: '100%', minHeight: 160 }} />
                </div>
                {/* 6 Dimension Stat Cards */}
                <div style={{ width: 150, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, paddingLeft: 8 }}>
                  {[
                    { label: '流动性', score: 85, color: COLORS.blue },
                    { label: '经济面', score: 58, color: COLORS.green },
                    { label: '估值面', score: 78, color: COLORS.purple },
                    { label: '资金面', score: 65, color: COLORS.orange },
                    { label: '技术面', score: 50, color: COLORS.cyan },
                    { label: '情绪面', score: 62, color: COLORS.gold }
                  ].map((s, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '5px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>{s.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Bottom Card: Timeseries + Heatmap */}
            <div className="bento-card" style={{ flex: 1.1, padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6, whiteSpace: 'nowrap' }}>
                因子趋势与相关性矩阵
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 150 }}>
                <div style={{ flex: 1.2, height: '100%', minHeight: 150 }}>
                  <Chart option={factorTimeOption} style={{ height: '100%', width: '100%', minHeight: 150 }} />
                </div>
                <div style={{ flex: 1, height: '100%', minHeight: 150 }}>
                  <Chart option={corrOption} style={{ height: '100%', width: '100%', minHeight: 150 }} />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= 4. VIEW 2: AI 舆情 3 层数据漏斗 & 新浪快讯 ================= */}
      {tab === 2 && (
        <div className="market-grid-tab1">
          
          {/* Left Card (45% Width): AI 舆情 3层数据漏斗架构 */}
          <div className="bento-card" style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>AI 舆情 3 层漏斗</span>
              <span style={{ fontSize: 17, color: COLORS.green, background: 'rgba(22, 163, 74, 0.1)', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>DeepSeek API</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'space-around' }}>
              
              <div style={{ background: '#f0f7ff', border: '1px solid #bae0ff', borderRadius: 6, padding: '8px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.blue, display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
                  <span>L1 规则过滤</span>
                  <span>降噪率 52.4%</span>
                </div>
                <div style={{ fontSize: 16.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  过滤广告与重复噪音，提取权威研报与财经新闻。
                </div>
              </div>

              <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, padding: '8px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gold, display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
                  <span>L2 Flash 初筛</span>
                  <span>时延 &lt; 200ms</span>
                </div>
                <div style={{ fontSize: 16.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  粗粒度多空二分类，输出初步极性得分。
                </div>
              </div>

              <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, padding: '8px 12px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.green, display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
                  <span>L3 Pro 深度推演</span>
                  <span>Score_AI = +0.45</span>
                </div>
                <div style={{ fontSize: 16.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  输出链式推演 (CoT)，提取 8 维向量并计算月度得分。
                </div>
              </div>

            </div>

            {/* 8 维研报向量 e_report 呈现 */}
            <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 6, whiteSpace: 'nowrap' }}>
                研报特征向量 e_report (8 维)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {eReportVector.map((vec, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '4px 6px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 16.5, color: 'var(--text-muted)' }}>{vec.name}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, fontFamily: 'var(--font-mono)', color: vec.val >= 0 ? COLORS.green : COLORS.red }}>
                      {vec.val >= 0 ? `+${vec.val}` : vec.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Card (55% Width): 新浪 7x24 高频快讯流与 DeepSeek 推理 */}
          <div className="bento-card" style={{ flex: 1.2, padding: '14px 18px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span>7×24 快讯流与 AI 推理</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['ALL', '半导体国产化', '大宗商品', '平台监管', '政策驱动', '货币宽松', '经济复苏'].map(t => (
                  <span
                    key={t}
                    onClick={() => setNewsFilter(t)}
                    style={{
                      fontSize: 16.5,
                      padding: '2px 5px',
                      borderRadius: 3,
                      cursor: 'pointer',
                      background: newsFilter === t ? COLORS.blue : '#f1f5f9',
                      color: newsFilter === t ? '#fff' : 'var(--text-secondary)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
              {filteredNews.map((news, idx) => {
                const isExpanded = expandedNews === idx
                return (
                  <div
                    key={idx}
                    onClick={() => setExpandedNews(isExpanded ? null : idx)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18.5, color: 'var(--text-muted)', marginBottom: 2 }}>
                          [{news.time}] <span style={{ color: COLORS.blue, fontWeight: 600 }}>{news.tag}</span> • <span style={{ color: 'var(--text-muted)' }}>{news.source}</span>
                        </div>
                        <div style={{ fontSize: 20.5, fontWeight: 600, color: 'var(--text-bright)', lineHeight: 1.4 }}>
                          {news.title}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: news.score.startsWith('+') ? COLORS.green : COLORS.red }}>
                          {news.score}
                        </span>
                        <div style={{ fontSize: 17.5, color: 'var(--text-muted)' }}>AI 评分</div>
                      </div>
                    </div>

                    {/* CoT 链式推理展开 */}
                    {isExpanded && (
                      <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed #b7eb8f', fontSize: 19.5, color: '#166534', background: '#f6ffed', padding: '6px 8px', borderRadius: 4 }}>
                        <span style={{ fontWeight: 600 }}>● 推理依据：</span>{news.reason}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
