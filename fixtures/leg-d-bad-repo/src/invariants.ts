// SPDX-License-Identifier: Apache-2.0
// Synthetic bad fixture for leg D.
// This file: D3 — the invariant package and service are gone entirely.
import { invariant } from '@deepseek-ai/dsh-invariants'

export function guarded(ctx: any) {
  ctx.invariants.check('demo/invariant', () => true)
  return invariant
}
