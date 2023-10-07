// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { PrivateKey, Client } = require("@hashgraph/sdk");

import { DidDocument, HcsDid } from "@hashgraph/did-sdk-js";
import hederaClient from "./hedera";
import { NotFoundError } from "../lib/errors";

interface CreateDidParams {
  privateKey: typeof PrivateKey;
  client: typeof Client;
}

export async function loadDidDocument(documentId: string) {
  const didDocument = new HcsDid({
    identifier: documentId,
    client: hederaClient
  });

  const resolvedDocument = await didDocument.resolve();

  if (!isValidDidDocument(resolvedDocument)) {
    throw new NotFoundError(`Unable to resolve DID Document with id ${documentId}`);
  }

  return resolvedDocument;
}

export function createDidDocument(params: CreateDidParams) {
  return new HcsDid(params);
}

export function registerDidDocument(document: HcsDid) {
  return document.register();
}

function isValidDidDocument(didDocument: DidDocument) {
  return Boolean(didDocument.getVersionId());
}
