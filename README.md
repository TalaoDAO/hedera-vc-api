# Hedera VC HTTP API

A Simple REST API to manage Hedera Verifiable Credentials, Verifiable Presentations and DIDs.

## Install

```
npm install
```

## Run

First, setup a .env file with the following:

```.env
# Optionaly run on a different port
PORT=3001

# Your Hedera account
HEDERA_ACCOUNT_ID=<x.y.z>
HEDERA_PRIVATE_KEY=<encoded private key>

# Run on testnet
HEDERA_NETWORK=testnet

# A secret of your choosing to add entropty to encryption
CRYPTO_SECRET=123456
```

Then 

```
npm run dev
```

You should see that you're running in "INITIALIZING" mode. This means that the app is not yet ready to issue VCs for instance.
You'll first have to setup an address book.

## Setting up Address Book / Appnet

1. Navigate to `localhost:3000/docs`
2. Expand the `POST /admin/init` method. 
3. Click "try it out", set `appnetName` to your appnetName and set `appnetDidServer` url to `http://localhost:3000`
4. Click execute.
5. When executing, copy the file's `x.y.z` identifier.
6. set a new `HEDERA_ADDRESS_BOOK_FILEID` environment variable with the value
7. Restart the app with the environment variable set, you should now be in "OK" mode. You can check it with the `GET /admin/status` method.

## Docker

You may also run this application using Docker. Example of a docker file.
You'll find our [images here](https://hub.docker.com/repository/docker/meranti/hedera-vc-api/general).


```yaml
version: "3.6"

services:
  hedera-vc-api:
    image: meranti/hedera-vc-api:alpha-1
    ports:
      - "3000:3000"
    restart: always
    environment:
      - HEDERA_ACCOUNT_ID=<x.y.z>
      - HEDERA_PRIVATE_KEY=<b8104000..4502f>
      - HEDERA_ADDRESS_BOOK_FILEID=<x.y.z>
      - HEDERA_NETWORK=<testnet | mainnet>
      - CRYPTO_SECRET=<any string>
```

## Literature

[Proposed Standard for a VC API](https://w3c-ccg.github.io/vc-api/#issue-credential)
[SpruceId, An existing implementation](https://www.spruceid.dev/didkit/didkit-packages/http-server)
[Hedera Tech Insights: Maintaining a DID registry](https://hedera.com/blog/maintaining-a-decentralized-identity-registry-with-hedera)
[The Hedera JS DID SDK](https://github.com/hashgraph/did-sdk-js)
