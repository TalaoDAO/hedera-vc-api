// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { Client, Hbar, PrivateKey, TopicCreateTransaction, FileId, FileDeleteTransaction } = require("@hashgraph/sdk");

import { HcsIdentityNetwork } from "@hashgraph/did-sdk-js";

import envVars, { getEnvVar } from "./envVars";
import { SignedHcsIdentityNetworkBuilder } from "../utils/SignedHcsIdentityNetworkBuilder";

let hederaClient: typeof Client;

if (envVars.HEDERA_NETWORK === "testnet") {
  hederaClient = Client.forTestnet();
} else if (envVars.HEDERA_NETWORK === "mainnet") {
  hederaClient = Client.forMainnet();
} else if (envVars.HEDERA_NETWORK === "previewnet") {
  hederaClient = Client.forPreviewnet();
} else {
  throw new Error("Invalid HEDERA_NETWORK value, must be one of testnet, mainnet, previewnet");
}

hederaClient.setOperator(envVars.HEDERA_ACCOUNT_ID, envVars.HEDERA_PRIVATE_KEY);

hederaClient.setDefaultMaxTransactionFee(new Hbar(100));

hederaClient.setMaxQueryPayment(new Hbar(50));

export const operatorKey = PrivateKey.fromString(envVars.HEDERA_PRIVATE_KEY);

export async function createTopic(isPrivate = false) {
  let topicCreateTx;

  if (isPrivate) {
    topicCreateTx = new TopicCreateTransaction().setSubmitKey(operatorKey.publicKey);
  } else {
    topicCreateTx = new TopicCreateTransaction();
  }

  const txResponse = await topicCreateTx.execute(hederaClient);

  const receipt = await txResponse.getReceipt(hederaClient);

  return String(receipt.topicId);
}

let identityNetwork: HcsIdentityNetwork;

interface AddressBookParams {
  appnetName: string;
  didTopicId: string;
  vcTopicId: string;
  appnetDidServers: string[];
}

export function createIdentityNetwork(addressBook: AddressBookParams) {
  return new SignedHcsIdentityNetworkBuilder()
    .setAdminKey(operatorKey)
    .setNetwork(envVars.HEDERA_NETWORK)
    .setAppnetName(addressBook.appnetName)
    .addAppnetDidServer(addressBook.appnetDidServers[0])
    .setPublicKey(operatorKey.publicKey)
    .setMaxTransactionFee(new Hbar(2))
    .setDidTopicMemo(addressBook.didTopicId)
    .setVCTopicMemo(addressBook.vcTopicId)
    .execute(hederaClient);
}

export function initIdentityNetworkFromAddressBook(addressBookFileId: typeof FileId) {
  return HcsIdentityNetwork.fromAddressBookFile(hederaClient, envVars.HEDERA_NETWORK, addressBookFileId);
}

export async function loadIdentityNetwork() {
  const fileId = getEnvVar("HEDERA_ADDRESS_BOOK_FILEID");

  if (fileId) {
    identityNetwork = await initIdentityNetworkFromAddressBook(fileId);
  }
}

export function getIdentityNetwork(): HcsIdentityNetwork | undefined {
  return identityNetwork;
}

export async function deleteIdentityNetworkFromFileId(addressBookFileId: typeof FileId) {
  const tx = await new FileDeleteTransaction()
    .setFileId(addressBookFileId)
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(hederaClient);

  const signedTx = await tx.sign(operatorKey);

  const submitTx = await signedTx.execute(hederaClient);

  return submitTx.getReceipt(hederaClient);
}

export function operatorSignMessage(msg: Uint8Array) {
  return operatorKey.sign(msg);
}

export default hederaClient;
