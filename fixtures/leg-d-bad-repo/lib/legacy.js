// SPDX-License-Identifier: Apache-2.0
// Synthetic bad fixture for leg D. This file lives under lib/ on purpose: the
// scanner must reach committed build artifacts (a rebuilt bundle that still
// ships the deleted slot key breaks every user).
export function legacyHeader(ctx) {
  ctx.slots.inject('conversation.session.header.leading', () => null)
}
