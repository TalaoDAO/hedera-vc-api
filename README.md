# Hedera VC HTTP API

A Simple REST API to manage Hedera Verifiable Credentials, Verifiable Presentations and DIDs.
This API can be setup as an Issuer or a verifier.
Ideally, it should be setup as one or the other, not as both to ensure privacy.

Features it supports:

1. [Issuer] Generate Hedera DID and DID Document
2. [Issuer] Issue a Verifiable Credential with a `did:hedera`
3. [Verifier] Verify Credentials issued by a `did:hedera`
4. [Issuer] Issue a Verifiable Presentation
5. [Verifier] Verify a Presentation issued by a `did:hedera`
6. [Issuer] Revoke a Verifiable Presentation using a 2021 Status List.

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
```

Then 

```
npm run dev
```

You should see that you're running in "INITIALIZING" mode. This means that the app is not yet ready to issue VCs for instance.
You'll first have to setup an address book.

## For Issuers: Generating a DID Document and a Status List

1. Navigate to `localhost:3000/docs`
2. Expand the `POST /admin/init` method. 
3. Click "try it out" and Execute
4. Upon execution, copy the document identifier `did:hedera:098sd0fs8d90fg..._0.0.12345` and the Status List file Id `0.0.45678`
6. set a new `HEDERA_DID` environment variable with the document identifier
7. set a new `STATUS_LIST_FILE_ID` environment variable with the Status List file id
8. set the `ISSUER_SERVER_URL` environment variables with the url to the server. This will show in the StatusList credential so verifiers which url to hit to retrieve the verification list. Set it to `http://localhost:3001` if running locally.
7. Restart the app with the environment variable set, you should now be in "OK" mode. You can check it with the `GET /admin/status` method.

## Docker

You may also run this application using Docker. Example of a docker file.
You'll find our [images here](https://hub.docker.com/r/meranti/hedera-vc-api/tags).


```yaml
version: "3.6"

services:
  hedera-vc-api:
    image: meranti/hedera-vc-api:alpha-4
    ports:
      - "3000:3000"
    restart: always
    environment:
      - HEDERA_ACCOUNT_ID=<x.y.z>
      - HEDERA_PRIVATE_KEY=<b8104000..4502f>
      - HEDERA_NETWORK=<testnet | mainnet>
      - HEDERA_DID=<decentralized identifier if you want to setup the server as Issuer>
      - STATUS_LIST_FILE_ID=<status list file id if you want to setup the server as Issuer>
      - ISSUER_SERVER_URL=youserver.com # this url will show in the status list credential so verifiers know where to find the status 
```

## Literature

* [Proposed Standard for a VC API](https://w3c-ccg.github.io/vc-api/#issue-credential)
* [SpruceId, An existing implementation](https://www.spruceid.dev/didkit/didkit-packages/http-server)
* [Hedera Tech Insights: Maintaining a DID registry](https://hedera.com/blog/maintaining-a-decentralized-identity-registry-with-hedera)
* [The Hedera JS DID SDK](https://github.com/hashgraph/did-sdk-js)
* [The HEDERA JS DID SDK with HIP-27](https://github.com/Meeco/hedera-did-sdk-js)
* [HIP-27](https://hips.hedera.com/hip/hip-27)