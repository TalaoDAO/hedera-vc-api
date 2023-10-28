# Read Status List From HFS

In order for you to read a status list from HFS, you need to know its file id.
Given a `credentialStatus` with url `http://localhost:3004/credentials/status/0.0.12345/0#0`, the file id is `0.0.12345`.

Provided that you possess the HFS file id, the status list id, and the index, you may check a credential's revocation status.

Let's use this `credentialStatus` as an example:

```json
"credentialStatus": {
    "id": "http://localhost:3004/credentials/status/0.0.12345/2#1337",
    "type": "StatusList2021Entry",
    "statusListIndex": "1337",
    "statusPurpose": "revocation",
    "statusListCredential": "http://localhost:3004/credentials/status/0.0.12345/2"
  },
```

We can retrieve the index `1337` in the status list `2` like this:

```js
const { Client, FileContentsQuery } = require("@hashgraph/sdk");
const sl = require("@digitalbazaar/vc-status-list");

const client = Client.forTestnet();
client.setOperator("<hedera account id x.z.y>", "<hedera secret key 302... comes here>");

const query = new FileContentsQuery().setFileId("0.0.12345");
const contents = await query.execute(client);

const statusLists = JSON.parse(String(contents));

// in the credentialStatus, the status list index is 2
const statusListByIndex = statusLists[2];

const decoded = await sl.decodeList({
  encodedList: statusListByIndex // could be "H4sIAAAAAAAAA-3BIQEAAAACIKc73RcmoAEAAAAAAAAAAAAAAPgbjSrD2NQwAAA"
});

// return true if revoked or false if not
console.log(decoded.getStatus(1337));
```