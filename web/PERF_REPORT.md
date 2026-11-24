# Home 页性能优化报告

**日期**: 2026-11-24  
**范围**: Home Hero 区（Hero section + 3 光斑 + 透视网格 + DotGrid + FluidOverlay）  
**测试环境**: Chromium 140 headless-new / Ubuntu 22.04 / 4 CPU cores / 无 GPU（rAF throttling ~4fps）  
⚠ **注意**: headless Chromium 强制 throttling requestAnimationFrame，FPS 数字**仅供相对对比参考**，非真实桌面 FPS。本文以 CSS computed style + 合成层隔离 + 资源尺寸为客观指标。

---

## 1. 修复清单

### §1 透视网格 — 3 层 bug 叠加
| 问题 | 修复前 | 修复后 |
|------|--------|--------|
| **mask 方向** | parent `mask-image: linear-gradient(to_top,black 10%,transparent 85%)`（底部 10% opaque → 立即透明），grid 视觉范围几乎全透明 | grid 自身 `mask-image: linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)`（底部全不透明 → 顶部渐隐） |
| **perspective/transform 分离** | parent 有 `[perspective:600px]`，child 只有 `[transform:rotateX(68deg)]` | **同元素** `transform: translateX(-50%) translateZ(0) perspective(700px) rotateX(60deg)` + `transform-origin: bottom center` |
| **bottom anchor** | child `bottom-[-10%]`（超出 parent 底部 -56px） | child `bottom-0`（贴底），rect.bottom 正好等于 Hero section bottom |
| **Hero overflow** | `overflow-hidden` | `overflow-x-clip overflow-y-hidden contain-[layout_style_paint]`（允许 transform 后垂直显示） |

**修复后 5 断点 rect 对比**：

| 视口 | coversVw | grid.left | grid.right | grid.top | grid.bottom |
|------|----------|-----------|------------|----------|-------------|
| 1440 | ✅ true | -720 | 2160 | 706 | 983 |
| 1280 | ✅ true | -640 | 1920 | 687 | 963 |
| 1024 | ✅ true | -512 | 1536 | 687 | 963 |
| 768  | ✅ true | -384 | 1152 | 666 | 939 |
| 390  | ✅ true | -195 | 585 | 929 | 1225 |

✅ 全部 coversVw=true，rect.bottom 贴 Hero section 底部

---

### §3 FluidOverlay — 设备分档 + 生命周期
| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| 分辨率 | SIM=128 / DYE=1024（所有设备） | **high**: 128/1024/20 iter · **low**（移动/≤4核/≤4GB）: 64/512/10 iter |
| SPLAT_FORCE | 6000 恒定 | low 档降为 4000 |
| visibilitychange | ❌ 无暂停 | ✅ `document.hidden` → `stop()`，visible → `start()` |
| scroll 暂停 | ❌ 无 | ✅ scroll 立即 stop，250ms 无滚动后恢复 |
| hostStyle | 无合成层提示 | `will-change:transform;transform:translateZ(0);contain:layout style paint` |
| fluid-hero.js start/stop | 无 | **新增**：适配层拦截首次 rAF 保存 frameFn，`__fluidStart/__fluidStop` 重启循环 |

**⚠ 未完成**: §3.3 FPS 运行时自适应（高→低→off）需要在 fluid-hero.js 内部 rAF 采样 frameMs，当前为 TODO 项。React 层面无法注入。

---

### §4 DotGrid — 空间哈希 + 动态粒子
| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| 时间复杂度 | O(n²) 每粒子扫全部 | **O(n) 近似** — 空间哈希桶 + 邻 8 桶查询 |
| 粒子数 | 固定 gap=18 → ~400 粒子 | **动态 gap**: 1440→36(120), 1024→42(90), 768→54(60), <768→68(40) |
| 距离比较 | `Math.hypot(dx,dy)` | **平方距离** `dx*dx + dy*dy`，仅在需要方向时 `Math.sqrt` |
| 鼠标范围检查 | 无 | 先判定 mouse 是否在 canvas+proximity 范围内再查表 |
| shock 冲击波 | 遍历全部 | 只做半径内粒子的范围预筛 |
| visibilitychange | ❌ 无 | ✅ hidden 暂停 rAF，visible 恢复 |
| scroll 暂停 | ❌ 无 | ✅ scroll 立即 cancel rAF，250ms 后恢复 |
| 合成层 | 无 | canvas 加 `will-change: transform; transform: translateZ(0)` |

---

### §5 光斑 — 去 blur-3xl
| 项目 | 修复前 | 修复后 |
|------|--------|--------|
| filter | `blur-[120px]` = **blur-3xl**（96px 大范围高斯模糊，合成器杀手） | **`blur-[24px]`**（预渲染径向渐变已足够柔） |
| 背景 | 纯色 + `blur(120px)`（运行时高斯） | **radial-gradient** 预渲染：`radial-gradient(circle, rgba(X,X,X,0.22) 0%, rgba(X,X,X,0.10) 40%, transparent 70%)` |
| 尺寸 | 520/460 + 320×620 | 统一 **288px**（预渲染渐变本身柔度足够） |
| 合成层 | 无 | 每枚光斑 `will-change:transform;transform:translateZ(0)` |

**视觉验收**: 修复后光斑柔度与修复前接近 —— 径向渐变 `rgba(0.22→0.10→transparent)` 3 段平滑过渡 + 24px blur 补偿硬度。

---

### §6 合成层隔离
| 元素 | contain | will-change | transform |
|------|---------|-------------|-----------|
| Hero section | `contain-[layout_style_paint]` | — | — |
| Hero 背景容器（光斑+grid） | — | `transform` | `translateZ(0)` |
| 每枚光斑 | — | `transform` | `translateZ(0)` |
| 透视网格 | — | `transform` | `translateZ(0)`（已在 inline transform 链里） |
| DotGrid canvas | — | `transform` | `translateZ(0)` |
| FluidOverlay host | `contain: layout style paint` | `transform` | `translateZ(0)` |

所有特效层 `pointer-events: none`（挂在父容器的 mousemove 等事件上）。

---

## 2. 改后文件清单

| 文件 | 改动 |
|------|------|
| `web/src/features/home/Hero/index.tsx` | §1 网格重写 + §4 DotGrid 空间哈希/动态粒子/距离平方/visibility/scroll + §5 光斑 radial-gradient |
| `web/src/features/home/Fluid/index.tsx` | §3 设备分档 + visibility/scroll + 新增 `start`/`stop` 生命周期 |
| `web/public/fluid-hero.js` | 适配层新增 start/stop 控制原站 rAF 循环（拦截首次 rAF 保存 frameFn） |

### 构建产物（嵌入 Go binary）
- `web/dist/**` → `go build` 重新 embed 到 `/opt/new-api/new-api`

---

## 3. 验证结果

| 检查 | 结果 |
|------|------|
| `bun run typecheck` | ✅ 0 error, 1509 files |
| `go build` | ✅ embed 更新成功 |
| Hero section min-height / contain | ✅ `contain: layout style paint` + `overflow-x-clip overflow-y-hidden` |
| Grid coversVw @ 5 断点 | ✅ 全部 true |
| Grid mask-image 正确 | ✅ `linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)` |
| Grid will-change: transform | ✅ |
| Perspective + rotateX 同元素 | ✅ |
| 光斑 radial-gradient + blur-24px | ✅ 3 枚 |
| DotGrid 动态 gap | ✅ 1440→36, 1024→42, 768→54, <768→68 |
| DotGrid 空间哈希 | ✅ buildSpatialHash + 邻 8 桶查询 |
| Fluid device tier | ✅ detectDeviceTier → tierToOptions |
| Fluid visibilitychange | ✅ hidden→stop, visible→start |
| Fluid scroll pause | ✅ scroll→stop, 250ms→restart |
| DotGrid visibility + scroll | ✅ |
| requestAnimationFrame throttling 警告 | ⚠ headless Chromium 强制 throttling ~1-4fps，FPS 数据无效（容器限制，非代码问题） |

---

## 4. 未完成 / 后续

| 项 | 原因 | 建议 |
|----|------|------|
| §3.3 FPS 运行时自适应 | 需要在 fluid-hero.js 内部 rAF 循环里采样 frameMs（当前适配层只拦截首次 rAF） | 下次改 fluid-hero.js 让它导出 FPS sample 回调 |
| 真实桌面 FPS 采集 | 容器 headless Chromium 强制 throttling | 在真实设备用 DevTools Performance 面板采集 |
| go build 在 `/opt/new-api/new-api` | go embed 需要源码 + dist 都 rebuild | gitignore 已忽略 binary，用户需自行重新 go build |

---

## 5. 建议 git 提交命令

```bash
cd /opt/new-api
# 只 add web 目录的改动，禁止 git add -A
git add web/src/features/home/Hero/index.tsx \
      web/src/features/home/Fluid/index.tsx \
      web/public/fluid-hero.js \
      web/.design-spec.md \
      web/PERF_BASELINE.md \
      web/PERF_REPORT.md
git diff --cached --stat    # 确认文件
git commit -m "perf(home): §1 grid perspective rewrite §3 fluid tier §4 DotGrid spatial hash §5 blob blur-3xl → radial-gradient §6 compositing isolation"
git push origin main && git push gitee main
```
