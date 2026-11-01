// SPDX-License-Identifier: Apache-2.0
// Synthetic good fixture for leg D.
// D3 adapted: failure propagation uses the plugin's own channel; there is no
// invariants package, service or /invariant subpath import left.
export function guarded(report: (message: string) => void) {
  try {
    check()
  } catch (error) {
    report(error instanceof Error ? error.message : String(error))
  }
}

function check() {}
