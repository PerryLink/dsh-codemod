// SPDX-License-Identifier: Apache-2.0
// Synthetic bad fixture for leg D.
// This file: D2 — the deleted settings registration surface. `register()` and
// `SettingsScope` both disappeared when settings-file was removed.
export function mountSettings(ctx: any, schema: any) {
  ctx.settings.register('demo', schema, { applies: 'restart' })
  const scope: SettingsScope<{ enabled: boolean }> = ctx.settings.scope('demo')
  return scope
}
