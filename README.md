# MintAPI Gateway SDK

`@mintapi/gateway` is the buyer-side SDK for calling MintAPI endpoints that use `402 Payment Required` plus `X-PAYMENT` retries.

Public import surface:

- `@mintapi/gateway/client`

## What this package is for

Use this SDK when you want an agent, tool runtime, or backend workflow to:

1. make a normal HTTP request to MintAPI
2. handle a `402` challenge automatically
3. choose an accepted payment route
4. sign the payment payload with your own signer infrastructure
5. retry the request with `X-PAYMENT`

This package does not contain the MintAPI seller-side gateway server. It only contains the buyer/client helpers external users need.

## Stable client surface

Supported exports from `@mintapi/gateway/client`:

- `paidFetch`
- `paidJson`
- `createAgentClient`
- `createSignerResolver`
- `getSignerFamily`
- `defineSignerModule`
- `loadSignerModule`
- `resolveSignerModule`
- `MintApiClientError`
- `PaymentChallengeError`
- `NoSupportedNetworkError`
- `SignerUnavailableError`
- `PaymentHeaderCreationError`
- `MintApiRequestError`

Everything else should be treated as internal implementation detail.

## Install

```bash
npm install @mintapi/gateway
```

## Fastest adoption path

1. install `@mintapi/gateway`
2. define one signer module that can resolve EVM and Solana signers
3. make one successful `paidJson(...)` request
4. move to `createAgentClient(...)` for endpoint-specific helpers

## Generic wrapper

```js
import { paidJson, createSignerResolver } from "@mintapi/gateway/client";

const signerResolver = createSignerResolver({
  signerResolversByFamily: {
    evm: async ({ network }) => resolveManagedEvmSigner(network),
    svm: async ({ network }) => resolveManagedSolanaSigner(network),
  },
});

const user = await paidJson(
  "https://api.mintapi.dev/api/twitter/user-info?screenname=elonmusk&rest_id=44196397",
  { method: "GET" },
  {
    preferredNetworks: ["base", "polygon", "solana"],
    getSigner: signerResolver,
  },
);
```

## Endpoint client

```js
import { createAgentClient, createSignerResolver } from "@mintapi/gateway/client";

const signerResolver = createSignerResolver({
  signerResolversByFamily: {
    evm: async ({ network }) => resolveManagedEvmSigner(network),
    svm: async ({ network }) => resolveManagedSolanaSigner(network),
  },
});

const client = createAgentClient({
  baseUrl: "https://api.mintapi.dev",
  getSigner: signerResolver,
});

const user = await client.twitter.userInfo({
  screenname: "elonmusk",
  rest_id: "44196397",
});

const results = await client.youtube.search({
  query: "cat",
  type: "video",
  geo: "US",
});
```

## Signer module contract

Use `defineSignerModule(...)` when you want one reusable file for CLI usage, backend jobs, and long-running agents.

```js
import { defineSignerModule } from "@mintapi/gateway/client";

export default defineSignerModule({
  preferredNetworks: ["base", "polygon", "solana"],
  signerResolversByFamily: {
    evm: async ({ network }) => resolveManagedEvmSigner(network),
    svm: async ({ network }) => resolveManagedSolanaSigner(network),
  },
});
```

The normalized module shape is:

- `preferredNetworks`: ordered buyer network preference
- `signerResolver(context)`: final signer resolver consumed by `paidFetch` and `createAgentClient`

## Signer resolver contract

Use `createSignerResolver(...)` to keep network and signer-family routing out of endpoint code.

```js
import { createSignerResolver } from "@mintapi/gateway/client";

const signerResolver = createSignerResolver({
  signerResolversByFamily: {
    evm: async ({ network }) => resolveManagedEvmSigner(network),
    svm: async ({ network }) => resolveManagedSolanaSigner(network),
  },
});
```

Resolution layers, in order:

1. `signer`
2. `networkSigners[network]`
3. `familySigners[family]`
4. `signerResolversByNetwork[network]`
5. `signerResolversByFamily[family]`
6. `getSigner(context)`
7. `defaultSigner`
8. `defaultSignerResolver(context)`

Current signer families used by MintAPI:

- `base` -> `evm`
- `polygon` -> `evm`
- `solana` -> `svm`

## Error model

`paidFetch(...)` and `paidJson(...)` throw typed errors:

- `PaymentChallengeError`
- `NoSupportedNetworkError`
- `SignerUnavailableError`
- `PaymentHeaderCreationError`
- `MintApiRequestError`

This allows agent runtimes to branch on payment-routing failures vs final API response failures.

## Notes

- seller keys stay on the server side only
- buyer signing should happen in the agent runtime, not in the MintAPI gateway
- use managed signers, wallet services, KMS, or HSM-backed adapters instead of raw private keys in environment files
