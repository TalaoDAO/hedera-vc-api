import axios from "axios";

import { loadDidDocument } from "./did";
import { ClientError } from "../lib/errors";
import { JSONObject, JSONValue } from "../types/JSON";
import { getEnvVar } from "./envVars";
import { operatorKey } from "./hedera";
import { importVcAndEd25518Suite } from "../lib/nonEsModules";
import { checkCredentialStatus } from "./statusList";
import contexts from "../lib/contexts";
import { createVerificationSuite } from "./verificationSuite";

export interface Credential {
  "@context": (string | JSONObject)[];
  id?: string;
  type: string[];
  issuer: string | { id: string };
  issuanceDate: string;
  expirationDate?: string;
  // if this is set to JSONObject, tsoa has issues accepting nested arrays...
  credentialSubject: JSONObject | JSONValue;
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

      if (contexts.has(url)) {
        return {
          document: contexts.get(url),
          documentUrl: url
        };
      }

      const { data: document } = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });

      return {
        document,
        documentUrl: url
      };
    }
  });

  if (isCredentialVerified.verified) {
    return {
      checks: ["proof"],
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
    documentLoader: async (url: string) => {
      if (contexts.has(url)) {
        return {
          document: contexts.get(url)
        };
      }
      const { data: document } = await axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });

      return {
        document,
        documentUrl: url
      };
    }
  });
}
