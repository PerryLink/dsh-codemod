// SPDX-License-Identifier: Apache-2.0
// verify-self-contained: every bare import in this package must resolve from the
// declared dependency set, and no import may point outside the package root.
// Usage: node scripts/verify-self-contained.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const declared = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.optionalDependencies ?? {}),
])
const BUILTIN = /^(node:|[a-z]+$)/
const SKIP = new Set(['node_modules', '.git', 'fixtures'])

/**
 * Yield every source file under `dir`, skipping the package's own exclusions.
 * @param {string} dir
 * @returns {Generator<string, void, void>}
 */
function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP.has(e.name)) yield* walk(join(dir, e.name)) }
    else if (/\.(mjs|cjs|js)$/.test(e.name)) yield join(dir, e.name)
  }
}

const problems = []
for (const file of walk(root)) {
  // Strip comments and template literals first: this script itself contains
  // `import('${...}')` inside a template literal, which is not an import edge.
  const text = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
  for (const m of text.matchAll(/(?:from|import\()\s*['"]([^'"]+)['"]/g)) {
    const spec = m[1]
    if (spec.startsWith('.')) {
      const target = resolve(dirname(file), spec)
      const rel = relative(root, target)
      if (rel.startsWith('..') || isAbsolute(rel)) problems.push(`${relative(root, file)}: relative import escapes the package: ${spec}`)
      else if (!existsSync(target) && !existsSync(`${target}.mjs`) && !existsSync(join(target, 'index.mjs'))) problems.push(`${relative(root, file)}: relative import does not exist: ${spec}`)
      continue
    }
    if (BUILTIN.test(spec)) continue
    const base = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
    if (!declared.has(base)) problems.push(`${relative(root, file)}: bare import not declared in package.json: ${spec}`)
  }
}

// The packaged skill bundle and its assets must exist for the plugin to mount.
for (const required of [
  'skills/plugin-upgrade/SKILL.md',
  'skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md',
  'skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md',
  'skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md',
  'lib/scan-0.2.mjs',
  'cordis.patch.yml',
]) {
  if (!existsSync(join(root, required))) problems.push(`missing packaged asset: ${required}`)
}

if (problems.length) {
  console.error('self-contained: FAIL')
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log('self-contained: all imports resolve within the package and from declared dependencies')
