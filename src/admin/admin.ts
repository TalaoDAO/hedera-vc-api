import hederaClient from "../services/hedera";
import { getEnvVar, hasEnvVar } from "../services/envVars";
import { operatorKey } from "../services/hedera";
import { createDidDocument, loadDidDocument, registerDidDocument } from "../services/did";
import { hfsCreateStatusList } from "../services/statusList";

export const enum APPLICATION_STATUS {
  INITIALIZING = "INITIALIZING",
  ERROR = "ERROR",
  OK = "OK"
}

export async function initApplication() {
  console.log(`Creating Did document...`);
  const newDidDocument = createDidDocument({
    privateKey: operatorKey,
    client: hederaClient
  });

  console.log(`Publishing Did document...`);
  const didDocument = await registerDidDocument(newDidDocument);

  console.log(`Creating status list...`);
  const statusListFileId = await hfsCreateStatusList();

  return {
    didDocument,
    statusListFileId
  };
}

export async function getApplicationStatus() {
  if (!hasEnvVar("HEDERA_DID")) {
    return {
      status: APPLICATION_STATUS.INITIALIZING,
      message: "Please set HEDERA_DID environment variable with a valid HIP-27 identifier."
    };
  } else if (!hasEnvVar("STATUS_LIST_FILE_ID")) {
    return {
      status: APPLICATION_STATUS.INITIALIZING,
      message: "Please set STATUS_LIST_FILE_ID environment variable with a valid hedera file id."
    };
  } else {
    const registeredDid = await loadDidDocument(getEnvVar("HEDERA_DID")!)!;

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
