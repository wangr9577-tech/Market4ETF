/**
 * ECharts 全局配置工厂
 * 统一深色金融主题下的图表风格
 */

const COLORS = {
  blue: '#409eff',
  gold: '#f6c954',
  cyan: '#22d3ee',
  purple: '#8b5cf6',
  red: '#e25555',
  green: '#2dc78a',
  orange: '#e6a23c',
  gray: '#5b6282',
  lightGray: '#8b92b0',
  bg: '#080c24',
  bgAlt: '#141d52',
  border: 'rgba(100,120,200,0.12)',
  text: '#d0d4e8',
  textMuted: '#5b6282',
}

const REGIME_COLORS = {
  bull: 'rgba(226,85,85,0.08)',
  bear: 'rgba(45,199,138,0.08)',
  sideways: 'rgba(230,162,60,0.08)',
  'high-vol': 'rgba(139,92,246,0.08)',
}

/** 基础配置 mixin */
const baseOption = () => ({
  backgroundColor: 'transparent',
  textStyle: { fontFamily: "'Inter', sans-serif", color: COLORS.text },
  grid: { top: 50, right: 20, bottom: 40, left: 60, containLabel: true },
  tooltip: {
    trigger: 'axis',
    backgroundColor: COLORS.bgAlt,
    borderColor: COLORS.border,
    textStyle: { color: COLORS.text, fontSize: 12 },
  },
  legend: {
    textStyle: { color: COLORS.lightGray, fontSize: 12 },
    top: 5,
    itemGap: 20,
  },
})

/** 生成Regime背景色带的markArea数据 */
export function regimeMarkArea(dates, regimes) {
  if (!regimes || regimes.length === 0) return []
  const areas = []
  let start = 0
  for (let i = 1; i <= regimes.length; i++) {
    if (i === regimes.length || regimes[i] !== regimes[start]) {
      areas.push([
        {
          xAxis: dates[start],
          itemStyle: { color: REGIME_COLORS[regimes[start]] || 'transparent' },
        },
        { xAxis: dates[i - 1] },
      ])
      start = i
    }
  }
  return areas
}

/** 净值走势图 */
export function navLineOption(dates, series, regimes) {
  return {
    ...baseOption(),
    tooltip: { ...baseOption().tooltip, trigger: 'axis' },
    legend: { ...baseOption().legend, data: series.map((s) => s.name) },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: COLORS.border } },
      axisLabel: { color: COLORS.textMuted, fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: COLORS.textMuted, fontSize: 11 },
      splitLine: { lineStyle: { color: COLORS.border } },
    },
    series: series.map((s, idx) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: idx === 0 ? 2.5 : 1.5, color: s.color },
      itemStyle: { color: s.color },
      areaStyle: idx === 0 ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: s.color + '30' }, { offset: 1, color: 'transparent' }] } } : undefined,
      markArea: idx === 0 && regimes ? { silent: true, data: regimeMarkArea(dates, regimes) } : undefined,
    })),
    dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', height: 20, bottom: 5 }],
  }
}

/** 环形饼图 */
export function ringPieOption(data, title = '') {
  return {
    ...baseOption(),
    tooltip: { trigger: 'item', formatter: '{b}: {d}%', backgroundColor: COLORS.bgAlt, borderColor: COLORS.border, textStyle: { color: COLORS.text } },
    legend: { ...baseOption().legend, orient: 'vertical', right: 10, top: 'center' },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: COLORS.bg, borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: COLORS.text } },
      data: data.map((d, i) => ({
        name: d.name,
        value: d.weight || d.value,
        itemStyle: { color: [COLORS.blue, COLORS.green, COLORS.gold, COLORS.cyan, COLORS.purple, COLORS.orange, COLORS.red][i % 7] },
      })),
    }],
    graphic: title ? [{ type: 'text', left: '37%', top: '45%', style: { text: title, fill: COLORS.textMuted, fontSize: 12, textAlign: 'center' } }] : [],
  }
}

/** 半圆仪表盘 */
export function gaugeOption(value, title = '市场情绪') {
  const color = value > 70 ? COLORS.red : value > 40 ? COLORS.gold : COLORS.green
  return {
    ...baseOption(),
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 5,
      center: ['50%', '60%'],
      radius: '90%',
      axisLine: {
        lineStyle: { width: 12, color: [[0.3, COLORS.green], [0.7, COLORS.gold], [1, COLORS.red]] },
      },
      pointer: { length: '60%', width: 4, itemStyle: { color } },
      axisTick: { show: false },
      splitLine: { length: 10, lineStyle: { color: COLORS.textMuted, width: 1 } },
      axisLabel: { color: COLORS.textMuted, fontSize: 10, distance: 15 },
      detail: {
        fontSize: 28, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color,
        offsetCenter: [0, '30%'], formatter: '{value}',
      },
      title: { offsetCenter: [0, '55%'], fontSize: 12, color: COLORS.textMuted },
      data: [{ value, name: title }],
    }],
  }
}

/** 雷达图 */
export function radarOption(indicators, data, title = '') {
  return {
    ...baseOption(),
    radar: {
      indicator: indicators.map((ind) => ({ name: ind.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: COLORS.lightGray, fontSize: 11 },
      splitLine: { lineStyle: { color: COLORS.border } },
      splitArea: { areaStyle: { color: ['transparent', COLORS.bgAlt] } },
      axisLine: { lineStyle: { color: COLORS.border } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: data,
        areaStyle: { color: COLORS.blue + '30' },
        lineStyle: { color: COLORS.blue, width: 2 },
        itemStyle: { color: COLORS.blue },
      }],
    }],
  }
}

/** 热力图 */
export function heatmapOption(xLabels, yLabels, data, min = -1, max = 1) {
  return {
    ...baseOption(),
    grid: { top: 30, right: 80, bottom: 60, left: 80 },
    tooltip: { position: 'top', formatter: (p) => `${xLabels[p.value[0]]} × ${yLabels[p.value[1]]}<br/>相关系数: ${p.value[2].toFixed(2)}` },
    xAxis: { type: 'category', data: xLabels, axisLabel: { color: COLORS.textMuted, fontSize: 11, rotate: 30 }, splitArea: { show: true, areaStyle: { color: ['transparent', COLORS.bgAlt] } } },
    yAxis: { type: 'category', data: yLabels, axisLabel: { color: COLORS.textMuted, fontSize: 11 } },
    visualMap: { min, max, calculable: true, orient: 'vertical', right: 5, top: 'center', inRange: { color: [COLORS.green, '#1A2035', COLORS.red] }, textStyle: { color: COLORS.textMuted } },
    series: [{ type: 'heatmap', data, itemStyle: { borderColor: COLORS.bg, borderWidth: 2 }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }],
  }
}

/** 多折线因子图 */
export function factorLineOption(dates, factors) {
  const colors = [COLORS.blue, COLORS.gold, COLORS.cyan, COLORS.green, COLORS.purple]
  return {
    ...baseOption(),
    legend: { ...baseOption().legend, data: factors.map((f) => f.name) },
    xAxis: { type: 'category', data: dates, axisLine: { lineStyle: { color: COLORS.border } }, axisLabel: { color: COLORS.textMuted, fontSize: 11 }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: COLORS.textMuted, fontSize: 11 }, splitLine: { lineStyle: { color: COLORS.border } } },
    series: factors.map((f, i) => ({
      name: f.name, type: 'line', data: f.data.map((v) => Math.round(v * 100) / 100), smooth: true, symbol: 'none',
      lineStyle: { width: 2, color: colors[i % colors.length] }, itemStyle: { color: colors[i % colors.length] },
    })),
    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 18, bottom: 5 }],
  }
}

/** 分组柱状图 */
export function groupBarOption(categories, series) {
  return {
    ...baseOption(),
    legend: { ...baseOption().legend, data: series.map((s) => s.name) },
    xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: COLORS.border } }, axisLabel: { color: COLORS.textMuted, fontSize: 11 } },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: COLORS.textMuted, fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: COLORS.border } } },
    series: series.map((s) => ({
      name: s.name, type: 'bar', data: s.data, itemStyle: { color: s.color, borderRadius: [4, 4, 0, 0] }, barMaxWidth: 30,
    })),
  }
}

/** 回撤图 */
export function drawdownOption(dates, data) {
  return {
    ...baseOption(),
    grid: { top: 20, bottom: 30, left: 60, right: 20 },
    xAxis: { type: 'category', data: dates, show: false },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: COLORS.textMuted, fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: COLORS.border } } },
    series: [{ type: 'bar', data, itemStyle: { color: COLORS.red + '80', borderRadius: [0, 0, 2, 2] } }],
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].axisValue}<br/>回撤: ${p[0].value}%` },
  }
}

/** 散点图（有效前沿） */
export function scatterOption(points, optimal) {
  return {
    ...baseOption(),
    xAxis: { type: 'value', name: '风险 (%)', nameTextStyle: { color: COLORS.textMuted }, axisLabel: { color: COLORS.textMuted, fontSize: 11 }, splitLine: { lineStyle: { color: COLORS.border } } },
    yAxis: { type: 'value', name: '收益 (%)', nameTextStyle: { color: COLORS.textMuted }, axisLabel: { color: COLORS.textMuted, fontSize: 11 }, splitLine: { lineStyle: { color: COLORS.border } } },
    series: [
      { type: 'scatter', data: points.map((p) => [p.risk, p.return]), symbolSize: 6, itemStyle: { color: COLORS.blue + '80' } },
      {
        type: 'scatter', data: [[optimal.risk, optimal.return]], symbolSize: 16, itemStyle: { color: COLORS.gold },
        label: { show: true, formatter: optimal.label, position: 'right', color: COLORS.gold, fontSize: 12 },
      },
    ],
  }
}

/** 月度收益热力图（日历） */
export function calendarHeatmapOption(data) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']
  return {
    ...baseOption(),
    grid: { top: 30, right: 80, bottom: 30, left: 80 },
    tooltip: { formatter: (p) => `${years[p.value[1]]}年${months[p.value[0]]}<br/>收益率: ${p.value[2]}%` },
    xAxis: { type: 'category', data: months, axisLabel: { color: COLORS.textMuted, fontSize: 10 }, splitArea: { show: true, areaStyle: { color: ['transparent', COLORS.bgAlt] } } },
    yAxis: { type: 'category', data: years, axisLabel: { color: COLORS.textMuted, fontSize: 11 } },
    visualMap: { min: -8, max: 8, calculable: true, orient: 'vertical', right: 5, top: 'center', inRange: { color: [COLORS.green, '#1A2035', COLORS.red] }, textStyle: { color: COLORS.textMuted } },
    series: [{ type: 'heatmap', data, itemStyle: { borderColor: COLORS.bg, borderWidth: 3, borderRadius: 4 }, label: { show: true, color: COLORS.text, fontSize: 10, formatter: (p) => p.value[2] > 0 ? `+${p.value[2]}` : p.value[2] } }],
  }
}

/** 桑基图 */
export function sankeyOption(states, matrix) {
  const nodes = states.map((s) => ({ name: s }))
  const stateColors = [COLORS.red, COLORS.green, COLORS.gold, COLORS.purple]
  const links = []
  for (let i = 0; i < states.length; i++) {
    for (let j = 0; j < states.length; j++) {
      if (matrix[i][j] > 0.03) {
        links.push({ source: states[i], target: states[j] + ' ', value: Math.round(matrix[i][j] * 100) })
      }
    }
  }
  const targetNodes = states.map((s) => ({ name: s + ' ' }))
  return {
    ...baseOption(),
    tooltip: { trigger: 'item', formatter: (p) => p.data.source ? `${p.data.source} → ${p.data.target.trim()}: ${p.data.value}%` : p.data.name.trim() },
    series: [{
      type: 'sankey', layout: 'none', emphasis: { focus: 'adjacency' },
      nodeWidth: 20, nodeGap: 15,
      data: [...nodes, ...targetNodes].map((n, i) => ({ ...n, itemStyle: { color: stateColors[i % stateColors.length] } })),
      links,
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.4 },
      label: { color: COLORS.text, fontSize: 12 },
    }],
  }
}

export { COLORS, REGIME_COLORS }
