#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
/**
 * scan-0.1.5.mjs — zero-dependency detector for the DSH `0.1.3-alpha.1 →
 * 0.1.5-rc.1` plugin-adaptation seams.
 *
 * Why this exists: this span's breakage is mostly *silent*. Two examples that
 * motivate the whole catalog:
 *   - the bare `conversation` client slot was deleted with no alias, and
 *     `ctx.slots.inject()` only runs its callback when the declaration exists —
 *     so a client half that still targets it stops mounting without an error,
 *     a log line or a failed build (`C1`);
 *   - `assistant/message` gained a required `stream` field, so a log written
 *     without it imports fine and then refuses to resume (`S3`).
 * A green local gate is therefore NOT evidence of adaptation: the published
 * type line hides both deletions entirely.
 *
 * This scanner is the MERGED catalog for the whole `0.1.3-alpha.1 → 0.1.5-rc.1`
 * corridor. It supersedes two version-locked predecessors that each covered one
 * hop of the same span:
 *   - leg A `0.1.3-alpha.1 → 0.1.5-alpha.1` — seams `S1`–`S10`, `M1`
 *     (formerly `dsh-plugin-upgrade`)
 *   - leg B `0.1.5-alpha.1 → 0.1.5-rc.1` — seams `C1`–`C5`, `H1`–`H4`, `P1`
 *     (formerly `dsh-plugin-upgrade-rc1`)
 * `M1` and the former leg-B `C3` were the same defect (a local gate compiling a
 * stale type line), so they are one seam here; the card records the old spelling.
 * The hop `0.1.5-rc.1 → 0.1.5-rc.2` added no plugin-facing seam, so the span
 * ends at rc.1 by construction.
 *
 * The catalog below is the single source of truth shared by the version card,
 * the packaged skill and this CLI. `test/card.test.mjs` fails when the card and
 * this catalog disagree about the seam ids.
 *
 * Usage:
 *   node scan-0.1.5.mjs [--repo <path>] [--json <out.json>] [--seams S3,C1] [--quiet]
 *
 * Exit codes: 0 = no error-severity hit, 1 = at least one error-severity hit,
 *             2 = usage/scan failure.
 *
 * Provenance: every upstream fact behind a seam was re-read from the harness
 * checkout and recorded with `path:line` in `docs/EVIDENCE.md` and in the
 * version card
 * (`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md`).
 * This scanner ships so a plugin author can re-measure their own repository; it
 * imports nothing outside Node's standard library and never writes inside the
 * scanned tree.
 */

import fs from 'node:fs'
import path from 'node:path'
import { beyondCorridors, CORRIDOR_CEILING } from './route.mjs'

const SKIP_DIRS = new Set(['node_modules', 'lib', 'dist', '.git', '.tmp', 'coverage', '_scratch', '_archive', 'downloads', 'upstream', 'dev'])
const SCAN_EXT = /\.(ts|tsx|mts|cts|mjs|cjs|js|jsx|json|yml|yaml)$/

/**
 * @typedef {object} Seam
 * @property {string} id
 * @property {string} title
 * @property {'error'|'warn'|'info'} severity
 * @property {string} action
 * @property {RegExp|null} test  null = structured or card-only, deliberately not detected line-wise
 * @property {(line: string) => boolean} [lineFilter]
 * @property {(lines: string[], i: number) => boolean} [windowFilter]
 * @property {(text: string, file: string) => boolean} [fileCheck]
 * @property {(text: string, file: string) => boolean} [fileCheck2]
 * @property {(text: string) => boolean} [downgradeIf]
 */

/**
 * @typedef {object} Hit
 * @property {string} seam
 * @property {string} severity
 * @property {string} file
 * @property {number} line
 * @property {string} snippet
 * @property {string} detail
 */

/** @type {Seam[]} */
export const SEAMS = [
  // ---------------------------------------------------------------- leg A
  // 0.1.3-alpha.1 → 0.1.5-alpha.1
  {
    id: 'S3',
    title: 'assistant/message 缺 stream（V3 必填）',
    severity: 'error',
    action: '写入会话日志的 assistant/message 必须带 `stream: []`（或真实分片）；缺了导入成功但会话不可续聊（Session.fromRestore 抛 invalid settlement fields）。',
    test: /assistant\/message/,
    // Only object construction / append calls, never comparisons or prose.
    lineFilter: line => /type\s*:\s*['"]assistant\/message['"]|append\(\s*['"]assistant\/message['"]|['"]assistant\/message['"]\s*,/.test(line),
    // Only production code that actually writes session logs, and only when the file
    // never mentions `stream` (comments excluded).
    fileCheck: (text, file) => !/(^|[\\/])(tests?|__tests__)[\\/]/.test(file) &&
      /(\.append\(|writeFileSync|writeFile\(|writeSync|persist)/.test(text) &&
      /assistant\/message/.test(text) && !/\bstream\b/.test(stripComments(text)),
  },
  {
    id: 'S8',
    title: 'SessionHandle.read() 返回形状（{eventState,events}）',
    severity: 'error',
    action: 'handle.read() 现在返回 SessionHandleReadResult；数组操作要改成 `(await handle.read()).events`。',
    test: /\.read\s*\([^)]*\)\s*\.\s*(filter|find|findLast|map|some|every|forEach|slice|length)\b|await\s+[\w.$]+\s*\.\s*read\s*\(/,
    // Only session-persistence handles are in scope (Web Streams readers also expose read()).
    fileCheck: text => /sessionPersistence|SessionHandle|session-persistence|handle\.read\b/.test(text),
    // A file that unwraps `.events` (property, destructuring, or a shared normalizer) is adapted.
    fileCheck2: text => {
      const awaitsRead = /await\s+[\w.$]+\s*\.\s*read\s*\(/.test(text)
      if (!awaitsRead) return true
      return !(/\.events\b/.test(text) || /\{[^}]*\bevents\b[^}]*\}\s*=\s*await/.test(text) || /normalizeReadResult/.test(text))
    },
  },
  {
    id: 'S9',
    title: 'SystemPrompt Config.persona 已改名',
    severity: 'error',
    action: '`persona` 改为 `personaPrefix` / `personaSuffix`（`includeHarnessIdentity: false` 不等价，会删 harness identity 段）。',
    test: /\{\s*persona\s*:|\bpersona\s*:\s*['"`]/,
    // `persona:` is only the SystemPrompt seam when the call site is a SystemPrompt mount.
    windowFilter: (lines, i) => lines.slice(Math.max(0, i - 3), i + 1).join('\n').includes('SystemPrompt'),
  },
  {
    id: 'M1',
    title: '本地门禁编译的是过期类型线 → typecheck 静默回退（假绿）',
    severity: 'error',
    action: '两种独立成因，任何一种都让本地门禁变成假绿：(a) dev/test 依赖钉在 `0.1.5-alpha.*`，本地类型看不到 rc.1 的删除；(b) tsconfig `paths` 指向不存在的 checkout 目录时 TypeScript 静默回退到 node_modules 的已发布类型。把 dev/test 依赖钉到当前 rc 线，并保证每条 checkout 别名都能解析。**本接缝在 leg B 卡片上曾记作 `C3`，是同一条缺陷。**',
    test: null,
  },
  {
    id: 'S4',
    title: 'tool/code-dispatch 已改名 tool/ptc-dispatch',
    severity: 'error',
    action: '事件名改为 `tool/ptc-dispatch`；旧标签在 V3 会话里不再被识别（保留双标签需归一化器）。',
    test: /tool\/code-dispatch/,
    // A file that also names `tool/ptc-dispatch` is handling the legacy alias on purpose.
    downgradeIf: text => /tool\/ptc-dispatch/.test(text),
  },
  {
    id: 'S5',
    title: 'ctx.agent 已移除',
    severity: 'error',
    action: '调用方必须显式传 Agent（如 `setup(agentCtx, agent)` 的第 2 参），不要读 `ctx.agent`。',
    test: /ctx\.agent\b|ctx\['agent'\]|ctx\.get\(\s*['"]agent['"]\s*\)/,
    // Deliberate back-compat fallbacks are legitimate while the old peer band is supported.
    downgradeIf: text => /legacy|0\.1\.4|backward|back-compat|compat/i.test(text),
  },
  {
    id: 'S6',
    title: 'Inbox 已改为类型接口',
    severity: 'error',
    action: '`Inbox` 不再可构造；夹具改用官方 unsupportedInbox() 形状，运行时用 `agent.inbox`。',
    test: /\bnew\s+Inbox\s*\(|import\s*\{[^}]*\bInbox\b[^}]*\}\s*from\s*['"]@deepseek-ai\/dsh-agent['"]/,
    // A harness pinned to a pre-0.1.5 ruler may still construct Inbox on purpose.
    downgradeIf: text => /0\.1\.3|0\.1\.2|pinned|legacy/i.test(text),
  },
  {
    id: 'S7',
    title: 'SubprocessHandle.pid 已移除',
    severity: 'warn',
    action: 'handle 不再有 `pid`（只剩 SubprocessTerminalHandle.pid）；测试夹具删掉该字段。',
    test: /\bpid\s*:\s*\d+|\.pid\b/,
    // Node ChildProcess.pid and plugin-owned process info also match: keep this advisory.
    downgradeIf: () => true,
  },
  {
    id: 'S2',
    title: 'EpochHeader.system 已移除（系统提示词进消息历史）',
    severity: 'warn',
    action: '系统提示词现在是 surface node 0 的 `system/message`；`request/header.system` 只在旧线存在，读取方需要结构式回退。',
    test: /header\.system\b|EpochHeader/,
  },
  {
    id: 'S1',
    title: '会话格式 V3 / 日志文件名世代化',
    severity: 'warn',
    action: '当前世代是 `session.v3.jsonl.zstd`；硬编码 `session.jsonl.zstd` 的读写脚本会静默失效（建议从新到旧枚举 vN）。',
    test: /SESSION_FORMAT_VERSION|session\.jsonl(?!\.v\d)/,
  },
  {
    id: 'S10',
    title: '插件自建会话事件必须走自适应门',
    severity: 'warn',
    action: '宿主事件词表 fail-closed 且 `Session.append` 无 `ignorable` 写入通道；无条件 append 会让会话不可读，请保留"探测后降级"的写法。',
    test: /SessionEventMap|\.append\(/,
  },

  // ---------------------------------------------------------------- leg B
  // 0.1.5-alpha.1 → 0.1.5-rc.1
  {
    id: 'C1',
    title: '裸 slot `conversation` 已删除（无别名）→ UI 静默不挂载',
    severity: 'error',
    action: '把 `ctx.slots.inject(\'conversation\', …)` / `slots.register({ name: \'conversation\' })` 改写成 `main.conversation`（会话内容位）或 `main`（全局中央面板，需 `key`）。rc.1 没有别名，也没有 deprecation 说明：回调永不执行，插件 UI 消失且没有任何报错。',
    test: /['"]conversation['"]/,
    // Same-line and multi-line call forms both count; the key must sit in a
    // slot-facing context, never in prose or an unrelated settings string.
    windowFilter: (lines, i) => {
      const win = lines.slice(Math.max(0, i - 2), i + 2).join('\n')
      return /\.inject\s*\(/.test(win) || /register\s*\(\s*\{/.test(win) || /name\s*:\s*['"]conversation['"]/.test(win)
    },
  },
  {
    id: 'C2',
    title: 'npm 包改名：`dsh-client-ui-sidebar-textpreview` → `…-sidebar-documentpreview`',
    severity: 'error',
    action: '把 peer / optional peer / import / lockfile 里的 `@deepseek-ai/dsh-client-ui-sidebar-textpreview` 改为 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview`。旧名在 rc.1 的 `packages/client/` 下已不存在，也没有 shim 包；做文档预览的插件改注册到 `sidebar.right.tab.document`。',
    test: /sidebar-textpreview/,
  },
  {
    id: 'P1',
    title: 'peer 区间缺了第二段 → `0.1.5-rc.1` 被 semver 拒绝',
    severity: 'error',
    action: '`>=0.1.2-rc.1 <0.2.0` 单段在 semver 下**不满足** `0.1.5-rc.1`（实测 semver 7.8.5 → false）：npm 的 prerelease-tuple 规则只在同一 `[major,minor,patch]` 元组上存在带 prerelease 的 comparator 时才放行。必须保留 `|| >=0.1.5-alpha.1 <0.2.0` 这一段，rc.1 适配**不改** peer 区间。',
    test: null,
  },
  {
    id: 'C4',
    title: 'rc.1 新增全局面板模型，且每个 slot 多一个 `usePanelInfo` 标准 prop',
    severity: 'warn',
    action: '纯增量：rc.1 给几乎每个 slot 的 standardProps 追加了 `usePanelInfo: UsePanelInfo`（47 个文件提及），并新增 `main`（keyed/root）、`sidebar.panellist`（list/root）、`ctx.layout.selectPanel(MainPanelId | null)`、`ctx.layout.beginNavigation()`。用官方 `ComposedProps` 的仓零改动；手写 props 接口的组件需要复核。',
    test: /usePanelInfo|selectPanel\(|sidebar\.panellist|MainPanelId|beginNavigation\(/,
  },
  {
    id: 'C5',
    title: '右侧文档预览迁到 keyed slot `sidebar.right.tab.document`',
    severity: 'warn',
    action: 'TextPreview 的行为迁到 `sidebar.right.tab.document`（keyed/session，ownerProps = `DocumentContent`）。`sidebar.right.pane.tab` / `.title` 仍然存在，但 `declaredBy` 从 `rightbar` 变成 `rightbar.session`：inject `rightbar` 取得 pane 的插件要复核注入目标。',
    test: /sidebar\.right\.pane\.tab|TextPreview|DocumentContent/,
  },
  {
    id: 'H1',
    title: 'fail-closed 会话事件词表新增两个类型',
    severity: 'warn',
    action: '`KNOWN_SESSION_EVENT_TYPES` 新增 `deliverables/presented` 与 `subagent/catalog`。枚举过该词表、或自建事件白名单 / 计数快照的读取方要重新快照；否则新事件从「未知跳过」变成进入 surface，计数与渲染都会变。',
    test: /KNOWN_SESSION_EVENT_TYPES|deliverables\/presented|subagent\/catalog/,
  },
  {
    id: 'H2',
    title: '新工具 `present` 占用了 tool view 的 key `\'present\'`',
    severity: 'warn',
    action: 'rc.1 的新工具 `present` 自带 PresentRow，注册在 `tool.call.toolview` 的 key `\'present\'`（`packages/client/ui-deliverables/src/client/index.ts:62`），并且 `present` 因此进入 `conversation.chat.node` 的 already-taken keyDomain（`grep` 与 `read` 之间）。alpha.1 时该 key 是空闲的：已占用它的插件会被官方行顶掉，请换 key。',
    test: /['"]present['"]/,
    lineFilter: line => /toolview|tool\.call|chat\.node|key\s*:\s*['"]present['"]/.test(line),
  },
  {
    id: 'H4',
    title: 'DeepSeek 适配器的默认咨询模型目录改以 `deepseek-flash` 打头',
    severity: 'info',
    action: 'rc.1 起 `llm-deepseek` 的默认 `models` 目录第一项是 `deepseek-flash`（name `DeepSeek-V41-Flash`，commit `bc5fd3b8dc`），README 的 `models` 默认行同步改为「V41 Flash + V4 Flash + V4 Pro + V4 Flash Vision Exp」。硬编码模型 id、或假定目录首项即默认模型的插件复核。',
    test: /['"]deepseek-(?:chat|reasoner|v[0-9][a-z0-9.-]*|flash[a-z0-9.-]*)['"]/,
  },
  {
    id: 'H3',
    title: 'rc.1 新增可选能力（纯增量，卡片列出，不做自动检测）',
    severity: 'info',
    action: '`ctx.sessionFeedback`（`command-feedback`）；`ctx.layout.selectPanel()` / `beginNavigation()`；`ctx.workspaces.openSession()` / `openWorkspace()` / `forkSession()`；新品牌类型 `MainPanelId`。全部是增量：不接入不会有任何破坏，接入是可选收益。本接缝刻意没有自动检测。',
    test: null,
  },
]

/** Seam ids in card order; the version card must name exactly this set. */
export const SEAM_IDS = SEAMS.map(s => s.id)

/** Seams implemented structurally (not by regex), like `M1` and `P1`. */
const STRUCTURED = new Set(['M1', 'P1'])

/**
 * Seams that are documented on the card and id-parity checked, but deliberately
 * have no automatic detection (pure additive capabilities).
 */
export const CARD_ONLY = SEAMS.filter(s => s.test === null && !STRUCTURED.has(s.id)).map(s => s.id)

/**
 * Yield every scannable file under `dir`, depth-limited and read-only.
 * @param {string} dir
 * @param {number} [depth]
 * @returns {Generator<string, void, void>}
 */
function* walk(dir, depth = 0) {
  if (depth > 8) return
  let ents
  try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of ents) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue
      yield* walk(path.join(dir, e.name), depth + 1)
    } else if (SCAN_EXT.test(e.name)) {
      yield path.join(dir, e.name)
    }
  }
}

/**
 * 1-based line number of the first line containing `needle`, or 1.
 * @param {string} text
 * @param {string} needle
 * @returns {number}
 */
function lineOf(text, needle) {
  const lines = text.split(/\r?\n/)
  const i = lines.findIndex(l => l.includes(needle))
  return i < 0 ? 1 : i + 1
}

/**
 * Strip comment-only lines so prose never satisfies a code-level check.
 * @param {string} text
 * @returns {string}
 */
function stripComments(text) {
  return text.split(/\r?\n/).filter(l => !/^\s*(?:\/\/|\/\*|\*|#)/.test(l)).join('\n')
}

/**
 * Read and parse the repository's top-level package.json, or null.
 * @param {string} repoDir
 * @returns {{ file: string, text: string, json: Record<string, unknown> } | null}
 */
function readManifest(repoDir) {
  const file = path.join(repoDir, 'package.json')
  try { return { file, text: fs.readFileSync(file, 'utf8'), json: JSON.parse(fs.readFileSync(file, 'utf8')) } } catch { return null }
}

/**
 * M1 — the local-gate false green. Two independent causes, both reported under
 * this one seam (leg B's card spelled the pair `C3`):
 *   (a) a `@deepseek-ai/*` dev/test dependency pinned on the `0.1.5-alpha.*`
 *       line, so local typecheck cannot see the deletions later in the span;
 *   (b) a `tsconfig` `paths` alias pointing at a checkout directory that does
 *       not exist, where TypeScript silently falls back to node_modules.
 * @param {string} repoDir
 * @param {Set<string>} imports bare `@deepseek-ai/*` specifiers the repo imports
 */
function checkStaleTypeLine(repoDir, imports) {
  const hits = []
  const manifest = readManifest(repoDir)
  if (manifest) {
    const dev = manifest.json.devDependencies && typeof manifest.json.devDependencies === 'object' ? manifest.json.devDependencies : {}
    for (const [dep, spec] of Object.entries(dev)) {
      if (!dep.startsWith('@deepseek-ai/')) continue
      if (typeof spec !== 'string') continue
      // Exact-ish pins on the alpha line only: a deliberate range that still
      // covers the span (`>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0`) is fine.
      if (!/^[\^~]?0\.1\.5-alpha\.[12]$/.test(spec.trim())) continue
      hits.push({
        seam: 'M1', severity: 'error', file: manifest.file, line: lineOf(manifest.text, `"${dep}"`),
        snippet: `"${dep}": "${spec}"`,
        detail: `dev/test types are pinned at the 0.1.5-alpha line (${spec}) → local typecheck cannot see the rc.1 slot catalog (green gate is fake)`,
      })
    }
  }
  const names = (() => { try { return fs.readdirSync(repoDir).filter(f => /^tsconfig.*\.json$/.test(f)) } catch { return [] } })()
  for (const f of names) {
    const full = path.join(repoDir, f)
    let json
    try { json = JSON.parse(fs.readFileSync(full, 'utf8')) } catch { continue }
    const opts = json.compilerOptions || {}
    const paths = opts.paths
    if (!paths || typeof paths !== 'object') continue
    const base = path.resolve(repoDir, opts.baseUrl || '.')
    for (const [alias, targets] of Object.entries(paths)) {
      if (!Array.isArray(targets)) continue
      for (const t of targets) {
        if (typeof t !== 'string') continue
        // Only checkout-style aliases are in scope: they must point at the harness tree.
        const looksCheckout = /(?:^|\/)(?:packages|vendor)\//.test(t) || t.includes('deepseek-harness')
        if (!looksCheckout) continue
        // An alias the repo never imports cannot cause a false green: skip it.
        const aliasBase = alias.replace(/\/\*$/, '')
        if (imports && imports.size && !imports.has(aliasBase)) continue
        // Wildcard aliases (`.../lib/types/*`) are checked at their static prefix.
        const probe = t.includes('*') ? t.slice(0, t.indexOf('*')) : t
        const resolved = path.resolve(base, probe)
        if (!fs.existsSync(resolved)) {
          hits.push({
            seam: 'M1', severity: 'error', file: full, line: 1,
            snippet: `"${alias}": ["${t}"]`,
            detail: `resolves to ${resolved} which does not exist → TypeScript silently falls back to node_modules (green gate is fake)`,
          })
        }
      }
    }
  }
  return hits
}

/**
 * P1 — the peer band must keep its second segment. `>=0.1.2-rc.1 <0.2.0` alone
 * rejects `0.1.5-rc.1` under npm semver's prerelease-tuple rule.
 * @param {string} repoDir
 */
function checkPeerBand(repoDir) {
  /** @type {Hit[]} */
  const hits = []
  const manifest = readManifest(repoDir)
  if (!manifest) return hits
  const peers = manifest.json.peerDependencies && typeof manifest.json.peerDependencies === 'object' ? manifest.json.peerDependencies : {}
  for (const [dep, spec] of Object.entries(peers)) {
    if (!dep.startsWith('@deepseek-ai/dsh-')) continue
    if (typeof spec !== 'string') continue
    const text = spec.trim()
    if (!/0\.1\.2-rc\.1/.test(text)) continue
    if (/0\.1\.5-alpha\.1/.test(text) || /0\.1\.5-rc\.1/.test(text)) continue
    hits.push({
      seam: 'P1', severity: 'error', file: manifest.file, line: lineOf(manifest.text, `"${dep}"`),
      snippet: `"${dep}": "${text}"`,
      detail: 'peer band lost its `>=0.1.5-alpha.1 <0.2.0` segment → 0.1.5-rc.1 is rejected by semver\'s prerelease-tuple rule (measured false on semver 7.8.5)',
    })
  }
  return hits
}

/**
 * Scan one repo.
 * @param {string} repoDir
 * @param {{ seams?: string[] }} [options]
 * @returns {{ repo: string, scannedAt: string, files: number, hits: Hit[], bySeam: Record<string, number>, beyondCorridors?: boolean }}
 */
export function scanRepo(repoDir, options = {}) {
  const wanted = options.seams && options.seams.length ? new Set(options.seams) : null
  const hits = []
  const imports = new Set()
  let files = 0
  for (const file of walk(repoDir)) {
    files++
    let text
    try { text = fs.readFileSync(file, 'utf8') } catch { continue }
    for (const m of text.matchAll(/(?:from|require\()\s*['"](@deepseek-ai\/[^'"]+)['"]/g)) imports.add(m[1])
    const lines = text.split(/\r?\n/)
    for (const seam of SEAMS) {
      if (wanted && !wanted.has(seam.id)) continue
      if (seam.test === null) continue // structured or card-only seam
      if (STRUCTURED.has(seam.id)) continue // handled separately (structured, not regex)
      if (seam.fileCheck && !seam.fileCheck(text, file)) continue
      if (seam.fileCheck2 && !seam.fileCheck2(text, file)) continue
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        // Comment-only lines carry prose, not code: never a seam hit.
        if (/^(?:\/\/|\/\*|\*|#)/.test(trimmed)) continue
        if (!seam.test.test(lines[i])) continue
        if (seam.lineFilter && !seam.lineFilter(lines[i])) continue
        if (seam.windowFilter && !seam.windowFilter(lines, i)) continue
        // S7 is noisy: only report when the file is about subprocess handles.
        if (seam.id === 'S7' && !/Subprocess|subprocess/.test(text)) continue
        // S6 only for value imports / constructor calls, never type-only.
        if (seam.id === 'S6' && /import\s+type\s*\{/.test(lines[i])) continue
        // S9 only in a SystemPrompt-ish context or a test harness.
        if (seam.id === 'S9' && !/SystemPrompt|system-prompt|systemPrompt/.test(text)) continue
        const downgraded = seam.downgradeIf ? seam.downgradeIf(text) : false
        hits.push({
          seam: seam.id, severity: downgraded ? 'warn' : seam.severity, file, line: i + 1,
          snippet: lines[i].trim().slice(0, 200),
          detail: downgraded ? `${seam.title} (legacy alias handling — verify it is intentional)` : seam.title,
        })
      }
    }
  }
  if (!wanted || wanted.has('M1')) hits.push(...checkStaleTypeLine(repoDir, imports))
  if (!wanted || wanted.has('P1')) hits.push(...checkPeerBand(repoDir))
  /** @type {Record<string, number>} */
  const bySeam = {}
  for (const h of hits) bySeam[h.seam] = (bySeam[h.seam] || 0) + 1
  return { repo: repoDir, scannedAt: new Date().toISOString(), files, hits, bySeam }
}

/**
 * Human-readable rendering. Error group first, advisory seams after.
 * @param {{ repo: string, files: number, hits: Hit[] }} report
 * @returns {string}
 */
export function render(report) {
  const L = []
  L.push(`# scan-0.1.5 · ${report.repo}`)
  L.push(`files scanned: ${report.files} · hits: ${report.hits.length}`)
  const order = ['S3', 'S8', 'S9', 'M1', 'S4', 'S5', 'S6', 'C1', 'C2', 'P1', 'S7', 'S2', 'S1', 'S10', 'C4', 'C5', 'H1', 'H2', 'H4']
  if (!report.hits.length) {
    L.push('no seam hits — still verify with a real-host smoke AND a real browser assertion for the client half')
    L.push('(this scanner is necessary, not sufficient: the breakage this corridor covers is silent)')
  }
  for (const id of order) {
    const group = report.hits.filter(h => h.seam === id)
    if (!group.length) continue
    const seam = SEAMS.find(s => s.id === id)
    L.push('')
    L.push(`## ${id} [${seam.severity}] ${seam.title} — ${group.length} hit(s)`)
    L.push(`   action: ${seam.action}`)
    for (const h of group.slice(0, 12)) L.push(`   ${path.relative(process.cwd(), h.file)}:${h.line}  ${h.snippet}`)
    if (group.length > 12) L.push(`   ... ${group.length - 12} more`)
  }
  L.push('')
  L.push('H3 [info] card-only: the rc.1 additive capabilities are listed on the version card and are never auto-detected.')
  return L.join('\n')
}

/**
 * CLI entry point.
 * @param {string[]} argv
 * @returns {number} the process exit code.
 */
export function main(argv) {
  /** @type {{ repo: string, json: string | null, seams: string[] | null, quiet: boolean }} */
  const args = { repo: process.cwd(), json: null, seams: null, quiet: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--repo') args.repo = argv[++i]
    else if (a === '--json') args.json = argv[++i]
    else if (a === '--seams') args.seams = String(argv[++i]).split(',').map(s => s.trim()).filter(Boolean)
    else if (a === '--quiet') args.quiet = true
    else if (a === '--help' || a === '-h') { console.log('usage: node scan-0.1.5.mjs [--repo <path>] [--json <out.json>] [--seams S3,C1] [--quiet]'); return 0 }
    else { console.error(`unknown argument: ${a}`); return 2 }
  }
  const repoDir = path.resolve(args.repo)
  if (!fs.existsSync(repoDir)) { console.error(`repo not found: ${repoDir}`); return 2 }
  const report = scanRepo(repoDir, { seams: args.seams })
  report.beyondCorridors = beyondCorridors(repoDir)
  if (report.beyondCorridors && !args.quiet) console.error(`warning: declared band is newer than every corridor here (max ${CORRIDOR_CEILING})`)
  if (!args.quiet) console.log(render(report))
  if (args.json) fs.writeFileSync(path.resolve(args.json), JSON.stringify(report, null, 1), 'utf8')
  return report.hits.some(h => h.severity === 'error') ? 1 : 0
}

if (process.argv[1]?.endsWith('scan.mjs') || process.argv[1]?.endsWith('scan-0.1.5.mjs')) {
  process.exit(main(process.argv.slice(2)))
}
