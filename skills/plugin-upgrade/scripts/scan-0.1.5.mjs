#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
/**
 * CLI wrapper for the corridor-index router (one package, several closed corridors).
 *
 * Usage:
 *   node scripts/scan-0.1.5.mjs [--repo <path>] [--span legD|legC|legAB|<span>] [--json <out.json>] [--seams E1,E3] [--quiet]
 *   npx --package dsh-plugin-upgrade dsh-plugin-upgrade-scan --repo <path>
 *
 * The wrapper only routes: it reads the target repository's declared dsh band (or
 * an explicit --span) and hands the SAME argv to that corridor's own catalog
 * module, so every corridor keeps its own evidence-bound seam array and its own
 * main(). An unknown band routes to the older corridor (legAB), which is what a
 * repository predating 0.1.6 needs. Nothing here reaches the network.
 *
 * Exit codes: 0 = no error-severity hit, 1 = at least one error-severity hit,
 *             2 = usage or scan failure.
 */
import { resolveCorridor, spanFromArgv, repoFromArgv, withoutSpanArgv, loadCatalog } from '../../../lib/route.mjs'

const argv = process.argv.slice(2)
const corridor = resolveCorridor({ repoDir: repoFromArgv(argv), span: spanFromArgv(argv) })
const catalog = await loadCatalog(corridor)

if (!argv.includes('--quiet')) {
  process.stderr.write(`corridor: ${corridor.id} (${corridor.span}) -> ${corridor.catalog}\n`)
}

process.exit(catalog.main(withoutSpanArgv(argv)))
