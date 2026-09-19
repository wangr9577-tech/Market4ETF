import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  StockOutlined,
  LeftOutlined
} from '@ant-design/icons'

const NAV_SECTIONS = [
  { key: 'home', label: '首页概览', icon: <DashboardOutlined />, path: '/' },
  { key: 'market', label: '市场分析', icon: <LineChartOutlined />, path: '/market' },
  { key: 'alloc', label: '资产配置', icon: <PieChartOutlined />, path: '/allocation' },
  { key: 'backtest', label: '回测分析', icon: <HistoryOutlined />, path: '/backtest' },
  { key: 'settings', label: '系统设置', icon: <SettingOutlined />, path: '/settings' },
]

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <StockOutlined style={{ fontSize: 18, color: 'var(--accent-blue)' }} />
          </div>
          <div>
            <div className="brand-text">ETF动态配置系统</div>
            <div className="brand-sub">Dynamic Allocation</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div className="nav-section" key={section.key}>
              <NavLink
                to={section.path}
                end
                className={({ isActive: a }) => `nav-section-header ${a ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <span className="nav-icon">{section.icon}</span>
                <span>{section.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LeftOutlined style={{ fontSize: 11 }} />
          <span>收起菜单</span>
        </div>
      </aside>

      {/* Main */}
      <div className="main-wrap">
        <header className="topbar">
          <div className="topbar-user">
            <div className="topbar-avatar">研</div>
            <span>策略研究员</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
