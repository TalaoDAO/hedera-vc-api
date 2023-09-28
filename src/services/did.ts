// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { PrivateKey, Client } = require("@hashgraph/sdk");

import { HcsDid } from "@hashgraph/did-sdk-js";
import hederaClient from "./hedera";

let didDocument: HcsDid;

interface CreateDidParams {
  privateKey: typeof PrivateKey;
  client: typeof Client;
}

export async function loadDidDocument(documentId: string) {
  didDocument = new HcsDid({
    identifier: documentId,
    client: hederaClient
  });

  await didDocument.resolve();
}

export function createDidDocument(params: CreateDidParams) {
  didDocument = new HcsDid(params);

  return didDocument;
}

export function getDidDocument() {
  return didDocument;
}

export function registerDidDocument() {
  return didDocument.register();
}
