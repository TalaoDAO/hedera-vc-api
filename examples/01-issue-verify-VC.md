# Issue and Verify Verifiable Credentials

To use this API as an Issuer, make sure to follow the steps in the [README.md](../README.md) and setup a DID Document and a Status List.

The DID Document is required to be able to issue Verifiable Credentials.

For this example, we'll assume that the issuer's ID is `did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795`.

## Verifiable Credential Issuance

This will be our credential to issue:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "DemoPass": {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "email": "schema:email",
          "entityId": "schema:identifier",
          "firstName": "schema:firstName",
          "id": "@id",
          "lastName": "schema:lastName",
          "parentId": "schema:identifier",
          "phone": "schema:telephone",
          "schema": "https://schema.org/",
          "type": "@type",
          "userId": "schema:identifier"
        },
        "@id": "urn:demopass"
      }
    }
  ],
  "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
  "type": [
    "VerifiableCredential",
    "DemoPass"
  ],
  "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "email": "jonh.doe@gmail.com",
    "entityId": 984,
    "firstName": "John",
    "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
    "lastName": "Doe",
    "parentId": 120,
    "type": "DemoPass",
    "userId": 12
  }
}
```

To issue this credential, we'll call the `POST /credentials/issue` with the credentials and an empty options object.
We'll add a few options to the header to specify that we require a `json` back. We'll also pass the API KEY.

```sh
curl -X 'POST' \
  'http://localhost:3004/credentials/issue' \
  -H 'accept: application/json' \
  -H 'x-api-key: testKey' \
  -H 'Content-Type: application/json' \
  -d '{
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "DemoPass": {
          "@context": {
            "@protected": true,
            "@version": 1.1,
            "email": "schema:email",
            "entityId": "schema:identifier",
            "firstName": "schema:firstName",
            "id": "@id",
            "lastName": "schema:lastName",
            "parentId": "schema:identifier",
            "phone": "schema:telephone",
            "schema": "https://schema.org/",
            "type": "@type",
            "userId": "schema:identifier"
          },
          "@id": "urn:demopass"
        }
      }
    ],
    "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
    "type": [
      "VerifiableCredential",
      "DemoPass"
    ],
    "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "issuanceDate": "2010-01-01T19:23:24Z",
    "credentialSubject": {
      "email": "jonh.doe@gmail.com",
      "entityId": 984,
      "firstName": "John",
      "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
      "lastName": "Doe",
      "parentId": 120,
      "type": "DemoPass",
      "userId": 12
    }
  }, 
  "options": {}
}'
```

The response should be a `201` with the signed credential.
Notice that the credential is identical, however its comes with a `proof` property which helps verifiers verify the signature. 

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    {
      "DemoPass": {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "email": "schema:email",
          "entityId": "schema:identifier",
          "firstName": "schema:firstName",
          "id": "@id",
          "lastName": "schema:lastName",
          "parentId": "schema:identifier",
          "phone": "schema:telephone",
          "schema": "https://schema.org/",
          "type": "@type",
          "userId": "schema:identifier"
        },
        "@id": "urn:demopass"
      }
    }
  ],
  "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
  "type": [
    "VerifiableCredential",
    "DemoPass"
  ],
  "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "email": "jonh.doe@gmail.com",
    "entityId": 984,
    "firstName": "John",
    "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
    "lastName": "Doe",
    "parentId": 120,
    "type": "DemoPass",
    "userId": 12
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-10-27T09:49:23Z",
    "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..7AsGXVAmg_LK3ZzuES-ZMGRXeYoeICSvF7qbjxXVy8OTOH7IcTv6VlE7VZO9WVLdOaApnQMvQDaCH32E1amnCg"
  }
}
```

The type of signature indicates an Ed25519 algorithm. The credential was signed on Oct 27th 2023 by our issuer id.
To verify this document, I would have to retrieve the identifier's document and get its public key, then verify the `jws` signature.

## Verifiable Credential Verification

This is exactly what this API's verification method does. We'll pass the signed credential back to `POST /credentials/verify` to verify it:

```sh
curl -X 'POST' \
  'http://localhost:3004/credentials/verify' \
  -H 'accept: application/json' \
  -H 'x-api-key: testKey' \
  -H 'Content-Type: application/json' \
  -d '{
  "verifiableCredential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      {
        "DemoPass": {
          "@context": {
            "@protected": true,
            "@version": 1.1,
            "email": "schema:email",
            "entityId": "schema:identifier",
            "firstName": "schema:firstName",
            "id": "@id",
            "lastName": "schema:lastName",
            "parentId": "schema:identifier",
            "phone": "schema:telephone",
            "schema": "https://schema.org/",
            "type": "@type",
            "userId": "schema:identifier"
          },
          "@id": "urn:demopass"
        }
      }
    ],
    "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
    "type": [
      "VerifiableCredential",
      "DemoPass"
    ],
    "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "issuanceDate": "2010-01-01T19:23:24Z",
    "credentialSubject": {
      "email": "jonh.doe@gmail.com",
      "entityId": 984,
      "firstName": "John",
      "id": "did:key:zQ3sharUr4F1zxVK8YJKbzx4qi9X6vsmjkphwj7NAwHLz3p2T",
      "lastName": "Doe",
      "parentId": 120,
      "type": "DemoPass",
      "userId": 12
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "created": "2023-10-27T09:49:23Z",
      "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..7AsGXVAmg_LK3ZzuES-ZMGRXeYoeICSvF7qbjxXVy8OTOH7IcTv6VlE7VZO9WVLdOaApnQMvQDaCH32E1amnCg"
    }
  }
}'
```

Which should return a `200` with the following payload:

```json
{
  "checks": [
    "proof"
  ],
  "warnings": [],
  "errors": []
}
```

This means that the proof was verified and the credential is valid.

An invalid credential would have returned a `400 Invalid Input!`. For instance, if you tried to change any value in the `credentialSubject` this would invalidate the `jws` signature and return the `400` error.

Now that we've seen how to Issue a credential, we'll cover the [revocation flow](./02-VC-status.md).