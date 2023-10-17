import { ClientError } from "../lib/errors";
import { importVcAndEd25518Suite } from "../lib/nonEsModules";
import { loadDidDocument } from "./did";

export async function createVerificationSuite(didIdentifier: string) {
  let resolvedDid;

  try {
    resolvedDid = await loadDidDocument(didIdentifier);
  } catch (e) {
    if (e instanceof Error) {
      throw new ClientError(`Invalid proof, no DID Document with id ${didIdentifier}`);
    }
  }

  const { Ed25519VerificationKey2018, Ed25519Signature2018 } = await importVcAndEd25518Suite();

  const key = await Ed25519VerificationKey2018.from({
    type: "Ed25519VerificationKey2018",
    controller: resolvedDid?.getId(),
    id: resolvedDid?.getId(),
    publicKeyBase58: resolvedDid?.toJsonTree().verificationMethod[0].publicKeyBase58
  });

  return new Ed25519Signature2018({
    key
  });
}
