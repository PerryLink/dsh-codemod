// SPDX-License-Identifier: Apache-2.0
// Synthetic good fixture for leg D.
// D4 + D5 adapted: the surviving header slot, readBytes, and changes(path).
export async function mountClient(ctx: any, path: string) {
  ctx.slots.inject('conversation.header.leading', () => null)
  const bytes: Uint8Array = await ctx.remote.workspaceFiles.readBytes(path, {})
  const changes = ctx.remote.workspaceFiles.changes(path)
  return { bytes, changes }
}
