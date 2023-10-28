# Set a Verifiable Credential Status and Revoke

To be able to revoke a credential, we first need to assign it a status.
Revocation means that the issuer considers the Verfiable Credential as no longer valid.
As the Verfiable Credential is in it's owner's posession, it can't be mutated to indicate the new status.
As a result, the credential is given an index in a list of statuses which can be looked up on the [Hedera File Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/file-service).

A verifier only needs to know the location of the status list on HFS, retrieve it, and check the index specified by the issuer to see if it's off or on, for valid or revoked.

## Verifiable Credential with Status Issuance

First, let's issue a credential with a status. We'll keep the same credential but add an option when issuing it, using the same `POST /credentials/issue` that we used before. We also need to add a new `context`, `"https://w3id.org/vc/status-list/2021/v1"` so we can sign the VC knowing what properties to expect.

```curl
{
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/vc/status-list/2021/v1",
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
  "options": {
    "credentialStatus": {
      "id": "http://localhost:3004/credentials/status/0.0.12345/0#0",
      "type": "StatusList2021Entry",
      "statusListIndex": "0",
      "statusPurpose": "revocation",
      "statusListCredential": "http://localhost:3004/credentials/0.0.12345/status/0"
    }
  }
}
```

Essentially, the issuer must track which VC, identified by its own `id`, is tracked in which list, and at which index.
Each list has a fixed length of 100,000 items for example, and the VC has an index in that list.
In our example, our VC's status is stored at index `0` in the list with id `0`.
The status list itself is stored in the HFS file `0.0.12345`. This is the file that was conveniently initialized during the initialization of the service.

If our VC was stored in the file `0.0.98765` at index `1337` in the status list `2`, the `credentialStatus` option would look like this:

```json
"credentialStatus": {
  "id": "http://localhost:3004/credentials/status/0.0.98765/2#1337",
  "type": "StatusList2021Entry",
  "statusListIndex": "1337",
  "statusPurpose": "revocation",
  "statusListCredential": "http://localhost:3004/credentials/status/0.0.98765/2"
}
```

The `http://localhost:3004` url must be valid url storing another Verifiable Credential with a status list. Replace with the location of your API.

To issue this credential, let's `POST` it to the appropriate url:

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
      "https://w3id.org/vc/status-list/2021/v1",
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
  "options": {
    "credentialStatus": {
      "id": "http://localhost:3004/credentials/status/0.0.5758797/0#0",
      "type": "StatusList2021Entry",
      "statusListIndex": "0",
      "statusPurpose": "revocation",
      "statusListCredential": "http://localhost:3004/credentials/status/0.0.5758797/0"
    }
  }
}'
```

Which will result in a `201` with the signed credential:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/vc/status-list/2021/v1",
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
  "credentialStatus": {
    "id": "http://localhost:3004/credentials/status/0.0.5758797/0#0",
    "type": "StatusList2021Entry",
    "statusListIndex": "0",
    "statusPurpose": "revocation",
    "statusListCredential": "http://localhost:3004/credentials/status/0.0.5758797/0"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-10-28T10:29:59Z",
    "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..CuZBYm7U8m25Neld_lzTycTN8_MKSMOnMjtm2cFIWQIgJaz-LX-OWH9hqE0VkG1D_roi2yEFyaL8AiHD6L0PDw"
  }
}
```

Notice that the `credentialStatus` was added to the VC.

## Status List Verification

Let's take a look at that status list, we can simply issue a `GET on http://localhost:3004/credentials/status/0.0.57587970`.
This API is public, there's no need to pass in a API_KEY as that url should be accessible by all verifiers.

```sh
curl -X 'GET' \
  'http://localhost:3004/credentials/status/0.0.5758797/0' \
  -H 'accept: application/json'
```

And the `200` response:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "http://localhost:3004/credentials/status/0.0.5758797/0",
  "type": [
    "VerifiableCredential",
    "StatusList2021Credential"
  ],
  "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
  "issuanceDate": "2023-10-28T10:30:59.453Z",
  "credentialSubject": {
    "id": "http://localhost:3004/credentials/status/0.0.5758797/0#list",
    "type": "StatusList2021",
    "statusPurpose": "revocation",
    "encodedList": "H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-10-28T10:30:59Z",
    "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..B_npykktr5SuHBFiaoDMh3HmkimpE7uGLSnqbtesZEmQadHMQ8um51GuAKXoq4q709KBe-NQ1KyexN-Kt_1cCg"
  }
}
```

We can verify this VC if need be, we need to ensure that it was indeed signed by its `issuer`.

In the `credentialSubject` we can see the `encodedList` item. This is an encoded list (`GZIP`) of 100,000 items. 
Our status is at index `0`, so let's decode it and verify that our VC wasn't revoked:

```js
import * as sl from "@digitalbazaar/vc-status-list";

const decoded = await sl.decodeList({
  encodedList: "H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA"
});

// should be false
console.log(decoded.getStatus(0));
```

## Verifiable Credential with Status Verification

Our verify method actually does this verification:

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
        "https://w3id.org/vc/status-list/2021/v1",
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
      "credentialStatus": {
        "id": "http://localhost:3004/credentials/status/0.0.5758797/0#0",
        "type": "StatusList2021Entry",
        "statusListIndex": "0",
        "statusPurpose": "revocation",
        "statusListCredential": "http://localhost:3004/credentials/status/0.0.5758797/0"
      },
      "proof": {
        "type": "Ed25519Signature2018",
        "created": "2023-10-28T10:29:59Z",
        "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..CuZBYm7U8m25Neld_lzTycTN8_MKSMOnMjtm2cFIWQIgJaz-LX-OWH9hqE0VkG1D_roi2yEFyaL8AiHD6L0PDw"
      }
    }
  }'
```

Which returns a `200`:

```sh
{
  "checks": [
    "proof"
  ],
  "warnings": [],
  "errors": []
}
```

## Revocation of Verifiable Credential

So far, our VC's status was `valid`. As an issuer, we're able to revoke it. To do so, we'll simply update the status list using the appropriate API:

```
curl -X 'POST' \
  'http://localhost:3004/credentials/status/0.0.5758797/0' \
  -H 'accept: */*' \
  -H 'x-api-key: testKey' \
  -H 'Content-Type: application/json' \
  -d '{
  "credentialId": "0",
  "credentialStatus": [
    {
      "status": "true",
      "type": "revocation"
    }
  ]
}'
```

When revoking a credential, we need to specify the HFS file Id for the status list, `0.0.5758797`, and the id of the status list itself in that file, which is `0`. The status list contains 100,000 statuses.
We know that the status of our VC is at index `0` so we specifiy it in the `credentialId` field.

If successfully updated, the status should be a `204` without content.

## Verification of revoked Verifiable Credential

Verifying the same credential again should now return a `400` since the status is revoked.
Let's run exactly the same query as before, since the verifiable credential hasn't changed:

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
        "https://w3id.org/vc/status-list/2021/v1",
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
      "credentialStatus": {
        "id": "http://localhost:3004/credentials/status/0.0.5758797/0#0",
        "type": "StatusList2021Entry",
        "statusListIndex": "0",
        "statusPurpose": "revocation",
        "statusListCredential": "http://localhost:3004/credentials/status/0.0.5758797/0"
      },
      "proof": {
        "type": "Ed25519Signature2018",
        "created": "2023-10-28T10:29:59Z",
        "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..CuZBYm7U8m25Neld_lzTycTN8_MKSMOnMjtm2cFIWQIgJaz-LX-OWH9hqE0VkG1D_roi2yEFyaL8AiHD6L0PDw"
      }
    }
  }'
```

Which results in a `400`:

```json
{
  "message": "Invalid Input!"
}
```

And if we retrieve and test the revocation list:

```sh
curl -X 'GET' \
  'http://localhost:3004/credentials/status/0.0.5758797/0' \
  -H 'accept: application/json'
```

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/vc/status-list/2021/v1"
  ],
  "id": "http://localhost:3004/credentials/status/0.0.5758797/0",
  "type": [
    "VerifiableCredential",
    "StatusList2021Credential"
  ],
  "issuer": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
  "issuanceDate": "2023-10-28T10:45:28.538Z",
  "credentialSubject": {
    "id": "http://localhost:3004/credentials/status/0.0.5758797/0#list",
    "type": "StatusList2021",
    "statusPurpose": "revocation",
    "encodedList": "H4sIAAAAAAAAA-3BIQEAAAACIKc73RcmoAEAAAAAAAAAAAAAAPgbjSrD2NQwAAA"
  },
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-10-28T10:45:28Z",
    "verificationMethod": "did:hedera:testnet:zDGAu46WcY3W3g3WpivM1SHniCUWSfT16F48v6bk9rGuR_0.0.5758795",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..8wztP3DGyK9_AM_9-EeTObilN5UpBbycTmGtzMhrFxKonqi1xw7LcJMjBwteNaq3C43KIpXxKXinppuqtIwIAg"
  }
}
```

```js
import * as sl from "@digitalbazaar/vc-status-list";

const decoded = await sl.decodeList({
  encodedList: "H4sIAAAAAAAAA-3BIQEAAAACIKc73RcmoAEAAAAAAAAAAAAAAPgbjSrD2NQwAAA"
});

// return true, which means revoked
console.log(decoded.getStatus(0));
```

Now we've seen how to issue a credential with a status and how to verify and revoke it.

Last, we'll take a look at how to [issue and verify presentations](./03-issue-verify-VP.md).