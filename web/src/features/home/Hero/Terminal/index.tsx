/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
'use client'

import { useEffect, useState } from 'react'

/**
 * Demo 终端卡片 — 从 linlongs_live 静态产物 1:1 复刻
 * 规格文档: /opt/new-api/web/TERMINAL_SPEC.md
 * 源码位置: _next/static/chunks/app/(site)/page-6ed0db24f60e6cfb.js · function T
 */

// ── 常量（与 demo bundle 完全一致）──────────────────────────────────────

const TABS = [
  { key: 'curl', label: 'cURL' },
  { key: 'python', label: 'Python' },
  { key: 'node', label: 'Node.js' },
] as const

type TabKey = (typeof TABS)[number]['key']

const MODELS = [
  'gpt-5',
  'claude-sonnet-4-5',
  'gemini-2.5-pro',
  'qwen3-max',
  'deepseek-v3.2',
  'doubao-seed-1.6',
]

const SYNTAX = {
  key: 'text-sky-300',        // JSON keys
  str: 'text-emerald-300',   // string values + quotes
  kw: 'text-fuchsia-300',    // keywords / booleans
  fn: 'text-amber-200',      // command / function names
  dim: 'text-slate-500',     // dim separators
}

// API 基础地址（用当前站点 origin 替换 demo 硬编码的 linlongs.com）
const BASE_URL =
  typeof window !== 'undefined' ? `${window.location.origin}/v1` : '/v1'

// ── 辅助：模型名 chip（含闪烁 caret，与 demo function j 一致）───────────

function ModelChip({ model }: { model: string }) {
  return (
    <span className={SYNTAX.str}>
      &quot;
      <span className='rounded bg-white/10 px-0.5 text-white'>{model}</span>
      <span className='ll-caret ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-[#8B7BFF]' />
      &quot;
    </span>
  )
}

// ── 代码渲染器（与 demo function E 一致，按 tab 切分三段子 ──────────────

function CodeContent({ tab, model }: { tab: TabKey; model: string }) {
  if (tab === 'python') {
    return (
      <>
        <div>
          <span className={SYNTAX.kw}>from</span> openai{' '}
          <span className={SYNTAX.kw}>import</span> OpenAI
        </div>
        <div>&nbsp;</div>
        <div>
          client = <span className={SYNTAX.fn}>OpenAI</span>(base_url=
          <span className={SYNTAX.str}>&quot;{BASE_URL}&quot;</span>, api_key=
          <span className={SYNTAX.str}>&quot;sk-••••&quot;</span>)
        </div>
        <div>
          resp = client.chat.completions.<span className={SYNTAX.fn}>create</span>(
        </div>
        <div>
          &nbsp;&nbsp;model=<ModelChip model={model} />,
        </div>
        <div>
          &nbsp;&nbsp;messages=[
          {'{'}
          <span className={SYNTAX.str}>&quot;role&quot;</span>:{' '}
          <span className={SYNTAX.str}>&quot;user&quot;</span>,{' '}
          <span className={SYNTAX.str}>&quot;content&quot;</span>:{' '}
          <span className={SYNTAX.str}>&quot;你好&quot;</span>
          {'}'}
          ],
        </div>
        <div>
          &nbsp;&nbsp;stream=<span className={SYNTAX.kw}>True</span>,
        </div>
        <div>)</div>
      </>
    )
  }

  if (tab === 'node') {
    return (
      <>
        <div>
          <span className={SYNTAX.kw}>import</span> {'{'} OpenAI {'}'}{' '}
          <span className={SYNTAX.kw}>from</span>{' '}
          <span className={SYNTAX.str}>&quot;openai&quot;</span>;
        </div>
        <div>&nbsp;</div>
        <div>
          <span className={SYNTAX.kw}>const</span> client ={' '}
          <span className={SYNTAX.kw}>new</span>{' '}
          <span className={SYNTAX.fn}>OpenAI</span>({'{'} baseURL:{' '}
          <span className={SYNTAX.str}>&quot;{BASE_URL}&quot;</span> {'}'});
        </div>
        <div>
          <span className={SYNTAX.kw}>const</span> resp ={' '}
          <span className={SYNTAX.kw}>await</span> client.chat.completions.
          <span className={SYNTAX.fn}>create</span>({'{'}
        </div>
        <div>
          &nbsp;&nbsp;model: <ModelChip model={model} />,
        </div>
        <div>
          &nbsp;&nbsp;messages: [
          {'{'} role: <span className={SYNTAX.str}>&quot;user&quot;</span>,
          content: <span className={SYNTAX.str}>&quot;你好&quot;</span> {'}'}],
        </div>
        <div>
          &nbsp;&nbsp;stream: <span className={SYNTAX.kw}>true</span>,
        </div>
        <div>{'}'});</div>
      </>
    )
  }

  // curl (default)
  return (
    <>
      <div>
        <span className={SYNTAX.fn}>curl</span> {BASE_URL}/chat/completions \
      </div>
      <div>
        &nbsp;&nbsp;-H <span className={SYNTAX.str}>&quot;Authorization: Bearer sk-••••&quot;</span> \
      </div>
      <div>
        &nbsp;&nbsp;-H <span className={SYNTAX.str}>&quot;Content-Type: application/json&quot;</span> \
      </div>
      <div>
        &nbsp;&nbsp;-d <span className={SYNTAX.dim}>&apos;</span>
        {'{'}
      </div>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className={SYNTAX.key}>&quot;model&quot;</span>:{' '}
        <ModelChip model={model} />,
      </div>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className={SYNTAX.key}>&quot;messages&quot;</span>: [
        {'{'}
        <span className={SYNTAX.key}>&quot;role&quot;</span>:{' '}
        <span className={SYNTAX.str}>&quot;user&quot;</span>,{' '}
        <span className={SYNTAX.key}>&quot;content&quot;</span>:{' '}
        <span className={SYNTAX.str}>&quot;你好&quot;</span>
        {'}'}
        ],
      </div>
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className={SYNTAX.key}>&quot;stream&quot;</span>:{' '}
        <span className={SYNTAX.kw}>true</span>
      </div>
      <div>
        &nbsp;&nbsp;{'}'}
        <span className={SYNTAX.dim}>&apos;</span>
      </div>
    </>
  )
}

// ── 主组件 ─────────────────────────────────────────────────────────────

export function Terminal({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>('curl')

  // 模型名打字机循环 — 与 demo hook 完全一致
  const [activeIdx, setActiveIdx] = useState(0)
  const [count, setCount] = useState(MODELS[0].length)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const model = MODELS[activeIdx]
    const settled = !deleting && count === model.length

    // 速度：删除 @35ms · 打字 @70ms · 已定居停 @1800ms · 删除完切换停 @250ms
    let delay: number
    if (deleting && count === 0) {
      delay = 250
    } else if (deleting) {
      delay = 35
    } else if (settled) {
      delay = 1800
    } else {
      delay = 70
    }

    const t = window.setTimeout(() => {
      if (deleting && count === 0) {
        setDeleting(false)
        setActiveIdx((i) => (i + 1) % MODELS.length)
      } else if (settled) {
        setDeleting(true)
      } else {
        setCount((c) => c + (deleting ? -1 : 1))
      }
    }, delay)
    return () => window.clearTimeout(t)
  }, [activeIdx, count, deleting])

  const model = MODELS[activeIdx].slice(0, count)

  // Ping 数值 — 每次 model 定居随机刷新
  const [pingMs, setPingMs] = useState(126)
  useEffect(() => {
    const settled = !deleting && count === MODELS[activeIdx].length
    if (settled) setPingMs(90 + Math.round(90 * Math.random()))
  }, [activeIdx, count, deleting])

  return (
    <div className={`relative mx-auto w-full max-w-[860px] ${className ?? ''}`}>
      {/* 外层发光环 — 渐变描边 */}
      <div className='pointer-events-none absolute -inset-px rounded-[20px] bg-[linear-gradient(120deg,#4FC3FF55,#7C6BFF66,#FF9A9E55)] opacity-80 blur-[1px]' />
      {/* 外层发光晕 — 大尺寸径向模糊 */}
      <div className='pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(92,107,255,0.35),transparent_70%)] blur-2xl' />

      {/* 主壳 */}
      <div className='relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1020]/95 text-left shadow-[0_30px_80px_-20px_rgba(40,50,140,0.55)] backdrop-blur-xl'>
        {/* 标题栏 */}
        <div className='flex items-center gap-4 border-b border-white/[0.07] px-4 py-3'>
          {/* Mac 三点 */}
          <div className='flex gap-1.5'>
            <span className='size-3 rounded-full bg-[#FF5F57]' />
            <span className='size-3 rounded-full bg-[#FEBC2E]' />
            <span className='size-3 rounded-full bg-[#28C840]' />
          </div>

          {/* Tab 组 */}
          <div className='flex gap-1 rounded-lg bg-white/[0.04] p-0.5'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type='button'
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition ${
                  activeTab === tab.key
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 右侧 endpoint 标签 — 仅 sm+ */}
          <span className='ml-auto hidden font-mono text-[11px] text-slate-500 sm:block'>
            POST /v1/chat/completions
          </span>
        </div>

        {/* 代码区 */}
        <div className='relative overflow-x-auto px-5 py-5 font-mono text-[12px] leading-6 text-slate-200 sm:text-[13px]'>
          {/* 极淡扫描线（CRT 质感，opacity 0.015 不影响可读性） */}
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.015)_50%)] bg-[length:100%_4px]'
          />

          <div className='relative whitespace-pre'>
            <CodeContent tab={activeTab} model={model} />
          </div>
        </div>

        {/* 状态栏 */}
        <div className='flex items-center gap-2 whitespace-nowrap border-t border-white/[0.07] bg-white/[0.02] px-4 py-2.5 font-mono text-[11px] sm:gap-3'>
          {/* 200 OK + 动画小圆点 */}
          <span className='flex items-center gap-1.5 text-emerald-400'>
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60' />
              <span className='relative inline-flex size-2 rounded-full bg-emerald-400' />
            </span>
            200 OK
          </span>

          <span className='text-slate-500'>·</span>
          <span className='text-slate-300 tabular-nums'>{pingMs} ms</span>
          <span className='text-slate-500'>·</span>
          <span className='text-slate-400'>stream</span>

          {/* 右侧文案 — 仅 sm+ */}
          <span className='ml-auto hidden truncate text-slate-500 sm:inline'>
            OpenAI-compatible · 200+ models
          </span>
        </div>
      </div>
    </div>
  )
}
