function assignDetails(target, details) {
  if (!details || typeof details !== "object") return;
  Object.entries(details).forEach(([key, value]) => {
    target[key] = value;
  });
}

export class MintApiClientError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = details.code ?? "MINTAPI_CLIENT_ERROR";
    assignDetails(this, details);
  }
}

export class PaymentChallengeError extends MintApiClientError {
  constructor(message, details = {}) {
    super(message, {
      code: "PAYMENT_CHALLENGE_ERROR",
      ...details,
    });
  }
}

export class NoSupportedNetworkError extends MintApiClientError {
  constructor(message, details = {}) {
    super(message, {
      code: "NO_SUPPORTED_NETWORK",
      ...details,
    });
  }
}

export class SignerUnavailableError extends MintApiClientError {
  constructor(message, details = {}) {
    super(message, {
      code: "SIGNER_UNAVAILABLE",
      ...details,
    });
  }
}

export class PaymentHeaderCreationError extends MintApiClientError {
  constructor(message, details = {}) {
    super(message, {
      code: "PAYMENT_HEADER_CREATION_ERROR",
      ...details,
    });
  }
}

export class MintApiRequestError extends MintApiClientError {
  constructor(message, details = {}) {
    super(message, {
      code: "REQUEST_ERROR",
      ...details,
    });
  }
}
