# ETF FOF 动态配置策略系统 (Market4ETF)

> **农行杯大赛参赛项目** | 基于 DFM 动态因子模型 + Transformer 时序编码 + MAPPO 强化学习的指数基金智能资产配置系统

---

## 📌 项目概述

本系统是一套面向机构投资与高净值客户的**指数型基金（ETF）智能动态配置与风控平台**。针对传统资产配置感知维度单薄、静态配置适应性差、纯强化学习易高维震荡及真实交易摩擦损耗等痛点，构建了“多维环境感知 — 4大 Market Regime 基础配置 — 月度舆情研报驱动 RL 动态调仓 — Risk Sentinel 摩擦平滑”的全闭环架构。

### 🌟 核心特色与创新
1. **多维全景感知与 AI 舆情 3 层漏斗**：
   - 严格复刻并拓展国盛证券“择时六面图”（流动性、经济面、估值面、资金面、技术面、情绪面）30+ 维高频量化指标；
   - 创新性搭建 AI 舆情 3 层数据漏斗（L1 规则初筛 $\rightarrow$ L2 Data Agent 初选 $\rightarrow$ L3 Analyst Agent 深度研报），由 DeepSeek API 深度提炼月度舆情研报特征向量。
2. **DFM + Transformer 显隐双层降维与 4 大 Market Regime**：
   - DFM 结合卡尔曼滤波与 EM 算法提取 7 维显性因子；
   - 60 日滑动窗口 Transformer 提取 64 维隐含市场演化特征；
   - 划分【强牛成长】、【震荡轮动】、【滞胀避险】、【底部复苏】4 大 Market Regime，并确立对应的基准搭配（Baseline）。
3. **月度研报驱动的 MAPPO 多智能体动态调仓**：
   - Macro Agent（宏观指引）+ Portfolio Agent（Dirichlet 分布连续采样微调）+ Risk Sentinel Agent（风控哨兵）分层协同；
   - 避免无约束自由搜索造成的模型震荡，在基准搭配上自适应微调 ETF 权重。
4. **真实交易摩擦抑制与 1232 交易日回测验证**：
   - 显式计入万分之三双边佣金与印花税惩罚项；
   - 动态换手平滑系数 $\beta_t$ 约束，月均换手率降至 **0.30%**；
   - 5 年全样本回测累计收益率达 **+54.11%**（超额等权 +25.7%），夏普比率 **0.493**，最大回撤 **-26.15%**。

---

## 🛠️ 技术栈

- **前端核心**：React 18, React Router v6, Vite 5
- **数据可视化**：ECharts 5, echarts-for-react
- **UI 组件库与图标**：Ant Design 5 (`antd`), `@ant-design/icons`
- **样式与布局**：CSS3 / Bento Grid（自适应科技金融浅色终端风格）
- **核心算法引擎**：Python, PyTorch (Transformer & PPO), NumPy, Pandas, Statsmodels

---

## 🚀 本地运行指南

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问：`http://localhost:3000`

### 3. 构建生产包
```bash
npm run build
```

---

## 📂 项目结构

```
├── index.html                   # HTML 入口
├── package.json                 # 依赖配置
├── vite.config.js               # Vite 构建配置
├── .gitignore                   # Git 忽略配置
└── src/
    ├── main.jsx                 # 应用主入口
    ├── App.jsx                  # 根组件与路由配置
    ├── components/
    │   ├── charts/Chart.jsx     # ECharts 响应式通用图表封装
    │   └── layout/Layout.jsx    # 全局 App Shell、侧边导航与顶栏
    ├── data/
    │   └── mockData.js          # 真实回测指标序列与历史数据
    ├── pages/
    │   ├── Dashboard.jsx        # 1. 首页总览看板 (KPI + 净值走势 + 持仓分布)
    │   ├── Market.jsx           # 2. 市场分析 (六面图全景 + 3层AI漏斗 + 快讯流)
    │   ├── Allocation.jsx       # 3. 资产配置 (Regime 策略切换 + 14只ETF池)
    │   ├── Backtest.jsx         # 4. 回测分析 (4策略横评 + 回撤深度 + 年度对比)
    │   ├── Settings.jsx         # 5. 系统设置 (超参数明细 + 权限 + 系统健康度)
    │   └── Deploy.jsx           # 6. 部署监控 (实盘交易路由与执行终端)
    ├── styles/
    │   └── globals.css          # 金融科技浅色主题设计系统 (Tokens & Bento Grids)
    └── utils/
        └── chartOptions.js      # ECharts 配置生成工具库
```

---

## 🌐 在线演示 (GitHub Pages)

本项目部署有实时交互式 Demo：
👉 **演示地址**：[https://wangr9577-tech.github.io/Market4ETF/](https://wangr9577-tech.github.io/Market4ETF/)

---

## 📄 License
MIT License
