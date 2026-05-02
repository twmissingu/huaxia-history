[![English](https://img.shields.io/badge/-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/-中文-red?style=flat-square)](README_zh.md)

---

# 华夏志 (Huaxia History)

通过沉浸式电影级体验，探索五千年中华历史。从夏朝到大清，在一个精美的网页应用中发现朝代、事件和人物。

## 为什么做这个？

传统历史网站像学术数据库——枯燥、杂乱、割裂。华夏志重新想象这种体验：

- **电影级第一印象** — 带有电影级动画的首屏，，立刻吸引你
- **空间理解** — 互动地图展示历史发生在哪里，而不仅仅是何时
- **丰富数据，简洁设计** — 16+ 朝代、200+ 事件、500+ 人物，智能筛选
- **诗意过渡** — 水墨晕染动画连接各页面，如同中国画卷缓缓展开

## 功能特性

- 🎬 电影级首屏与墨滴过渡动画
- 📜 互动时间线，跨越五千年（夏至清）
- 🗺️ 动态地图，展示疆域变化与历史路线
- 👥 朝代与人物详情页，带关系图谱
- 🔍 时空搜索 — 查找事件并跳转到对应时空
- 📱 移动优先设计，原生触控交互

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/twmissingu/huaxia-history.git
cd huaxia-history

# 安装依赖
npm install
```

### 配置

创建 `.env.local` 文件用于 Mapbox（可选，没有地图也能显示其他内容）：

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=你的mapbox令牌
```

### 运行

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 `http://localhost:3000` 开始探索。

## AI Agent 指南

本项目为 AI Agent 流畅交互而设计：

1. **克隆与安装**
   ```bash
   git clone https://github.com/twmissingu/huaxia-history.git
   cd huaxia-history
   npm install
   ```

2. **配置**（可选）
   ```bash
   # 创建 .env.local 用于 Mapbox
   echo 'NEXT_PUBLIC_MAPBOX_TOKEN=your_token' > .env.local
   ```

3. **运行**
   ```bash
   npm run dev
   ```

4. **构建部署**
   ```bash
   npm run build
   npm run start
   ```

## 项目结构

```
huaxia-history/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页/Hero
│   ├── timeline/           # 时间线视图
│   ├── map/                # 互动地图
│   ├── dynasty/[id]/       # 朝代详情
│   ├── figure/[id]/        # 人物详情
│   ├── event/[id]/         # 事件详情
│   └── search/             # 搜索页面
├── components/             # React 组件
│   ├── ink-transition/     # 水墨动画
│   ├── timeline/           # 时间线组件
│   ├── map/                # 地图组件
│   └── hero/               # 首屏组件
├── data/                   # 静态 JSON 数据
│   ├── dynasties.json      # 16+ 朝代
│   ├── events.json         # 200+ 事件
│   └── figures.json         # 500+ 人物
└── docs/                   # 文档
```

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **地图**: Mapbox GL JS
- **可视化**: D3.js
- **动画**: Framer Motion, GSAP

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

---

_华夏五千年，尽在此卷_