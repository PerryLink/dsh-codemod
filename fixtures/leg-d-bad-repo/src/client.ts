// SPDX-License-Identifier: Apache-2.0
// Synthetic bad fixture for leg D.
// This file: D4 + D5 — the deleted header slot and the removed workspace-files
// Remote methods.
export function mountClient(ctx: any, path: string) {
  ctx.slots.inject('conversation.session.header.leading', () => null)
  const all = ctx.remote.workspaceFiles.readAll(path)
  const changes = ctx.remote.workspaceFiles.changes()
  return { all, changes }
}
