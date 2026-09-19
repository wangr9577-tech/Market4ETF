import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './styles/globals.css'

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#e2e8f0',
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontSize: 18,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ConfigProvider theme={lightTheme} locale={zhCN}>
        <App />
      </ConfigProvider>
    </HashRouter>
  </React.StrictMode>
)
