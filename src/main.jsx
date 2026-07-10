import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './styles/globals.css'

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#409eff',
    colorBgBase: '#080c24',
    colorBgContainer: '#0f1740',
    colorBgElevated: '#141d52',
    colorBorder: 'rgba(100,120,200,0.12)',
    colorText: '#d0d4e8',
    colorTextSecondary: '#8b92b0',
    borderRadius: 6,
    fontFamily: "'Inter','Microsoft YaHei',sans-serif",
    fontSize: 13,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={darkTheme} locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
