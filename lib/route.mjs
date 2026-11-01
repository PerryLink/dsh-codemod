// SPDX-License-Identifier: Apache-2.0
/**
 * The corridor index: one package, one entry point, several closed corridors.
 *
 * Owner decision (2026-09-19): the family's earlier "a hop is a new package" rule
 * is superseded. This package carries a corridor index instead, and the scanner
 * picks the corridor that matches the repository under inspection. What does NOT
 * change: each corridor keeps its OWN evidence-bound catalog module - the seam
 * arrays are never merged, so every card claim stays traceable to its measurement.
 *
 * Routing is deliberately a heuristic over the target repository's declared band
 * (`engines.dsh`, dependencies on `@deepseek-ai/dsh*`), because the scanner is
 * read-only, dependency-free and offline: no registry lookup happens here. The
 * "which line is newest" question belongs to the agent running the skill, not to
 * this scanner. `--span <id>` overrides the guess, and an unknown band falls back
 * to the older corridor, which is what a repository predating 0.1.6 needs anyway.
 */
import { readFileSync } from 'node:fs'

/** @typedef {{ id: string, span: string, catalog: string, card: string, baselineTags: string[], evidence: string }} Corridor */

/** @type {Corridor[]} */
export const CORRIDORS = [
  {
    id: 'legAB',
    span: '0.1.3-alpha.1 -> 0.1.5-rc.1',
    catalog: '../lib/scan.mjs',
    card: 'skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md',
    baselineTags: ['dsh-v0.1.5-alpha.1', 'dsh-v0.1.5-rc.1'],
    evidence: 'docs/EVIDENCE.md section A (leg A provenance) and sections 1-10 (leg B records)',
  },
  {
    id: 'legC',
    span: '0.1.5-rc.2 -> 0.1.6-alpha.2',
    catalog: '../lib/scan-0.1.6.mjs',
    card: 'skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md',
    baselineTags: ['dsh-v0.1.6-alpha.2'],
    evidence: 'docs/EVIDENCE.md section 11 (leg C records)',
  },
  {
    id: 'legD',
    span: '0.1.6-alpha.2 -> 0.2.x',
    catalog: '../lib/scan-0.2.mjs',
    card: 'skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md',
    baselineTags: ['dsh-v0.2.1-alpha.2', 'dsh-v0.2.2-alpha.2'],
    evidence: 'docs/EVIDENCE.md section 12 (leg D records); dsh-plugin-guide guide/migration-0.2.md',
  },
]

/**
 * Accepts a corridor id ('legC'), a full span, or a bare mention of a line.
 * @param {string} id - the `--span` value, a corridor id, or a bare line mention.
 * @returns {Corridor | undefined} the matching corridor, or undefined when nothing matches.
 */
export function corridorById(id) {
  if (typeof id !== 'string' || id.length === 0) return undefined
  const wanted = id.trim().toLowerCase()
  return CORRIDORS.find(
    c => c.id.toLowerCase() === wanted || c.span.toLowerCase() === wanted || c.span.toLowerCase().includes(wanted),
  )
}

/** The 0.1.6 line marker. Kept as one regex so the heuristic is auditable. */
const LEG_C_MARKER = /0\.1\.6-(alpha|beta|rc|0)/

/** The 0.1.7 line marker (covered by leg D, not by leg C). */
const LEG_D_017_MARKER = /0\.1\.7-(alpha|beta|rc|0)/

/**
 * True when the declared band belongs to the `0.2.x` generation. Upper bounds
 * are stripped first, so `<0.2.0` (the stale band this corridor repairs) does
 * not route to leg D by itself: only a positive 0.2 mention, or a 0.1.7 line,
 * does.
 * @param {string} band
 * @returns {boolean}
 */
export function isZeroTwoBand(band) {
  const positive = band.replace(/<\s*=?\s*\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g, '')
  return /0\.2\./.test(positive) || LEG_D_017_MARKER.test(band)
}

/**
 * Reads the target repository's declared band: the text of every field that
 * carries a dsh version, or '' when nothing declares one.
 * @param {string} repoDir
 * @returns {string}
 */
export function declaredBand(repoDir) {
  try {
    const manifest = JSON.parse(readFileSync(`${repoDir.replace(/[\\/]+$/, '')}/package.json`, 'utf8'))
    const parts = []
    if (manifest.engines && typeof manifest.engines.dsh === 'string') parts.push(manifest.engines.dsh)
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
      const block = manifest[field]
      if (!block || typeof block !== 'object') continue
      for (const [name, range] of Object.entries(block)) {
        if (name.startsWith('@deepseek-ai/dsh')) parts.push(String(range))
      }
    }
    return parts.join(' ')
  } catch {
    return ''
  }
}

/**
 * Chooses the corridor for a repository, or for an explicit span.
 * @param {{ repoDir?: string, span?: string }} [input]
 * @returns {Corridor}
 */
export function resolveCorridor(input = {}) {
  if (input.span) {
    const explicit = corridorById(input.span)
    if (explicit) return explicit
  }
  const band = input.repoDir ? declaredBand(input.repoDir) : ''
  if (isZeroTwoBand(band)) return CORRIDORS.find(c => c.id === 'legD')
  if (LEG_C_MARKER.test(band)) return CORRIDORS.find(c => c.id === 'legC')
  return CORRIDORS.find(c => c.id === 'legAB')
}

/**
 * Reads `--span <value>` out of an argv array without touching the other flags.
 * @param {string[]} argv - the raw CLI argument list (no `node`/script prefix).
 * @returns {string | undefined} the span value, or undefined when the flag is absent.
 */
export function spanFromArgv(argv) {
  const index = argv.findIndex(a => a === '--span')
  if (index >= 0 && typeof argv[index + 1] === 'string' && !argv[index + 1].startsWith('--')) return argv[index + 1]
  const inline = argv.find(a => a.startsWith('--span='))
  return inline ? inline.slice('--span='.length) : undefined
}

/**
 * Drops `--span <value>` / `--span=<value>` from an argv array. The wrapper
 * consumes the flag itself; the corridor catalogs must not see it (their
 * `main()` rejects unknown arguments, which used to turn `--span` into exit 2).
 * @param {string[]} argv - the raw CLI argument list (no `node`/script prefix).
 * @returns {string[]} the argv with the span flag removed.
 */
export function withoutSpanArgv(argv) {
  const out = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--span') { i += 1; continue }
    if (a.startsWith('--span=')) continue
    out.push(a)
  }
  return out
}

/**
 * Reads `--repo <value>` (or `--repo=<value>`) out of an argv array.
 * @param {string[]} argv - the raw CLI argument list (no `node`/script prefix).
 * @returns {string | undefined} the repo path, or undefined when the flag is absent.
 */
export function repoFromArgv(argv) {
  const index = argv.findIndex(a => a === '--repo')
  if (index >= 0 && typeof argv[index + 1] === 'string') return argv[index + 1]
  const inline = argv.find(a => a.startsWith('--repo='))
  return inline ? inline.slice('--repo='.length) : undefined
}

/**
 * Loads the catalog module the corridor points at.
 * @param {Corridor} corridor - the corridor whose `catalog` path is imported.
 * @returns {Promise<any>} the catalog module namespace (`main`, `SEAMS`, `render`, …). `any` is the honest type here: the specifier is a runtime string, so the namespace shape is not knowable statically.
 */
export async function loadCatalog(corridor) {
  return import(new URL(corridor.catalog, import.meta.url).href)
}

/** The newest host line any carried corridor was measured on. */
export const CORRIDOR_CEILING = '0.2.2-alpha.2'

/** Parse a semver-ish version into numeric + prerelease parts. @param {string} text @returns {{ nums: number[], pre: string[] } | undefined} */
function parseVersion(text) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(text)
  if (match === null) return undefined
  return {
    nums: [Number(match[1]), Number(match[2]), Number(match[3])],
    pre: match[4] === undefined ? [] : match[4].split('.'),
  }
}

/** Compare two parsed versions (numeric, then prerelease per semver). @param {{ nums: number[], pre: string[] }} a @param {{ nums: number[], pre: string[] }} b @returns {number} */
function compareVersions(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a.nums[i] !== b.nums[i]) return a.nums[i] - b.nums[i]
  }
  if (a.pre.length === 0 && b.pre.length === 0) return 0
  if (a.pre.length === 0) return 1
  if (b.pre.length === 0) return -1
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i += 1) {
    const left = a.pre[i]
    const right = b.pre[i]
    if (left === undefined) return -1
    if (right === undefined) return 1
    if (left === right) continue
    const ln = /^\d+$/.test(left) ? Number(left) : undefined
    const rn = /^\d+$/.test(right) ? Number(right) : undefined
    if (ln !== undefined && rn !== undefined) return ln - rn
    if (ln !== undefined) return -1
    if (rn !== undefined) return 1
    return left < right ? -1 : 1
  }
  return 0
}

/**
 * True when the repository's declared host band is newer than every carried
 * corridor (the scan is valid, but it cannot certify the target line).
 * @param {string} repoDir - target repository.
 * @returns {boolean}
 */
export function beyondCorridors(repoDir) {
  const band = declaredBand(repoDir)
  if (band === '') return false
  const ceiling = parseVersion(CORRIDOR_CEILING)
  // Only lower bounds matter: an upper bound like `<0.2.0` is not a target.
  const versions = band.replace(/<[^\s|]+/g, '').match(/\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/g) ?? []
  return versions.some((raw) => {
    const parsed = parseVersion(raw)
    return parsed !== undefined && ceiling !== undefined && compareVersions(parsed, ceiling) > 0
  })
}
