import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts'

/**
 * 通用 ECharts React 封装
 * @param {Object} option - ECharts 配置项
 * @param {string} className - 容器 CSS class
 * @param {Object} style - 容器内联样式
 */
export default function Chart({ option, className = 'chart-container', style = {} }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, 'dark')
    }
    instanceRef.current.setOption(option, true)

    const handleResize = () => {
      instanceRef.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [option])

  useEffect(() => {
    return () => {
      instanceRef.current?.dispose()
      instanceRef.current = null
    }
  }, [])

  return <div ref={chartRef} className={className} style={style} />
}
