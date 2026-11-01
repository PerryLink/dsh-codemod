<div align="center">

# ⬆️ dsh-plugin-upgrade

> **Non-official companion tool.** Part of the DSH standards family; not a certification, accreditation, security audit, or official endorsement. Standard: https://github.com/PerryLink/dsh-standards. The `dsh.standards` block is a `not-run` placeholder, not a pass.


> **Scope: three closed corridors, ending at `0.2.x`.** `legAB` = `0.1.3-alpha.1` → `0.1.5-rc.1`, `legC` = `0.1.5-rc.2` → `0.1.6-alpha.2`, `legD` = `0.1.6-alpha.2 / 0.1.7` → `0.2.x` (measured against the `0.2.2-alpha.2` checkout and the guide's `0.2.1-alpha.2` baseline). The corridor cards stop at their measured seams: `legD` scans five (`D1`–`D5`) and lists the rest of the 0.2 breakage as **advisory (not scanned)** — a clean scan is not a 0.2 compatibility certificate. For routine bundle updates, use the host plugin manager's native `updateBundle()`.

- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-plugin-upgrade` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugin-upgrade)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-upgrade?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-plugin-upgrade?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-plugin-upgrade/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-plugin-upgrade)

**Plugin upgrade skill for DeepSeek Harness — one package, one corridor index, three closed corridors: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`), `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`), and `0.1.6-alpha.2` / `0.1.7` → `0.2.x` (`legD`).**

*The scanner routes itself: it reads the target repository's declared dsh band (or takes `--span`), then applies that corridor's own evidence-bound catalog — `legAB`'s 20 seams (leg A `0.1.3-alpha.1` → `0.1.5-alpha.1` plus leg B `0.1.5-alpha.1` → `0.1.5-rc.1`), `legC`'s 5 (`E1`–`E5`), or `legD`'s 5 (`D1`–`D5`; the rest of the 0.2 breakage is listed as advisory and not scanned). One entry point, so a client half that stopped mounting silently is never mistaken for "typecheck is green".*

> **Official repository.** This is the only official repository of dsh-plugin-upgrade, maintained by PerryLink. It supersedes the retired version-locked packages `dsh-plugin-upgrade` (leg A) and `dsh-plugin-upgrade-rc1` (leg B), and it is the package the `0.1.5-rc.2` → `0.1.6-alpha.2` corridor (leg C) was folded into — the `dsh-plugin-upgrade-016` name never reached the registry. **Both `dsh-plugin-upgrade-015` and `dsh-plugin-upgrade-016` are retired as of 2026-10-05 and receive no further fixes, releases or security updates**; every plugin upgrade continues here, and the corridor is chosen by the version the target repository declares for itself, so no version-locked package per host hop is needed. Same-name repositories under other accounts are not affiliated.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-upgrade.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-upgrade/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-upgrade/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-upgrade?label=version)](https://github.com/PerryLink/dsh-plugin-upgrade/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-upgrade)](https://www.npmjs.com/package/dsh-plugin-upgrade)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-upgrade)](https://www.npmjs.com/package/dsh-plugin-upgrade)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-upgrade
```


</div>

---

**📖 Ecosystem knowledge base** — measured data, not marketing: [plugin development guide · plugin-selection data · maintenance criteria](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

```sh
dsh plugin --profile web add dsh-plugin-upgrade            # from npm
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade   # from source
dsh plugin --profile web remove dsh-plugin-upgrade         # uninstall (reversible)
```

Installing the bundle only registers a skill; removing the row removes the skill. The CLI is a normal `npx` target and needs no profile at all.

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（95 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.


## What is dsh-plugin-upgrade?

Plugin upgrade skill for DeepSeek Harness — one package, one corridor index, three closed corridors: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`), `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`), and `0.1.6-alpha.2` / `0.1.7` → `0.2.x` (`legD`).

The scanner routes itself: it reads the target repository's declared dsh band (or takes `--span`), then applies that corridor's own evidence-bound catalog — `legAB`'s 20 seams (leg A `0.1.3-alpha.1` → `0.1.5-alpha.1` plus leg B `0.1.5-alpha.1` → `0.1.5-rc.1`), `legC`'s 5 (`E1`–`E5`), or `legD`'s 5 (`D1`–`D5`). One entry point, so a client half that stopped mounting silently is never mistaken for "typecheck is green".

![Workflow diagram for dsh-plugin-upgrade: call → plugin → result.](docs/assets/dsh-plugin-upgrade-flow.svg)

*Workflow overview: call → plugin → result. The examples below use the real command surface.*



## Comparison

![Measured comparison chart for dsh-plugin-upgrade](https://raw.githubusercontent.com/PerryLink/dsh-plugin-upgrade/main/docs/assets/dsh-plugin-upgrade-evidence.png)

40 family repos swept · README §What you get (leg A, 2026-09-09)

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.2-alpha.2` (measured checkout `ce7073d512`; guide baseline `dsh-v0.2.1-alpha.2` = `d743267`). The corridor index is evidence-bound to the spans it measured: `legAB` = `0.1.3-alpha.1 → 0.1.5-rc.1` (tag `dsh-v0.1.7-alpha.2` = `183f08e9c6dd`; leg A→B handoff `dsh-v0.1.7-alpha.2` = `5dda764ed3aa`), `legC` = `0.1.5-rc.2 → 0.1.6-alpha.2` (tag `dsh-v0.1.6-alpha.2`), and `legD` = `0.1.6-alpha.2 / 0.1.7 → 0.2.x` (`0.2.2-alpha.2`). Peer band `@deepseek-ai/dsh-skill >=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0`, `@deepseek-ai/cordis ^4.0.5-alpha.1`, `@deepseek-ai/schemastery ^3.18.5-alpha.1`. |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Platforms | Anywhere Node runs; the scanner is filesystem-only and platform-neutral |
| Model | Text-only models fully supported; the skill is a Markdown body, no tool or vision requirement |
| Corridor index | One package, one entry point. `lib/route.mjs` holds the closed corridors and the CLI routes to the matching one from the target repo's declared band (`engines.dsh`, the `@deepseek-ai/dsh*` ranges); `--span legAB\|legC\|legD` overrides the guess and an undeclared band falls back to the oldest corridor. The three catalogs are never merged: each corridor keeps its own seam array, card, evidence, fixtures and parity gate. |
| Scope | **Three closed corridors**: `legAB` = `0.1.3-alpha.1` → `0.1.5-rc.1` (leg A + leg B), `legC` = `0.1.5-rc.2` → `0.1.6-alpha.2`, `legD` = `0.1.6-alpha.2 / 0.1.7` → `0.2.x` (5 scanned seams + an explicit advisory section). A corridor never widens: a hop that adds a seam is a new corridor — a new card and a new index row, not a new package. |
| Legs | Every leg lives in this package: leg A keeps the `S1`–`S10` + `M1` seams, leg B keeps `C1`, `C2`, `C4`, `C5`, `H1`–`H4`, `P1`, leg C keeps `E1`–`E5`, and leg D keeps `D1`–`D5` — each with its own evidence, card section, fixtures and rollback path. There is no sibling package to install. |
| `C3` | Retired: leg B's card spelled the stale-type-line false green `C3`, which is the same defect as leg A's `M1`. The fold is recorded on the card; `--seams C3` matches nothing. |
| Sibling | Do not mount the retired `dsh-plugin-upgrade` in the same profile: both register the agent skill `plugin-upgrade`, so the second mount collides on the skill name. That package is deprecated on npm and its repository is retired; this package replaces both of its legs. |

## What you get

Two halves, one seam catalog per corridor:

- **A bundled agent skill (`plugin-upgrade`)** — the corridor cards and a fix-and-verify loop. The body first routes the caller to the corridor that matches its peer band; the model loads it only when a task actually needs it, and the package contributes no system-prompt paragraph and no tool.
- **A zero-dependency CLI (`dsh-plugin-upgrade-scan`)** — resolves the corridor and reports `file:line` facts for that corridor's seams: `legAB`'s twenty (`S3`, `S8`, `S9`, `M1`, `S4`, `S5`, `S6`, `S7`, `S2`, `S1`, `S10`, `C1`, `C2`, `P1`, `C4`, `C5`, `H1`, `H2`, `H4`, `H3`) re-read from the harness tag ranges on 2026-09-09 (leg A) and 2026-09-10 (leg B), `legC`'s five (`E1`–`E5`) measured on `dsh-v0.1.6-alpha.2` (2026-09-19), or `legD`'s five (`D1`–`D5`) re-read on 2026-11-01 against the `0.2.2-alpha.2` checkout (`ce7073d512`) and the guide's `0.2.1-alpha.2` baseline. Exit `1` on any error-severity hit, so it drops straight into CI.

The point is the failure mode this corridor exists to kill: **this span's breakage is mostly silent, from both ends.** The type line can be stale, so the repo compiles against the **old** catalog (seam `M1`), and the bare `conversation` client slot was deleted with no alias while `ctx.slots.inject()` only runs its callback when the declaration exists — so a client half that still targets it stops mounting with no error, no log line and no failed build (seam `C1`). Three classes of breakage survive `typecheck` + `test`:

1. the local gate compiles a stale type line — old `paths` alias, or dev/test types pinned at `0.1.5-alpha.*` (seam `M1`);
2. a log writer omits the V3 required `stream` field, so the session imports and then refuses to resume (seam `S3`);
3. the tests are mocked against the old shape, so they pass while the host drops the contribution (seam `C1`).

Honest sizing: leg B's workspace sweep found that the family's client halves use only **8** slot keys, all of which survive in rc.1 — for them the rc.1 breakage is **latent, not actual**. Third-party client plugins that targeted the bare `conversation` key are the ones that break, and they break quietly. Leg A's sweep found the opposite texture: 40 repos, 11 of them hit `M1`, and fixing the stale path exposed real TypeScript errors in 3 repos that were previously "green".

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade
```

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add dsh-plugin-upgrade

# 2. verify the row mounted
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-upgrade'

# 3. scan the plugin you are upgrading
npx dsh-plugin-upgrade-scan --repo ../my-plugin
```

Then ask the agent to use the `plugin-upgrade` skill, or drive the loop yourself with the card that matches your band: `skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md` (`legAB` — leg A is §1, leg B is §2, the merged seam index is §3), `skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md` (`legC`), or `skills/plugin-upgrade/references/v0.1.6-alpha.2-to-v0.2.x.md` (`legD`). The scanner picks the corridor for you; add `--span legC`/`--span legD` when the declared band is ambiguous.

### Examples

These are the plugin's real entry points; install once, then call one.

#### Detailed example

**Command**

~~~sh
dsh-plugin-upgrade-scan --repo fixtures/leg-a-bad-repo --seams S3
~~~

**Output**

~~~text
# scan-0.1.5 · /mnt/d/Projects/dsh/plugins/dsh-plugin-upgrade/fixtures/leg-a-bad-repo
files scanned: 3 · hits: 1

## S3 [error] assistant/message 缺 stream（V3 必填） — 1 hit(s)
   action: 写入会话日志的 assistant/message 必须带 `stream: []`（或真实分片）；缺了导入成功但会话不可续聊（Session.fromRestore 抛 invalid settlement fields）。
   fixtures/leg-a-bad-repo/src/index.ts:30  type: 'assistant/message',

H3 [info] card-only: the rc.1 additive capabilities are listed on the version card and are never auto-detected.
~~~

*Observed from `README.md:159-173 (Surfaces/CLI); test/scan.test.mjs:158; fixtures/leg-a-bad-repo/src/index.ts:30`*

#### Failure branch

**Input**

~~~text
node scripts/scan-0.1.5.mjs --repo /nonexistent-upgrade-repo
~~~

**Output**

~~~text
repo not found: /nonexistent-upgrade-repo
~~~

*Observed from `plugins/dsh-plugin-upgrade/lib/scan.mjs:510-514,523; plugins/dsh-plugin-upgrade/README.md:181-192`*

#### Brief examples

- `plugin-upgrade`

## Configuration

Every key is optional and lives in the profile patch:

| Key | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Register the packaged skill. Set `false` to keep the dependency mounted but silent. |
| `skillName` | `plugin-upgrade` | Directory under `skillsRoot` to register, and the name shown in the catalog. |
| `skillsRoot` | the package's own `./skills` | Where `<skillName>/SKILL.md` lives. Point it at your own card to reuse the plumbing. |
| `userInvocable` | `true` | Whether a human can invoke the skill by name in addition to the model. |

```yaml
- insert:
    - id: dsh-plugin-upgrade
      name: dsh-plugin-upgrade
      config:
        skillName: plugin-upgrade
```

The plugin mounts loud: a missing `SKILL.md`, an empty body, or a frontmatter without `name` fails the mount instead of registering an empty skill.

## Surfaces

**Skill** — `plugin-upgrade` (model- and user-invocable by default). Body: leg routing table, the 8 hard rules and the 6-step loop. References: the merged corridor card. Scripts: the detector, shipped inside the skill directory so relative paths resolve.

**CLI** — `dsh-plugin-upgrade-scan`:

```sh
dsh-plugin-upgrade-scan [--repo <path>] [--span legAB|legC|legD|<span>] [--json <out.json>] [--seams S3,C1,D1] [--quiet]
```

| Flag | Meaning |
|---|---|
| `--repo <path>` | Repository to scan (default: cwd). Its declared dsh band chooses the corridor. |
| `--span legAB\|legC\|legD\|<span>` | Force a corridor instead of guessing from the declared band. An unknown band falls back to `legAB`. The wrapper consumes the flag before the catalog sees argv. |
| `--json <out.json>` | Also write the machine-readable report (`repo`, `scannedAt`, `files`, `hits[]`, `bySeam`). |
| `--seams S3,C1,D1` | Restrict to specific seams of the resolved corridor's catalog (ids are never shared between corridors). |
| `--quiet` | Suppress the human rendering (pair with `--json`). |

Exit codes: `0` no error-severity hit · `1` at least one error-severity hit · `2` usage or scan failure. A clean scan is necessary but not sufficient — the exit criterion is a real-host smoke, plus a resume round-trip for log writers (leg A) and a real browser assertion for the client half (leg B).

## The twenty `legAB` seams

Order follows the catalog in `lib/scan.mjs` (leg A first, then leg B), which is also the order `test/card.test.mjs` pins the card to.

| Id | Severity | What changed on the way to `0.1.5-rc.1` |
|---|---|---|
| `S3` | error | `assistant/message` gained a required `stream` field (session format V3): a log written without it imports successfully and then refuses to resume (`Session.fromRestore` throws `invalid settlement fields`). |
| `S8` | error | `SessionHandle.read()` returns `SessionHandleReadResult` (`{ eventState, events }`) instead of the event array; array operations must unwrap `.events`. |
| `S9` | error | `SystemPrompt`'s config renamed `persona` → `personaPrefix` / `personaSuffix`. Substituting `includeHarnessIdentity: false` is **not** equivalent — it deletes the harness identity block. |
| `M1` | error | The local gate compiles a stale type line: dev/test types pinned at `0.1.5-alpha.*`, or a `tsconfig` `paths` alias resolving to a missing checkout directory, makes TypeScript fall back silently to the published types. Green gate, wrong ruler. |
| `S4` | error | `tool/code-dispatch` was renamed `tool/ptc-dispatch`; the old label is no longer recognized in V3 sessions. |
| `S5` | error | `ctx.agent` was removed: the caller must pass the Agent explicitly (e.g. the second parameter of `setup(agentCtx, agent)`). |
| `S6` | error | `Inbox` is a type interface, not a constructable class; fixtures use the official unsupported shape and runtime code reads `agent.inbox`. |
| `S7` | warn | `SubprocessHandle.pid` was removed (only `SubprocessTerminalHandle.pid` remains); drop the field from test fixtures. |
| `S2` | warn | `EpochHeader.system` was removed: the system prompt is surface node 0's `system/message` now. |
| `S1` | warn | Session format V3 and generation-suffixed log names — the current generation is `session.v3.jsonl.zstd`, so scripts that hardcode `session.jsonl.zstd` fail silently. |
| `S10` | warn | Plugin-authored session events must go through the host's fail-closed adaptation gate: `Session.append` has no `ignorable` write channel, so an unconditional append can make a session unreadable. |
| `C1` | error | The bare client slot `conversation` was deleted and replaced by `main` + `main.conversation`, with **no alias**. `ctx.slots.inject()` only fires when the declaration exists, so a plugin targeting it stops mounting **silently**. |
| `C2` | error | `@deepseek-ai/dsh-client-ui-sidebar-textpreview` was renamed `…-sidebar-documentpreview`; the old name is gone with no shim package. |
| `P1` | error | The peer band must keep its second segment: `>=0.1.2-rc.1 <0.2.0` alone **rejects** `0.1.5-rc.1` under npm semver's prerelease-tuple rule (measured `false` on semver 7.8.5). |
| `C4` | warn | rc.1 added a global main-panel model (`main`, `sidebar.panellist`, `ctx.layout.selectPanel(MainPanelId \| null)`) and appended a `usePanelInfo` standard prop to almost every slot. |
| `C5` | warn | Document preview moved to the keyed slot `sidebar.right.tab.document` (`DocumentContent`); `sidebar.right.pane.tab` survives but its parent entry became `rightbar.session`. |
| `H1` | warn | `KNOWN_SESSION_EVENT_TYPES` gained `deliverables/presented` and `subagent/catalog` — the fail-closed vocabulary grew. |
| `H2` | warn | The new `present` tool's row occupies `tool.call.toolview` key `'present'`, which was free in alpha.1. |
| `H4` | info | The DeepSeek adapter's default advisory catalog now leads with `deepseek-flash` (DeepSeek-V41-Flash). |
| `H3` | info | New optional capabilities: `ctx.sessionFeedback`, `ctx.layout.beginNavigation()`, `ctx.workspaces.openSession()` / `openWorkspace()` / `forkSession()`. Listed on the card; deliberately not auto-detected. |

`S7`, `S2`, `S1`, `S10`, `C4`, `C5`, `H1`, `H2` and `H4` are deliberately advisory: they have legitimate matches (a repo that already uses the new API, a documentation snapshot, a plugin's own model-id table, a Node `ChildProcess.pid`), so the scanner reports them as leads for manual review rather than failures. `M1` and `P1` are **structured** checks — they resolve `package.json` and `tsconfig*.json` instead of matching text — and `H3` is **card-only**: documented, id-parity checked, and deliberately without a detector (`CARD_ONLY = ['H3']`).

## The five `legC` seams (`0.1.5-rc.2` → `0.1.6-alpha.2`)

Order follows the catalog in `lib/scan-0.1.6.mjs`, which is also the order `test/card.test.mjs` pins the `legC` card to. Every seam here is `error` and every one is detected (`CARD_ONLY = []`).

| Id | Severity | What changed on the way to `0.1.6-alpha.2` |
|---|---|---|
| `E1` | error | `agent/created` listeners are dispatched serially: a listener that throws — or that does slow work — blocks agent creation outright. Wrap synchronous work in `try`/`catch` and defer the rest with `queueMicrotask`/`setImmediate` or your own queue. |
| `E2` | error | An async `apply()` whose first `await` precedes its registrations: anything registered afterwards lands in the unload window and throws `INACTIVE_EFFECT`, while the old closure keeps running. Register everything before the first `await`, inside one `ctx.effect()`. |
| `E3` | error | Deleted slot/state keys: `settings.plugin.item` became the keyed→list `plugins.item`, and `SessionListState.current` is gone — a settings card disappears **silently** (`spec === undefined` early return), and `current` casts keep compiling while the feature is dead. |
| `E4` | error | Deleted client API: `sessions.open` / `openSubagent` / `clear` became `retain` / `using` / `retainInfo`. |
| `E5` | error | Deleted model literals: `deepseek-v4-flash*` and `deepseek-v4-vision-exp`. The default model catalog shrank from 4 to 2, and an uncatalogued id passes through as text-only. |

The same discipline applies as for `legAB`: a clean scan is necessary, not sufficient. `legC` breakage is silent or runtime-only (the published type line hides the deletions), so the exit criterion stays a real-host smoke on a temp `DSH_HOME`, plus the log-writer round-trip and the real-browser assertion where they apply.

## What this does not cover

- **A hop past every corridor here.** `legAB` ends at `0.1.5-rc.1` by construction (the harness hop `0.1.5-rc.1` → `0.1.5-rc.2` added no plugin-facing seam), `legC` covers `0.1.5-rc.2` → `0.1.6-alpha.2`, and `legD` covers `0.1.6-alpha.2 / 0.1.7` → `0.2.x` against the measured `0.2.2-alpha.2` checkout. A later hop that adds a seam — or a 0.2.x line past `0.2.2-alpha.2` — is **not** covered: a corridor is closed, and widening a card is worse than adding one. It gets a new card and a new index row, not a new package.
- **A 0.2 migration certificate.** `legD` scans five deletions/renames only. V4 session-log parsing, the `{kind:'plugin'}` message source, deleted composition rows, `dsh.client.inject` shape, the `stats` → `activity`/`usage` split, `mode: 'both'`, and the guide's `L1`–`L19` are real 0.2 changes listed in the card's **advisory (not scanned)** section; none of them is auto-detected.
- **The `0.1.1` → `0.1.2` hop.** Use the community convergence skill.
- **Restating across legs.** Leg A owns the session-format seams (`assistant/message.stream`, `SessionHandleReadResult`, `EpochHeader.system`, `ctx.agent`, `Inbox`, `SystemPrompt.persona`, the V3 log generation) and leg B does not restate them — the whole `packages/core/session/src` diff in leg B's range is two added event-type literals and one comment line. Each leg's card section keeps its own scope statement.
- **The DSH user-facing upgrade path.** This package upgrades *plugin source code*, not a user's harness installation.
- **Theme tokens.** `docs/web-styling.md` has zero changes in leg B's range.
- **Proof.** A clean scan is a hypothesis. The exit criterion is a real-host smoke (temp `DSH_HOME`, target CLI, `plugin add <tarball>`, `--dump-config`) plus a resume round-trip for session-log writers (leg A) and a real browser assertion for every client-side hit (leg B).

## Security boundaries

- **Read-only scan.** The CLI never writes inside the scanned repository; `--json` writes only to the path you pass.
- **No network, no shell.** The scanner imports nothing beyond Node's standard library and never spawns a process.
- **No secrets.** Nothing in the package reads credentials, environment tokens, or session data.
- **Sandboxed smoke recipe.** The card's real-host check uses a `mkdtemp` `DSH_HOME`; it never touches your real `~/.dsh`.

## Development

```sh
npm install                        # or: pnpm install (the repo ships a pnpm-lock.yaml)
npm test                           # node --test: scanner, card<->catalog parity, real Cordis + SkillRegistry
npm run verify:self-contained      # every import resolves inside the package
npm run verify:artifacts           # the packed tarball carries the skill, CLI and patch, and excludes tests
npm run check:readmes              # five-language README consistency
npm pack
```

The scanner has a synthetic fixture pair **per corridor**: `fixtures/leg-a-bad-repo` (leg A's session/config seams, every error seam present on purpose) with `fixtures/leg-a-good-repo` (adapted), `fixtures/bad-repo` (leg B's client-slot seams) with `fixtures/good-repo` (adapted), `fixtures/leg-c-bad-repo` with `fixtures/leg-c-good-repo`, and `fixtures/leg-d-bad-repo` with `fixtures/leg-d-good-repo` — plus a live negative on a family repository already pinned to `0.1.5-rc.1`, so a regression in a catalog fails the suite rather than a downstream user. `test/card.test.mjs` asserts that each card's index and its own catalog (`lib/scan.mjs` for `legAB`, `lib/scan-0.1.6.mjs` for `legC`, `lib/scan-0.2.mjs` for `legD`) name **exactly** the same seam ids with the same severities, that `legAB`'s `CARD_ONLY` is exactly `['H3']` while `legC`'s and `legD`'s are empty, and that the three catalogs share no seam id — the evidence-binding rule as a machine gate, per corridor.

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `plugin-upgrade`, `migration`, `skill`, `version-card`, `scanner`, `client-slots` (mirror `package.json` keywords; `dsh-plugin` is the ecosystem's visibility channel).

## PerryLink DSH Plugin Family

This project is part of the DeepSeek Harness plugin family from [PerryLink](https://github.com/PerryLink). The roster stays collapsed below so every README keeps a short first screen; expand it to see every row and its status.

<details>
<summary>Expand all plugins</summary>

| Plugin | Status |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 FROZEN — see the repo README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 FROZEN — see the repo README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 FROZEN — see the repo README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 FROZEN — see the repo README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 FROZEN — see the repo README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRED — see the repo README |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRED — see the repo README |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRED — see the repo README |

</details>

## License

Apache-2.0 — see [LICENSE](LICENSE). Install-time dependencies and their licenses are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); nothing is bundled.
