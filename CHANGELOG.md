# Changelog

## 0.1.3

- switch the public SDK license to `Apache-2.0`
- pin transitive `axios` to `1.15.2` via `overrides` to clear audit findings
- keep the standalone public SDK repo aligned with the published package flow

## 0.1.0

- Initial public MintAPI buyer SDK release
- `paidFetch` and `paidJson` for x402-aware retries
- `createAgentClient(...)` for endpoint-specific helpers
- signer-module support with `defineSignerModule(...)` and `loadSignerModule(...)`
- typed client error classes
- TypeScript declarations for the public client surface
