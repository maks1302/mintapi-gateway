const EVM_NETWORKS = new Set(["base", "polygon"]);
const SVM_NETWORKS = new Set(["solana"]);

export function getSignerFamily(network) {
  if (!network) return null;

  const normalized = String(network).toLowerCase();
  if (EVM_NETWORKS.has(normalized)) return "evm";
  if (SVM_NETWORKS.has(normalized)) return "svm";
  return null;
}

async function resolveCandidate(candidate, context) {
  if (typeof candidate === "function") {
    return candidate(context);
  }

  return candidate;
}

export function createSignerResolver(options = {}) {
  return async function signerResolver(context = {}) {
    if (options.signer) return options.signer;

    const network = context.network ? String(context.network) : undefined;
    const family = context.family ?? getSignerFamily(network);

    if (network && options.networkSigners?.[network]) {
      return options.networkSigners[network];
    }

    if (family && options.familySigners?.[family]) {
      return options.familySigners[family];
    }

    if (network && options.signerResolversByNetwork?.[network] !== undefined) {
      return resolveCandidate(options.signerResolversByNetwork[network], context);
    }

    if (family && options.signerResolversByFamily?.[family] !== undefined) {
      return resolveCandidate(options.signerResolversByFamily[family], context);
    }

    if (typeof options.getSigner === "function") {
      const signer = await options.getSigner({
        ...context,
        network,
        family,
      });
      if (signer !== undefined) return signer;
    }

    if (options.defaultSigner) return options.defaultSigner;

    if (typeof options.defaultSignerResolver === "function") {
      return options.defaultSignerResolver({
        ...context,
        network,
        family,
      });
    }

    return undefined;
  };
}
