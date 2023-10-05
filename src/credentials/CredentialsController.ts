import { Body, Controller, Post, Route } from "tsoa";

import { Credential, SignedVerifiableCredential, verifyCredential } from "../services/credential";

interface CredentialIssueOptions {
  created: string;
  challenge: string;
  domain: string;
  credentialStatus: {
    type: string;
  };
}

interface CredentialIssueParams {
  credential: Credential;
  options: CredentialIssueOptions;
}

interface CredentialVerifyOptions {
  challenge?: string;
  domain?: string;
}

interface CredentialVerifyParams {
  verifiableCredential: SignedVerifiableCredential;
  options: CredentialVerifyOptions;
}

@Route("credentials")
export class CredentialsController extends Controller {
  @Post("issue")
  public async issueCredential(@Body() { credential }: CredentialIssueParams) {
    credential;
  }

  @Post("verify")
  public verifyCredential(@Body() { verifiableCredential }: CredentialVerifyParams) {
    return verifyCredential(verifiableCredential);
  }
}
