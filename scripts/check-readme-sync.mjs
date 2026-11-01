// SPDX-License-Identifier: Apache-2.0
// Five-language README sync gate: every README must carry the same number of
// `## ` sections as the English source and state the install command.
// Usage: node scripts/check-readme-sync.mjs
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FILES = ['README.md', 'README-zh.md', 'README-es.md', 'README-pt.md', 'README-hi.md']
const INSTALL_COMMAND = 'dsh plugin --profile web add dsh-codemod'
const failures = []
/** @param {string} file @returns {string} */
const read = (file) => {
  const p = join(root, file)
  if (!existsSync(p)) { failures.push(`${file} is missing`); return '' }
  return readFileSync(p, 'utf8')
}
/** @param {string} text @returns {number} */
const sectionCount = text => (text.match(/^## /gmu) ?? []).length

const contents = FILES.map(read)
const expected = sectionCount(contents[0])
for (let i = 1; i < FILES.length; i++) {
  if (contents[i] === '') continue
  const count = sectionCount(contents[i])
  if (count !== expected) failures.push(`${FILES[i]}: ${count} '## ' sections, expected ${expected}`)
  if (!contents[i].includes(INSTALL_COMMAND)) failures.push(`${FILES[i]}: missing the install command`)
}
if (!contents[0].includes(INSTALL_COMMAND)) failures.push('README.md: missing the install command')
if (failures.length) {
  console.error('readme-sync: FAIL')
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log(`readme-sync: all ${FILES.length} READMEs share ${expected} sections and the install command`)
