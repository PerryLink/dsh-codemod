// SPDX-License-Identifier: Apache-2.0
/**
 * Public type surface for dsh-plugin-upgrade.
 * @module dsh-plugin-upgrade
 */

/** Plugin configuration (Schemastery-backed; every field is a deployment choice). */
export interface Config {
  /** Register the packaged skill (default true). */
  enabled?: boolean
  /** Skill name published to the model catalog (default 'plugin-upgrade'). */
  skillName?: string
  /** Skill root inside the package; must contain `<skillName>/SKILL.md`. */
  skillsRoot?: string
  /** Mark the skill user-invocable in addition to model-invocable (default true). */
  userInvocable?: boolean
}

/**
 * The seam-id union of the three closed corridors: leg A `S1`–`S10` + `M1`,
 * leg B `C1`, `C2`, `C4`, `C5`, `H1`–`H4`, `P1`, leg C `E1`–`E5`, and leg D
 * `D1`–`D5`. Leg B's former `C3` is leg A's `M1` and is **not** a member: the
 * scanner, `--seams` and the card index all reject it.
 */
export type SeamId =
  | 'S3' | 'S8' | 'S9' | 'M1' | 'S4' | 'S5' | 'S6' | 'S7' | 'S2' | 'S1' | 'S10'
  | 'C1' | 'C2' | 'P1' | 'C4' | 'C5' | 'H1' | 'H2' | 'H4' | 'H3'
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5'

/** One seam hit produced by the scanner. */
export interface SeamHit {
  /** Seam id of the resolved corridor (`S*`/`M1`/`C*`/`P1`/`H*` for legAB, `E1`–`E5` for legC, `D1`–`D5` for legD). */
  seam: SeamId
  /** 'error' fails the scan; 'warn' and 'info' are manual-review leads. */
  severity: 'error' | 'warn' | 'info'
  /** Absolute path of the file carrying the hit. */
  file: string
  /** 1-based line number. */
  line: number
  /** Trimmed source line (truncated to 200 characters). */
  snippet: string
  /** Human-readable explanation, including the suggested action. */
  detail: string
}

/** Scanner report for one repository. */
export interface ScanReport {
  repo: string
  scannedAt: string
  files: number
  hits: SeamHit[]
  bySeam: Record<string, number>
}

/**
 * One entry of a corridor's seam catalog, shared by its card, the CLI and the
 * plugin. `test` is null for a card-only seam (`H3`) and for the structured
 * seams (`M1`, `P1`, `D1`), which run dedicated file-level detectors instead of
 * a regex.
 */
export interface Seam {
  id: SeamId
  title: string
  severity: 'error' | 'warn' | 'info'
  action: string
  test: RegExp | null
}

/** Scan a repository directory for the merged 0.1.3-alpha.1 -> 0.1.5-rc.1 seams (`legAB`). */
export declare function scanRepo(repoDir: string, options?: { seams?: string[] }): ScanReport

/** Render a report for a terminal. */
export declare function render(report: ScanReport): string

/** CLI entry point; returns the process exit code. */
export declare function main(argv: string[]): number

/** The seam catalog. The version card must name exactly these ids. */
export declare const SEAMS: Seam[]

/** Seam ids in card order; `test/card.test.mjs` pins the card to this list. */
export declare const SEAM_IDS: SeamId[]

/** Seams documented on the card with no automatic detection (`H3`). */
export declare const CARD_ONLY: SeamId[]

/** Split a SKILL.md frontmatter block into its routing fields and body. */
export declare function splitFrontmatter(text: string): { description?: string, whenToUse?: string, body: string }

/** Read and validate a packaged skill bundle (fails loud). */
export declare function readSkillBundle(skillsRoot: string, skillName: string): {
  frontmatterName: string
  description?: string
  whenToUse?: string
  body: string
  skillDir: string
}

export declare const name: string
export declare const inject: string[]
export declare const Config: unknown
export declare function apply(ctx: unknown, config?: Config): void
