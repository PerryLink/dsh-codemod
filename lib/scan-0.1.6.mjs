#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
/**
 * scan-0.1.6.mjs — zero-dependency detector for the DSH `0.1.5-rc.2 →
 * 0.1.6-alpha.2` plugin-adaptation seams.
 *
 * Why this exists: this span's breakage is mostly *silent*. Four examples that
 * motivate the whole catalog:
 *   - the `settings.plugin.item` slot was deleted with no alias, and
 *     `ctx.slots.inject()` only runs its callback when the declaration exists —
 *     so a settings card that still targets it stops mounting without an error,
 *     a log line or a failed build (`E3`);
 *   - `sessions.open`/`openSubagent`/`clear` were removed from `ISessions`
 *     (replaced by `retain`/`using`/`retainInfo`), so navigation code dies at
 *     click time with a loud TypeError or a swallowed error string (`E4`);
 *   - `SessionListState.current` was deleted, so every reader of "the current
 *     session" silently degrades (cast-typed readers pass tsc anyway) (`E3`);
 *   - the default model catalog shrank 4 → 2 and uncatalogued ids like
 *     `deepseek-v4-flash` route as text-only, so a vision tier that names one
 *     throws UNSUPPORTED_CONTENT on the first image request (`E5`).
 * A green local gate is therefore NOT evidence of adaptation: the published
 * type line hides the deletions entirely, and the two remaining breakages are
 * runtime races (`E1`, `E2`) that no typecheck can see.
 *
 * This scanner is the CLOSED catalog for the whole `0.1.5-rc.2 → 0.1.6-alpha.2`
 * corridor. It supersedes nothing and shares nothing: the previous span's
 * package (dsh-plugin-upgrade-015) owns its own twenty seams, and a corridor
 * never widens — this package's five seams have zero overlap with that one.
 *
 * Born hardened (the previous scanner's known defects are absorbed here, not
 * back-patched there):
 *   - `SKIP_DIRS` does NOT contain `lib`: a repo with a committed build (like
 *     the family's `lib/client.js`) must be scanned, because committed build
 *     artifacts ship the old seam to the user.
 *   - Every line-level behavior (context filter, file filter, downgrade rule)
 *     is a per-seam catalog field applied uniformly by one loop — no seam gets
 *     a special-case branch — and the render order derives from the catalog
 *     itself.
 *
 * The catalog below is the single source of truth shared by the version card,
 * the packaged skill and this CLI. `test/card.test.mjs` fails when the card and
 * this catalog disagree about the seam ids.
 *
 * Usage:
 *   node scan-0.1.6.mjs [--repo <path>] [--json <out.json>] [--seams E1,E3] [--quiet]
 *
 * Exit codes: 0 = no error-severity hit, 1 = at least one error-severity hit,
 *             2 = usage/scan failure.
 *
 * Provenance: every upstream fact behind a seam was re-read from the harness
 * checkout at tag `dsh-v0.1.6-alpha.2` (ddefc45) and recorded with `path:line`
 * in `docs/EVIDENCE.md` and in the version card
 * (`skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md`).
 * This scanner ships so a plugin author can re-measure their own repository; it
 * imports nothing outside Node's standard library and never writes inside the
 * scanned tree.
 */

import fs from 'node:fs'
import path from 'node:path'
import { beyondCorridors, CORRIDOR_CEILING } from './route.mjs'

// Hardened: `lib` is deliberately absent — committed build artifacts must be
// scanned (a rebuilt `lib/client.js` still carrying the old slot key ships the
// breakage to every user).
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.tmp', 'coverage', '_scratch', '_archive', 'downloads', 'upstream', 'dev'])
const SCAN_EXT = /\.(ts|tsx|mts|cts|mjs|cjs|js|jsx|json|yml|yaml)$/

/**
 * @typedef {object} Seam
 * @property {string} id
 * @property {string} title
 * @property {'error'} severity
 * @property {string} action
 * @property {RegExp|null} test  null = structured, detected by a dedicated file-level check
 * @property {(line: string) => boolean} [lineFilter]
 * @property {(lines: string[], i: number) => boolean} [windowFilter]
 * @property {(text: string, file: string) => boolean} [fileCheck]
 * @property {(text: string) => boolean} [downgradeIf]  file-level guard recognition
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
  // ---------------------------------------------------------------- leg C
  // 0.1.5-rc.2 → 0.1.6-alpha.2
  {
    id: 'E1',
    title: 'agent/created 监听器抛错或异步拖延会阻断 agent 创建（A1 串行链）',
    severity: 'error',
    action: '宿主在 agent 创建链上串行派发 `agent/created`：监听器抛错直接阻断创建，异步工作拖延首次消息。把监听器改写成「绝不抛错 + 快速返回」：同步工作包 try/catch，重工作 queueMicrotask/setImmediate 或投递到自己的队列，副作用失败只记日志。',
    test: /agent\/created/,
    // Registration contexts only: `.on(`, `.oneline(`, `addListener(`, listener maps.
    windowFilter: (lines, i) => {
      const win = lines.slice(Math.max(0, i - 2), i + 1).join('\n')
      return /\.on\s*\(|\.oneline\s*\(|addListener\s*\(|listener\s*[:=]\s*\{/.test(win)
    },
    // A file that guards its listener (try/catch, .catch, deferred work) is
    // adapted in spirit: report as a review lead instead of a blocker.
    downgradeIf: text => /try\s*\{|\.catch\s*\(|queueMicrotask|setImmediate|\.push\s*\(/.test(text),
  },
  {
    id: 'E2',
    title: '异步 apply 竞态：首个 await 之后才注册 ⇒ 卸载窗口内 INACTIVE_EFFECT（A02 全类）',
    severity: 'error',
    action: '`export async function apply(ctx)` 里，一切注册（ctx.effect/ctx.on/ctx.provide/ctx.plugin/*.register）必须在第一个 `await` 之前完成；`register()` 的返回值必须交给 `ctx.effect()` 持有。首个 await 之后的注册在卸载窗口内必抛 INACTIVE_EFFECT，旧闭包继续生效。',
    test: null, // structured detector: checkAsyncApply
  },
  {
    id: 'E3',
    title: '被删的槽/状态键：settings.plugin.item 与 SessionListState.current（静默消失）',
    severity: 'error',
    action: '`settings.plugin.item` 已删（新契约 `plugins.item`，keyed→list，条目带 `id`/`order`/`label`、props `{view:\'summary\'|\'page\'}`，不传 priority）；`SessionListState.current` 已删——「当前会话」从槽标准 props `sessionId`/`useSessionStatus`/`retainedBy.mainView` 推导（上游 ui-session 是模式），保留 undefined 守卫。两者都是静默失效：inject 回调不执行、cast 结构面 tsc 抓不到。',
    test: /settings\.plugin\.item|(?:list|snapshot|sessions\.list)\.current\b|getSnapshot\s*\(\s*\)\s*\.current/,
    // Slot/session consumption contexts only, never prose about the migration.
    lineFilter: line => /slots\.inject|register\s*\(\s*\{|name\s*:|sessions|snapshot|current|SessionListState|list\b/.test(line),
  },
  {
    id: 'E4',
    title: '被删的客户端 API：sessions.open / openSubagent / clear（点击路径 TypeError/吞错）',
    severity: 'error',
    action: '`ISessions` 删除了 `open`/`openSubagent`/`clear`，替代面是 `retain(id, { source })`（返回 Disposable，面板持有时存下、卸载时 dispose）/`using`/`retainInfo`。跳转代码改走 retain；特性探测（typeof 检查 + 回退）是保留旧 peer 带期间的合法写法。',
    test: /sessions\.(open|openSubagent|clear)\b/,
    // A file that also names the new surface (or probes before calling) is
    // handling the transition on purpose: report as a review lead.
    downgradeIf: text => /sessions\.retain|sessions\.using|typeof\s+\w*\.?\s*sessions|feature[-\s]?detect|hasOwnProperty\(['"]open['"]\)/i.test(text),
  },
  {
    id: 'E5',
    title: '被删的模型字面量：deepseek-v4-flash* / deepseek-v4-vision-exp（未编目 id 透传 text-only）',
    severity: 'error',
    action: '默认模型目录 4→2，`deepseek-v4-flash*` 与 `deepseek-v4-vision-exp` 已不在目录：未编目 id 透传为 text-only 路由，带图请求（vision 档）响亮抛 UNSUPPORTED_CONTENT、cheap 档静默降级。把配置默认值与测试硬编码换成仍在册的模型 id，README 同步。',
    test: /['"](deepseek-v4-flash[\w.-]*|deepseek-v4-vision-exp[\w.-]*)['"]|(?:default|model)\s*:\s*(deepseek-v4-flash[\w.-]*|deepseek-v4-vision-exp[\w.-]*)\s*$/,
  },
]

/** Seam ids in card order; the version card must name exactly this set. */
export const SEAM_IDS = SEAMS.map(s => s.id)

/** Seams implemented structurally (not by regex), like `E2`. */
const STRUCTURED = new Set(['E2'])

/**
 * Seams that are documented on the card and id-parity checked, but deliberately
 * have no automatic detection. This corridor has none: every seam ships a
 * detector.
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
 * E2 — the async-apply race, structured. Locate `export async function apply`,
 * walk its body with brace counting, find the first `await`, and flag every
 * registration call after it. `register()` return values are flagged regardless
 * of whether they reach `ctx.effect()`: the card instructs the author to hand
 * them to the effect.
 * @param {string} text
 * @param {string} file
 * @returns {Hit[]}
 */
function checkAsyncApply(text, file) {
  const lines = text.split(/\r?\n/)
  const hits = []
  for (let i = 0; i < lines.length; i++) {
    if (!/export\s+async\s+function\s+apply\b/.test(lines[i])) continue
    // First line from the signature onward that carries a brace. The signature
    // line itself may hold a `config = {}` default: counting starts there and
    // only a close to depth 0 on a LATER line ends the body.
    let j = i
    while (j < lines.length && !lines[j].includes('{')) j++
    if (j >= lines.length) continue
    let depth = 0
    let firstAwait = -1
    let bodyLine = 0
    for (let k = j; k < lines.length; k++) {
      const line = lines[k]
      let inString = null
      for (let c = 0; c < line.length; c++) {
        const ch = line[c]
        if (inString) {
          if (ch === inString && line[c - 1] !== '\\') inString = null
          continue
        }
        if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue }
        if (ch === '{') depth++
        if (ch === '}') { depth--; if (depth === 0 && k > j) { bodyLine = k; break } }
      }
      if (bodyLine) break
      if (firstAwait < 0 && k > j && /\bawait\s+/.test(line)) firstAwait = k
    }
    if (bodyLine === 0 || firstAwait < 0) continue
    for (let k = firstAwait + 1; k <= bodyLine; k++) {
      const line = lines[k]
      if (/^\s*(?:\/\/|\/\*|\*|#)/.test(line.trim())) continue
      if (/ctx\.(effect|on|provide|plugin)\s*\(|\b[a-zA-Z_$][\w.$]*\.register\s*\(/.test(line)) {
        hits.push({
          seam: 'E2', severity: 'error', file, line: k + 1,
          snippet: line.trim().slice(0, 200),
          detail: `registration after the first await (line ${firstAwait + 1}) of an async apply → INACTIVE_EFFECT in the unload window; move it before any await and hand register() results to ctx.effect()`,
        })
      }
    }
    i = bodyLine
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
  let files = 0
  for (const file of walk(repoDir)) {
    files++
    let text
    try { text = fs.readFileSync(file, 'utf8') } catch { continue }
    const lines = text.split(/\r?\n/)
    for (const seam of SEAMS) {
      if (wanted && !wanted.has(seam.id)) continue
      if (seam.test === null) continue // structured seam, handled below
      if (STRUCTURED.has(seam.id)) continue
      if (seam.fileCheck && !seam.fileCheck(text, file)) continue
      const downgraded = seam.downgradeIf ? seam.downgradeIf(text) : false
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        // Comment-only lines carry prose, not code: never a seam hit.
        if (/^(?:\/\/|\/\*|\*|#)/.test(trimmed)) continue
        if (!seam.test.test(lines[i])) continue
        if (seam.lineFilter && !seam.lineFilter(lines[i])) continue
        if (seam.windowFilter && !seam.windowFilter(lines, i)) continue
        hits.push({
          seam: seam.id, severity: downgraded ? 'warn' : seam.severity, file, line: i + 1,
          snippet: lines[i].trim().slice(0, 200),
          detail: downgraded ? `${seam.title} (guarded/transitional form — verify it is intentional)` : seam.title,
        })
      }
    }
    if (!wanted || wanted.has('E2')) hits.push(...checkAsyncApply(text, file))
  }
  /** @type {Record<string, number>} */
  const bySeam = {}
  for (const h of hits) bySeam[h.seam] = (bySeam[h.seam] || 0) + 1
  return { repo: repoDir, scannedAt: new Date().toISOString(), files, hits, bySeam }
}

/**
 * Human-readable rendering. Order derives from the catalog, never a copy.
 * @param {{ repo: string, files: number, hits: Hit[] }} report
 * @returns {string}
 */
export function render(report) {
  const L = []
  L.push(`# scan-0.1.6 · ${report.repo}`)
  L.push(`files scanned: ${report.files} · hits: ${report.hits.length}`)
  if (!report.hits.length) {
    L.push('no seam hits — still verify with a real-host smoke AND a real browser assertion for the client half')
    L.push('(this scanner is necessary, not sufficient: the breakage this corridor covers is silent)')
  }
  for (const id of SEAM_IDS) {
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
  L.push('every seam in this corridor ships a detector; CARD_ONLY = []')
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
    else if (a === '--help' || a === '-h') { console.log('usage: node scan-0.1.6.mjs [--repo <path>] [--json <out.json>] [--seams E1,E3] [--quiet]'); return 0 }
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

if (process.argv[1]?.endsWith('scan-0.1.6.mjs')) {
  process.exit(main(process.argv.slice(2)))
}
