import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import {
  MintApiRequestError,
  NoSupportedNetworkError,
  PaymentChallengeError,
  PaymentHeaderCreationError,
  SignerUnavailableError,
  createAgentClient,
  defineSignerModule,
  loadSignerModule,
  paidFetch,
  paidJson,
} from "../src/client/index.mjs";

const clientEntryPath = fileURLToPath(new URL("../src/client/index.mjs", import.meta.url));

function createJsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

test("paidFetch returns the original response when payment is not required", async () => {
  const response = createJsonResponse(200, { ok: true });
  const result = await paidFetch("https://api.mintapi.dev/api/test", {}, {
    fetchImpl: async () => response,
  });

  assert.equal(result, response);
});

test("paidFetch retries after 402 with selected network and X-PAYMENT header", async () => {
  const calls = [];
  const signer = { id: "managed-evm-signer" };

  const result = await paidFetch("https://api.mintapi.dev/api/test", { method: "GET" }, {
    fetchImpl: async (input) => {
      calls.push(input);

      if (calls.length === 1) {
        return createJsonResponse(402, {
          x402Version: 1,
          accepts: [{ network: "base", scheme: "exact" }],
        });
      }

      return createJsonResponse(200, { paid: true });
    },
    paymentRequirementsSelector: () => ({ network: "base", scheme: "exact" }),
    getSigner: async ({ network, family }) => {
      assert.equal(network, "base");
      assert.equal(family, "evm");
      return signer;
    },
    paymentHeaderCreator: async (resolvedSigner, version, requirements) => {
      assert.equal(resolvedSigner, signer);
      assert.equal(version, 1);
      assert.deepEqual(requirements, { network: "base", scheme: "exact" });
      return "signed-payment-header";
    },
  });

  assert.equal(result.status, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].headers.get("X-PAYMENT"), "signed-payment-header");
});

test("paidFetch throws PaymentChallengeError when 402 response has no accepts routes", async () => {
  await assert.rejects(
    paidFetch("https://api.mintapi.dev/api/test", {}, {
      fetchImpl: async () => createJsonResponse(402, { x402Version: 1, accepts: [] }),
    }),
    (error) => {
      assert.ok(error instanceof PaymentChallengeError);
      assert.equal(error.status, 402);
      return true;
    },
  );
});

test("paidFetch throws NoSupportedNetworkError when selector cannot find a usable route", async () => {
  await assert.rejects(
    paidFetch("https://api.mintapi.dev/api/test", {}, {
      fetchImpl: async () =>
        createJsonResponse(402, {
          x402Version: 1,
          accepts: [{ network: "solana", scheme: "exact" }],
        }),
      paymentRequirementsSelector: () => {
        throw new Error("no route match");
      },
    }),
    (error) => {
      assert.ok(error instanceof NoSupportedNetworkError);
      assert.deepEqual(error.preferredNetworks, ["base", "polygon", "solana"]);
      return true;
    },
  );
});

test("paidFetch throws SignerUnavailableError when no signer can be resolved", async () => {
  await assert.rejects(
    paidFetch("https://api.mintapi.dev/api/test", {}, {
      fetchImpl: async () =>
        createJsonResponse(402, {
          x402Version: 1,
          accepts: [{ network: "polygon", scheme: "exact" }],
        }),
      paymentRequirementsSelector: () => ({ network: "polygon", scheme: "exact" }),
      getSigner: async () => undefined,
      paymentHeaderCreator: async () => "should-not-run",
    }),
    (error) => {
      assert.ok(error instanceof SignerUnavailableError);
      assert.equal(error.network, "polygon");
      assert.equal(error.family, "evm");
      return true;
    },
  );
});

test("paidFetch throws PaymentHeaderCreationError when signer payment proof creation fails", async () => {
  await assert.rejects(
    paidFetch("https://api.mintapi.dev/api/test", {}, {
      fetchImpl: async () =>
        createJsonResponse(402, {
          x402Version: 1,
          accepts: [{ network: "base", scheme: "exact" }],
        }),
      paymentRequirementsSelector: () => ({ network: "base", scheme: "exact" }),
      getSigner: async () => ({ id: "signer" }),
      paymentHeaderCreator: async () => {
        throw new Error("signer backend unavailable");
      },
    }),
    (error) => {
      assert.ok(error instanceof PaymentHeaderCreationError);
      assert.equal(error.network, "base");
      assert.ok(error.cause);
      return true;
    },
  );
});

test("paidJson throws MintApiRequestError for non-2xx final responses", async () => {
  await assert.rejects(
    paidJson("https://api.mintapi.dev/api/test", {}, {
      fetchImpl: async () => createJsonResponse(400, { error: "invalid params" }),
    }),
    (error) => {
      assert.ok(error instanceof MintApiRequestError);
      assert.equal(error.status, 400);
      assert.deepEqual(error.body, { error: "invalid params" });
      return true;
    },
  );
});

test("createAgentClient builds endpoint URLs and passes through query params", async () => {
  let capturedRequest;

  const client = createAgentClient({
    baseUrl: "https://api.mintapi.dev",
    fetchImpl: async (input) => {
      capturedRequest = input;
      return createJsonResponse(200, { ok: true });
    },
  });

  const result = await client.youtube.search({
    query: "cat",
    type: "video",
    token: "next-page",
    geo: "US",
  });

  assert.deepEqual(result, { ok: true });
  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/youtube/search?query=cat&token=next-page&geo=US&type=video",
  );
  assert.equal(capturedRequest.method, "GET");
  assert.equal(capturedRequest.headers.get("Accept"), "application/json");

  await client.zillow.zestimateHistory({
    recent_first: "True",
    which: "zestimate_history",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/zestimate-history?recent_first=True&which=zestimate_history&byzpid=30907787",
  );

  await client.zillow.rentZestimateHistory({
    recent_first: "True",
    which: "rent_zestimate_history",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/rent-zestimate-history?recent_first=True&which=rent_zestimate_history&byzpid=30907787",
  );

  await client.zillow.listingPrice({
    recent_first: "True",
    which: "listing_price",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/listing-price?recent_first=True&which=listing_price&byzpid=30907787",
  );

  await client.zillow.zestimatePercentChange({
    recent_first: "True",
    which: "zestimate_percent_change",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/zestimate-percent-change?recent_first=True&which=zestimate_percent_change&byzpid=30907787",
  );

  await client.zillow.taxAssessment({
    recent_first: "True",
    which: "tax_assessment",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/tax-assessment?recent_first=True&which=tax_assessment&byzpid=30907787",
  );

  await client.zillow.taxPaid({
    recent_first: "True",
    which: "tax_paid",
    byzpid: "30907787",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/tax-paid?recent_first=True&which=tax_paid&byzpid=30907787",
  );

  await client.zillow.ownerAgent({
    byzpid: "30696332",
    byurl: "https://www.zillow.com/homedetails/220-77th-St-Brooklyn-NY-11209/30696332_zpid/",
    byaddress: "220 77th St, Brooklyn, NY 11209",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/owner-agent?byzpid=30696332&byurl=https%3A%2F%2Fwww.zillow.com%2Fhomedetails%2F220-77th-St-Brooklyn-NY-11209%2F30696332_zpid%2F&byaddress=220+77th+St%2C+Brooklyn%2C+NY+11209",
  );

  await client.zillow.comparableHomes({
    byzpid: "44471319",
    byurl: "https://www.zillow.com/homedetails/415-South-St-APT-202-Honolulu-HI-96813/2089316022_zpid/",
    byaddress: "1221 Victoria St APT 301, Honolulu, HI 96814",
  });

  assert.equal(
    capturedRequest.url,
    "https://api.mintapi.dev/api/zillow/comparable-homes?byzpid=44471319&byurl=https%3A%2F%2Fwww.zillow.com%2Fhomedetails%2F415-South-St-APT-202-Honolulu-HI-96813%2F2089316022_zpid%2F&byaddress=1221+Victoria+St+APT+301%2C+Honolulu%2C+HI+96814",
  );
});

test("defineSignerModule normalizes preferred networks and signer resolver", async () => {
  const signerModule = defineSignerModule({
    preferredNetworks: ["solana", "base"],
    getSigner: async ({ network }) => ({ network }),
  });

  assert.deepEqual(signerModule.preferredNetworks, ["solana", "base"]);
  const signer = await signerModule.signerResolver({ network: "solana" });
  assert.deepEqual(signer, { network: "solana" });
});

test("loadSignerModule resolves the canonical signer module export", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "mintapi-signer-module-"));
  const modulePath = path.join(tempDir, "signer.mjs");

  try {
    await writeFile(
      modulePath,
      `
        import { defineSignerModule } from ${JSON.stringify(
          clientEntryPath,
        )};

        export default defineSignerModule({
          preferredNetworks: ["polygon", "base"],
          getSigner: async ({ network }) => ({ network, source: "test-module" }),
        });
      `,
      "utf8",
    );

    const signerModule = await loadSignerModule(modulePath);
    assert.deepEqual(signerModule.preferredNetworks, ["polygon", "base"]);
    const signer = await signerModule.signerResolver({ network: "polygon" });
    assert.deepEqual(signer, { network: "polygon", source: "test-module" });
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
