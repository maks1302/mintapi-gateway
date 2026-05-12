import path from "node:path";
import { pathToFileURL } from "node:url";
import { createSignerResolver } from "./signer-resolver.mjs";

function normalizePreferredNetworks(preferredNetworks) {
  if (!Array.isArray(preferredNetworks) || preferredNetworks.length === 0) {
    return ["base", "polygon", "solana"];
  }

  return [...new Set(preferredNetworks.filter(Boolean).map((network) => String(network)))];
}

export function defineSignerModule(options = {}) {
  const preferredNetworks = normalizePreferredNetworks(options.preferredNetworks);
  const signerResolver = options.signerResolver ?? createSignerResolver(options);

  if (typeof signerResolver !== "function") {
    throw new TypeError("defineSignerModule requires a signerResolver function");
  }

  return {
    kind: "x402-signer-module",
    preferredNetworks,
    signerResolver,
  };
}

export function resolveSignerModule(moduleExports) {
  const exported = moduleExports?.default ?? moduleExports;

  if (exported?.kind === "x402-signer-module" && typeof exported.signerResolver === "function") {
    return defineSignerModule(exported);
  }

  if (typeof exported === "function") {
    return defineSignerModule({ signerResolver: exported });
  }

  if (typeof exported?.signerResolver === "function" || typeof exported?.getSigner === "function") {
    return defineSignerModule(exported);
  }

  throw new TypeError(
    "Signer module must export defineSignerModule(...), signerResolver, getSigner, or a default resolver function",
  );
}

export async function loadSignerModule(modulePath, options = {}) {
  if (!modulePath) {
    throw new TypeError("loadSignerModule requires a modulePath");
  }

  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const absolutePath = path.isAbsolute(modulePath) ? modulePath : path.resolve(cwd, modulePath);
  const imported = await import(pathToFileURL(absolutePath).href);
  return resolveSignerModule(imported);
}
