# Demo Terminal Card — 1:1 Spec (from Playwright + source bundle)

> Source: `http://127.0.0.1:18888/` (Next.js 15 production build)
> Module: `app/(site)/page-6ed0db24f60e6cfb.js` — function `T`
> Extraction time: 2026-11-24 16:55
> Toolchain: Playwright chromium-headless-shell (viewport 1440×1200, deviceScaleFactor 1)

---

## 1. Constants (from bundle)

```js
// Tabs — used as w.map()
const tabs = [
  { key: "curl",   label: "cURL"   },
  { key: "python", label: "Python" },
  { key: "node",   label: "Node.js" },
]

// Base URL — MUST replace for our site (do NOT hardcode linlongs.com)
const BASE_URL_PLACEHOLDER = "{your-site-origin}/v1"

// Model names for typing cycle (displayed in code chip)
const MODELS = [
  "gpt-5", "claude-sonnet-4-5", "gemini-2.5-pro",
  "qwen3-max", "deepseek-v3.2", "doubao-seed-1.6"
]

// Syntax-highlighting color classes
const SYNTAX = {
  key: "text-sky-300",     // JSON keys ("model", "stream")
  str: "text-emerald-300", // String values + quotes
  kw:  "text-fuchsia-300", // Language keywords (import, const, True/true)
  fn:  "text-amber-200",   // Command names / function names (curl, create, OpenAI)
  dim: "text-slate-500",   // Dim separators (single quotes, punctuation)
}
```

---

## 2. State (from bundle — function T)

```js
const [activeTab, setActiveTab] = useState("curl")

// Typed model name — cycles through MODELS array with typewriter-delete effect
// Speed: settle → delete char-by-char @35ms · pause @250ms · type char-by-char @70ms · pause @1800ms
// Model display: MODELS[idx].slice(0, count)
const [activeIdx, setActiveIdx] = useState(0)
const [count, setCount]         = useState(MODELS[0].length)
const [deleting, setDeleting]   = useState(false)

useEffect(() => {
  const model = MODELS[activeIdx]
  const settled = !deleting && count === model.length
  let delay = deleting ? 35 : (settled ? 1800 : 70)
  if (deleting && count === 0) delay = 250

  const t = setTimeout(() => {
    if (deleting && count === 0) {
      setDeleting(false)
      setActiveIdx((activeIdx + 1) % MODELS.length)
    } else if (settled) {
      setDeleting(true)
    } else {
      setCount((c) => c + (deleting ? -1 : 1))
    }
  }, delay)
  return () => clearTimeout(t)
}, [activeIdx, count, deleting])

const model = MODELS[activeIdx].slice(0, count)

// Ping ms — random 90–180 ms, updates every time model settles
const [pingMs, setPingMs] = useState(126)
useEffect(() => {
  const settled = !deleting && count === MODELS[activeIdx].length
  if (settled) setPingMs(90 + Math.round(90 * Math.random()))
}, [settled_flag_above])
```

---

## 3. DOM Tree (exact 1:1 from outerHTML + computed styles)

```
<div>  [outer wrapper: relative mx-auto w-full max-w-[860px]]
│
├─ <div>  [outer glow ring]
│  className = "pointer-events-none absolute -inset-px rounded-[20px] bg-[linear-gradient(120deg,#4FC3FF55,#7C6BFF66,#FF9A9E55)] opacity-80 blur-[1px]"
│  computed bg: linear-gradient(120deg, rgba(79,195,255,0.333), rgba(124,107,255,0.4), rgba(255,154,158,0.333))
│  rect: 862 × 327
│
├─ <div>  [big glow backdrop]
│  className = "pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(92,107,255,0.35),transparent_70%)] blur-2xl"
│  computed bg: radial-gradient(60% 60% at 50% 40%, rgba(92,107,255,0.35), transparent 70%)
│  rect: 940 × 405
│
└─ <div>  [main shell]
   className = "relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1020]/95 text-left shadow-[0_30px_80px_-20px_rgba(40,50,140,0.55)] backdrop-blur-xl"
   computed: bg ok-lab(0.177 … /0.95) · border 1px white/10 · radius 20px · shadow rgba(40,50,140,0.55) · backdrop-filter blur(24px)
   rect: 860 × 325
   │
   ├─ <div>  [title bar]
   │  className = "flex items-center gap-4 border-b border-white/[0.07] px-4 py-3"
   │  computed: h=53.5px, border-bottom 1px white/7%, padding 12px 16px, gap 16px
   │  │
   │  ├─ <div>  [mac dots group]
   │  │  className = "flex gap-1.5"
   │  │  │
   │  │  ├─ <span className="size-3 rounded-full bg-[#FF5F57]" />  ← 12×12 red
   │  │  ├─ <span className="size-3 rounded-full bg-[#FEBC2E]" />  ← 12×12 yellow
   │  │  └─ <span className="size-3 rounded-full bg-[#28C840]" />  ← 12×12 green
   │  │
   │  ├─ <div>  [tab container]
   │  │  className = "flex gap-1 rounded-lg bg-white/[0.04] p-0.5"
   │  │  computed: h=29px, inner rounded-md tabs inside
   │  │  │
   │  │  └─ .map(tabs, tab => <button
   │  │       className = "rounded-md px-2.5 py-1 font-mono text-[11px] transition
   │  │                     {activeTab === tab.key ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}"
   │  │       type="button"
   │  │       onClick={() => setActiveTab(tab.key)}
   │  │       >{tab.label}</button>)
   │  │
   │  └─ <span className="ml-auto hidden font-mono text-[11px] text-slate-500 sm:block">
   │     POST /v1/chat/completions
   │     </span>
   │
   ├─ <div>  [code area]
   │  className = "relative overflow-x-auto px-5 py-5 font-mono text-[12px] leading-6 text-slate-200 sm:text-[13px]"
   │  computed: h=232px · padding 20px · font-family ui-monospace/SFMono-Regular/Menlo/Monaco/Consolas · font-size 13px (sm) · line-height 24px
   │  │
   │  ├─ <div>  [scan lines — EXTREMELY subtle]
   │  │  className = "pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.015)_50%)] bg-[length:100%_4px]"
   │  │  computed: linear-gradient every 4px, 1.5% opacity white stripes (CRT feel, no readability impact)
   │  │
   │  └─ <div className="relative whitespace-pre">
   │     ← Fragment from function E({ activeTab, model })
   │     Each row = <div> with children array of text + <span className={SYNTAX.xxx}> tokens
   │     Model name inside row = function j() rendered inline
   │
   │     function j({ model }) →
   │       <span className="text-emerald-300">
   │         "<span className="rounded bg-white/10 px-0.5 text-white">{model}</span>
   │         <span className="ll-caret ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-[#8B7BFF]" />
   │         "
   │       </span>
   │
   └─ <div>  [status bar]
      className = "flex items-center gap-2 whitespace-nowrap border-t border-white/[0.07] bg-white/[0.02] px-4 py-2.5 font-mono text-[11px] sm:gap-3"
      computed: h=37.5px · border-top 1px white/7% · bg white/2% · padding 10px 16px · gap 8px → 12px sm
      │
      ├─ <span className="flex items-center gap-1.5 text-emerald-400">  ← "200 OK" group
      │  <span className="relative flex size-2">
      │    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />  ← ping ring
      │    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />                        ← solid dot
      │  </span>
      │  200 OK
      │  </span>
      ├─ <span className="text-slate-500">·</span>
      ├─ <span className="text-slate-300 tabular-nums">{pingMs} ms</span>
      ├─ <span className="text-slate-500">·</span>
      ├─ <span className="text-slate-400">stream</span>
      └─ <span className="ml-auto hidden truncate text-slate-500 sm:inline">
         OpenAI-compatible · 200+ models
         </span>
```

---

## 4. Syntax Highlighting Color Palette (Tailwind v4 oklch → RGB)

| CSS Class | oklch Value (computed) | RGB (approx) | Usage |
|-----------|----------------------|-------------|-------|
| `text-sky-300` | `oklch(0.828 0.111 230.318)` | ~`#7DD3FC` | JSON keys ("model", "stream", "messages", "role", "content") |
| `text-emerald-300` | `oklch(0.845 0.143 164.978)` | ~`#6EE7B7` | String values + model chip text |
| `text-fuchsia-300` | `oklch(0.833 0.145 321.434)` | ~`#F0ABFC` | Boolean literals (true/True) |
| `text-amber-200` | `oklch(0.924 0.12 95.746)` | ~`#FCD34D` | Command/function names (curl, OpenAI, create) |
| `text-slate-500` | `oklch(0.554 0.046 257.417)` | ~`#64748B` | Dim separators, POST label, status dots |
| `text-slate-400` | `oklch(0.704 0.04 256.788)` | ~`#94A3B8` | Inactive tab text, "stream" |
| `text-slate-300` | `oklch(0.869 0.022 252.894)` | ~`#CBD5E1` | Ping ms number |
| `bg-white/10` (active tab bg) | `oklab(…/0.1)` | — | Active tab pill, model chip bg |
| `bg-white/[0.04]` (tab container bg) | `oklab(…/0.04)` | — | Tab grouping background |
| `bg-[#0B1020]/95` (shell bg) | `oklab(…/0.95)` | ~`#0B1020` 95% | Main shell |
| `border-white/10` | `oklab(…/0.1)` | — | Shell border |
| `border-white/[0.07]` | `oklab(…/0.07)` | — | Header/status separators |

---

## 5. Code Content by Tab (function E)

**curl tab (default)**
```
curl {BASE_URL}/chat/completions \
  -H "Authorization: Bearer sk-••••" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model with chip + caret>",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true
  }'
```

**python tab**
```
from openai import OpenAI

client = OpenAI(base_url="{BASE_URL}", api_key="sk-••••")
resp = client.chat.completions.create(
  model=<model with chip + caret>,
  messages=[{"role": "user", "content": "你好"}],
  stream=True,
)
```

**node tab**
```
import { OpenAI } from "openai";

const client = new OpenAI({ baseURL: "{BASE_URL}" });
const resp = await client.chat.completions.create({
  model: <model with chip + caret>,
  messages: [{ role: "user", content: "你好" }],
  stream: true,
});
```

---

## 6. Interactions (confirmed from bundle)

| Interaction | Behavior |
|------------|----------|
| Click tab button | `setActiveTab(key)` — no animation, instant switch (in Tailwind class name change is transition-less for content, but tab pill color has `transition` class → 150ms ease) |
| Tab pill active indicator | `bg-white/10 text-white` vs `bg-transparent text-slate-400` |
| Hover inactive tab | `hover:text-slate-200` |
| Model name in chip | Typing animation: settle(1800ms) → delete char by char @35ms → pause 250ms → type new model char by char @70ms |
| Model caret | `ll-caret` class — blink animation (our existing CSS) |
| Ping ms | `Math.round(90 + 90*Math.random())` each time model settles |
| Status dot ping | `animate-ping` + `opacity-60` — Tailwind built-in ping ring |
| Scan lines overlay | Passive `pointer-events-none`, 1.5% opacity stripes — **no animation** |
| prefers-reduced-motion | **demo has NO reduced-motion guard** — we'll add one for accessibility |

---

## 7. Outer Glow Detail (2 layers)

| Layer | ClassName | Rendered | Purpose |
|-------|-----------|----------|---------|
| Ring | `absolute -inset-px rounded-[20px] bg-[linear-gradient(120deg,#4FC3FF55,#7C6BFF66,#FF9A9E55)] opacity-80 blur-[1px]` | 862×327 · 1px blur · 3-color gradient ring around shell | Subtle chromatic edge glow |
| Backdrop | `absolute -inset-10 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(92,107,255,0.35),transparent_70%)] blur-2xl` | 940×405 · 60px blur · radial blue blob behind shell | Ambient purple-blue halo |

Note: `blur-2xl` in Tailwind v4 is `blur(40px)` which is heavy — pushes the halo out far.

---

## 8. RESPONSIVE (demo only shows 1440; inference from classes)

| Class Hint | Behavior |
|------------|----------|
| `sm:text-[13px]` on code | Code font-size 12px <640px → 13px ≥640px |
| `sm:block` / `sm:inline` on POST label + right status text | Hide on mobile, show ≥640px |
| `sm:gap-3` on status bar | Gap 8px <640px → 12px ≥640px |
| `overflow-x-auto` on code | Code scrolls horizontally when narrow |
| Outer `max-w-[860px]` on wrapper | Fixed max, won't stretch wider |

---

## 9. Base URL Replacement Strategy

Demo hardcodes `"https://api.linlongs.com/v1"`. For our site:
- Replace with a `<SiteConfig.baseUrl>` pattern or `window.location.origin + '/v1'`
- If unknown at build time, set constant to `"/v1"` and let user proxy via config
- **Never hardcode linlongs.com** in our build

---

## 10. Verification Checklist (when we build)

- [ ] Outer glow ring + backdrop present
- [ ] Shell `rounded-[20px]` + `bg-[#0B1020]/95` + `backdrop-blur-xl` + `shadow-[0_30px_80px_-20px_rgba(40,50,140,0.55)]`
- [ ] Mac dots 12×12 (size-3) colors exact
- [ ] Tab container `bg-white/[0.04]` pill shape
- [ ] Active tab `bg-white/10 text-white`
- [ ] Code area `text-[12px] sm:text-[13px]` + `leading-6` + exact scan lines
- [ ] All 3 tabs present (curl, python, node)
- [ ] Model name typing animation working
- [ ] Caret bg `#8B7BFF`
- [ ] Status bar ping dot with `animate-ping`
- [ ] Ping ms random 90–180 ms
- [ ] Base URL replaced with site placeholder
