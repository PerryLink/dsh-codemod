#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
/**
 * scan-0.2.mjs — zero-dependency detector for the DSH `0.1.6-alpha.2 /
 * 0.1.7 → 0.2.x` plugin-adaptation seams (corridor `legD`).
 *
 * Why this exists: the 0.2 generation deletes public extension points instead
 * of renaming them, and the deletions are invisible to a local typecheck that
 * compiles against the older published type line. Five measured examples:
 *   - the peer band still ends at `<0.2.0`, and the host now *enforces* dsh
 *     peer ranges at install and restart time (`plugin-compatibility.ts`), so
 *     the plugin is refused rather than silently tolerated (`D1`);
 *   - `ctx.settings.register()` / `installSection()` / `SettingsScope` were
 *     removed when `settings-file` was deleted and the settings service became
 *     `SettingsForms` (`D2`);
 *   - `@deepseek-ai/dsh-invariants`, `ctx.invariants` and every `<pkg>/invariant`
 *     subpath export were deleted with `packages/runtime-diagnostics/` (`D3`);
 *   - `conversation.session.header.leading` was deleted and replaced by
 *     `conversation.header.leading`; `ctx.slots.inject()` only runs its callback
 *     when the declaration exists, so the contribution stops mounting silently
 *     (`D4`);
 *   - the `workspaceFiles` Remote dropped `readAll`/`readRelated` in favour of
 *     `readBytes`, and `changes()` became `changes(path)` (`D5`).
 *
 * This scanner is the CLOSED catalog for the whole `0.1.6-alpha.2 → 0.2.x`
 * corridor. Its five seams are disjoint from the legAB and legC catalogs
 * (`test/card.test.mjs` pins the union), and it shares nothing with them.
 *
 * Honesty: this catalog does not cover every 0.2 breakage. The seams that
 * cannot be detected reliably without a build or a host run — V4 session-log
 * parsing, the `{kind:'plugin'}` message-source removal, deleted composition
 * rows, `dsh.client.inject` shape, the `stats` entry split and the rest of the
 * guide's §13 list — are recorded on the card in the "advisory (not scanned)"
 * section, never in this array. A green scan is necessary, not sufficient.
 *
 * The catalog below is the single source of truth shared by the version card,
 * the packaged skill and this CLI. `test/card.test.mjs` fails when the card and
 * this catalog disagree about the seam ids or severities.
 *
 * Usage:
 *   node scan-0.2.mjs [--repo <path>] [--json <out.json>] [--seams D1,D3] [--quiet]
 *
 * Exit codes: 0 = no error-severity hit, 1 = at least one error-severity hit,
 *             2 = usage/scan failure.
 *
 * Provenance: every upstream fact behind a seam was re-read from the harness
 * checkout `/home/yy/deepseek-harness` at `ce7073d512` (root version
 * `0.2.2-alpha.2`) and from `dsh-plugin-guide/guide/migration-0.2.md`
 * (baseline `d743267388641bc76f17c45ce8b4c231aed1d32c`, tag
 * `dsh-v0.2.1-alpha.2`). The commands and outputs are recorded with
 * `path:line` in `docs/EVIDENCE.md` §12 and in
 * `skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md`.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { beyondCorridors, CORRIDOR_CEILING } from './route.mjs'

// Deliberately no `lib` in SKIP_DIRS: a committed build artifact ships the old
// seam to every user, so it must be scanned (same rule as the legC catalog).
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
 * @property {(text: string) => boolean} [fileCheck]
 * @property {(text: string) => boolean} [downgradeIf]  guarded/transitional recognition
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
  // ---------------------------------------------------------------- leg D
  // 0.1.6-alpha.2 / 0.1.7 → 0.2.x
  {
    id: 'D1',
    title: 'peer 区间仍止于 <0.2.0：0.2.x 宿主在安装期直接拒绝（D1）',
    severity: 'error',
    action: '`dsh plugin add` 与重启探针会用运行时版本比对插件声明的 `engines.dsh`（存在则独占）或 `@deepseek-ai/dsh*` 的 `peerDependencies`，不匹配直接拒绝安装/启动。把 0.2 线的子句补进区间，例如 `>=0.1.6-0 <0.2.0 || >=0.2.1-0 <0.3.0`；不要写 `>=0.1.2-rc.1 <0.3.0` 这种跨代开区间（能装但运行时炸）。范围之外仍要配运行时特性探测。',
    test: null, // structured detector: checkPeerBand
  },
  {
    id: 'D2',
    title: 'settings 重写：settings.register / installSection / SettingsScope 已删除（D2）',
    severity: 'error',
    action: '`packages/settings/settings-file` 已整体删除，`ctx.settings` 变成 `SettingsForms extends Service`：`register(ns, schema, opts)`、`installSection(...)`、`SettingsScope<T>`、`SettingsRegisterOptions` 与 `applies: \'restart\'` 全部不存在。表单改由 profile 条目的 `Config` schema 自动派生，暴露字段标成 `Volatile<T>`，读用 `.get()`、监听 `loader/volatile-update`；客户端 `ctx.settingsScope` 也已删除。',
    test: /\bsettings\s*\.\s*(?:register|installSection)\s*\(|\binstallSection\s*\(|\bSettingsScope\b|\bsettingsScope\b|\bSettingsRegisterOptions\b/,
  },
  {
    id: 'D3',
    title: 'invariants 全部删除：包 / ctx.invariants / <pkg>/invariant 导出（D3）',
    severity: 'error',
    action: '`@deepseek-ai/dsh-invariants` 包、`ctx.invariants` 服务、`InvariantRegistry`/`InvariantInstaller`/`InvariantFailure`/`InvariantError` 以及每个 `<package>/invariant` 子路径导出都已删除，整棵 `packages/runtime-diagnostics/` 消失。删掉 import 与组合行；靠 `INVARIANT` 异常做失败传播的代码必须换成自己的通道（四个 emitter 已改为“记录并继续”）。',
    test: /@deepseek-ai\/dsh-invariants\b|['"][^'"]*\/invariant['"]|\bctx\.invariants\b|\bInvariantRegistry\b|\bInvariantInstaller\b|\bInvariantFailure\b|\bInvariantError\b/,
  },
  {
    id: 'D4',
    title: '被删槽 conversation.session.header.leading → conversation.header.leading（D4）',
    severity: 'error',
    action: '`conversation.session.header.leading` 已删除，位置由 `conversation.header.leading` 接管。`ctx.slots.inject()` 只在声明存在时才执行回调，所以仍指向旧 key 的插件会**静默消失**（无报错、无日志、构建照绿）。改用 `conversation.header.leading`，并按新位置的标准 props 重取会话信息；`settings.plugin.item` 属于 legC 的 E3，不在本接缝重复。',
    test: /conversation\.session\.header\.leading/,
  },
  {
    id: 'D5',
    title: 'workspace-files Remote：readAll/readRelated → readBytes，changes() → changes(path)（D5）',
    severity: 'error',
    action: '`remote.workspaceFiles` 删除了 `readAll`/`readRelated`（返回解码后的字节结果），改为 `readBytes(path, { range?, baseFile? })`，经 Connection 二进制 RPC 返回原生 `Uint8Array`；工作区级 `changes()` 改为单目标 `changes(path)`（目录被限制在工作区内）。`read(path, { offset?, limit? })` 与 `list(path)` 未变。改用 `readBytes`/`changes(path)`，并处理二进制结果。',
    test: /workspaceFiles\s*\.\s*(?:readAll|readRelated)\b|\.(?:readAll|readRelated)\s*\(|workspaceFiles\s*\.\s*changes\s*\(\s*\)|\{\s*(?:readAll|readRelated|changes)\s*\}\s*=\s*[^\n]*workspaceFiles/,
    // A file that already names readBytes is mid-migration: report as a lead.
    downgradeIf: text => /\breadBytes\b/.test(text),
  },
]

/** Seam ids in card order; the version card must name exactly this set. */
export const SEAM_IDS = SEAMS.map(s => s.id)

/** Seams implemented structurally (not by regex). */
const STRUCTURED = new Set(['D1'])

/**
 * Seams that are documented on the card and id-parity checked, but deliberately
 * have no automatic detection. This corridor has none: every catalog seam ships
 * a detector. The seams this corridor cannot scan are *not* in the catalog at
 * all — they live in the card's "advisory (not scanned)" section.
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
 * True when a declared range cannot admit any `0.2.x` version. Conservative:
 * an unparseable/unknown clause counts as admitting, so the detector never
 * invents a failure. Clauses are split on `||`; an explicit upper bound below
 * `0.2` excludes, and a `0.2` lower bound / exact / caret admits.
 * @param {string} range - one engines.dsh or peerDependencies value.
 * @returns {boolean}
 */
function excludes02(range) {
  const text = String(range).trim()
  if (text === '' || text.startsWith('workspace:')) return false
  const clauses = text.split(/\s*\|\|\s*/).filter(clause => clause !== '')
  if (clauses.length === 0) return false
  return clauses.every((clause) => {
    const stripped = clause.replace(/<\s*=?\s*\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, '')
    if (/0\.2\./.test(stripped)) return false
    if (/>=\s*0\.3\./.test(clause)) return true
    return /<\s*=?\s*0\.2(?:\.\d+)?(?:-[0-9A-Za-z.-]+)?/.test(clause)
  })
}

/**
 * D1 — the declared host band, read the way the host reads it: `engines.dsh`
 * decides alone when present; otherwise every `@deepseek-ai/dsh*` peer must
 * match. A band that cannot admit any 0.2 version is refused at install time.
 * @param {string} file
 * @param {string} text
 * @returns {Hit[]}
 */
function checkPeerBand(file, text) {
  /** @type {Hit[]} */
  const hits = []
  let manifest
  try { manifest = JSON.parse(text) } catch { return hits }
  if (!manifest || typeof manifest !== 'object') return hits
  const lines = text.split(/\r?\n/)
  /** @param {string} needle @returns {number} */
  const lineOf = (needle) => {
    const i = lines.findIndex(line => line.includes(needle))
    return i < 0 ? 1 : i + 1
  }
  /** @param {string} field @param {string} range @param {string} detail */
  const report = (field, range, detail) => {
    if (!excludes02(range)) return
    hits.push({
      seam: 'D1', severity: 'error', file, line: lineOf(range),
      snippet: `${field}: ${range}`.slice(0, 200),
      detail: `${detail} — the declared range cannot admit any 0.2.x runtime; the host compares the runtime version to this range and refuses the install/restart`,
    })
  }
  const engines = manifest.engines
  if (engines && typeof engines === 'object' && typeof engines.dsh === 'string') {
    report('engines.dsh', engines.dsh, 'engines.dsh decides alone (peerDependencies are then ignored)')
    return hits
  }
  const peers = manifest.peerDependencies
  if (!peers || typeof peers !== 'object' || Array.isArray(peers)) return hits
  for (const [name, range] of Object.entries(peers)) {
    if (typeof range !== 'string') continue
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    report(`peerDependencies[${name}]`, range, `dsh peer range for ${name}`)
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
    if ((!wanted || wanted.has('D1')) && path.basename(file) === 'package.json') {
      hits.push(...checkPeerBand(file, text))
    }
    const lines = text.split(/\r?\n/)
    for (const seam of SEAMS) {
      if (wanted && !wanted.has(seam.id)) continue
      if (seam.test === null || STRUCTURED.has(seam.id)) continue
      if (seam.fileCheck && !seam.fileCheck(text)) continue
      const downgraded = seam.downgradeIf ? seam.downgradeIf(text) : false
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        // Comment-only lines carry prose, not code: never a seam hit.
        if (/^(?:\/\/|\/\*|\*|#)/.test(trimmed)) continue
        if (!seam.test.test(lines[i])) continue
        if (seam.lineFilter && !seam.lineFilter(lines[i])) continue
        hits.push({
          seam: seam.id, severity: downgraded ? 'warn' : seam.severity, file, line: i + 1,
          snippet: lines[i].trim().slice(0, 200),
          detail: downgraded ? `${seam.title} (guarded/transitional form — verify it is intentional)` : seam.title,
        })
      }
    }
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
  L.push(`# scan-0.2 · ${report.repo}`)
  L.push('corridor: legD · 0.1.6-alpha.2 -> 0.2.x')
  L.push(`files scanned: ${report.files} · hits: ${report.hits.length}`)
  if (!report.hits.length) {
    L.push('no seam hits — still verify with a real-host smoke AND a real browser assertion for the client half')
    L.push('(this scanner is necessary, not sufficient: the 0.2 deletions are silent or install-time)')
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
  L.push('not scanned (see the card\'s "advisory (not scanned)" section): V4 session-log parsing,')
  L.push('the {kind:\'plugin\'} message source, deleted composition rows, dsh.client.inject shape,')
  L.push('the stats -> activity/usage entry split, mode:both, and the guide §13 L1-L19 list.')
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
    else if (a === '--help' || a === '-h') { console.log('usage: node scan-0.2.mjs [--repo <path>] [--json <out.json>] [--seams D1,D3] [--quiet]'); return 0 }
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

// Direct execution only: the wrapper imports this module, and `endsWith`
// guards used to re-run THIS main() with the wrapper's raw argv (so `--span`
// exited 2 before the router could act). Compare resolved paths instead.
if (process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)))
}
