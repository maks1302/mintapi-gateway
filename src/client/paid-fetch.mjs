import { createPaymentHeader, selectPaymentRequirements } from "x402/client";
import {
  MintApiRequestError,
  NoSupportedNetworkError,
  PaymentChallengeError,
  PaymentHeaderCreationError,
  SignerUnavailableError,
} from "./errors.mjs";
import { createSignerResolver, getSignerFamily } from "./signer-resolver.mjs";

function ensureRequestLike(input, init) {
  if (input instanceof Request) {
    return input;
  }

  return new Request(input, init);
}

async function parsePaymentRequest(response) {
  let paymentRequest;

  try {
    paymentRequest = await response.clone().json();
  } catch (cause) {
    throw new PaymentChallengeError("MintAPI returned a non-JSON payment challenge", {
      status: response.status,
      cause,
    });
  }

  if (!paymentRequest?.accepts?.length) {
    throw new PaymentChallengeError("MintAPI returned a payment challenge without accepted routes", {
      status: response.status,
      body: paymentRequest,
    });
  }

  return paymentRequest;
}

async function resolveSigner(options, context) {
  const resolver = createSignerResolver(options);
  return resolver(context);
}

export async function paidFetch(input, init, options = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const request = ensureRequestLike(input, init);
  const response = await fetchImpl(request);

  if (response.status !== 402) {
    return response;
  }

  const paymentRequest = await parsePaymentRequest(response);
  options.onPaymentRequired?.(paymentRequest, response);

  const preferredNetworks = options.preferredNetworks ?? ["base", "polygon", "solana"];
  const paymentScheme = options.paymentScheme ?? "exact";

  let paymentRequirements;
  try {
    paymentRequirements = (options.paymentRequirementsSelector ?? selectPaymentRequirements)(
      paymentRequest.accepts,
      preferredNetworks,
      paymentScheme,
    );
  } catch (cause) {
    throw new NoSupportedNetworkError(
      "MintAPI returned payment routes, but none matched the configured buyer preferences",
      {
        cause,
        preferredNetworks,
        accepts: paymentRequest.accepts,
      },
    );
  }

  options.onPaymentRequirementsSelected?.(paymentRequirements, paymentRequest);

  const family = getSignerFamily(paymentRequirements.network);
  const signer = await resolveSigner(options, {
    network: paymentRequirements.network,
    family,
    paymentRequirements,
    paymentRequest,
  });

  if (!signer) {
    throw new SignerUnavailableError(
      `No signer was available for MintAPI payment route "${paymentRequirements.network}"`,
      {
        network: paymentRequirements.network,
        family,
        paymentRequirements,
        paymentRequest,
      },
    );
  }

  let paymentHeader;
  try {
    const paymentHeaderCreator = options.paymentHeaderCreator ?? createPaymentHeader;
    paymentHeader = await paymentHeaderCreator(
      signer,
      paymentRequest.x402Version ?? 1,
      paymentRequirements,
      options.x402Config,
    );
  } catch (cause) {
    throw new PaymentHeaderCreationError(
      `Failed to create X-PAYMENT for MintAPI route "${paymentRequirements.network}"`,
      {
        cause,
        network: paymentRequirements.network,
        family,
        paymentRequirements,
        paymentRequest,
      },
    );
  }

  options.onPaymentHeaderCreated?.(paymentHeader, paymentRequirements);

  const retryHeaders = new Headers(request.headers);
  retryHeaders.set("X-PAYMENT", paymentHeader);

  const retryRequest = new Request(request, {
    headers: retryHeaders,
  });

  return fetchImpl(retryRequest);
}

export async function paidJson(input, init, options = {}) {
  const response = await paidFetch(input, init, options);
  const isJson = response.headers.get("Content-Type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new MintApiRequestError(
      `MintAPI request failed with status ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`,
      {
        status: response.status,
        body,
      },
    );
  }

  return body;
}
