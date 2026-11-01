// SPDX-License-Identifier: Apache-2.0
// verify-artifacts: pack the package into a temp directory and prove the published
// tarball carries the plugin entry, the skill bundle, the CLI and the patch layer,
// that dev-only content (tests, fixtures, CI) is excluded, and that the entry
// imports under plain Node.
// Usage: node scripts/verify-artifacts.mjs
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, existsSync, readFileSync, symlinkSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const staging = mkdtempSync(join(tmpdir(), 'dsh-plugin-upgrade-pack-'))
const failures = []
try {
  execFileSync('npm', ['pack', '--pack-destination', staging], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true, shell: true })
  const tgz = readdirSync(staging).find(f => f.endsWith('.tgz'))
  if (!tgz) throw new Error('npm pack produced no tarball')
  execFileSync('tar', ['-xzf', join(staging, tgz), '-C', staging], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
  const pkgRoot = join(staging, 'package')
  if (!existsSync(pkgRoot)) failures.push('tarball has no package/ root')

  const required = [
    'index.mjs',
    'types.d.ts',
    'cordis.patch.yml',
    'lib/scan.mjs',
    'lib/scan-0.2.mjs',
    'scripts/scan-0.1.5.mjs',
    'skills/plugin-upgrade/SKILL.md',
    'skills/plugin-upgrade/scripts/scan-0.1.5.mjs',
    'skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md',
    'skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md',
    'skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md',
    'docs/EVIDENCE.md',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
  ]
  for (const rel of required) if (!existsSync(join(pkgRoot, rel))) failures.push(`tarball is missing ${rel}`)

  // Dev-only content must never ship: tests, fixtures and CI configuration.
  for (const rel of ['test', 'fixtures', '.github', 'pnpm-workspace.yaml', 'pnpm-lock.yaml']) {
    if (existsSync(join(pkgRoot, rel))) failures.push(`tarball ships dev-only content: ${rel}`)
  }

  // The packaged entry must import without the harness present. It imports the
  // declared peer @deepseek-ai/schemastery, so lend the extracted tree this
  // repo's installed peers through a directory link instead of reinstalling.
  try {
    const nm = join(pkgRoot, 'node_modules')
    if (!existsSync(nm) && existsSync(join(root, 'node_modules'))) {
      symlinkSync(join(root, 'node_modules'), nm, process.platform === 'win32' ? 'junction' : 'dir')
    }
    const entryUrl = pathToFileURL(join(pkgRoot, 'index.mjs')).href
    const out = execFileSync(process.execPath, ['-e', `import(${JSON.stringify(entryUrl)}).then(m => console.log('exports:' + ['name','inject','Config','apply'].filter(k => k in m).join(',')))`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    if (!/exports:name,inject,Config,apply/.test(out)) failures.push(`entry export surface unexpected: ${out.trim()}`)
  } catch (error) {
    // `execFileSync` attaches the failed child's stderr, which `Error` does not
    // declare: narrow with `in` instead of casting so the message stays identical.
    const stderr = error instanceof Error && 'stderr' in error ? error.stderr : undefined
    const detail = error instanceof Error ? String(stderr || error.message) : String(error)
    failures.push(`packaged entry failed to import: ${detail.slice(0, 200)}`)
  }

  // The packaged SKILL.md must keep its corridor-index frontmatter (all three corridors).
  const skill = readFileSync(join(pkgRoot, 'skills/plugin-upgrade/SKILL.md'), 'utf8')
  if (!/^name:\s*plugin-upgrade\s*$/m.test(skill)) failures.push('packaged SKILL.md lost its frontmatter name')
  if (!/^  corridors:\s*"legAB `0\.1\.3-alpha\.1 -> 0\.1\.5-rc\.1`/m.test(skill)) failures.push('packaged SKILL.md lost its legAB corridor frontmatter')
  if (!/legC `0\.1\.5-rc\.2 -> 0\.1\.6-alpha\.2`/m.test(skill)) failures.push('packaged SKILL.md lost its legC corridor frontmatter')

  // cordis.patch.yml must stay a top-level YAML ARRAY of loader patch entries:
  // a mapping (`insert:` at column 0) mounts nothing and dsh reports
  // "must be a top-level YAML array of loader patch entries" at profile load.
  const patch = readFileSync(join(pkgRoot, 'cordis.patch.yml'), 'utf8')
  const body = patch.split(/\r?\n/).filter(l => l.trim() !== '' && !l.trim().startsWith('#'))
  if (!body[0]?.startsWith('- ')) failures.push(`cordis.patch.yml is not a top-level YAML array (starts with ${JSON.stringify(body[0]?.slice(0, 30))})`)
  if (!body.some(l => /^-\s+insert:/.test(l))) failures.push('cordis.patch.yml has no top-level `- insert:` entry')
  if (!body.some(l => /name:\s*dsh-plugin-upgrade\s*$/.test(l))) failures.push('cordis.patch.yml does not insert the dsh-plugin-upgrade row')

  // The skill-relative scanner entry must work from inside the tarball, because
  // the skill body resolves `./scripts/...` against the skill directory.
  const probe = join(staging, 'bad-probe')
  mkdirSync(probe, { recursive: true })
  writeFileSync(join(probe, 'index.ts'), "ctx.slots.inject('conversation', () => {})\n")
  try {
    execFileSync(process.execPath, [join(pkgRoot, 'skills/plugin-upgrade/scripts/scan-0.1.5.mjs'), '--repo', probe, '--quiet'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    failures.push('packaged skill-relative scanner exited 0 on a real seam (C1)')
  } catch (error) {
    if (error.status !== 1) failures.push(`packaged skill-relative scanner exited ${error.status}, expected 1`)
  }

  // A leg-A seam must fail the same scanner from the tarball: the merged
  // catalog, not the rc.1-only one, is what ships. The probe stays import-free
  // so this file keeps no dependency edge the package does not declare.
  const legAProbe = join(staging, 'leg-a-probe')
  mkdirSync(legAProbe, { recursive: true })
  writeFileSync(join(legAProbe, 'index.ts'), [
    'declare const SystemPrompt: any',
    "export const mount = (ctx: any) => ctx.plugin(SystemPrompt, { persona: '' })",
    '',
  ].join('\n'))
  try {
    execFileSync(process.execPath, [join(pkgRoot, 'skills/plugin-upgrade/scripts/scan-0.1.5.mjs'), '--repo', legAProbe, '--quiet', '--seams', 'S9'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    failures.push('packaged skill-relative scanner exited 0 on a leg-A seam (S9)')
  } catch (error) {
    if (error.status !== 1) failures.push(`packaged skill-relative scanner exited ${error.status} on the leg-A probe, expected 1`)
  }

  // A leg-D seam must fail from the tarball through the explicit span: the
  // router consumes --span, and the legD catalog must still see a clean argv.
  const legDProbe = join(staging, 'leg-d-probe')
  mkdirSync(legDProbe, { recursive: true })
  writeFileSync(join(legDProbe, 'client.ts'), [
    'declare const ctx: any',
    "export const mount = () => ctx.slots.inject('conversation.session.header.leading', () => null)",
    '',
  ].join('\n'))
  try {
    execFileSync(process.execPath, [join(pkgRoot, 'skills/plugin-upgrade/scripts/scan-0.1.5.mjs'), '--repo', legDProbe, '--span', 'legD', '--quiet'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    failures.push('packaged skill-relative scanner exited 0 on a leg-D seam (D4)')
  } catch (error) {
    if (error.status !== 1) failures.push(`packaged skill-relative scanner exited ${error.status} on the leg-D probe, expected 1`)
  }

  if (failures.length) {
    console.error('artifacts: FAIL')
    for (const f of failures) console.error('  ' + f)
    process.exitCode = 1
  } else {
    console.log(`artifacts: OK (${required.length} required files present, dev-only content excluded, entry imports, skill frontmatter intact, CLI fails a real seam)`)
  }
} finally {
  rmSync(staging, { recursive: true, force: true })
}
