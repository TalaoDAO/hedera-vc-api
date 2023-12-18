# Hedera VC HTTP API

Easily manage Hedera Decentralized Identifiers and issue, verify, revoke or suspend credentials and presentations using this simple HTTP API.

This API can be setup as an Issuer or a Verifier, or both.

Features it supports:

1. [Issuer] Generate Hedera DID and DID Document
2. [Issuer] Issue a Verifiable Credential with a `did:hedera`
3. [Verifier] Verify Credentials issued by a `did:hedera`
4. [Holder] Prove a Presentation
5. [Verifier] Verify a Presentation issued by a `did:hedera`
6. [Issuer] Revoke a Verifiable Presentation using a 2021 Status List.

This API is built on top of 2 Hedera features:

1. Following the [HIP-27](https://hips.hedera.com/hip/hip-27) proposal, the generated DID Document is stored on [Hedera Consensus Service](https://hedera.com/consensus-service).
2. The resulting status list is stored on [Hedera's File Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/file-service), making it easy for anybody to retrieve it and test its content. Check out how to retrieve the status list from HFS [here](./examples/04-read-status-list-from-hfs.md).

## API Docs

This API is compliant with the [VC API](https://w3c-ccg.github.io/vc-api/#the-vc-api) specifications.
The actual swagger for this service is available [here](./build/swagger.json).
When the service is running, the swagger is also served at the `/docs` url.

## Install

If you just want to consume this API and have docker setup, you may directly use the provided [docker image](#docker), see below.

This API runs a node.js server, ensure you have node >18 installed and clone this repository, then:

```
npm install
```

## Run as a Verifier (default mode)

By default, starting a Hedera VC API with an Hedera account will start the app as a Verifier app.
The minimum set of required environment variables is as follows:

First, setup a .env file with the following:

```.env
# Optionaly run on a different port than 3000
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

You should see that you're running in "INITIALIZING" mode. This means that the app is not yet ready to issue VCs, VPs or serve a status list. But it can already verify VCs and VPs.

## Run as Issuer

To run as issuer, you need to configure a few more environment variables.

- You'll need to initialize a DID and upload the associated DID Document.
- You'll need to create a status list and keep its file id safe as it's the place where you'll maintain revocation statuses.
- You'll need to specify the server's public URL so verifiers know where to look up statuses.

To do so, follow those steps:

1. Navigate to `localhost:3000/docs` (or wherever the server is running)
2. Expand the `POST /admin/init` method.
3. Click "try it out" and Execute
4. Upon execution, copy the document identifier `did:hedera:098sd0fs8d90fg..._0.0.12345`
5. set a new `HEDERA_DID` environment variable with the document identifier
7. set the `ISSUER_SERVER_URL` environment variables with the url to the server. This will show in the StatusList credential so verifiers which url to hit to retrieve the verification list. Set it to `http://localhost:3001` if running locally.
8. Restart the app with the environment variable set, you should now be in "OK" mode. You can check it with the `GET /admin/status` method.

## Docker

You may also run this application using Docker. Example of a docker file.
You'll find our [images here](https://hub.docker.com/r/meranti/hedera-vc-api/tags).

```yaml
version: "3.8"

services:
  hedera-vc-api:
    image: meranti/hedera-vc-api:beta-2
    ports:
      - "3000:3000"
    restart: always
    environment:
      - HEDERA_ACCOUNT_ID=<x.y.z>
      - HEDERA_PRIVATE_KEY=<b8104000..4502f>
      - HEDERA_NETWORK=<testnet | mainnet>
      - HEDERA_DID=<decentralized identifier if you want to setup the server as Issuer>
      - ISSUER_SERVER_URL=youserver.com # this url will show in the status list credential so verifiers know where to find the status
```

## Secure API with API_KEY

You may also additionnally secure your APIs with an API_KEY.

First, set a preferably long, random key as an environment variable:

```
API_KEY=<your long, random api key here>
```

Then add the API_KEY to every request by setting `x-api-key` in the headers:

```sh
curl -X 'GET' \
  'http://localhost:3001/admin/status' \
  -H 'accept: application/json' \
  -H 'x-api-key: <the long, random api key>'
```

## Example

To better understand how this service works, you make take a look at our curl examples:

1. [issue a VC and verify](./examples/01-issue-verify-VC.md)
2. [issue a VC with a status, revoke it and verify](./examples/02-VC-status.md)
3. [issue a VP and verify it](./examples/03-issue-verify-VP.md)
4. [read a status list from hfs](./examples/04-read-status-list-from-hfs.md)

## Literature

- [Proposed Standard for a VC API](https://w3c-ccg.github.io/vc-api/)
- [SpruceId, An existing implementation](https://www.spruceid.dev/didkit/didkit-packages/http-server)
- [Hedera Tech Insights: Maintaining a DID registry](https://hedera.com/blog/maintaining-a-decentralized-identity-registry-with-hedera)
- [The Hedera JS DID SDK](https://github.com/hashgraph/did-sdk-js)
- [The Hedera JS DID SDK with HIP-27](https://github.com/Meeco/hedera-did-sdk-js)
- [HIP-27](https://hips.hedera.com/hip/hip-27)
