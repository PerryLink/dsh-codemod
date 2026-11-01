// SPDX-License-Identifier: Apache-2.0
// Self-test for lib/scan-0.2.mjs — the `legD` corridor (0.1.6-alpha.2 / 0.1.7
// -> 0.2.x). Synthetic bad/good fixtures for the five catalog seams, the
// structured D1 peer-band check, the D5 downgrade, --seams filtering, and the
// router's auto-detection of a 0.2 band plus the explicit `--span legD`.
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { scanRepo, render, SEAM_IDS, CARD_ONLY } from '../lib/scan-0.2.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const cli = path.join(root, 'scripts', 'scan-0.1.5.mjs')
const bad = path.join(root, 'fixtures', 'leg-d-bad-repo')
const good = path.join(root, 'fixtures', 'leg-d-good-repo')

/** Run the packaged CLI and return `{ status, stdout, stderr }` instead of throwing. */
function runCli(args) {
  try {
    const stdout = execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    return { status: 0, stdout, stderr: '' }
  } catch (error) {
    return { status: error.status, stdout: String(error.stdout ?? ''), stderr: String(error.stderr ?? '') }
  }
}

/** A temp repo whose package.json declares one dsh band. */
function bandRepo(range) {
  const dir = mkdtempSync(path.join(tmpdir(), 'leg-d-band-'))
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'band', engines: { dsh: range } }))
  return dir
}

const bySeam = hits => hits.reduce((acc, h) => { acc[h.seam] = (acc[h.seam] || 0) + 1; return acc }, {})

test('legD catalog is the five measured seams, in card order, all detected', () => {
  assert.deepEqual(SEAM_IDS, ['D1', 'D2', 'D3', 'D4', 'D5'])
  assert.deepEqual(CARD_ONLY, [], 'every legD seam ships a detector')
})

test('legD bad fixture: every seam is flagged at error severity', () => {
  const report = scanRepo(bad)
  const errors = report.hits.filter(h => h.severity === 'error')
  assert.deepEqual(bySeam(errors), { D1: 1, D2: 2, D3: 2, D4: 2, D5: 2 })
  assert.equal(report.hits.length, 9)
  // A committed build artifact under lib/ must be scanned, not skipped.
  assert.ok(report.hits.some(h => h.seam === 'D4' && h.file.includes(`${path.sep}lib${path.sep}`)))
})

test('legD good fixture: an adapted plugin produces zero error-severity hits', () => {
  const report = scanRepo(good)
  assert.deepEqual(report.hits.filter(h => h.severity === 'error'), [], JSON.stringify(report.hits, null, 1))
})

test('D1 is structured: a stale upper bound fails, a 0.2 clause passes, engines.dsh wins', () => {
  assert.equal(scanRepo(bandRepo('>=0.1.7-0 <0.2.0')).bySeam.D1, 1)
  assert.equal(scanRepo(bandRepo('>=0.1.2-rc.1 <0.2.0')).bySeam.D1, 1)
  assert.equal(scanRepo(bandRepo('>=0.1.6-0 <0.2.0 || >=0.2.1-0 <0.3.0')).bySeam.D1, undefined)
  assert.equal(scanRepo(bandRepo('>=0.2.1-0 <0.3.0')).bySeam.D1, undefined)
  assert.equal(scanRepo(bandRepo('workspace:*')).bySeam.D1, undefined)
  // engines.dsh decides alone: a usable peer does not rescue a stale engine.
  const dir = mkdtempSync(path.join(tmpdir(), 'leg-d-engine-'))
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    name: 'engine',
    engines: { dsh: '>=0.1.7-0 <0.2.0' },
    peerDependencies: { '@deepseek-ai/dsh-skill': '>=0.2.1-0 <0.3.0' },
  }))
  assert.equal(scanRepo(dir).bySeam.D1, 1)
})

test('D5 downgrades to a review lead when the file also names readBytes', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'leg-d-mid-migration-'))
  writeFileSync(path.join(dir, 'client.ts'), [
    "export function read(ctx: any, p: string) {",
    '  const bytes = ctx.remote.workspaceFiles.readBytes(p, {})',
    '  return ctx.remote.workspaceFiles.readAll(p)',
    '}',
    '',
  ].join('\n'))
  const report = scanRepo(dir, { seams: ['D5'] })
  assert.equal(report.hits.length, 1)
  assert.equal(report.hits[0].severity, 'warn')
  assert.match(report.hits[0].detail, /guarded\/transitional/)
})

test('--seams filters the legD catalog and an unknown id matches nothing', () => {
  assert.deepEqual([...new Set(scanRepo(bad, { seams: ['D3'] }).hits.map(h => h.seam))], ['D3'])
  assert.deepEqual(scanRepo(bad, { seams: ['D9'] }).hits, [])
})

test('CLI: an explicit --span legD fails the bad fixture and passes the good one', () => {
  const badRun = runCli(['--repo', bad, '--span', 'legD', '--quiet'])
  assert.equal(badRun.status, 1)
  const goodRun = runCli(['--repo', good, '--span', 'legD', '--quiet'])
  assert.equal(goodRun.status, 0)
})

test('CLI: auto-detection routes a 0.2 band and a 0.1.7 band to legD', () => {
  const zeroTwo = runCli(['--repo', bandRepo('>=0.2.1-0 <0.3.0')])
  assert.equal(zeroTwo.status, 0)
  assert.match(zeroTwo.stdout, /# scan-0\.2 · /)
  const oneSeven = runCli(['--repo', bandRepo('>=0.1.7-0 <0.2.0')])
  assert.equal(oneSeven.status, 1, 'the stale 0.1.7 band must trip D1 through the legD catalog')
  assert.match(oneSeven.stderr, /corridor: legD/)
  // The legC band still routes to legC: `<0.2.0` alone is not a 0.2 target.
  const oneSix = runCli(['--repo', bandRepo('>=0.1.6-0 <0.2.0')])
  assert.match(oneSix.stdout, /# scan-0\.1\.6 · /)
})

test('CLI: --json carries the legD report shape and exit codes follow severity', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'leg-d-json-'))
  try {
    const jsonPath = path.join(tmp, 'report.json')
    const run = runCli(['--repo', bad, '--span', 'legD', '--quiet', '--json', jsonPath])
    assert.equal(run.status, 1)
    const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    assert.equal(report.hits.length, 9)
    assert.deepEqual(Object.keys(report.bySeam).sort(), ['D1', 'D2', 'D3', 'D4', 'D5'])
    assert.equal(report.files, 5)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})

test('render() names the legD corridor and the advisory boundary', () => {
  const out = render(scanRepo(bad))
  assert.match(out, /# scan-0\.2 · /)
  assert.match(out, /corridor: legD · 0\.1\.6-alpha\.2 -> 0\.2\.x/)
  assert.match(out, /## D1 \[error\]/)
  assert.match(out, /advisory \(not scanned\)/)
})

test('the legD scan is read-only: the fixture trees are untouched', () => {
  for (const dir of [bad, good]) {
    const before = fs.readdirSync(dir).sort()
    scanRepo(dir)
    assert.deepEqual(fs.readdirSync(dir).sort(), before)
  }
})

test('the wrapper consumes --span for every corridor (legAB/legC/legD)', () => {
  assert.equal(runCli(['--repo', path.join(root, 'fixtures', 'leg-a-bad-repo'), '--span', 'legAB', '--quiet']).status, 1)
  assert.equal(runCli(['--repo', path.join(root, 'fixtures', 'leg-c-bad-repo'), '--span', 'legC', '--quiet']).status, 1)
  assert.equal(runCli(['--repo', bad, '--span=legD', '--quiet']).status, 1)
})
