# Issue and Verify Verifiable Presentation

We first looked at how to issue and verify credentials for a holder to keep.
The last step is for a holder to present the VC to a verifier.

To issue/prove a Presentation, we'll use the `POST /presentations/prove` api.

Our presentation looks like this:

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "id": "prezid:123",
  "type": ["VerifiablePresentation"],
  "holder": "holderid:1243",
  "verifiableCredential": [
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
      "type": ["VerifiableCredential", "DemoPass"],
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
  ]
}
```

We can identify the presentation's id `prezid:123`, as well as the holder's identifier `holderid:1243`.

The holder will wrap a number of Verifiable Credentials in a `verifiableCredential` array (they've already been issued and have a proof section) in the Presentation and sign it. The complete payload is wrapped in an object with a `presentation` property and a challenge in an `options` property.

```sh
curl -X 'POST' \
  'http://localhost:3004/presentations/prove' \
  -H 'accept: application/json' \
  -H 'x-api-key: testKey' \
  -H 'Content-Type: application/json' \
  -d '{
    "presentation": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "id": "prezid:123",
    "type": [
      "VerifiablePresentation"
    ],
    "holder": "holderid:1243",
    "verifiableCredential": [
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
    ]
  },
  "options": {
    "challenge": "challenge-123"
  }
}'
```

Notice the `challenge` option which could be any string passed by the verifier to verify that the presentation was issued for them specifically and not reused.

This should return a `201` with a signed VP:

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiablePresentation"],
  "verifiableCredential": [
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
      "type": ["VerifiableCredential", "DemoPass"],
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
  ],
  "id": "prezid:123",
  "holder": "holderid:1243",
  "proof": {
    "type": "Ed25519Signature2018",
    "created": "2023-12-18T07:58:11Z",
    "verificationMethod": "did:hedera:testnet:zBGujTvDepajDJfndETnYKRNn5xDx4py6t3xNbdbLpKDd_0.0.5787376",
    "proofPurpose": "authentication",
    "challenge": "challenge-123",
    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..iy7fpp3Rqh1aVdslsafvqIFgh3wcPAw7e32_RirFlU8TuzA4AcwUUDe3SQYaP1awBh5kEtRd0ETMzp1Gpzj_CQ"
  }
}
```

And we'll verify it now:

```sh
curl -X 'POST' \
  'http://localhost:3004/presentations/verify' \
  -H 'accept: application/json' \
  -H 'x-api-key: testKey' \
  -H 'Content-Type: application/json' \
  -d '{
    "verifiablePresentation": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      "type": [
        "VerifiablePresentation"
      ],
      "verifiableCredential": [
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
      ],
      "id": "prezid:123",
      "holder": "holderid:1243",
      "proof": {
        "type": "Ed25519Signature2018",
        "created": "2023-12-18T07:58:11Z",
        "verificationMethod": "did:hedera:testnet:zBGujTvDepajDJfndETnYKRNn5xDx4py6t3xNbdbLpKDd_0.0.5787376",
        "proofPurpose": "authentication",
        "challenge": "challenge-123",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..iy7fpp3Rqh1aVdslsafvqIFgh3wcPAw7e32_RirFlU8TuzA4AcwUUDe3SQYaP1awBh5kEtRd0ETMzp1Gpzj_CQ"
      }
    },
      "options": {
        "challenge": "challenge-123"
      }
    }'
```

Which should result in a `200`:

```json
{
  "checks": ["proof"],
  "warnings": [],
  "errors": []
}
```

We now know how to issue and verify Presentations!
