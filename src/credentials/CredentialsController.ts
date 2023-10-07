import { Body, Controller, Post, Route } from "tsoa";

import { Credential, SignedVerifiableCredential, verifyCredential, issueCredential } from "../services/credential";
import { APPLICATION_STATUS, getApplicationStatus } from "../admin/admin";
import { ClientError } from "../lib/errors";

interface CredentialIssueOptions {
  created?: string;
  challenge?: string;
  domain?: string;
  credentialStatus?: {
    type: string;
  };
}

interface CredentialIssueParams {
  credential: Credential;
  options?: CredentialIssueOptions;
}

interface CredentialVerifyOptions {
  challenge?: string;
  domain?: string;
}

interface CredentialVerifyParams {
  verifiableCredential: SignedVerifiableCredential;
  options?: CredentialVerifyOptions;
}

@Route("credentials")
export class CredentialsController extends Controller {
  @Post("issue")
  public async issueCredential(@Body() { credential }: CredentialIssueParams) {
    const status = await getApplicationStatus();

    if (status.status !== APPLICATION_STATUS.OK) {
      throw new ClientError("Application isn't initialized as an Issuer");
    } else {
      return {
        verifiableCredential: await issueCredential(credential)
      };
    }
  }

  @Post("verify")
  public verifyCredential(@Body() { verifiableCredential }: CredentialVerifyParams) {
    return verifyCredential(verifiableCredential);
  }
}
