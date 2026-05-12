# Publishing

This repository is the public buyer-side MintAPI SDK package.

Published package name:

- `@mintapi/gateway`

Supported public import:

- `@mintapi/gateway/client`

## What gets published

The package tarball includes:

- `README.md`
- `PUBLISHING.md`
- `CHANGELOG.md`
- `src/client/**/*.mjs`
- `src/client/**/*.d.ts`

Tests and GitHub workflow files stay in the repository but do not ship in the npm tarball.

## Preferred publishing method

Use npm trusted publishing from GitHub Actions instead of long-lived npm tokens.

Reference:

- https://docs.npmjs.com/trusted-publishers/

## Release checklist

1. update package version in `package.json`
2. update `CHANGELOG.md`
3. run tests
4. run `npm run pack:dry-run`
5. verify the tarball file list
6. push a git tag like `v0.1.0`
7. let GitHub Actions publish the package
8. update docs snippets if the client surface changed

## Commands

From the repo root:

```bash
npm run test
npm run pack:dry-run
git tag v0.1.0
git push origin v0.1.0
```

## npm setup required

Before the workflow can publish:

1. ensure the `@mintapi` npm organization exists
2. ensure your npm user has publish rights for the org
3. add a trusted publisher for this GitHub repository and workflow
4. make sure the package name `@mintapi/gateway` is available

For GitHub Actions trusted publishing, npm needs:

- GitHub owner/org: the repository owner
- repository: `mintapi-gateway`
- workflow file: `publish.yml`

The workflow lives at:

- `.github/workflows/publish.yml`

## Stability rule

Treat the `@mintapi/gateway/client` export surface as stable.

If you add, rename, or remove a public export, update:

- `src/client/index.mjs`
- `src/client/index.d.ts`
- `test/client-exports.test.mjs`
- `README.md`
- docs snippets that reference the SDK
