// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { Client, Hbar, PrivateKey } = require("@hashgraph/sdk");

import { getEnvVar } from "./envVars";

const hederaClient = Client.forNetwork(getEnvVar("HEDERA_NETWORK"), { scheduleNetworkUpdate: false });

hederaClient.setOperator(getEnvVar("HEDERA_ACCOUNT_ID"), getEnvVar("HEDERA_PRIVATE_KEY"));

hederaClient.setDefaultMaxTransactionFee(new Hbar(100));

hederaClient.setMaxQueryPayment(new Hbar(50));

export const operatorKey = PrivateKey.fromString(getEnvVar("HEDERA_PRIVATE_KEY"));

export function operatorSignMessage(msg: Uint8Array) {
  return operatorKey.sign(msg);
}

export default hederaClient;
