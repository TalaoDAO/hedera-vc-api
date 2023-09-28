import hederaClient from "../services/hedera";
import { hasEnvVar } from "../services/envVars";
import { operatorKey } from "../services/hedera";
import { createDidDocument, getDidDocument, registerDidDocument } from "../services/did";

export const enum APPLICATION_STATUS {
  INITIALIZING = "INITIALIZING",
  ERROR = "ERROR",
  OK = "OK"
}

export function initApplication() {
  console.log(`Creating DidDocument...`);
  createDidDocument({
    privateKey: operatorKey,
    client: hederaClient
  });

  console.log(`Publishing DidDocument...`);
  return registerDidDocument();
}

export function getApplicationStatus() {
  if (!hasEnvVar("HEDERA_DID")) {
    return {
      status: APPLICATION_STATUS.INITIALIZING,
      message: "Please set HEDERA_DID environment variable with a valid HIP-27 identifier."
    };
  } else {
    const registeredDid = getDidDocument();

    if (!registeredDid) {
      return {
        status: APPLICATION_STATUS.ERROR,
        message: "Unable to resolve DID Document, invalid fileId set in HEDERA_DID."
      };
    } else {
      return {
        status: APPLICATION_STATUS.OK,
        message: "API ready."
      };
    }
  }
}
