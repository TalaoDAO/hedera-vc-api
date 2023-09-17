// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { PrivateKey, Hbar } = require("@hashgraph/sdk");

import { DidDocumentBase, DidMethodOperation, HcsDidMessage, HcsIdentityNetwork } from "@hashgraph/did-sdk-js";
import hederaClient, { operatorSignMessage } from "../services/hedera";

export function getDidDocument(identityNetwork: HcsIdentityNetwork, key: typeof PrivateKey) {
  return identityNetwork.generateDid(key, true).generateDidDocument();
}

export function publishDidDocument(
  identityNetwork: HcsIdentityNetwork,
  didDocument: DidDocumentBase
): Promise<HcsDidMessage> {
  return new Promise((resolve) => {
    identityNetwork
      .createDidTransaction(DidMethodOperation.CREATE)
      .setDidDocument(didDocument.toJSON())
      .signMessage((msg) => operatorSignMessage(msg))
      .buildAndSignTransaction((tx) => tx.setMaxTransactionFee(new Hbar(2)))
      .onMessageConfirmed((msg) => resolve(msg.open()))
      .execute(hederaClient);
  });
}
