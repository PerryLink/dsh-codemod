// SPDX-License-Identifier: Apache-2.0
// Real-Cordis registration tests: mount the official SkillRegistry, mount this
// plugin, and assert the packaged merged-corridor skill appears in the catalog
// and disappears on dispose. Negatives: a missing bundle, an empty body and a
// nameless frontmatter must each fail loud at mount.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import * as plugin from '../index.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const SKILL = 'plugin-upgrade'
const CARD = 'references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md'

test('the plugin identity names the merged package, not either retired one', () => {
  assert.equal(plugin.name, 'dsh-plugin-upgrade')
  assert.deepEqual(plugin.inject, ['skills'])
})

test('registers the packaged skill on the real skills service and removes it on dispose', async () => {
  const ctx = new Context()
  await ctx.plugin(SkillRegistry)
  const fiber = await ctx.plugin(plugin)
  const list = await ctx.skills.list()
  assert.ok(list.some(s => s.name === SKILL), `expected ${SKILL} in ${list.map(s => s.name).join(',')}`)
  const def = await ctx.skills.get(SKILL)
  assert.ok(def, 'skill definition must resolve')
  assert.match(def.content, /Plugin upgrade/)
  assert.match(def.content, /Locate your leg first/, 'the body must route the caller to a leg')
  assert.equal(def.source, 'bundled')
  assert.equal(def.invocation.modelInvocable, true)
  assert.equal(def.invocation.userInvocable, true)
  assert.match(def.description, /0\.1\.3-alpha\.1 -> 0\.1\.5-rc\.1/)
  assert.match(def.description, /legD` \(`0\.1\.6-alpha\.2 \/ 0\.1\.7 -> 0\.2\.x`/)
  assert.match(def.description, /D1`-`D5/)
  assert.match(def.whenToUse, /0\.1\.6-alpha\.2/)
  assert.match(def.whenToUse, /0\.2\.x line/)
  assert.match(def.whenToUse, /pre-0\.1\.6 activation promise/)
  // Relative references in the body resolve against the skill's own directory.
  assert.equal(path.basename(def.resourceBase.path), SKILL)
  assert.ok(existsSync(path.join(def.resourceBase.path, CARD)))
  assert.ok(existsSync(path.join(def.resourceBase.path, 'references', 'v0.1.6-alpha.2-to-v0.2.x.md')))
  await fiber.dispose()
  const after = await ctx.skills.list()
  assert.ok(!after.some(s => s.name === SKILL), 'skill must disappear after dispose')
})

test('the registered body reaches both legs through the packaged card', async () => {
  const ctx = new Context()
  await ctx.plugin(SkillRegistry)
  await ctx.plugin(plugin)
  const def = await ctx.skills.get(SKILL)
  const card = readFileSync(path.join(def.resourceBase.path, CARD), 'utf8')
  assert.match(card, /^## Leg A · Version card `0\.1\.3-alpha\.1` → `0\.1\.5-alpha\.1`$/m)
  assert.match(card, /^## Leg B · 版本卡 `0\.1\.5-alpha\.1` → `0\.1\.5-rc\.1`$/m)
  assert.match(card, /<!-- MERGED-SEAM-INDEX:BEGIN -->/)
  // The scanner ships inside the skill directory so `./scripts/...` resolves.
  assert.ok(existsSync(path.join(def.resourceBase.path, 'scripts', 'scan-0.1.5.mjs')))
})

test('enabled: false mounts without registering anything', async () => {
  const ctx = new Context()
  await ctx.plugin(SkillRegistry)
  await ctx.plugin(plugin, { enabled: false })
  const list = await ctx.skills.list()
  assert.ok(!list.some(s => s.name === SKILL))
})

test('a missing skill bundle fails loud instead of mounting silently', async () => {
  const ctx = new Context()
  await ctx.plugin(SkillRegistry)
  // Cordis surfaces an apply() throw on the mount fiber, so the rejection lands
  // when the fiber is awaited rather than on the synchronous ctx.plugin() call.
  await assert.rejects(
    async () => { await ctx.plugin(plugin, { skillsRoot: path.join(root, 'fixtures', 'does-not-exist') }) },
    /dsh-plugin-upgrade: cannot read skill bundle/,
  )
})

test('an empty skill body fails loud', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dshup015-empty-'))
  try {
    const dir = path.join(tmp, SKILL)
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${SKILL}\n---\n\n`)
    assert.throws(() => plugin.readSkillBundle(tmp, SKILL), /skill body is empty/)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
})

test('a frontmatter without a name fails loud', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dshup015-noname-'))
  try {
    const dir = path.join(tmp, SKILL)
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'SKILL.md'), '---\ndescription: no name here\n---\nbody\n')
    assert.throws(() => plugin.readSkillBundle(tmp, SKILL), /missing a name/)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
})

test('the Config schema defaults to the packaged skill and a directory resourceBase root', () => {
  const parsed = new plugin.Config({})
  assert.equal(parsed.enabled, true)
  assert.equal(parsed.skillName, SKILL)
  assert.equal(parsed.userInvocable, true)
  assert.ok(parsed.skillsRoot.endsWith('skills'), `unexpected skillsRoot default: ${parsed.skillsRoot}`)
})

test('splitFrontmatter parses a SKILL.md frontmatter', () => {
  const parsed = plugin.splitFrontmatter('---\nname: demo\ndescription: a demo\nwhenToUse: when it demos\n---\nbody line\n')
  assert.equal(parsed.description, 'a demo')
  assert.equal(parsed.whenToUse, 'when it demos')
  assert.equal(parsed.body, 'body line\n')
  assert.equal(plugin.splitFrontmatter('no frontmatter').description, undefined)
})

test('splitFrontmatter survives a CRLF checkout (Windows core.autocrlf=true)', () => {
  const parsed = plugin.splitFrontmatter('---\r\nname: demo\r\ndescription: a demo\r\nwhenToUse: when it demos\r\n---\r\nbody line\r\n')
  assert.equal(parsed.description, 'a demo')
  assert.equal(parsed.whenToUse, 'when it demos')
  assert.equal(parsed.body, 'body line\n')
})

test('readSkillBundle mounts a CRLF-converted bundle', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'dshup015-crlf-'))
  try {
    const dir = path.join(tmp, SKILL)
    mkdirSync(dir, { recursive: true })
    const crlf = readFileSync(path.join(root, 'skills', SKILL, 'SKILL.md'), 'utf8').replace(/\r?\n/g, '\r\n')
    writeFileSync(path.join(dir, 'SKILL.md'), crlf)
    const bundle = plugin.readSkillBundle(tmp, SKILL)
    assert.equal(bundle.frontmatterName, SKILL)
    assert.match(bundle.whenToUse, /0\.1\.5-rc\.1/)
    assert.match(bundle.body, /Plugin upgrade/)
    assert.ok(!bundle.body.startsWith('---'), 'frontmatter must not leak into the body')
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
})
