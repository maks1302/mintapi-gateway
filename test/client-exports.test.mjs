import test from "node:test";
import assert from "node:assert/strict";

test("public client export surface stays intentional", async () => {
  const clientModule = await import("@mintapi/gateway/client");
  const exportedNames = Object.keys(clientModule).sort();

  assert.deepEqual(exportedNames, [
    "MintApiClientError",
    "MintApiRequestError",
    "NoSupportedNetworkError",
    "PaymentChallengeError",
    "PaymentHeaderCreationError",
    "SignerUnavailableError",
    "createAgentClient",
    "createSignerResolver",
    "defineSignerModule",
    "getSignerFamily",
    "loadSignerModule",
    "paidFetch",
    "paidJson",
    "resolveSignerModule",
  ]);
});
