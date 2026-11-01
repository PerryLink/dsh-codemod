# AGENTS.md

Standalone DeepSeek Harness plugin repository (`dsh-plugin-upgrade`). Development
follows the dsh-plugin-guide skill and the official plugin contract; this file records
repo-local decisions. Read `README.md` (external contract) and **both** packaged corridor
cards (`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md` and
`skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md`) before changing behavior.

## One package, one corridor index (a corridor still never widens)

- **A corridor never widens.** A corridor is one *closed, measured* span with its own card,
  catalog, evidence, fixtures and rollback path. Never stretch a card to "all versions":
  a drifting card is worse than no card.
- **A new corridor adds a card and an index row, not a package.** Owner decision
  (2026-09-19), recorded in `lib/route.mjs`: this package carries the corridor **index**.
  `resolveCorridor()` reads the target repository's declared band (`engines.dsh`, the
  `@deepseek-ai/dsh*` ranges) and routes to the matching corridor; `--span legAB|legC|legD`
  overrides the guess, and an undeclared band falls back to the older corridor.
  - **`legAB`** — `0.1.3-alpha.1 → 0.1.5-rc.1`, carried as leg A (`0.1.3-alpha.1 →
    0.1.5-alpha.1`) and leg B (`0.1.5-alpha.1 → 0.1.5-rc.1`): 20 seams, catalog
    `lib/scan.mjs`, card `…/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md` (§1 leg A, §2 leg B,
    §3 the 20-seam index), evidence `docs/EVIDENCE.md` §A + §1–§10.
  - **`legC`** — `0.1.5-rc.2 → 0.1.6-alpha.2`: 5 seams (`E1`–`E5`, all `error`), catalog
    `lib/scan-0.1.6.mjs`, card `…/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md`, evidence
    `docs/EVIDENCE.md` §11. The retired `dsh-plugin-upgrade-016` name never reached the
    registry; this corridor is folded in here.
  - **`legD`** — `0.1.6-alpha.2 / 0.1.7 → 0.2.x`: 5 scanned seams (`D1`–`D5`, all
    `error`), catalog `lib/scan-0.2.mjs`, card
    `…/references/v0.1.6-alpha.2-to-v0.2.x.md`, evidence `docs/EVIDENCE.md` §12. The
    card's **advisory (not scanned)** section owns the 0.2 seams the catalog deliberately
    does not detect (V4 session logs, `{kind:'plugin'}` sources, composition rows,
    `dsh.client.inject` shape, `stats` → `activity`/`usage`, `mode: 'both'`, `L1`–`L19`);
    those are not `CARD_ONLY` seams and must never be added to `SEAMS` without a fixture.
- **The seam arrays are never merged.** Three corridors mean three catalogs, three cards and
  three parity gates, so every card claim stays traceable to its own measurement. What the
  corridors *do* share is the entry point: one skill id (`plugin-upgrade`), one CLI
  (`dsh-plugin-upgrade-scan`), one report shape.
- **This supersedes the family's earlier rule.** The retired `dsh-plugin-upgrade`,
  `dsh-plugin-upgrade-rc1` and `dsh-plugin-upgrade-016` each carried a "**The corridor is
  locked** … a new corridor is a new package" section plus "**zero code dependency on the
  sibling corridor**: no `import`, no vendoring, no shared `SEAMS`". The owner deliberately
  superseded that pair: one package now carries the index, and each corridor keeps its own
  `SEAMS` while the *plumbing* (router, entry point, report shape) is shared. What survives
  unchanged is the numbering discipline — a corridor is *closed*, not open-ended — and the
  per-leg ownership below.

Consequences accepted by this repository:

- The `legAB` catalog (20 seams: `S3`, `S8`, `S9`, `M1`, `S4`, `S5`, `S6`, `S7`, `S2`, `S1`,
  `S10`, `C1`, `C2`, `P1`, `C4`, `C5`, `H1`, `H2`, `H4`, `H3`) is evidence-bound to the two
  tag ranges it was measured on — leg A `dsh-v0.1.5-alpha.1` (2026-09-09 wave over 40 plugin
  repos) and leg B `dsh-v0.1.5-alpha.1..dsh-v0.1.5-rc.1` (2026-09-10). The harness hop
  `0.1.5-rc.1 → 0.1.5-rc.2` added no plugin-facing seam, which is why that span ends at rc.1
  while the dev/test pin runs on the `0.1.7-rc.2` line and the compat probe matrix covers
  the measured entry line `0.1.6-alpha.2` (pre-0.1.6 lines are outside this package; the peer band no longer promises activation there; historical names: `0.1.2-rc.1`, `0.1.5-rc.2`,
  `0.1.7-alpha.2`, `0.1.7-rc.2`). The `legC` catalog (`E1`–`E5`)
  is evidence-bound to `dsh-v0.1.6-alpha.2` (2026-09-19, §11).
- **Leg A owns the session-format seams** (`assistant/message.stream`, `S3`;
  `SessionHandleReadResult`, `S8`; `EpochHeader.system`, `S2`; `ctx.agent`, `S5`; `Inbox`,
  `S6`; `SystemPrompt.persona`, `S9`; the V3 log generation, `S1`) and **leg B does not
  restate them** — measured: the whole `packages/core/session/src` diff inside leg B's range
  is two added event-type literals and one comment line. Each leg's card section keeps its own
  scope statement; restating across legs is drift.
- **`C3` is retired.** Leg B's card spelled the stale-type-line false green `C3`; it is the
  same defect as leg A's `M1` and is folded into it, so `M1` carries both causes (an
  unresolvable `tsconfig` `paths` alias and dev/test types pinned at `0.1.5-alpha.*`). The
  card records the old spelling in the fold notes, but `C3` is not a seam id: `--seams C3`
  matches nothing and `types.d.ts` does not accept it.
- The peer band is **unchanged** by both legs. `>=0.1.2-rc.1 <0.2.0` alone rejects
  `0.1.5-rc.1` under npm semver's prerelease-tuple rule (measured `false` on semver 7.8.5);
  the `|| >=0.1.5-alpha.1 <0.2.0` segment is what admits it. `P1` forbids dropping it, and
  this package's own `peerDependencies` keeps all four segments
  (`>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`),
  each newly published prerelease tuple having gained its own clause under the same rule.
- The `C1` ruling (the bare `conversation` slot removal is a **public extension-point
  break**, kept at `error`, with a rewrite recipe and a real-browser exit criterion) is
  recorded in card §2 §3.3. Do not downgrade it to an advisory without new upstream
  evidence (an alias, a shim, or an official migration note).

## Layout (JS form, pure host, no browser half)

```
index.mjs             single host face: Config schema + skill bundle reader + apply()
types.d.ts            Config, SeamId, SeamHit, ScanReport and the public function surface
lib/route.mjs         the corridor index: CORRIDORS, declaredBand(), resolveCorridor(),
                      --span/--repo parsing, loadCatalog(), CORRIDOR_CEILING
lib/scan.mjs          zero-dependency `legAB` seam catalog (legs A+B) + scanner + CLI main()
lib/scan-0.1.6.mjs    zero-dependency `legC` seam catalog (E1–E5) + scanner + CLI main()
lib/scan-0.2.mjs      zero-dependency `legD` seam catalog (D1–D5) + scanner + CLI main()
scripts/scan-0.1.5.mjs   thin bin wrapper (npx dsh-plugin-upgrade-scan): resolves the
                         corridor through lib/route.mjs and hands the same argv (minus
                         --span) to that corridor's catalog main(). The filename is
                         historical; the wrapper routes all three corridors
skills/plugin-upgrade/scripts/scan-0.1.5.mjs  the same wrapper inside the skill
                      directory, so the skill body's `./scripts/...` resolves against its
                      resourceBase
scripts/sweep-all.mjs    maintainer tool: sweep a workspace of plugin repos into a table
scripts/changelog-section.mjs  print one CHANGELOG section for GitHub Release notes
scripts/verify-self-contained.mjs  every import resolves inside the package
scripts/verify-artifacts.mjs       pack + inspect the published tarball (also asserts that
                                   test/, fixtures/ and .github/ do NOT ship, and that a
                                   leg-A seam fails the packaged CLI)
scripts/check-readme-sync.mjs      five-language README consistency
skills/plugin-upgrade/SKILL.md  the bundled skill body (frontmatter name is the skill id;
                                    it routes the caller to the corridor matching its peer band)
skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md  the `legAB` card:
                                    §1 Leg A, §2 Leg B, §3 the 20-seam index
skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md  the `legC` card:
skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md  the `legD` card:
                                    the 5-seam `E1`–`E5` index and the fix/verify recipes
test/scan.test.mjs    synthetic bad/good fixtures for BOTH legs + --seams + a live negative
test/plugin.test.mjs  real Cordis Context + real SkillRegistry: register, dispose, negatives
test/card.test.mjs    the card↔catalog id/severity parity gate for ALL THREE corridors
fixtures/             scanner fixtures — never published:
                        bad-repo / good-repo            leg B (client-slot oriented)
                        leg-a-bad-repo / leg-a-good-repo  leg A (TypeScript/session oriented)
docs/EVIDENCE.md      the command→output record every card claim traces to
                      (§A = leg A's provenance, §1–§10 = leg B's records, §11 = leg C's)
cordis.patch.yml      bundle declaration (insert dsh-plugin-upgrade); every
                      Config key inline
pnpm-workspace.yaml   nearest-workspace root (isolates this repo from a surrounding harness checkout)
package.json          npm metadata; files whitelist = published content
.github/workflows/    CI (3 OS × 2 Node), monthly compat probe, v* npm release + GitHub
                      Release, plugin-doctor static R/K gate, OpenSSF Scorecard
README.md             English primary (GitHub default page; source of truth)
README-{zh,es,pt,hi}.md  translations, top switcher, updated in the same commit
CHANGELOG.md          Keep a Changelog, [Unreleased] at the top
SECURITY.md           private vulnerability reporting + scope
THIRD_PARTY_NOTICES.md  install-time dependencies (none bundled)
LICENSE               Apache-2.0
```

## Hard rules applied here

- **`C1` is an error, never a warning.** The deletion has no alias and the injection callback
  never runs, so the only honest level is error. Only promote `C4`/`C5`/`H1`/`H2`/`H4` from
  advisory to error with evidence and a fixture that proves the false positive is gone.
- **`M1` and `P1` are blockers, never warnings.** If the local type line is stale (either
  cause), or the peer band lost its second segment, every other local signal is fake. `M1`
  and `P1` are **structured** checks, so their catalog `test` is `null` without being
  card-only.
- **The leg-A error seams stay errors.** `S3`, `S8`, `S9`, `S4`, `S5` and `S6` each make a
  repo that looks green fail on the target host; only demote one with new upstream evidence.
- **Advisory seams stay advisory.** `S7`/`S2`/`S1`/`S10` and `C4`/`C5`/`H1`/`H2`/`H4` have
  legitimate matches; they are leads for manual review. Only promote one to `error` with
  evidence and a fixture that proves the false positive is gone.
- **`H3` is card-only.** It is documented, id-parity checked, and deliberately has no
  detector; `CARD_ONLY` is exactly `['H3']` and the test suite asserts it stays that way.
- **The scanner is read-only and dependency-free.** No network, no child process, no write
  inside `--repo`; `lib/scan.mjs` imports only `node:fs` and `node:path`. Keep it that way.
- **A clean scan is necessary, not sufficient.** Never describe a scan as proof of
  adaptation: this span's breakage is silent from both ends, so a session-log writer needs a
  resume round-trip (`S3`), a client half needs a real browser assertion, and the card's exit
  criterion is a real-host smoke on a temp `DSH_HOME`.
- **The card and the catalog are one catalog — per corridor.** `test/card.test.mjs` fails when
  a card's index and that corridor's catalog disagree on ids or severities, when a card mints
  an id outside its own catalog, and when `legC`'s or `legD`'s `CARD_ONLY` is not empty. The three corridors'
  catalogs are never merged. Change the card first, then the catalog, in the same commit.
- **Mount loud.** A missing `SKILL.md`, an empty body, or a frontmatter without `name` must
  abort the mount. Never register a placeholder skill.
- **The skill id is the frontmatter name.** `skillName` selects the directory; the registered
  name comes from the file. Keep the four in sync (`plugin-upgrade`: directory,
  frontmatter `name`, `package.json` Config default, `cordis.patch.yml`).
- **Registration is an effect.** `ctx.skills.register()` runs inside `ctx.effect()` so the
  disposer removes the contribution on unload; the test asserts that.
- **No build step.** Pure ESM: `index.mjs` + `lib/` are the shipped artifacts. There is no
  `build`/`prepare` script — keep it that way.
- **Optional seams fail closed.** `skills` is a hard `inject`; if the service is absent the
  plugin waits rather than registering into a void.
- **License headers.** `// SPDX-License-Identifier: Apache-2.0` is the first line of every
  source file; `# SPDX-License-Identifier: Apache-2.0` heads `cordis.patch.yml`.

## Checks

```sh
npm install                        # or: pnpm install (pnpm-lock.yaml is committed)
npm test                           # node --test: scanner (both legs) + card parity + real-registry mount
npm run check                      # tsc -p tsconfig.check.json: the checked-JS shipping surface (index.mjs, lib/**, scripts/**)
npm run typecheck:ci               # tsc -p tsconfig.check.ci.json: same program, published host types (empty paths)
npm run typecheck:checkout         # tsc -p tsconfig.checkout.json: shipping surface + checkout/host-surface.mts, against the local harness checkout's built types
npm run verify:self-contained      # every import resolves inside the package
npm run verify:artifacts           # tarball contents + entry import + dev-only content excluded
npm run check:readmes              # five-language README consistency
npm pack                           # the published tarball
```

`pnpm-workspace.yaml` keeps `minimumReleaseAge: 0`: pnpm 11 enables a 1440-minute age gate by
default and its frozen-install lockfile verification ignores `minimumReleaseAgeExclude`, so
the freshly published `@deepseek-ai` pins would otherwise keep a fresh install red for 24h
after every harness release.

## Release

Version is currently `2.0.2` (`2.0.0` was the package that returned as the corridor index;
`2.0.1` re-published the corrected npm description). The retired packages' histories live in
`CHANGELOG.md` under `[Unreleased]` and below. For a new version: bump
`package.json#version`, stamp the CHANGELOG `[Unreleased]` section into `## [<x.y.z>] - <UTC
date>`, re-run the full gate, commit `chore(release): <x.y.z>`, and `git tag -a v<x.y.z>`.
`git push origin main --follow-tags` triggers `.github/workflows/release.yml`, which re-runs
the gate, publishes to npm with provenance (skipped without the `NPM_TOKEN` secret) and
creates the GitHub Release from the stamped CHANGELOG section behind an idempotent
`gh release view` guard. Never push a tag for a version already on the registry.
**Publish incident (2026-09-10, the first tag of the retired `dsh-plugin-upgrade-rc1`).**
`v0.1.0`'s first run failed in `Publish to npm` with `*** is not a legal HTTP header value`,
after the provenance statement had already been signed and published to the transparency log.
The step read the token through setup-node's `${NODE_AUTH_TOKEN}` expansion at the time; it
now normalises line breaks and writes `//registry.npmjs.org/:_authToken=…` into
`NPM_CONFIG_USERCONFIG` itself. The rewritten step reports whether the secret carried line
breaks, and it reported **no** — so the trailing-newline hypothesis is disproven and the
mechanism of the env-expanded failure is NOT established. What is established: that path
failed, the directly written userconfig publishes. `v0.1.0` was re-tagged onto the fix
(allowed: the version was not on the registry yet). The rewritten step is inherited by this
package unchanged; do not reintroduce `${NODE_AUTH_TOKEN}` without re-testing it.

The scanner catalog is evidence-bound: a version bump that changes a seam must update the
card, `docs/EVIDENCE.md`, the fixtures **of the leg it belongs to** and `CHANGELOG.md` in the
same commit.

**Post-publish integration (not done in this repository's history yet).** The README badge
row expects `PerryLink/dsh-plugin-doctor` to carry a
`PerryLink__dsh-plugin-upgrade.svg` badge, and the family also enrols each package
in the Gitee mirror, the `dsh-catalog` directory and the omdsh workshop list. Those are
release-side steps performed from the family workspace after the first tag. The three
retired package names (`dsh-plugin-upgrade` leg A, `dsh-plugin-upgrade-rc1` leg B, and the
never-published `dsh-plugin-upgrade-016` corridor) stay on the registry or in history only
(unpublished content is not removed by publishing a new name); their README/card wording is
now historical.

## Docs

- Five-language READMEs (`README.md` is the source; `README-zh.md`, `README-es.md`,
  `README-pt.md`, `README-hi.md` follow). Every behavior change updates all five in the same
  commit; `check:readmes` enforces the shared section count and the install line in CI.
- GitHub topics `dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`,
  `plugin-upgrade`, `migration`, `skill`, `version-card`, `scanner`, `client-slots` (mirror
  `package.json` keywords; the ecosystem's visibility channel is the `dsh-plugin` topic).
- License is Apache-2.0 (`LICENSE` + the package.json `license` field).
  `THIRD_PARTY_NOTICES.md` documents install-time dependencies; nothing is bundled.
- Every factual claim in a card or the scanner traces to a command recorded in
  `docs/EVIDENCE.md` — §A for leg A's provenance (via the retired `dsh-plugin-upgrade` card,
  now merged in as Leg A), §1–§10 for leg B's records, and §11 for leg C's. Where a claim
  could not be verified it is marked **unverified** and kept out of the card.
