// SPDX-License-Identifier: Apache-2.0
// Synthetic good fixture for leg D.
// D2 adapted: the form is derived from the profile entry's Config schema, and
// the plugin only reads/describes it — no register()/SettingsScope.
export function mountSettings(ctx: any) {
  const forms = ctx.settings.describe({ namespace: 'demo' })
  return forms
}
