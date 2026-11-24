# 灵珑AI 首页逆向还原报告

> 来源：`/tmp/demo/linlongs_live`（Next.js App Router 静态产物，构建 ID `gaaSP1QjI6-uajXU9qMKN`）
> 还原对象：`_next/static/chunks/app/(site)/page-6ed0db24f60e6cfb.js`
> 提取方式：webpack 模块反混淆（prettier babel）+ CSS 产物 grep + RSC payload 解析

---

## 1. 组件树

```
app/(site)/layout.tsx
├─ ThemeProvider (next-themes, disableTransitionOnChange)
├─ I18nProvider
├─ ToasterProvider
├─ InviteCodeCapture
├─ <header>  SiteHeader                       ← 布局层，非 page 模块
├─ page.tsx  (module 27146 动态导入 4 个 chunk 模块)
│  ├─ module 1275  SplashCursor                → <div fixed inset-0 z-50 pointer-events-none><canvas/>
│  ├─ module 61414 Hero                        → <section>  两栏 + 终端 + 统计条
│  │  ├─ DotGrid (内联 canvas 组件, module 内部)
│  │  ├─ CodePanel (=T)                        → 终端卡片
│  │  │  ├─ CodeLine 组 → renderTab(curl | python | node)
│  │  │  │  └─ <ModelToken>  ← 打字机光标 .ll-caret
│  │  │  └─ StatusBar: 200 OK · latency ms · stream
│  │  └─ StatCell (×3)
│  ├─ module 90734 BrandMarquee                → <section> 无限 logo 走马灯
│  └─ module 44604 ChooseUs                    → <section> 5 张编号卡
│     └─ FeatureCard (×5)
│        ├─ 渐变边框层 + 网格纹理层 + 鼠标跟随光斑层
│        ├─ 编号 <span>01…05</span>
│        └─ 角标 SVG 插画（切 cardKey）
└─ <footer>  SiteFooter                       ← 布局层
```

模块 ID 对照：`1275`=SplashCursor、`61414`=Hero、`90734`=BrandMarquee、`44604`=ChooseUs、`24578`=cn/year 工具、`26275`=auth storage 工具。

---

## 2. 区块清单

| # | 区块 | 根元素 / 位置 | 关键子元素 | 交互 |
|---|------|---------------|-----------|------|
| 0 | SplashCursor | `div.fixed.inset-0.z-50.pointer-events-none` + canvas | WebGL2 流体（Navier-Stokes + curl/vorticity/dye） | `mousemove` 拖动 splat、`mousedown` 爆发、`touchstart/move` 移动端 |
| 1 | Hero 背景 | `section.relative.overflow-hidden.pt-16.sm:pt-24` | 3 个 `ll-drift` 光斑 + `ll-grid-floor` 透视地面 + DotGrid canvas | 光斑 CSS 漂移；DotGrid 鼠标斥力 + 点击冲击波（GSAP inertia + elastic 回弹） |
| 2 | Hero 文案 | `div.relative.z-10` | eyebrow（等宽大写）/ `h1` 渐变文字 / 描述 / 双 CTA | CTA hover：`ll-sheen` 扫光 + 箭头位移 |
| 3 | Hero 终端 | `CodePanel` 圆角 20px 深色卡片 | 红黄绿圆点 / 3 个语言 Tab / 代码区 / 状态栏 | Tab 切换；模型名打字机循环（70ms/字，停留 1800ms，删除 35ms）；`200 OK` ping 动画 |
| 4 | Hero 统计 | `grid.grid-cols-3.divide-x` 玻璃卡 | 3× StatCell（数值 + 标签） | hover 底部紫光晕淡入 |
| 5 | BrandMarquee | `section.relative.py-8` | 标题分隔线 + 无限滚动 logo 带 + 左右渐隐遮罩 | `logo-marquee 30s linear infinite`；hover 暂停 |
| 6 | ChooseUs | `section.relative.overflow-hidden.bg-white.dark:bg-[#0A0F1E]` | eyebrow + h2 + 5 卡（3 张 `md:col-span-2`，2 张 `md:col-span-3`） | 卡片 hover 上浮 + 紫色投影 + 径向光斑跟随鼠标 + 角标插画放大 |

---

## 3. 设计 Token

### 颜色
| Token | 值 | 用途 |
|---|---|---|
| 品牌主色 | `#475CFF` | eyebrow、编号、主 CTA、浅色网格 |
| 悬浮紫 | `#7C6BFF` / `#5B5BFF` | hover 光斑、分隔线、投影 |
| 大字渐变 | `#3D5BFF → #8B5CF6` | h1（暗色 `#A5B4FF → #D8B4FE`） |
| 卡片插画渐变 | `#4FC3FF → 55% #6A5CFF → #FF9AB0` | SVG linearGradient |
| 暗色底 | `#101828` / `#0A0F1E` / `#0B1020` | 布局/ChooseUs/终端 |
| 终端底色 | `#0B1020/95` | 代码面板 |
| 文本 | `gray-950` / `gray-600`；暗色 `white` / `gray-300` | 标题 / 正文 |
| Eyebrow 暗色 | `#93A1FF` | 暗色下可读性 |

### 排版 / 尺寸
- 容器：`max-w-[1470px]`，内边距 `px-5 sm:px-7`
- Hero h1：`text-4xl sm:text-6xl`，`leading-[1.08]`，`font-semibold`，`tracking-tight`
- 描述：`text-[15px] sm:text-base`，`leading-7`
- eyebrow / 编号 / 代码：`font-mono`，`tracking-[0.16em~0.2em]`，`text-xs`
- 卡片：`rounded-2xl` + 内层 `rounded-[15px]`，`min-h-[200px] sm:min-h-[295px]`，`p-6 sm:p-8`
- 终端：`rounded-[20px]`，代码 `text-[12px] sm:text-[13px]`，`leading-6`
- 按钮：`h-11`，`rounded-xl`，`px-6`，`text-sm font-semibold`

### 动效参数
| 名称 | 定义 |
|---|---|
| `ll-drift` | `14s ease-in-out infinite`，`translate(0)→(40px,30px) scale(1)→1.08` |
| `ll-drift-rev` | 同上 `18s`，`reverse` |
| `ll-grid-floor` | `3s linear infinite`，`background-position 0→0 56px` |
| `ll-caret` | `1s step-end infinite`，`opacity 1(0-49%)→0(50-100%)` |
| `ll-sheen::after` | `3.2s ease-in-out infinite`，`translate(-120%)skew(-20deg)→(220%)` |
| `logo-marquee` | `30s linear infinite`，`translate(0)→(-50%)` |
| DotGrid | `dotSize 2 / gap 18 / proximity 130 / shockRadius 250 / shockStrength 5 / resistance 750 / returnDuration 1.5` |
| 流体 | `SIM 128 / DYE 1440 / DENSITY 3.5 / VELOCITY 2 / CURL 3 / SPLAT_RADIUS 0.2 / FORCE 6000 / SPEED 10 / HUE [0.55,0.95]` |

### reduced-motion
CSS 产物内统一降级：
```css
@media (prefers-reduced-motion: reduce) {
  .ll-caret,.ll-drift,.ll-drift-rev,.ll-grid-floor,.ll-sheen:after{animation:none!important}
}
```
JS 侧：`SplashCursor` 与 `DotGrid` 首行 `matchMedia('(prefers-reduced-motion: reduce)').matches` 直接 return。

---

## 4. 交互逻辑实现方式

| 动效 | 技术 |
|---|---|
| 流体拖尾 | WebGL2 自定义渲染管线（advection / divergence / curl / vorticity / pressure Jacobi 20 次 / gradient subtract / display shading），`requestAnimationFrame` |
| 点阵斥力 + 冲击波 | Canvas2D + 手动积分；圆点受鼠标靠近产生偏移，点击时按距离施加惯性冲量，GSAP `inertia` + `elastic.out(1,0.75)` 回弹 |
| 光斑漂移 | 纯 CSS keyframes |
| 地面网格 | CSS `perspective` + `rotateX(68deg)` + 网格背景位移 |
| 标题渐变 | `bg-clip-text text-transparent` + `linear-gradient(to bottom right, …)` |
| CTA 扫光 | CSS `::after` 白色渐变条动画 |
| 模型打字机 | `setTimeout` 状态机（type 70ms / hold 1800ms / delete 35ms / next 250ms） |
| Logo 走马灯 | CSS animation + `animationPlayState` 悬停暂停 |
| 卡片鼠标光斑 | `onMouseMove` 写入 CSS 变量 `--mx/--my`，`radial-gradient` 引用 |

---

## 5. 文案清单（i18n key → 中文）

### Hero
| key | zh |
|---|---|
| `home.banner.title` | 企业级 AI 智能的统一网关 |
| `home.banner.description` | 通过一套标准接口接入全球主流文本、图像、视频与音频模型。多线路容灾、逐笔用量核算，以及企业采购所需的合同、发票与专项交付，均在同一个平台内完成。 |
| `home.banner.primaryCta` | 立即开始 |
| `home.banner.secondaryCta` | 浏览模型 |
| `home.banner.stats.users` | 服务团队与开发者 |
| `home.banner.stats.tokens` | 日均处理 Tokens |
| `home.banner.stats.models` | 已接入模型 |

原生文案（不翻译，硬编码）：`LINLONG AI GATEWAY · API.LINLONGS.COM`（替换为站点域名）、`POST /v1/chat/completions`、`200 OK`、`stream`、`OpenAI-compatible · 200+ models`、代码片段。

### 统计数值
| 值 | 说明 |
|---|---|
| `{1000 + 天数×20}+` | 从 2026-08-15 起每日递增（演示用可信增长曲线） |
| `1000亿+`（zh）/ `100B+` | 日均 Tokens |
| `200+` | 模型数 |

### BrandMarquee
| key | zh |
|---|---|
| `home.logos.caption` | 领先模型服务商，一个接口全接入 |

### ChooseUs
| key | zh |
|---|---|
| `home.chooseUs.eyebrow` | 为什么选择灵珑 |
| `home.chooseUs.title` | 面向生产流量的模型接入基础设施 |
| `cards.singleApi.title` | 统一标准接口 |
| `cards.singleApi.description` | 兼容 OpenAI Chat / Responses、Anthropic Messages，以及生图、视频、音频异步任务接口 /v1/predictions，一套密钥与统一的 SDK 模式。 |
| `cards.security.title` | 密钥隔离与权限控制 |
| `cards.security.description` | 支持按密钥设置额度上限、过期时间与可用分组，链路全程加密传输，并提供完整 request_id 调用日志。 |
| `cards.globalEdge.title` | 多节点加速直连 |
| `cards.globalEdge.description` | 通过多区域接入节点转发上游请求，降低跨网抖动与首字延迟，保障流式输出稳定。 |
| `cards.latency.title` | 清晰计费与企业结算 |
| `cards.latency.description` | 按模型、分组与实际调用逐笔核算费用；支持在线充值，也支持企业对公转账、签订正式合同与开具增值税发票。 |
| `cards.failover.title` | 多线路自动容灾 |
| `cards.failover.description` | 同一模型背后可绑定多条上游通道；主线路出现波动或维护时自动切换备用路由，避免单点故障中断线上业务。 |

### Brand logo 资源
`/images/brands/br-{1..12}.svg`（Za / Qwen / Doubao / Gemini / Grok / Z.ai / KIMI / MINIMAX / OpenAI / KwaiKAT / Claude）

---

## 6. 与 New API 的落点差异

| demo | New API 实现 | 说明 |
|---|---|---|
| `next-themes` | `useTheme()` (`context/theme-provider`) | 保留 New API 主题体系 |
| `next/link` | `@tanstack/react-router` `Link` / `Button render` | 路由适配 |
| 自定义 I18nProvider | `react-i18next` `useTranslation` | key 前缀统一 `home.*` |
| `/signin` `/model` | `/sign-in` `/pricing` | 站点路由不同 |
| 静态数值 | 后端配置的站点名 + 真实模型数量 | 数据来源不同 |
| 自有 header/footer | `PublicLayout` + `Footer` | 直接复用 |
| `SplashCursor` chunk | `public/fluid-hero.js` + `mountFluid()` | 保留既有实现，全屏 `z-50` |
| 无公告 | `GET /api/notice` | New API 特有，置于顶部 |
