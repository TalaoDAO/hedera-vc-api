// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { Client, Hbar } = require("@hashgraph/sdk");

const hederaClient = Client.forTestnet();

hederaClient.setOperator(process.env.HEDERA_ACCOUNT_ID!, process.env.HEDERA_PRIVATE_KEY!);

hederaClient.setDefaultMaxTransactionFee(new Hbar(100));

hederaClient.setMaxQueryPayment(new Hbar(50));

export default hederaClient;
