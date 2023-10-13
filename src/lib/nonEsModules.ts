export async function importVcAndEd25518Suite() {
  const vc = await import("@digitalbazaar/vc");

  const { Ed25519VerificationKey2018 } = await import("@digitalbazaar/ed25519-verification-key-2018");
  const { Ed25519Signature2018 } = await import("@digitalbazaar/ed25519-signature-2018");
  const base58btc = await import("base58-universal");

  return {
    vc,
    Ed25519Signature2018,
    Ed25519VerificationKey2018,
    base58btc
  };
}

export function loadStatusList() {
  return import("@digitalbazaar/vc-status-list");
}
