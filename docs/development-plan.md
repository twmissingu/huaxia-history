# 华夏志 (Huaxia History) — 开发计划

> 基于 `/CONTEXT.md` 产品规格的技术实现方案
> 技术栈：Next.js 15 + Tailwind CSS + Framer Motion + Mapbox + D3.js

---

## 一、技术选型

| 层级 | 技术 | 版本 | 理由 |
|------|------|------|------|
| 框架 | Next.js | 15.x | App Router, SSG, 内置路由, SEO友好 |
| 语言 | TypeScript | 5.x | 类型安全, 数据模型约束 |
| 样式 | Tailwind CSS | 4.x | 原子化CSS, 快速实现宣纸质感与氛围色 |
| 动画 | Framer Motion | 12.x | React声明式动画, 页面过渡, 手势交互 |
| 动画 | GSAP + ScrollTrigger | 3.x | 墨滴晕染, 时间线滚动联动, 复杂时间轴动画 |
| 地图 | Mapbox GL JS | 3.x | 矢量渲染, flyTo镜头动画, 自定义样式 |
| 图谱 | D3.js | 7.x | 人物关系网络力导向图 |
| 虚拟滚动 | @tanstack/react-virtual | 3.x | 时间线大数据量渲染 |
| 字体 | @chinese-fonts/syst | latest | 思源宋体子集化加载 |
| 图标 | Lucide React | latest | 简洁现代图标 |
| 数据 | 静态JSON | - | v1.0静态, 未来替换为API |

---

## 二、项目目录结构

```
huaxia-history/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首屏 Hero + 墨滴过渡
│   ├── timeline/page.tsx         # 时间线页（全史贯通）
│   ├── map/page.tsx              # 地图页（时空联动）
│   ├── dynasty/[id]/page.tsx     # 朝代详情页（单页长卷）
│   ├── figure/[id]/page.tsx      # 人物详情页（关系图谱）
│   ├── search/page.tsx           # 搜索页（时空联动）
│   ├── layout.tsx                # 根布局（字体加载、主题）
│   └── globals.css               # 全局样式（宣纸质感、墨色变量）
├── components/
│   ├── hero/
│   │   ├── HeroSection.tsx       # 首屏主组件
│   │   ├── KenBurnsBackground.tsx # 缓慢平移背景
│   │   ├── TitleLayer.tsx        # 标题层（华夏志·史）
│   │   ├── SealStamp.tsx         # 印章装饰（SVG）
│   │   └── ScrollIndicator.tsx   # 向下滚动引导
│   ├── ink-transition/
│   │   ├── InkDropTransition.tsx # 墨滴晕染过渡组件
│   │   └── ink-animations.ts     # GSAP动画时间轴定义
│   ├── timeline/
│   │   ├── TimelineView.tsx      # 时间线主视图
│   │   ├── TimelineAxis.tsx      # 中轴线
│   │   ├── EventCard.tsx         # 事件卡片（左右交替）
│   │   ├── VirtualTimeline.tsx   # 虚拟滚动容器
│   │   ├── CategoryFilter.tsx    # 事件筛选（政治/军事/文化/科技）
│   │   └── FocusEffect.tsx       # 视口中央对焦效果
│   ├── map/
│   │   ├── MapView.tsx           # 地图主视图
│   │   ├── MapboxMap.tsx         # Mapbox GL JS 封装
│   │   ├── TerritoryLayer.tsx    # 动态疆域polygon
│   │   ├── CityMarker.tsx        # 城池标记
│   │   ├── RouteAnimation.tsx    # 历史路线动画
│   │   └── TimeSlider.tsx        # 时间滑块控制
│   ├── dynasty/
│   │   ├── DynastyHero.tsx       # 朝代头图
│   │   ├── DynastyInfo.tsx       # 基本信息（起止、国祚、都城）
│   │   ├── KeyEvents.tsx         # 精选关键事件
│   │   ├── KeyFigures.tsx        # 精选代表人物
│   │   ├── ReignTable.tsx        # 年号速查表
│   │   └── ExpandButton.tsx      # "查看全部"展开
│   ├── figure/
│   │   ├── FigureHero.tsx        # 人物头图
│   │   ├── FigureInfo.tsx        # 基本信息
│   │   ├── RelationGraph.tsx     # 关系图谱（D3力导向图）
│   │   ├── BioSection.tsx        # 生平简介
│   │   └── WorksSection.tsx      # 代表作品
│   ├── search/
│   │   ├── SearchBox.tsx         # 搜索框（全局悬浮）
│   │   ├── SearchResults.tsx     # 搜索结果面板
│   │   └── SpatiotemporalSync.tsx # 时空联动同步器
│   ├── navigation/
│   │   ├── SmartNav.tsx          # 智能导航栏
│   │   ├── ContextLabel.tsx      # 当前上下文显示（哪朝哪代）
│   │   ├── BackButton.tsx        # 返回按钮
│   │   └── SearchToggle.tsx      # 搜索图标
│   └── ui/                       # 通用UI组件
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── Separator.tsx
├── data/                         # 静态JSON数据
│   ├── dynasties.json            # 朝代数据（含richness）
│   ├── events.json               # 历史事件
│   ├── figures.json              # 历史人物
│   ├── locations.json            # 地理坐标（古今地名对照）
│   ├── routes.json               # 历史路线（丝绸之路等）
│   └── territories.json          # 疆域GeoJSON（时间序列）
├── lib/
│   ├── dataLoader.ts             # 数据加载器（未来替换为API）
│   ├── mapbox.ts                 # Mapbox工具函数
│   ├── timeline.ts               # 时间线计算工具
│   └── utils.ts                  # 通用工具
├── types/
│   └── index.ts                  # TypeScript类型定义
├── hooks/
│   ├── useScrollProgress.ts      # 滚动进度监听
│   ├── useMediaQuery.ts          # 响应式断点
│   └── useSpatiotemporal.ts      # 时空联动状态管理
├── public/
│   └── images/                   # 静态图片资源
│       ├── hero-*.jpg            # 首屏Hero图
│       ├── event-*.jpg           # 事件场景图
│       ├── figure-*.jpg          # 人物肖像
│       └── bg-*.jpg              # 背景纹理
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 三、数据模型

### Dynasty（朝代）
```typescript
interface Dynasty {
  id: string;                    // "tang"
  name: string;                  // "唐"
  shortName: string;             // "唐朝"
  period: string;                // "618-907"
  startYear: number;             // 618（负数表示BC）
  endYear: number;               // 907
  capital: string;               // "长安"
  capitalCoordinates: [number, number]; // [108.9, 34.3]
  color: string;                 // 氛围色 "#d4af37"
  secondaryColor: string;        // 辅助色
  richness: "thin" | "medium" | "rich";
  overview: string;              // 朝代简介
  heroImage: string;             // "/images/hero-tang.jpg"
  tagline: string;               // "盛世长安，万邦来朝"
}
```

### HistoricalEvent（历史事件）
```typescript
interface HistoricalEvent {
  id: string;
  year: number;                  // 755（负数表示BC，如-221）
  month?: number;
  day?: number;
  title: string;                 // "安史之乱爆发"
  dynasty: string;               // "tang"
  category: "politics" | "military" | "culture" | "technology";
  location: string;              // "范阳"
  coordinates?: [number, number]; // [116.4, 39.9]
  description: string;           // 事件详细描述
  significance: string;          // 历史意义
  relatedFigures: string[];      // ["an-lushan", "shi-siming"]
  image?: string;                // "/images/event-anshi.jpg"
}
```

### HistoricalFigure（历史人物）
```typescript
interface HistoricalFigure {
  id: string;
  name: string;                  // "李白"
  courtesyName?: string;         // "太白"
  artName?: string;              // "青莲居士"
  dynasty: string;               // "tang"
  birthYear: number;
  deathYear: number;
  birthplace: string;
  titles: string[];              // ["翰林待诏", "诗仙"]
  category: string[];            // ["poet", "writer"]
  tags: string[];                // ["浪漫主义", "酒仙"]
  bio: string;                   // 生平简介
  achievements: string[];        // 主要成就
  works?: string[];              // ["静夜思", "将进酒", "蜀道难"]
  relations: Relation[];
  image?: string;                // "/images/figure-libai.jpg"
  quote?: string;                // 代表性语录
}

interface Relation {
  figureId: string;
  type: "friend" | "enemy" | "family" | "teacher" | "student" | "colleague";
  description: string;
}
```

### Location（地理坐标）
```typescript
interface Location {
  id: string;
  ancientName: string;           // "长安"
  modernName: string;            // "西安"
  coordinates: [number, number]; // [108.9, 34.3]
  type: "capital" | "city" | "pass" | "battlefield" | "site";
  dynasty: string;               // 主要关联朝代
  description: string;
}
```

### HistoricalRoute（历史路线）
```typescript
interface HistoricalRoute {
  id: string;
  name: string;                  // "丝绸之路"
  nameEn: string;                // "Silk Road"
  period: string;                // "han-tang"
  type: "trade" | "military" | "diplomatic" | "migration";
  coordinates: [number, number][]; // GeoJSON LineString
  waypoints: {
    name: string;
    coordinates: [number, number];
    description: string;
  }[];
  description: string;
}
```

### Territory（疆域数据）
```typescript
interface Territory {
  dynasty: string;
  year: number;                  // 具体年份
  geojson: GeoJSON.Polygon;      // 疆域多边形
  maxExtent: boolean;            // 是否为最大疆域
}
```

---

## 四、核心功能实现方案

### 1. 墨滴晕染过渡动画

**技术方案**：GSAP + SVG 路径动画

```typescript
// 动画时间轴（1.2秒）
const inkTimeline = gsap.timeline();

// Phase 1: 墨滴落下（0-0.4s）
inkTimeline.fromTo(inkDrop, 
  { scale: 0, y: -100 },
  { scale: 1, y: 0, duration: 0.4, ease: "power2.in" }
);

// Phase 2: 晕染扩散（0.4-1.2s）
inkTimeline.to(inkSpread, 
  { scale: 50, opacity: 0, duration: 0.8, ease: "power1.out" }
);

// Phase 3: 新页面浮现（同步）
inkTimeline.fromTo(newPage,
  { opacity: 0 },
  { opacity: 1, duration: 0.6 },
  "-=0.4"
);
```

**SVG 墨滴实现**：
- 使用 SVG filter `feTurbulence` + `feDisplacementMap` 创造不规则边缘
- 墨滴核心：深褐色 `#1a0f0a`
- 晕染层：多层半透明圆形叠加，模拟水墨扩散

### 2. 时间线虚拟滚动

**技术方案**：@tanstack/react-virtual

```typescript
// 计算中轴线位置
const getCardPosition = (index: number) => {
  return index % 2 === 0 ? "left" : "right"; // 左右交替
};

// 对焦效果
const FocusEffect = ({ children, isCenter }) => (
  <div style={{
    filter: isCenter ? "blur(0px)" : "blur(2px)",
    opacity: isCenter ? 1 : 0.6,
    transition: "all 0.5s ease"
  }}>
    {children}
  </div>
);
```

**关键优化**：
- 只渲染视口内 ±3 个事件卡片
- 使用 `will-change: transform` 优化滚动性能
- 滚动条自定义为极简风格（细线+朝代色节点）

### 3. 地图系统

**技术方案**：Mapbox GL JS

**底图配置**：
```typescript
const mapConfig = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [105, 35],           // 中国中心
  zoom: 4,
  pitch: 0,
  attributionControl: false,
};
```

**动态疆域**：
- 使用 GeoJSON Source + Fill Layer
- 时间滑块改变时，切换对应的疆域 polygon
- 颜色根据朝代氛围色动态设置

**历史路线动画**：
```typescript
// 丝绸之路路线动画
const animateRoute = (routeId: string) => {
  const route = routes.find(r => r.id === routeId);
  const coordinates = route.coordinates;
  
  // 使用 Mapbox 的 line-gradient 实现流动效果
  map.addLayer({
    id: 'route-flow',
    type: 'line',
    source: {
      type: 'geojson',
      data: { type: 'LineString', coordinates }
    },
    paint: {
      'line-width': 3,
      'line-color': '#c9372c',
      'line-gradient': ['interpolate', ['linear'], ['line-progress'],
        0, 'rgba(201, 55, 44, 0)',
        0.5, 'rgba(201, 55, 44, 1)',
        1, 'rgba(201, 55, 44, 0)'
      ]
    }
  });
};
```

**飞行动画**：
```typescript
map.flyTo({
  center: destination,
  zoom: 8,
  speed: 0.8,        // 飞行速度
  curve: 1.5,        // 弧线曲率
  easing: (t) => t * (2 - t),  // 缓动函数
  duration: 1500,    // 1.5秒
});
```

### 4. 时空联动搜索

**技术方案**：React Context + 协调动画

```typescript
interface SpatiotemporalState {
  targetYear: number;
  targetLocation: [number, number];
  targetEvent: string;
  isAnimating: boolean;
}

// 搜索触发联动
const handleSearch = (query: string) => {
  const result = searchEngine.search(query);
  
  // 1. 时间线滚动到目标年份
  timelineRef.current.scrollToYear(result.year);
  
  // 2. 地图飞行到目标地点
  mapRef.current.flyTo(result.coordinates);
  
  // 3. 详情面板展开
  panelRef.current.expand(result);
  
  // 所有动画使用相同 duration（0.8s），产生协同感
};
```

### 5. 人物关系图谱

**技术方案**：D3.js 力导向图

```typescript
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collision", d3.forceCollide().radius(50));

// 中心人物节点放大
const centerNode = nodes.find(n => n.id === figureId);
centerNode.r = 60;  // 中心节点半径
centerNode.fx = width / 2;  // 固定在中心
centerNode.fy = height / 2;
```

**视觉样式**：
- 中心节点：人物肖像圆形裁切
- 关联节点：小型圆形 + 姓名标签
- 连线颜色：根据关系类型（友人绿色、敌人红色、师生蓝色）
- 力导向布局自动排列

### 6. 智能导航栏

**技术方案**：根据当前路由和滚动位置动态更新

```typescript
const getNavigationContext = (route: string, scrollData: any) => {
  switch (route) {
    case '/timeline':
      const currentDynasty = getDynastyByYear(scrollData.year);
      return { label: `${currentDynasty.name} · ${currentDynasty.period}` };
    case '/map':
      return { label: scrollData.locationName };
    case '/dynasty/[id]':
      const dynasty = getDynasty(route.params.id);
      return { label: `${dynasty.name} · ${dynasty.period}` };
    case '/figure/[id]':
      const figure = getFigure(route.params.id);
      return { label: `${figure.name} · ${figure.dynastyName}` };
    default:
      return { label: "华夏志" };
  }
};
```

---

## 五、样式系统设计

### 色彩变量（CSS Custom Properties）
```css
:root {
  /* 宣纸质感 */
  --paper-bg: #f5f0e8;           /* 暖白宣纸 */
  --paper-dark: #e8e0d4;         /* 暗部宣纸 */
  
  /* 墨色 */
  --ink-black: #1a0f0a;          /* 浓墨 */
  --ink-dark: #3d2b1f;           /* 重墨 */
  --ink-medium: #6b5b4f;         /* 中墨 */
  --ink-light: #9a8b7e;          /* 淡墨 */
  
  /* 强调色 */
  --cinnabar: #c9372c;           /* 秦汉朱砂红 */
  --gilt: #d4af37;               /* 唐宋鎏金黄 */
  
  /* 首屏 */
  --hero-dark: #0a0a0f;          /* 首屏暗调背景 */
}
```

### 朝代氛围色映射
```typescript
const dynastyColors: Record<string, string> = {
  xia: "#8b7355",        // 夏：土黄（夯土）
  shang: "#7a8b69",      // 商：青绿（青铜锈色）
  zhou: "#8b4513",       // 周：赭石（礼制庄重）
  qin: "#c9372c",        // 秦：朱砂红（黑红为主）
  han: "#c9372c",        // 汉：朱砂红
  sanguo: "#8b0000",     // 三国：暗红（战争）
  jin: "#6b8e6b",        // 晋：竹青（文人）
  sui: "#4682b4",        // 隋： steel蓝（大运河）
  tang: "#d4af37",       // 唐：鎏金黄
  wudai: "#808080",      // 五代：灰（乱世）
  song: "#87ceeb",       // 宋：天青
  yuan: "#228b22",       // 元：草原绿
  ming: "#cd853f",       // 明：秘鲁色（赭石）
  qing: "#4169e1",       // 清：皇家蓝
};
```

### Tailwind 自定义配置
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d4',
        },
        ink: {
          black: '#1a0f0a',
          dark: '#3d2b1f',
          medium: '#6b5b4f',
          light: '#9a8b7e',
        },
        cinnabar: '#c9372c',
        gilt: '#d4af37',
      },
      fontFamily: {
        serif: ['"Source Han Serif CN"', '"Noto Serif SC"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'ken-burns': 'kenBurns 30s ease-in-out infinite alternate',
        'breathe': 'breathe 2s ease-in-out infinite',
        'ink-drop': 'inkDrop 1.2s ease-in-out forwards',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.1) translateX(-5%)' },
          '100%': { transform: 'scale(1.1) translateX(5%)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(8px)' },
        },
      },
    },
  },
};
```

---

## 六、开发顺序

### 第一阶段：基础架构（第1-2天）
- [ ] 初始化 Next.js 15 + TypeScript 项目
- [ ] 配置 Tailwind CSS + 自定义主题
- [ ] 配置字体（思源宋体 + JetBrains Mono）
- [ ] 创建基础目录结构
- [ ] 定义 TypeScript 类型
- [ ] 创建数据加载器（dataLoader.ts）
- [ ] 全局布局（layout.tsx）：宣纸背景、导航栏框架

### 第二阶段：数据层（第3天）
- [ ] 生成朝代数据（dynasties.json）
- [ ] 生成历史事件数据（events.json）
- [ ] 生成历史人物数据（figures.json）
- [ ] 生成地理坐标数据（locations.json）
- [ ] 生成历史路线数据（routes.json）
- [ ] 生成疆域 GeoJSON（territories.json）

### 第三阶段：首屏与过渡（第4-5天）
- [ ] Ken Burns 背景动画
- [ ] 标题层排版（华夏志·史）
- [ ] 印章装饰（SVG）
- [ ] 滚动引导箭头
- [ ] 墨滴晕染过渡动画（GSAP + SVG）
- [ ] 滚动触发机制（ScrollTrigger）

### 第四阶段：时间线页（第6-8天）
- [ ] 中轴线布局
- [ ] 虚拟滚动容器
- [ ] 事件卡片组件（左右交替）
- [ ] 事件筛选（政治/军事/文化/科技）
- [ ] 视口中央对焦效果
- [ ] 滚动条自定义
- [ ] 移动端适配（纵向+横向卡片）

### 第五阶段：地图页（第9-11天）
- [ ] Mapbox GL JS 集成
- [ ] 底图配置（Light 样式）
- [ ] 城池标记（坐标+古今地名）
- [ ] 动态疆域 polygon（时间滑块）
- [ ] 历史路线动画（丝绸之路、大运河）
- [ ] flyTo 转场动画
- [ ] 移动端双指缩放

### 第六阶段：朝代详情页（第12-13天）
- [ ] 朝代头图
- [ ] 基本信息卡片
- [ ] 精选关键事件（≥5）
- [ ] 精选代表人物（≥5）
- [ ] 年号速查表
- [ ] "查看全部"展开逻辑
- [ ] 单页长卷布局

### 第七阶段：人物详情页（第14-15天）
- [ ] 人物基本信息
- [ ] 关系图谱（D3力导向图）
- [ ] 生平简介
- [ ] 代表作品
- [ ] 关联事件

### 第八阶段：搜索与联动（第16-17天）
- [ ] 搜索框组件（全局悬浮）
- [ ] 搜索结果面板
- [ ] 时空联动同步器
- [ ] 时间线滚动定位
- [ ] 地图 flyTo 动画
- [ ] 详情面板展开

### 第九阶段：导航与优化（第18-19天）
- [ ] 智能导航栏（上下文显示）
- [ ] 返回按钮
- [ ] 移动端导航适配
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] 动画性能优化

### 第十阶段：构建与部署（第20天）
- [ ] 静态导出配置
- [ ] 图片资源优化
- [ ] 构建测试
- [ ] Vercel 部署
- [ ] 最终验收

---

## 七、性能优化策略

### 图片优化
- 使用 Next.js Image 组件自动优化
- WebP 格式，质量 80%
- 首屏背景图预加载：`<link rel="preload">`
- 非首屏图片懒加载

### 字体优化
- 思源宋体子集化：仅加载 Heavy/Regular 字重
- 使用 `font-display: swap` 避免 FOIT
- JetBrains Mono 仅用于数字/年份

### 代码优化
- 路由级代码分割（Next.js 自动）
- 地图组件动态导入（`next/dynamic`），非地图页不加载 Mapbox
- D3 组件动态导入，非人物页不加载

### 动画优化
- 使用 `transform` 和 `opacity`（GPU 加速）
- `will-change` 仅在动画元素上使用
- 虚拟滚动只渲染视口内元素
- 使用 `requestAnimationFrame` 控制动画帧率

---

## 八、命令速查

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建（静态导出）
npm run build

# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint

# 运行单测
npm test

# 运行单个测试文件
npm test -- EventCard.test.tsx

# 安装新包
npm install framer-motion gsap mapbox-gl d3 @tanstack/react-virtual

# 安装类型定义
npm install -D @types/mapbox-gl @types/d3
```

---

*最后更新：2026-04-30*
