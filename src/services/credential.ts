import axios from "axios";

import { loadDidDocument } from "./did";
import { ClientError, NotFoundError } from "../lib/errors";
import { JSONObject } from "../types/JSON";
import { getEnvVar } from "./envVars";
import { operatorKey } from "./hedera";
import { importVcAndEd25518Suite } from "../lib/nonEsModules";
import { checkCredentialStatus } from "./statusList";
import contexts from "../lib/contexts";

export interface Credential {
  "@context": (string | JSONObject)[];
  id: string;
  type: string[];
  issuer: string | { id: string };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: JSONObject;
  credentialStatus?: CredentialStatus;
}

export interface CredentialStatus {
  id: string;
  type: "StatusList2021Entry";
  statusPurpose: "revocation" | "suspension";
  statusListIndex: string;
  statusListCredential: string;
}

export interface SignedVerifiableCredential extends Credential {
  credentialStatus?: CredentialStatus;
  proof: {
    type: string;
    created: string;
    challenge?: string;
    domain?: string;
    nonce?: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string;
    proofValue?: string;
  };
}

async function createVerificationSuite(didIdentifier: string) {
  let resolvedDid;

  try {
    resolvedDid = await loadDidDocument(didIdentifier);
  } catch (e) {
    if (e instanceof NotFoundError) {
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

export async function verifyCredential(signedCredential: SignedVerifiableCredential) {
  const id = signedCredential.proof.verificationMethod;

  const verificationSuite = await createVerificationSuite(id);

  const { vc } = await importVcAndEd25518Suite();

  const isCredentialVerified = await vc.verifyCredential({
    credential: signedCredential,
    suite: verificationSuite,
    checkStatus: checkCredentialStatus,
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
            ]
          }
        };
      }

      if (url.startsWith("http://localhost:3001/")) {
        const { data: document } = await axios.get(url);

        return {
          document
        };
      }

      if (contexts.has(url)) {
        return {
          document: contexts.get(url)
        };
      }

      return vc.defaultDocumentLoader(url);
    }
  });

  if (isCredentialVerified.verified) {
    return {
      checks: [],
      warnings: [],
      errors: []
    };
  } else {
    throw new ClientError("Invalid Input!");
  }
}

export async function issueCredential(credential: Credential) {
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

  return vc.issue({
    credential,
    suite,
    documentLoader: (url: string) => {
      if (contexts.has(url)) {
        return {
          document: contexts.get(url)
        };
      }

      return vc.defaultDocumentLoader(url);
    }
  });
}
