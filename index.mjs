// SPDX-License-Identifier: Apache-2.0
// dsh-plugin-upgrade bundle entry point.
//
// Publishes the corridor index as an on-demand agent skill named
// `plugin-upgrade`: `legAB` (`0.1.3-alpha.1 -> 0.1.5-rc.1`, carried as two
// closed legs), `legC` (`0.1.5-rc.2 -> 0.1.6-alpha.2`) and `legD`
// (`0.1.6-alpha.2 / 0.1.7 -> 0.2.x`). The skill body is this package's
// `skills/plugin-upgrade/SKILL.md`, and its relative references
// (`./references/...`) and scripts (`./scripts/...`) resolve against the
// packaged skills directory through the directory resourceBase, so the agent
// loads the matching corridor card and the scanner only when a task needs them.
//
// The package imports nothing from the harness beyond the injected `skills`
// service, so the cordis peer stays metadata-only.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Schema from '@deepseek-ai/schemastery'

export const name = 'dsh-plugin-upgrade'
export const inject = ['skills']

/** Package root, used as the resourceBase for relative skill references. */
const packageRoot = dirname(fileURLToPath(import.meta.url))

/**
 * Plugin configuration (Schemastery). Every knob is a deployment choice and is
 * documented in cordis.patch.yml; there are no hardcoded tunables.
 */
export const Config = Schema.object({
  /** Register the packaged skill (default true). */
  enabled: Schema.boolean().default(true),
  /** Skill name published to the model catalog. Defaults to the packaged corridor name. */
  skillName: Schema.string().default('plugin-upgrade'),
  /** Skill root inside the package; must contain `<skillName>/SKILL.md`. */
  skillsRoot: Schema.string().default(join(packageRoot, 'skills')),
  /** Mark the skill user-invocable in addition to model-invocable (default true). */
  userInvocable: Schema.boolean().default(true),
})

/**
 * Strip the YAML frontmatter block from SKILL.md and return its routing fields
 * and body. Line endings are normalized first: a Windows checkout with
 * `core.autocrlf=true` hands us CRLF, and the frontmatter delimiters are `\n`.
 * A missing block falls back to the full text as the body.
 * @param {string} text - raw SKILL.md content.
 * @returns {{ description: string | undefined, whenToUse: string | undefined, body: string }} the parsed description/whenToUse (when present) and the instruction body.
 */
export function splitFrontmatter(text) {
  const source = text.replace(/\r\n/g, '\n')
  if (!source.startsWith('---\n')) return { description: undefined, whenToUse: undefined, body: source }
  const end = source.indexOf('\n---', 4)
  if (end < 0) return { description: undefined, whenToUse: undefined, body: source }
  const meta = source.slice(4, end)
  const body = source.slice(end + 4).replace(/^\n+/, '')
  /** @param {string} key @returns {string | undefined} */
  const scalar = (key) => new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(meta)?.[1]?.trim().replace(/^["']|["']$/g, '')
  return { description: scalar('description'), whenToUse: scalar('whenToUse'), body }
}

/**
 * Read and validate the packaged skill bundle. Fails loud: a missing SKILL.md,
 * an empty body, or a missing frontmatter `name` aborts the mount instead of
 * registering an empty skill.
 * @param {string} skillsRoot - root directory holding `<skillName>/SKILL.md`.
 * @param {string} skillName - expected skill directory name.
 * @returns {{ frontmatterName: string, description: string | undefined, whenToUse: string | undefined, body: string, skillDir: string }} the frontmatter name, routing fields, body, and the skill directory.
 */
export function readSkillBundle(skillsRoot, skillName) {
  const skillPath = join(skillsRoot, skillName, 'SKILL.md')
  let raw
  try {
    raw = readFileSync(skillPath, 'utf8')
  } catch (error) {
    throw new Error(`dsh-plugin-upgrade: cannot read skill bundle at ${skillPath}: ${error instanceof Error ? error.message : String(error)}`)
  }
  const text = raw.replace(/\r\n/g, '\n')
  const { description, whenToUse, body } = splitFrontmatter(text)
  if (body.trim() === '') throw new Error(`dsh-plugin-upgrade: skill body is empty at ${skillPath}`)
  const frontmatterName = /^name:\s*(\S+)\s*$/m.exec(text.slice(0, text.indexOf('\n---', 4) + 1))?.[1]
  if (frontmatterName === undefined) throw new Error(`dsh-plugin-upgrade: skill frontmatter is missing a name at ${skillPath}`)
  return { frontmatterName, description, whenToUse, body, skillDir: join(skillsRoot, skillName) }
}

/**
 * Register the packaged skill. Registration is an effect: the disposer returned
 * by `ctx.skills.register()` removes the contribution on unload.
 * @param {{ effect: (factory: () => unknown) => unknown, skills: { register: (registration: Record<string, unknown>) => unknown } }} ctx - Cordis context with the injected `skills` service.
 * @param {{ enabled?: boolean, skillName?: string, skillsRoot?: string, userInvocable?: boolean }} [config] - validated plugin configuration.
 */
export function apply(ctx, config = {}) {
  const resolved = {
    enabled: config.enabled ?? true,
    skillName: config.skillName ?? 'plugin-upgrade',
    skillsRoot: config.skillsRoot ?? join(packageRoot, 'skills'),
    userInvocable: config.userInvocable ?? true,
  }
  if (!resolved.enabled) return
  const { frontmatterName, description, whenToUse, body, skillDir } = readSkillBundle(resolved.skillsRoot, resolved.skillName)
  ctx.effect(() =>
    ctx.skills.register({
      name: frontmatterName,
      source: 'bundled',
      description: description ?? 'DSH plugin upgrade · 0.1.3-alpha.1 -> 0.1.5-rc.1 (merged corridor): seam scanner and corridor card.',
      ...whenToUse !== undefined ? { whenToUse } : {},
      content: body,
      // The base is the skill's own directory, so `./references/...` and
      // `./scripts/...` in the body resolve inside the published tarball.
      resourceBase: { kind: 'directory', path: skillDir },
      invocation: { modelInvocable: true, userInvocable: resolved.userInvocable },
    }),
  )
}
