// SPDX-License-Identifier: Apache-2.0
// The evidence-binding gate: the merged version card and the scanner catalog are
// two renderings of ONE catalog, so their seam ids and severities must match
// exactly. Without this test the card and `lib/scan.mjs` drift silently, which
// is the failure mode the corridor rules exist to prevent.
//
// The merged card is one document holding two legs verbatim, so the parity gate
// reads the *merged index* section, which is delimited by explicit markers, and
// separately checks that no seam id outside the catalog is minted anywhere else
// on the card — except the single recorded historical spelling of `M1` as `C3`.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEAMS, SEAM_IDS, CARD_ONLY } from '../lib/scan.mjs'
import { SEAMS as SEAMS_C, SEAM_IDS as SEAM_IDS_C, CARD_ONLY as CARD_ONLY_C } from '../lib/scan-0.1.6.mjs'
import { SEAMS as SEAMS_D, SEAM_IDS as SEAM_IDS_D, CARD_ONLY as CARD_ONLY_D } from '../lib/scan-0.2.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const cardPath = path.join(root, 'skills', 'plugin-upgrade', 'references', 'v0.1.3-alpha.1-to-v0.1.5-rc.1.md')
const card = readFileSync(cardPath, 'utf8')
const cardCPath = path.join(root, 'skills', 'plugin-upgrade', 'references', 'v0.1.5-rc.2-to-v0.1.6-alpha.2.md')
const cardC = readFileSync(cardCPath, 'utf8')
const cardDPath = path.join(root, 'skills', 'plugin-upgrade', 'references', 'v0.1.6-alpha.2-to-v0.2.x.md')
const cardD = readFileSync(cardDPath, 'utf8')

/**
 * A card's index section, delimited by HTML comment markers. The `legAB` card
 * marks its section `MERGED-SEAM-INDEX`; the `legC` card marks its own
 * `SEAM-INDEX`. One package, two corridors, two independent indexes.
 */
function indexSection(text, begin, end) {
  const start = text.indexOf(begin)
  const stop = text.indexOf(end)
  assert.ok(start >= 0 && stop > start, `the card must keep its delimited seam index (${begin})`)
  return text.slice(start, stop)
}

const section = indexSection(card, '<!-- MERGED-SEAM-INDEX:BEGIN -->', '<!-- MERGED-SEAM-INDEX:END -->')
const sectionC = indexSection(cardC, '<!-- SEAM-INDEX:BEGIN -->', '<!-- SEAM-INDEX:END -->')
const sectionD = indexSection(cardD, '<!-- LEGD-SEAM-INDEX:BEGIN -->', '<!-- LEGD-SEAM-INDEX:END -->')
const rows = [...section.matchAll(/^\|\s*`([SMCHP]\d{1,2})`\s*\|\s*\*{0,2}(error|warn|info)\*{0,2}\s*\|/gmu)]
  .map(m => ({ id: m[1], severity: m[2] }))

test('the merged catalog is exactly the 20 seams of the two closed legs, in catalog order', () => {
  assert.deepEqual(SEAM_IDS, [
    'S3', 'S8', 'S9', 'M1', 'S4', 'S5', 'S6', 'S7', 'S2', 'S1', 'S10',
    'C1', 'C2', 'P1', 'C4', 'C5', 'H1', 'H2', 'H4', 'H3',
  ])
  assert.equal(SEAM_IDS.length, 20)
})

test('the card index names exactly the catalog seams, in catalog order', () => {
  assert.deepEqual(rows.map(r => r.id), SEAM_IDS)
})

test('the card index states each seam severity exactly as the catalog does', () => {
  assert.deepEqual(
    rows.map(r => `${r.id}:${r.severity}`),
    SEAMS.map(s => `${s.id}:${s.severity}`),
  )
})

test('the card mints no seam id outside the catalog, and `C3` survives only as recorded history', () => {
  const mentioned = new Set([...card.matchAll(/`([SMCHP]\d{1,2})`/g)].map(m => m[1]))
  // Every backticked id on the card is a live catalog id...
  for (const id of mentioned) {
    if (id === 'C3') continue
    assert.ok(SEAM_IDS.includes(id), `the card names ${id}, which is not in the merged catalog`)
  }
  // ...the catalog is fully covered by the card...
  for (const id of SEAM_IDS) assert.ok(mentioned.has(id), `the card never names ${id}`)
  // ...and the retired `C3` spelling appears only where the fold is explained.
  const c3Lines = card.split(/\r?\n/).filter(l => l.includes('`C3`'))
  assert.ok(c3Lines.length > 0, 'the fold must record that leg B spelled this seam `C3`')
  for (const line of c3Lines) {
    assert.match(line, /leg B/, `a bare \`C3\` survives outside the recorded history: ${line.trim()}`)
  }
})

test('the card-only seam is documented on the card and is exactly H3', () => {
  assert.deepEqual(CARD_ONLY, ['H3'])
  for (const id of CARD_ONLY) assert.match(section, new RegExp(`\\|\\s*\`${id}\`\\s*\\|`))
  assert.match(card, /CARD_ONLY = \['H3'\]/)
})

test('the card declares the merged corridor and how to read the two legs', () => {
  assert.match(card, /^# 合并版本卡 · `0\.1\.3-alpha\.1` → `0\.1\.5-rc\.1`/m)
  assert.match(card, /^## Leg A · Version card `0\.1\.3-alpha\.1` → `0\.1\.5-alpha\.1`$/m)
  assert.match(card, /^## Leg B · 版本卡 `0\.1\.5-alpha\.1` → `0\.1\.5-rc\.1`$/m)
  assert.match(card, /只对 `0\.1\.5-alpha\.1 → 0\.1\.5-rc\.1` 负责/)
  // The rc.1 -> rc.2 hop added no plugin-facing seam, so the span ends at rc.1.
  assert.match(card, /没有新增面向插件的接缝/)
})

test('both legs keep their own scope statement, and the fold into M1 is written down', () => {
  // leg A's lock, kept verbatim inside its own section
  assert.match(card, /本卡只对 `0\.1\.3-alpha\.1 → 0\.1\.5-alpha\.1` 负责/)
  // the merged preamble explains that leg B's C3 is leg A's M1
  assert.match(card, /它与 leg A 的 `M1` 是\*\*同一条缺陷\*\*/)
  assert.match(card, /原记作 `C3`/)
})

test('the card carries the C1 rewrite recipe and records that upstream shipped no deprecation note', () => {
  assert.match(card, /main\.conversation/)
  assert.match(card, /没有别名/)
  assert.match(card, /deprecation/)
  assert.match(card, /公开扩展点的破坏性移除/)
})

test('the card is honest about the family-side blast radius being latent', () => {
  assert.match(card, /latent|潜在破坏/)
  assert.match(card, /8\*\* 个 slot key|只用 \*\*8\*\*/)
})

test('the skill directory, the frontmatter name and the bundle default agree', () => {
  const skill = readFileSync(path.join(root, 'skills', 'plugin-upgrade', 'SKILL.md'), 'utf8')
  assert.match(skill, /^name: plugin-upgrade$/m)
  // One package, one corridor index: the frontmatter names BOTH corridors.
  assert.match(skill, /^ {2}corridors: "legAB `0\.1\.3-alpha\.1 -> 0\.1\.5-rc\.1`/m)
  assert.match(skill, /legC `0\.1\.5-rc\.2 -> 0\.1\.6-alpha\.2`/)
  assert.doesNotMatch(skill, /a hop after 0\.1\.5-rc\.1 \(a new corridor is a new package\)/,
    'the superseded "a hop is a new package" rule must not survive in the routing hint')
  // Both legs' frontmatter routing hints survive in the body.
  assert.match(skill, /Routing hints carried over from the two legs' frontmatter/)
  assert.match(skill, /supported entry line is 0\.1\.6-alpha\.2/)
  assert.match(skill, /not a pre-0\.1\.6 activation promise/)
  const patch = readFileSync(path.join(root, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /^\s+- id: dsh-plugin-upgrade$/m)
  assert.match(patch, /skillName: plugin-upgrade/)
  const entry = readFileSync(path.join(root, 'index.mjs'), 'utf8')
  assert.match(entry, /default\('plugin-upgrade'\)/, 'the Config default must name the packaged skill')
  assert.match(entry, /export const name = 'dsh-plugin-upgrade'/)
})

// ---- corridor 2: `legC`. Same evidence-binding rule, its own catalog. ----

test('the legC card index names exactly the legC catalog seams, in catalog order', () => {
  assert.deepEqual(SEAM_IDS_C, ['E1', 'E2', 'E3', 'E4', 'E5'])
  const rowsC = [...sectionC.matchAll(/^\|\s*`([E]\d{1,2})`\s*\|\s*\*{0,2}(error|warn|info)\*{0,2}\s*\|/gmu)]
    .map(m => ({ id: m[1], severity: m[2] }))
  assert.deepEqual(rowsC.map(r => r.id), SEAM_IDS_C)
  assert.deepEqual(
    rowsC.map(r => `${r.id}:${r.severity}`),
    SEAMS_C.map(s => `${s.id}:${s.severity}`),
  )
})

test('the legC card mints no id outside its own catalog and declares no card-only seam', () => {
  const mentioned = new Set([...cardC.matchAll(/`(E\d{1,2})`/g)].map(m => m[1]))
  for (const id of mentioned) {
    assert.ok(SEAM_IDS_C.includes(id), `the legC card names ${id}, which is not in the legC catalog`)
  }
  for (const id of SEAM_IDS_C) assert.ok(mentioned.has(id), `the legC card never names ${id}`)
  assert.deepEqual(CARD_ONLY_C, [], 'every legC seam has a detector')
  assert.match(cardC, /CARD_ONLY = \[\]/)
})

test('the two corridors keep separate catalogs and never merge their seam arrays', () => {
  const overlap = SEAM_IDS.filter(id => SEAM_IDS_C.includes(id))
  assert.deepEqual(overlap, [], 'the legAB and legC catalogs must not share seam ids')
  assert.notDeepEqual(SEAM_IDS, SEAM_IDS_C)
})


// ---- corridor 3: `legD`. Same evidence-binding rule, its own catalog. ----

test('the legD card index names exactly the legD catalog seams, in catalog order', () => {
  assert.deepEqual(SEAM_IDS_D, ['D1', 'D2', 'D3', 'D4', 'D5'])
  const rowsD = [...sectionD.matchAll(/^\|\s*`([D]\d{1,2})`\s*\|\s*\*{0,2}(error|warn|info)\*{0,2}\s*\|/gmu)]
    .map(m => ({ id: m[1], severity: m[2] }))
  assert.deepEqual(rowsD.map(r => r.id), SEAM_IDS_D)
  assert.deepEqual(
    rowsD.map(r => `${r.id}:${r.severity}`),
    SEAMS_D.map(s => `${s.id}:${s.severity}`),
  )
})

test('the legD card mints no id outside its own catalog and declares no card-only seam', () => {
  const mentioned = new Set([...cardD.matchAll(/`(D\d{1,2})`/g)].map(m => m[1]))
  for (const id of mentioned) {
    assert.ok(SEAM_IDS_D.includes(id), `the legD card names ${id}, which is not in the legD catalog`)
  }
  for (const id of SEAM_IDS_D) assert.ok(mentioned.has(id), `the legD card never names ${id}`)
  assert.deepEqual(CARD_ONLY_D, [], 'every legD seam has a detector')
  assert.match(cardD, /CARD_ONLY = \[\]/)
})

test('the legD card declares its scope, its advisory section and its evidence baseline', () => {
  assert.match(cardD, /^# 版本卡 · `0\.1\.6-alpha\.2` → `0\.2\.x`/m)
  assert.match(cardD, /只对 \*\*`0\.1\.6-alpha\.2`（含 `0\.1\.7` 线）→ `0\.2\.x`\*\*/)
  assert.match(cardD, /CARD_ONLY = \[\]/)
  // The seams the corridor cannot machine-detect must be declared as such,
  // never smuggled into the catalog.
  assert.match(cardD, /advisory \(not scanned\)/)
  assert.match(cardD, /V4 会话格式/)
  assert.match(cardD, /\{kind:'plugin'\}/)
  assert.match(cardD, /mode: 'both'/)
  assert.match(cardD, /dsh-plugin-guide\/guide\/migration-0\.2\.md/)
})

test('the three corridors keep separate catalogs and never merge their seam arrays', () => {
  const overlapCD = SEAM_IDS_C.filter(id => SEAM_IDS_D.includes(id))
  const overlapABD = SEAM_IDS.filter(id => SEAM_IDS_D.includes(id))
  assert.deepEqual(overlapCD, [], 'the legC and legD catalogs must not share seam ids')
  assert.deepEqual(overlapABD, [], 'the legAB and legD catalogs must not share seam ids')
  assert.notDeepEqual(SEAM_IDS_C, SEAM_IDS_D)
})
