// SPDX-License-Identifier: Apache-2.0
// The corridor-index gate: this package carries several CLOSED corridors and each
// keeps its own evidence-bound catalog module. This test binds the index to those
// catalogs - ids stay disjoint, the union is what the two cards document, routing
// picks the corridor the declared band belongs to, and an explicit --span overrides
// the guess. Without it the index could name a catalog that no longer exists, or
// two corridors could silently claim the same seam id.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CORRIDORS,
  corridorById,
  declaredBand,
  beyondCorridors,
  repoFromArgv,
  resolveCorridor,
  spanFromArgv,
} from '../lib/route.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const legAB = await import('../lib/scan.mjs')
const legC = await import('../lib/scan-0.1.6.mjs')
const legD = await import('../lib/scan-0.2.mjs')

test('the three catalogs stay disjoint and together cover 30 seams', () => {
  assert.equal(legAB.SEAMS.length + legC.SEAMS.length + legD.SEAMS.length, 30)
  const overlap = legAB.SEAM_IDS.filter(id => legC.SEAM_IDS.includes(id) || legD.SEAM_IDS.includes(id))
  assert.deepEqual(overlap, [], 'a seam id may not be claimed by two corridors')
  assert.deepEqual(legC.SEAM_IDS.filter(id => legD.SEAM_IDS.includes(id)), [])
})

test('every corridor names a card and a catalog that exist', () => {
  assert.equal(CORRIDORS.length, 3)
  for (const corridor of CORRIDORS) {
    const card = readFileSync(path.join(root, corridor.card), 'utf8')
    const catalog = readFileSync(path.join(root, corridor.catalog.replace('../', '')), 'utf8')
    assert.ok(card.length > 0, `${corridor.id}: card is empty`)
    assert.ok(catalog.length > 0, `${corridor.id}: catalog is empty`)
  }
})

test('the declared band routes, and an unknown band falls back to the older corridor', () => {
  const makeRepo = range => {
    const dir = mkdtempSync(path.join(tmpdir(), 'corridor-'))
    writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'sample', engines: { dsh: range }, devDependencies: { '@deepseek-ai/dsh-tools': range } }),
    )
    return dir
  }
  assert.equal(resolveCorridor({ repoDir: makeRepo('>=0.1.6-0 <0.2.0') }).id, 'legC')
  assert.equal(resolveCorridor({ repoDir: makeRepo('>=0.1.7-0 <0.2.0') }).id, 'legD')
  assert.equal(resolveCorridor({ repoDir: makeRepo('>=0.2.1-0 <0.3.0') }).id, 'legD')
  assert.equal(resolveCorridor({ repoDir: makeRepo('>=0.1.6-0 <0.2.0 || >=0.2.1-0 <0.3.0') }).id, 'legD')
  assert.equal(resolveCorridor({ repoDir: makeRepo('>=0.1.2-rc.1 <0.2.0') }).id, 'legAB')
  assert.equal(resolveCorridor({ repoDir: mkdtempSync(path.join(tmpdir(), 'corridor-')) }).id, 'legAB')
  assert.equal(resolveCorridor({}).id, 'legAB')
  assert.equal(declaredBand(makeRepo('>=0.1.6-0 <0.2.0')).includes('0.1.6'), true)
})

test('an explicit --span overrides the band', () => {
  assert.equal(resolveCorridor({ span: 'legC' }).id, 'legC')
  assert.equal(resolveCorridor({ span: '0.1.5-rc.2 -> 0.1.6-alpha.2' }).id, 'legC')
  assert.equal(resolveCorridor({ span: 'legAB' }).id, 'legAB')
  assert.equal(resolveCorridor({ span: 'legD' }).id, 'legD')
  assert.equal(resolveCorridor({ span: '0.1.6-alpha.2 -> 0.2.x' }).id, 'legD')
  assert.equal(corridorById('nope'), undefined)
  assert.equal(spanFromArgv(['--repo', 'D:/x', '--span', 'legC']), 'legC')
  assert.equal(spanFromArgv(['--span=legC']), 'legC')
  assert.equal(spanFromArgv(['--repo', 'D:/x']), undefined)
  assert.equal(repoFromArgv(['--repo', 'D:/x']), 'D:/x')
  assert.equal(repoFromArgv(['--repo=D:/x']), 'D:/x')
})

test('the leg C card names every seam its catalog detects', () => {
  const card = readFileSync(path.join(root, corridorById('legC').card), 'utf8')
  for (const id of legC.SEAM_IDS) {
    assert.ok(card.includes(id), `the leg C card does not name ${id}`)
  }
})

test('a band past every corridor is reported, not silently routed', () => {
  const makeRepo = range => {
    const dir = mkdtempSync(path.join(tmpdir(), 'corridor-beyond-'))
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'sample', engines: { dsh: range } }))
    return dir
  }
  assert.equal(beyondCorridors(makeRepo('0.2.3-alpha.1')), true)
  assert.equal(beyondCorridors(makeRepo('0.2.1-rc.2')), false)
  assert.equal(beyondCorridors(makeRepo('0.2.2-alpha.2')), false)
  assert.equal(beyondCorridors(makeRepo('>=0.1.7-0 <0.2.0')), false)
  assert.equal(beyondCorridors(makeRepo('>=0.1.6-alpha.2 <0.2.0')), false)
  assert.equal(beyondCorridors(makeRepo('>=0.1.2-rc.1 <0.2.0')), false)
  assert.equal(beyondCorridors(mkdtempSync(path.join(tmpdir(), 'corridor-empty-'))), false)
})
