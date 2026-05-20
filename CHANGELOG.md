# Changelog

## 0.1.8

- expand endpoint surface with Facebook and Yelp endpoints.

## 0.1.7

- expand the Instagram client surface with:
  - `mediaByHashtag`
  - `mediaByExploreSectionId`
  - `exploreSectionsList`
  - `citiesByCountryCode`
  - `locationsByCityId`
  - `mediaByLocationId`
  - `locationInfoByLocationId`
  - `globalSearchByKeyword`
  - `searchHashtags`
  - `searchLocations`
- add TypeScript request/response interfaces for the new Instagram endpoints
- keep SDK path and naming aligned with the gateway routes (`/api/instagram/*`)

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
