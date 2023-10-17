import { ClientError } from "../lib/errors";
import { importVcAndEd25518Suite } from "../lib/nonEsModules";
import { JSONObject } from "../types/JSON";
import { SignedVerifiableCredential } from "./credential";
import { loadDidDocument } from "./did";
import { getEnvVar } from "./envVars";
import { operatorKey } from "./hedera";
import { createVerificationSuite } from "./verificationSuite";

export interface Presentation {
  "@context": (string | JSONObject)[];
  id?: string;
  type: string[];
  holder: string | JSONObject;
  verifiableCredential: SignedVerifiableCredential[];
}

export interface SignedPresentation extends Presentation {
  proof: {
    type: string;
    created: string;
    challenge?: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
}

export async function createPresentation({
  verifiableCredential,
  id,
  holder
}: {
  verifiableCredential: SignedVerifiableCredential[];
  id: string;
  holder: string | JSONObject;
}): Promise<Presentation> {
  const { vc } = await importVcAndEd25518Suite();

  return vc.createPresentation({
    verifiableCredential,
    id,
    holder
  });
}

export async function signPresentation({
  presentation,
  challenge
}: {
  presentation: Presentation;
  challenge: string;
}): Promise<SignedPresentation> {
  const didDocument = await loadDidDocument(getEnvVar("HEDERA_DID")!);
  const { Ed25519VerificationKey2018, Ed25519Signature2018, vc, base58btc } = await importVcAndEd25518Suite();

  const key = await Ed25519VerificationKey2018.from({
    type: "Ed25519VerificationKey2018",
    controller: didDocument.getId(),
    id: didDocument.getId(),
    publicKeyBase58: base58btc.encode(operatorKey.publicKey.toBytes()),
    privateKeyBase58: base58btc.encode(operatorKey._key._key._keyPair.secretKey)
  });

  const suite = new Ed25519Signature2018({
    key
  });

  return vc.signPresentation({
    presentation,
    suite,
    challenge,
    documentLoader: vc.defaultDocumentLoader
  });
}

export async function verifyPresentation(presentation: SignedPresentation, challenge: string) {
  const id = presentation.proof.verificationMethod;

  const verificationSuite = await createVerificationSuite(id);

  const { vc } = await importVcAndEd25518Suite();

  const isPresentationVerified = await vc.verify({
    challenge,
    presentation,
    suite: verificationSuite,

    documentLoader: async (url: string) => {
      if (url.startsWith("did:hedera")) {
        return {
          document: {
            "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/ed25519-2018/v1"],
            id,
            assertionMethod: [
              {
                "@context": ["https://w3id.org/security/suites/ed25519-2018/v1"],
                id,
                type: "Ed25519VerificationKey2018",
                controller: id,
                publicKeyBase58: verificationSuite.key.publicKeyBase58
              }
            ],
            authentication: [id]
          }
        };
      }

      return vc.defaultDocumentLoader(url);
    }
  });

  if (isPresentationVerified.verified) {
    return {
      checks: ["proof"],
      warnings: [],
      errors: []
    };
  } else {
    throw new ClientError("Invalid Input!");
  }
}
