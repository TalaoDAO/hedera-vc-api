// eslint-disable-next-line @typescript-eslint/no-var-requires
const { FileContentsQuery, FileCreateTransaction, FileUpdateTransaction, Hbar } = require("@hashgraph/sdk");

import hederaClient, { operatorKey } from "./hedera";
import { loadDidDocument } from "./did";
import { getEnvVar } from "./envVars";
import { importVcAndEd25518Suite, loadStatusList } from "../lib/nonEsModules";
import { CredentialStatus, SignedVerifiableCredential } from "./credential";
import { ClientError } from "../lib/errors";
import contexts from "../lib/contexts";
import { JSONObject } from "../types/JSON";
import { STATUS_LIST_LENGTH } from "./constants";

export interface StatusList2021Credential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    type: "StatusList2021";
    statusPurpose: "revocation";
    encodedList: string;
  };
  proof?: {
    type: "Ed25519Signature2018";
    created: string;
    verificationMethod: string;
    proofPurpose: "assertionMethod";
    jws: string;
  };
}

export interface StatusList {
  encode: () => Promise<string>;
  decode: (encodedStatusList: string) => StatusList;
  setStatus: (index: number, isRevoked: boolean) => void;
}

export async function createStatusList(length: number): Promise<StatusList> {
  const statusList = await loadStatusList();
  return statusList.createList({ length });
}

export function encodeStatusList(statusList: StatusList): Promise<string> {
  return statusList.encode();
}

export function revokeIndex(statusList: StatusList, index: number) {
  statusList.setStatus(index, true);

  return statusList;
}

export async function decodeStatusList(encodedList: string) {
  const statusList = await loadStatusList();

  return statusList.decodeList({ encodedList });
}

export async function hfsCreateStatusList() {
  const transaction = await new FileCreateTransaction()
    .setKeys([operatorKey.publicKey])
    .setContents("[]")
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(hederaClient);

  const signTx = await transaction.sign(operatorKey);
  const submitTx = await signTx.execute(hederaClient);
  const receipt = await submitTx.getReceipt(hederaClient);

  return receipt.fileId;
}

export async function hfsUpdateStatusList(fileId: string, statusList: string[]) {
  const transaction = await new FileUpdateTransaction()
    .setFileId(fileId)
    .setContents(JSON.stringify(statusList))
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(hederaClient);

  const signTx = await transaction.sign(operatorKey);
  const submitTx = await signTx.execute(hederaClient);
  await submitTx.getReceipt(hederaClient);
}

export async function hfsGetStatusList(fileId: string): Promise<string[]> {
  const query = new FileContentsQuery().setFileId(fileId);

  const contents = await query.execute(hederaClient);

  return JSON.parse(String(contents));
}

export async function ensureHfsStatusListForCredential(credentialStatus: CredentialStatus) {
  const statusListId = Number(credentialStatus.statusListCredential.split("/").pop());
  const index = Number(credentialStatus.statusListIndex);

  if (!(statusListId >= 0)) {
    throw new ClientError("Invalid status list id");
  }

  if (index >= STATUS_LIST_LENGTH) {
    throw new ClientError(`statusListIndex should be between 0 and ${STATUS_LIST_LENGTH - 1}`);
  }

  const statusListFiledId = getEnvVar("STATUS_LIST_FILE_ID")!;

  const statusList = await hfsGetStatusList(statusListFiledId);

  if (typeof statusList[statusListId] !== "string") {
    statusList[statusListId] = await encodeStatusList(await createStatusList(STATUS_LIST_LENGTH));
    await hfsUpdateStatusList(statusListFiledId, statusList);
  }
}

export async function issueStatusListCredential(
  credential: StatusList2021Credential
): Promise<StatusList2021Credential> {
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

export async function checkCredentialStatus({
  credential,
  suite,
  documentLoader
}: {
  credential: SignedVerifiableCredential;
  suite: JSONObject;
  documentLoader: (url: string) => JSONObject;
}): Promise<{ verified: boolean }> {
  const statusList = await loadStatusList();

  return statusList.checkStatus({
    credential,
    suite,
    documentLoader
  });
}
