# Evidence · `dsh-plugin-upgrade` (merged `0.1.3-alpha.1` → `0.1.5-rc.1`)

Every upstream claim in the merged version card
(`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md`) and every
`action` string in `lib/scan.mjs` traces to a command recorded here, re-run on
**2026-09-09** (leg A's wave) and **2026-09-10** (leg B's tag-range diff) against the read-only
harness checkout at `D:\deepseek-harness`, the leg-A checkout at `19d2e38480`, and the
read-only family workspace at `D:\Projects\dsh\plugins`.

This file holds the records of both legs of the merged span:

- **§1–§10 below are leg B's records** (`0.1.5-alpha.1 → 0.1.5-rc.1`), kept verbatim from the
  retired `dsh-plugin-upgrade-rc1`, against the merged card's **§2 Leg B**;
- **§A at the end is leg A's provenance pointer** (`0.1.3-alpha.1 → 0.1.5-alpha.1`), against
  the merged card's **§1 Leg A**.

Toolchain used: `node v22.22.3`, `npm 11.16.0`, `pnpm 11.21.0` (Windows).

Nothing in this file is copied from another project's documentation; each block is the
observed output of the command above it. Where a claim could not be verified it is marked
**unverified** and is not used by the card.

## 1. Anchors and range size

```console
$ git -C D:\deepseek-harness tag -l "dsh-v0.1.5*"
dsh-v0.1.5-alpha.1
dsh-v0.1.5-alpha.2
dsh-v0.1.5-rc.1

$ git -C D:\deepseek-harness rev-list -n1 dsh-v0.1.5-alpha.1
5dda764ed3aa172535a7967b06ff95d9cbfe536a
$ git -C D:\deepseek-harness rev-list -n1 dsh-v0.1.5-rc.1
183f08e9c6dde7e36cd2318eaee70b0da08fb35e

$ git -C D:\deepseek-harness log --oneline dsh-v0.1.5-alpha.1..dsh-v0.1.5-rc.1 | wc -l
279
$ git -C D:\deepseek-harness log --oneline dsh-v0.1.5-alpha.2..dsh-v0.1.5-rc.1 | wc -l
17

$ git -C D:\deepseek-harness diff --shortstat dsh-v0.1.5-alpha.1..dsh-v0.1.5-rc.1
 1506 files changed, 31725 insertions(+), 11448 deletions(-)

$ git -C D:\deepseek-harness show dsh-v0.1.5-alpha.1:package.json   # .version
0.1.5-alpha.1
$ git -C D:\deepseek-harness show dsh-v0.1.5-rc.1:package.json      # .version
0.1.5-rc.1
```

## 2. Client slot catalog: 57 → 61 keys, `conversation` deleted

`packages/extensions/cordis-client-runner/src/client/slot-catalog.ts` is the public catalog a
plugin author reads through Inspect `Slots.listSubTree`. Extracting every `key: '<name>'`
and diffing the two tags:

```console
alpha1 count: 57  rc1 count: 61
--- removed ---
conversation
--- added ---
main, main.conversation, rightbar.session, sidebar.panellist, sidebar.right.tab.document
```

Implementation side, same file path at both tags
(`packages/client/ui-conversation/src/client/apply.ts`):

```console
$ dsh-v0.1.5-alpha.1:.../apply.ts:217     name: 'conversation',
$ dsh-v0.1.5-rc.1:.../apply.ts:220        name: 'main.conversation',
$ dsh-v0.1.5-rc.1:.../apply.ts:388        slots.inject('main', function* () {
$ dsh-v0.1.5-rc.1:.../apply.ts:390          name: 'main',
$ dsh-v0.1.5-rc.1:.../apply.ts:391          key: 'conversation',
$ dsh-v0.1.5-rc.1:.../apply.ts:392          children: { 'main.conversation': { kind: 'single', scope: 'session-maybe' } },
```

No alias survives:

```console
$ git -C D:\deepseek-harness grep -n "name: 'conversation'" dsh-v0.1.5-rc.1 -- packages
dsh-v0.1.5-rc.1:packages/client/ui-agent-preset/tests/apply.client.spec.ts:135:    name: 'conversation',
```

That single hit is a test fixture, not an implementation. The public contract that makes the
removal silent is quoted verbatim from the same tag's
`packages/extensions/cordis-client-runner/src/client/api-catalog.ts` (`SERVICE_API`, key
`slots`):

> `inject(key: keyof SlotMap & string, callback: () => SlotInjectionEffect): () => void`
> "Install an effect for each declaration lifetime of a slot. The callback runs synchronously
> when the declaration already exists; otherwise it runs inside the declaring `register()`
> call after the declaration is committed."

Upstream ships **no** deprecation or migration note for the removal: the only
`docs/capability-seams.md` change in the range is one added service row (§4 below), and no
document names `conversation`.

## 3. Package rename

```console
$ git show dsh-v0.1.5-alpha.1:packages/client/ui-sidebar-textpreview/package.json      # .name
@deepseek-ai/dsh-client-ui-sidebar-textpreview
$ git show dsh-v0.1.5-rc.1:packages/client/ui-sidebar-documentpreview/package.json     # .name
@deepseek-ai/dsh-client-ui-sidebar-documentpreview

$ git ls-tree -d --name-only dsh-v0.1.5-alpha.1 packages/client/ | Select-String sidebar
packages/client/ui-sidebar-files
packages/client/ui-sidebar-right
packages/client/ui-sidebar-textpreview
packages/client/ui-sidebar
$ git ls-tree -d --name-only dsh-v0.1.5-rc.1 packages/client/ | Select-String sidebar
packages/client/ui-sidebar-documentpreview
packages/client/ui-sidebar-files
packages/client/ui-sidebar-right
packages/client/ui-sidebar
```

The old directory and package name are gone in rc.1 with no shim package.

## 4. Host-side additions

```console
$ git diff dsh-v0.1.5-alpha.1..dsh-v0.1.5-rc.1 -- packages/core/session/src
 known-event-types.ts | +  'deliverables/presented',
 known-event-types.ts | +  'subagent/catalog',
 types.ts             | -  ... In v2 the ...   +  ... The ...

$ git ls-tree -d --name-only dsh-v0.1.5-rc.1 packages/fs/
...,packages/fs/tool-present,...        # absent from the alpha.1 listing
$ git show dsh-v0.1.5-rc.1:packages/fs/tool-present/src/index.ts   # line 39
    name: 'present',

$ git show dsh-v0.1.5-rc.1:packages/client/ui-deliverables/src/client/index.ts   # line 62
    { name: 'tool.call.toolview', key: 'present', locale: NS }, PresentRow,

# conversation.chat.node's already-taken keyDomain, both tags
alpha.1: ... already taken: ask_user_question, bash, ..., grep, read, read_image, ...
rc.1:    ... already taken: ask_user_question, bash, ..., grep, present, read, read_image, ...

$ git diff <range> -- docs/capability-seams.md
+  pkg_command_feedback["command-feedback"]
+  svc_sessionFeedback["ctx.sessionFeedback<br/>Session-level feedback recorder"]
+ | `ctx.sessionFeedback` | `core` | [`command-feedback`](...) | ... |

$ git ls-tree --name-only dsh-v0.1.5-alpha.1 docs/session-format-status.md   # (no output)
$ git show dsh-v0.1.5-rc.1:docs/session-format-status.md                     # new file
latestReleasedVersion: 3
evidenceTag: dsh-v0.1.5-alpha.1
```

`docs/session-format-status.md` is **new in rc.1** and its release record still points at
`dsh-v0.1.5-alpha.1`; it states "An alpha, beta, or release-candidate product publication
establishes released Session-format obligations."

The `ctx.layout` / `ctx.workspaces` / `TYPE_API` additions are quoted in the card; their
source is the `api-catalog.ts` diff of the same range, which adds
`selectPanel(panelId: MainPanelId | null): void`, `beginNavigation(): AbortSignal`,
`openSession(sessionId: SessionId): void`,
`openWorkspace(workspaceId: WorkspaceId, beforeOpen?: (sessionId: SessionId) => void): Promise<void>`,
`forkSession(sessionId: SessionId): Promise<void>` and
`export type MainPanelId = Branded<'MainPanelId'>;`.

## 5. Negative evidence (what did **not** change)

```console
$ git -C D:\deepseek-harness grep -l "usePanelInfo" dsh-v0.1.5-alpha.1 -- packages apps | wc -l
0
$ git -C D:\deepseek-harness grep -l "usePanelInfo" dsh-v0.1.5-rc.1 -- packages apps | wc -l
47

$ git diff --stat dsh-v0.1.5-alpha.1..dsh-v0.1.5-rc.1 -- packages/client/ui-slots
 packages/client/ui-slots/package.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

The session-format seams **leg A** owns (`assistant/message.stream`, `SessionHandleReadResult`,
`EpochHeader.system`, `ctx.agent`, `Inbox`, `SystemPrompt.persona`, the V3 log generation) have
**no** implementation change in this range: the whole `packages/core/session/src` diff is the
two added event-type literals and one comment line shown above. `docs/web-styling.md` (theme
tokens) has zero changes in the range. The scanner therefore reports no leg-A hit here that is
not also a leg-A fact, and the card says so explicitly in §2's scope statement.

## 6. Peer-range semantics (semver 7.8.5, measured)

```console
$ node -e "const s=require('.../semver'); ..."
semver version: 7.8.5
">=0.1.2-rc.1 <0.2.0"                                    -> false
">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0"         -> true
">=0.1.5-alpha.1 <0.2.0"                                -> true
">=0.1.5-rc.1 <0.2.0"                                   -> true
">=0.1.5-alpha.1 <0.2.0 || >=0.1.5-rc.1 <0.2.0"         -> true
alpha.1 satisfies >=0.1.5-alpha.1 <0.2.0 -> true
```

This is npm semver's prerelease-tuple rule: a prerelease version only satisfies a set when
some comparator on the same `[major, minor, patch]` tuple carries a prerelease. It is the
same rule behind the workspace's recorded `>=0.1.0-rc.8 <0.2.0` incident.

## 7. Real-world cross-check on the family workspace

Slot usage was extracted from **tracked** sources only (`git ls-files`, production files,
`node_modules`/`lib`/`dist`/docs snapshots excluded) across the 47 repositories under
`D:\Projects\dsh\plugins`:

```console
== PRODUCTION: 8 distinct keys ==
  conversation.input.left                 <- dsh-autotier, dsh-talk
  conversation.session.header.actions     <- dsh-auto-review, dsh-session-pin, dsh-ticktick
  settings.plugin.item                    <- dsh-github, dsh-ticktick
  settings.plugins.tab                    <- dsh-autotier, dsh-budget, dsh-checkpoint-rewind,
                                             dsh-draw, dsh-mcp-panel, dsh-reach, dsh-talk
  settings.section                        <- dsh-background-agents, dsh-memento,
                                             dsh-permission-rules, dsh-wechat
  shell.overlay                           <- dsh-session-pin
  sidebar.footer.action                   <- dsh-background-agents, dsh-session-pin
  tool.call.toolview                      <- dsh-draw
== TESTS: 1 distinct key ==
  session-1                               <- dsh-auto-review:test/client-registration.spec.ts
                                             (a Remote face's `options.inject(...)`, not the
                                              slots service — false positive, excluded)

$ # tracked sources across all 47 repos, same pattern
inject('conversation'  |  name: 'conversation'  |  sidebar-textpreview
(zero hits)
```

8 production keys across 15 repositories; the rc.1 deletion set is `{conversation}`, so all
8 survive. This is why the family's rc.1 CHANGELOG entries are pin-only, e.g.
`dsh-autotier/CHANGELOG.md:14`, `dsh-mcp-panel/CHANGELOG.md:16`,
`dsh-plugin-guide/CHANGELOG.md:22`, `dsh-permission-rules/CHANGELOG.md:69` (identical
wording). **The prior research pass recorded nine keys**; the ninth it listed,
`conversation.chat.node`, occurs in this workspace only inside
`dsh-plugin-guide/references/official-docs/` (a downloaded official-docs snapshot), never in
family plugin code. The card states the measured eight.

Related recorded behaviour, unchanged by this hop: `dsh-permission-rules/CHANGELOG.md:100`
describes `isUnmarkedHostVersion` treating the `0.1.5-alpha` line as non-stamping, so an
envelope-level `ignorable` write is silently dropped there. Since
`packages/session` + `packages/core` carry no substantive `ignorable` change in this range,
rc.1 inherits that behaviour.

## 8. Model catalog default

```console
$ git log --oneline -1 bc5fd3b8dc
bc5fd3b8dc feat(llm): default Chat Completions to DeepSeek V41 Flash

$ git show dsh-v0.1.5-alpha.1:packages/llm/llm-deepseek/src/index.ts   # DEFAULT_MODELS ids
id: 'deepseek-v4-flash' / 'deepseek-v4-pro' / 'deepseek-v4-flash-vision-exp'
$ git show dsh-v0.1.5-rc.1:packages/llm/llm-deepseek/src/index.ts      # DEFAULT_MODELS ids
id: 'deepseek-flash' (name: 'DeepSeek-V41-Flash') / 'deepseek-v4-flash' / 'deepseek-v4-pro' /
'deepseek-v4-flash-vision-exp'
```

The rc.1 README's `models` default row reads "V41 Flash + V4 Flash + V4 Pro + V4 Flash
Vision Exp". **Unverified:** that position 0 of the advisory catalog is *formally* the
selection default — no `DEFAULT_MODELS[0]` read appears in the adapter source. The card
therefore states what was measured (the catalog contents and the commit subject) and does
not claim a selection rule.

## 9. Package name availability

Re-measured for the merged package name on 2026-09-11 (the merged repository keeps this
record; the two retired names are the controls that prove the registry answers):

```console
$ npm view dsh-plugin-upgrade version
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/dsh-plugin-upgrade - Not found
npm error 404  The requested resource 'dsh-plugin-upgrade@*' could not be found or you do not have permission to access it.
(exit 1)

$ npm view dsh-plugin-upgrade version dist-tags.latest      # control: retired leg A still exists
version = '0.1.3'
dist-tags.latest = '0.1.3'
$ npm view dsh-plugin-upgrade-rc1 version dist-tags.latest  # control: retired leg B still exists
version = '0.1.0'
dist-tags.latest = '0.1.0'
$ npm view @deepseek-ai/dsh-skill@0.1.5-rc.2 version         # control: the merged dev pin is published
0.1.5-rc.2
```

### 9.1 The original name was rejected by npm (403 spam detection)

The first release attempt under the name `dsh-plugin-upgrade-0.1.3-0.1.5` failed at the
publish step of `release.yml` (run `34606797772`, 2026-09-11). The gate and the changelog
check both passed; only the registry write was refused:

```console
$ npm publish   # inside .github/workflows/release.yml, NPM_CONFIG_USERCONFIG written from the repo secret
npm notice name: dsh-plugin-upgrade-0.1.3-0.1.5
npm notice version: 0.1.0
npm notice package size: 88.5 kB
npm notice total files: 25
npm notice publish Signed provenance statement with source and build information from GitHub Actions
npm notice publish Provenance statement published to transparency log: https://search.sigstore.dev/?logIndex=2794018273
npm error code E403
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/dsh-plugin-upgrade-0.1.3-0.1.5 - Package name triggered spam detection; if you believe this is in error, please contact support at https://npmjs.com/support
(exit 1)

$ curl -s -o /dev/null -w '%{http_code}\n' https://registry.npmjs.org/dsh-plugin-upgrade-0.1.3-0.1.5
404     # the 403 lands before any write, so the name was never created
```

The rejected name embedded **two dotted version numbers** (`0.1.3-0.1.5`), which npm's spam
heuristics read as a version-shaped suffix. The package was therefore named
`dsh-plugin-upgrade` — matching its own skill id (`plugin-upgrade`) and bin
(`dsh-plugin-upgrade-scan`). The control is on the same account: the retired
`dsh-plugin-upgrade-rc1` (a single non-dotted suffix) published cleanly, so the **suffix
shape**, not the account or the plugin family, is what the detector reacted to.

## 10. Not verified (kept out of the card's claims)

- **L9 (real browser).** No browser assertion was executed in the environment that produced
  this package; the card marks it as a hard requirement for the reader and records it as
  unexecuted here.
- **L11 (real model credentials).** Not reproducible without credentials.
- Whether any family repository ever pinned `0.1.5-alpha.2` (not checked per repository).
- Whether `packages/client/*` contains plugin-author-facing breakage outside the public slot
  and service catalogs (no full export diff of the 432 changed client files).
- Whether upstream intends to publish a migration note for the `conversation` removal; the
  card records the absence of one as of 2026-09-10.

## A. Leg A provenance (`0.1.3-alpha.1` → `0.1.5-alpha.1`)

Leg A's provenance does **not** live in this file. It lives in the retired
`dsh-plugin-upgrade` package's version card,
`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-alpha.1.md`, which the merge
brought in as the merged card's **§1 Leg A** — verbatim, including its `path:line` citations,
its measured scale and its boundary notes.

What that leg's provenance records, so a reader of this file can find it without the retired
package:

| Item | Leg A's recorded value |
|---|---|
| Card that holds the evidence | retired `dsh-plugin-upgrade` card, now merged card §1 Leg A |
| Run | 2026-09-09 wave over **40 real plugin repositories** |
| Leg-A host checkout | `0.1.5-alpha.1`, HEAD `19d2e38480`; official tag `dsh-v0.1.5-alpha.1` = `5dda764ed3` |
| Seams measured | `S1`–`S10` + `M1` (the merged card's §1 sections 1–5, with the per-seam host path and commit) |
| Reproduce | CLI `dsh-plugin-upgrade-scan --repo <repo>` (then `dsh-plugin-upgrade-scan`), `file:line` output |
| `M1` scale | **11 of 40** repos hit the stale type line; fixing the paths exposed real TypeScript errors in **3** repos that had been "green" |
| `S3` scale | one measured case (`dsh-claude-move`: import succeeded, `Session.fromRestore` refused to resume) |
| `S8` scale | `dsh-background-agents` production code `src/tools.ts:713` (`TS2740`) plus two tests; `dsh-output-styles` `scripts/verify-session-log.mjs` threw a TypeError |
| `S9` scale | four repos' test fixtures (`dsh-data-quality`, `dsh-industry-research`, `dsh-research-report`, `dsh-fast`; `TS2353`) |
| Leg-A official precedent cited | `apps/cli/tests/profiles/headless/tests/harness.ts:59` |
| Leg-A unverified | real-browser L9 and real-model L11 were not executed there either (recorded in that card's §7) |

The merged repository re-measured leg A's seams against its own fixtures
(`fixtures/leg-a-bad-repo` / `fixtures/leg-a-good-repo`) rather than re-running the 40-repo
wave: the fixture pair pins the same error-severity seams the card names
(`S3`, `S8`, `S9`, `S4`, `S5`, `S6`, `M1` in the bad fixture; zero error hits in the good one).
Nothing in leg A's provenance was discarded by the merge, and nothing in it was re-derived
here — where the two legs disagree, the leg that measured the seam wins.


---

## Section 11 - leg C (0.1.5-rc.2 -> 0.1.6-alpha.2)

> Verbatim from the dsh-plugin-upgrade-016 repository's docs/EVIDENCE.md, moved here when that corridor was folded into this package as the second index row (2026-09-19). Its sub-headings keep their own numbering.

# EVIDENCE · dsh-plugin-upgrade-016

> 走廊方法论要求：卡片与扫描器里的每一条事实都能回溯到一条命令 + 输出。
> 本文件记录 leg C（`0.1.5-rc.2 → 0.1.6-alpha.2`）五条接缝的出处。
> 标注纪律：`已实测` = 本建包会话在 `D:\deepseek-harness`（tag `dsh-v0.1.6-alpha.2`，HEAD `ddefc45`）上重跑过；`转引已核实` = 方案文件 R3/A02/A01 已在研究期回源码核实，本会话不重复跑；`未验证` = 未跑。

## E1 · `agent/created` 串行派发（error）— 已实测

```console
$ git -C D:\deepseek-harness grep -n "agent/created" ddefc45 -- "packages/core/agent/src/*.ts"
ddefc45:packages/core/agent/src/index.ts:109:  * child plugins) exists before `session/created`, `agent/created`,
ddefc45:packages/core/agent/src/index.ts:176:  * `agent/created` listeners before releasing queued work. The sequence is
ddefc45:packages/core/agent/src/index.ts:417:  * serial `agent/created` listener fails. Emits `agent/disposed`
ddefc45:packages/core/agent/src/index.ts:547:      await this.ctx.serial(entry.carrier, 'agent/created', {
```

断言：`:547` 的 `ctx.serial(..., 'agent/created', ...)` 证明监听器在创建链上**串行 await** —— 一个抛错的监听器直接中断创建。A1 语义转引 `[A02]`/`[A05]`（已核实）。

## E2 · 异步 apply 竞态（error）— 转引已核实

宿主 fiber 在卸载窗口内对迟到的 `ctx.effect` 抛 `INACTIVE_EFFECT`（抛点 `fiber.ts` 已由方案 `[A02]` 回源码核实）；`register()` 返回值丢弃 = 旧闭包继续生效（反例 doublecheck `src/guard/index.ts:664`，正例 `:685-688`）。本卡检测面 = 「`export async function apply` 首个 `await` 之后出现 `ctx.effect|ctx.on|ctx.provide|ctx.plugin|*.register`」。本会话未真机复现卸载时序（`未验证`，扫描器是静态检测）。

## E3 · `settings.plugin.item` 与 `SessionListState.current`（error）— 已实测

```console
$ git -C D:\deepseek-harness grep -n "settings\.plugin\.item" ddefc45 -- "*.ts"
ddefc45:packages/client/ui-settings-models/src/client/slot-contract.ts:11: * the namespace follows `settings.plugin.item`, and the key domain stays the
$ git -C D:\deepseek-harness grep -n "'plugins\.item'" ddefc45 -- "*.ts"
ddefc45:packages/client/ui-plugin-manager/src/client/slot-contract.ts:32:  'plugins.item': { kind: 'list'; scope: 'root'; owner: PluginConfigViewProps }
ddefc45:packages/client/ui-plugin-manager/src/client/index.ts:89:  'plugins.item': { kind: 'list', scope: 'root' },
```

断言：`settings.plugin.item` 只剩一条**注释**（旧名说明），槽契约里已无该 key；新契约 = `plugins.item`（list/root）。`SessionListState.current` 的删除与 7 仓命中由 `[R3]` §② 穷尽差集核实（主控已回源码复核全部命中仓；`未验证` 本会话未重跑该差集）。

## E4 · `sessions.open/openSubagent/clear`（error）— 已实测

```console
$ git -C D:\deepseek-harness grep -n "openSubagent" ddefc45 -- "*.ts"
(no matches)
$ git -C D:\deepseek-harness grep -n "retain" ddefc45 -- "packages/api/session-controller/src/client/sessions/manager.ts"
ddefc45:packages/api/session-controller/src/client/sessions/manager.ts:149:  throw new Error(`sessions.retain: unknown session ${id}`)
```

断言：`openSubagent` 在 alpha.2 源码零命中；替代面 `retain` 存在。`open`/`clear` 的删除与三个消费方的形态（session-pin 响亮 TypeError、background-agents 吞错、claude-move 特性探测）由 `[R3]` §② 核实。

## E5 · 模型字面量 `deepseek-v4-flash*`/`deepseek-v4-vision-exp`（error）— 已实测

```console
$ git -C D:\deepseek-harness grep -rn "deepseek-v4-flash" ddefc45 -- "packages"
(no matches)
$ git -C D:\deepseek-harness grep -rn "deepseek-v4-pro" ddefc45 -- "packages" | head -3
ddefc45:packages/client/ui-model-selection/src/client/index.ts:52:  'deepseek-official/deepseek-v4-pro': 'option.deepseekV4Pro.description',
```

断言：被删 id 在 alpha.2 源码零命中，`deepseek-v4-pro` 仍在册。目录 4→2 与「未编目 id 透传 text-only」（上游 `llm-deepseek/README.md:48` 原文）由 `[A03]`/`[主控 M2]` 核实；非测试区 3 仓引用 + autotier README×5 与 8 个测试文件硬编码由 `[R4]` 新发现核实。

## 家族面事实（W0 钉死，本卡前置）

- 事件词表 58（+`workspace/changes`）、槽表 70 键、默认模型目录 2 条：`[A01]` §3 核实。
- peer canonical 三段式：`dsh-plugin-kit/data/peer-range.json`（W0 0-K 合入，tripwire exit 0 已实测）。
- 未验证项（诚实）：0.1.6 走廊卡在真实 45 仓上的全量扫描回归（等 W1 修复落地后跑）；本包真宿主冒烟（首次 publish 前执行）。

---

## Section 12 - leg D (0.1.6-alpha.2 / 0.1.7 -> 0.2.x)

> Re-read **2026-11-01** for the `legD` corridor. Host checkout: `/home/yy/deepseek-harness`
> at `ce7073d51254c26cd63b22a60835b8f948deb447` (root `package.json` version
> `0.2.2-alpha.2`). Migration guide: `/tmp/pl-work/dsh-plugin-guide/guide/migration-0.2.md`,
> baseline `d743267388641bc76f17c45ce8b4c231aed1d32c` (tag `dsh-v0.2.1-alpha.2`).
> Marking discipline: the five catalog seams (`D1`–`D5`) are machine-detected; the items at
> the end of this section are **evidence only, never scanned** (they are the card's advisory
> section, not `SEAMS` entries).

### D1 - the peer band is enforced at install/restart

```console
$ node -p "require('./package.json').version"          # in /home/yy/deepseek-harness
0.2.2-alpha.2
$ sed -n '55,75p' packages/boot/app-boot/src/plugin-compatibility.ts
function unmetRequirements(fields: Record<string, unknown>, runtimeVersion: string): Record<string, string> {
  const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
  if (Object.hasOwn(engines, 'dsh')) {
    const range = engines.dsh
    if (typeof range !== 'string') throw new Error('Plugin manifest engines.dsh must be a string')
    return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
  }
  ...
  for (const [name, range] of Object.entries(dependencies)) {
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    ...
    if (!satisfies(runtimeVersion, requirement)) unmet[name] = range
```

断言：`engines.dsh` 存在时**独占**（peer 被忽略），否则每个 `@deepseek-ai/dsh*` peer 都对照运行时版本；
`satisfies` 使用 `{ includePrerelease: true }`（`:52`）。调用点：`packages/boot/plugin-manager/src/operations.ts:356`
（安装前）、`:493`（更新）、`:680`（版本替换）。指南：`migration-0.2.md:36`（peer 范围会被安装期强制）、`:209`
（每条线一个 clause，禁止跨代开区间）。

本走廊的检测器：`lib/scan-0.2.mjs` `checkPeerBand()` + `excludes02()`；bad fixture
`fixtures/leg-d-bad-repo/package.json` 声明 `>=0.1.6-0 <0.2.0`，good fixture 声明
`>=0.1.6-0 <0.2.0 || >=0.2.1-0 <0.3.0`。测试矩阵见 `test/scan-0.2.test.mjs` 的
`D1 is structured` 用例（含 `engines.dsh` 优先级与 `workspace:` 豁免）。

### D2 - the settings surface was rewritten

```console
$ grep -rn "SettingsScope" --include=*.ts packages | wc -l
0
$ grep -n "export class SettingsForms" packages/settings/settings/src/index.ts
223:export class SettingsForms extends Service {
$ grep -rn "settings\.register\|installSection" --include=*.ts packages | wc -l
0
```

指南：`migration-0.2.md:60`（`settings-file` 整体删除）、`:62-71`（旧→新表：`register`/`installSection`/
`SettingsScope`/`SettingsRegisterOptions`/`applies` 删除，客户端 `settingsScope` 删除）。

### D3 - invariants were deleted, not deprecated

```console
$ ls packages/runtime-diagnostics
ls: cannot access 'packages/runtime-diagnostics': No such file or directory
$ grep -rn "ctx.invariants\|InvariantRegistry" --include=*.ts packages | wc -l
0
```

指南：`migration-0.2.md:80-85`；`docs/subsystems/invariants.md` 是区间内唯一被删除的官方文档。

### D4 - the header slot was removed

```console
$ grep -rn "conversation.session.header.leading" --include=*.ts packages | wc -l
0
$ grep -n "conversation.header.leading" packages/client/ui-conversation/src/client/contract/slots.ts | head -2
259:    'conversation.header.leading': {
636:  & PropsRenderSlots<'conversation.header.leading' | 'conversation.session.header'>
```

指南：`migration-0.2.md:118`（删除 `conversation.session.header.leading`，位置由
`conversation.header.leading` 接管）。失效机制与 legC 的 E3 同源：`ctx.slots.inject()` 只在声明存在时执行回调。

### D5 - the workspace-files Remote was renamed

```console
$ sed -n '21,26p' packages/api/workspace-files/lib/typert.remote-client.d.ts
    'workspaceFiles/changes': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => RemoteStreamHandle<WorkspaceFileWatchFrame, never>
    'workspaceFiles/list': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceDirectoryListing>>
    'workspaceFiles/read': (workspaceFileScopeId: SessionId, path: string, range: WorkspaceFileRange, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceFileText>>
    'workspaceFiles/readBytes': (workspaceFileScopeId: SessionId, path: string, options: WorkspaceByteReadOptions, signal?: AbortSignal) => Promise<RemoteResult<RemoteDecoded<WorkspaceFileBytes>>>
    'workspaceFiles/stat': (workspaceFileScopeId: SessionId, path: string, signal?: AbortSignal) => Promise<RemoteResult<WorkspaceFileStat>>
```

断言：`changes` 现在带 `path`；`readBytes` 存在；`readAll`/`readRelated` 不再是 Remote 方法。
指南：`migration-0.2.md:120-127`。

### Advisory evidence (NOT scanned, NOT in `SEAMS`)

这些记录支撑卡片的 advisory 节，但本走廊**没有**为它们实现检测器：

- **V4 session format.** `SESSION_FORMAT_VERSION = 4` 于 `packages/core/session/src/types.ts:90`；
  `ContentBlockMap` 已无 `tool-result`（`packages/llm/llm/src/types.ts:144-152`）；
  `packages/core/session/src/surface.ts:204` 原文 `must omit header.system; use system/message`。
  指南：`migration-0.2.md:38-56`。
- **`{kind:'plugin'}` message source.** `MessageSourceMap` 只有四个内建成员
  （`packages/llm/llm/src/message.ts:110-115`）；V4 准入在
  `packages/session/session-format-v3-to-v4/src/message-sources.ts:9-10` 抛
  `format v4 message requires a producer-owned source kind`。指南：`migration-0.2.md:150-163`。
- **Deleted composition rows.** `vendor/include/src/index.ts:108-115`：非 insert patch 依赖 `id` 命中，
  否则 `warn('patch: entry %C not found', id)`；`name` 不匹配则
  `warn('patch: name mismatch ... skipping')`。指南：`migration-0.2.md:83`、`:97-114`。
- **`dsh.client.inject` shape.** `Inject` 类型 = 数组或对象（`vendor/cordis/src/registry.ts:19`），
  函数形式会解析成零依赖；清单类型 `DshClientManifest.inject?: string[]` 于
  `packages/util/package-manifest/src/types.ts:91`。指南：`migration-0.2.md:137`。
- **`stats` → `activity`/`usage`.** 指南：`migration-0.2.md:32`、`:135`（0.2.1-alpha.1 官方破坏项）。
- **`mode: 'both'`.** `packages/core/agent-tool-presentation/src/index.ts:33` 的
  `mode: 'native' | 'ptc'`；测试 `tests/agent-tool-presentation.spec.ts:67` 断言
  `Config({ mode: 'both' })` 抛错。指南：`migration-0.2.md:229`（L2）。
- **`L1`–`L19`.** `migration-0.2.md:212-258`；本卡不复制其语义，只引用 ID。

### Not verified

- 未对已发布的 npm tarball 解包核验其内容与上述 tag/checkout 逐字节一致（与指南 §14.2 同一限制）。
- 未在真 0.2.x 宿主上跑 `dsh plugin add` 安装探针；`D1` 的代码路径已读，但安装拒绝的端到端行为未在本会话复现。
- 未跑真浏览器断言（`D4`/`D5` 的 exit criterion 仍是人工项）。
- 未对家族 40 仓重跑 `legD` 全量扫描，所以本卡不报告命中仓数。
