import { Body, Controller, Get, Path, Post, Route, Security, SuccessResponse } from "tsoa";

import {
  Credential,
  SignedVerifiableCredential,
  verifyCredential,
  issueCredential,
  CredentialStatus
} from "../services/credential";
import { APPLICATION_STATUS, getApplicationStatus } from "../admin/admin";
import { ClientError, NotFoundError } from "../lib/errors";
import { getEnvVar } from "../services/envVars";
import {
  createStatusList,
  decodeStatusList,
  encodeStatusList,
  hfsGetStatusList,
  hfsUpdateStatusList,
  issueStatusListCredential
} from "../services/statusList";
import { STATUS_LIST_LENGTH } from "../services/constants";

interface CredentialIssueOptions {
  created?: string;
  challenge?: string;
  domain?: string;
  credentialStatus?: CredentialStatus;
}

interface CredentialIssueParams {
  credential: Credential;
  options?: CredentialIssueOptions;
}

interface CredentialVerifyOptions {
  challenge?: string;
  domain?: string;
  credentialStatus?: {
    type: "StatusList2021Entry";
  };
}

interface CredentialVerifyParams {
  verifiableCredential: SignedVerifiableCredential;
  options?: CredentialVerifyOptions;
}

interface UpdateCredentialStatusParams {
  credentialId: string;
  credentialStatus: {
    type: "revocation";
    status: "true";
  }[];
}

@Route("credentials")
export class CredentialsController extends Controller {
  @Post("issue")
  @Security("api_key")
  @SuccessResponse("201", "Issued")
  public async issueCredential(
    @Body() { credential, options }: CredentialIssueParams
  ): Promise<SignedVerifiableCredential> {
    const status = await getApplicationStatus();

    if (status.status !== APPLICATION_STATUS.OK) {
      throw new ClientError("Application isn't initialized as an Issuer");
    } else {
      let credentialWithStatus;

      if (options?.credentialStatus) {
        credentialWithStatus = {
          ...credential,
          credentialStatus: options.credentialStatus
        };
      } else {
        credentialWithStatus = credential;
      }

      this.setStatus(201);

      let issuedCredential;

      try {
        issuedCredential = await issueCredential(credentialWithStatus);
      } catch (e) {
        throw new ClientError("Unable to issue credential");
      }

      return issuedCredential;
    }
  }

  @Post("verify")
  @Security("api_key")
  public verifyCredential(@Body() { verifiableCredential }: CredentialVerifyParams) {
    return verifyCredential(verifiableCredential);
  }

  @Get("status/{statusListFileId}/{statusListId}")
  public async getStatusList(@Path() statusListFileId: string, @Path() statusListId: number) {
    const issuerServerName = getEnvVar("ISSUER_SERVER_URL");

    if (!issuerServerName) {
      throw new Error(`Unable to issue Status List credential, ISSUER_SERVER_URL isn't set.`);
    }

    let statusList;

    try {
      statusList = await hfsGetStatusList(statusListFileId);
    } catch (e) {
      throw new NotFoundError(`Unable to load file id ${statusListFileId}`);
    }

    // If the status list doesn't exist yet, it's not an issue
    // it only exists when a credential in the list is first revoked
    // so we still return a VC with a status list, it'll just be empty
    if (!statusList[statusListId]) {
      statusList[statusListId] = await encodeStatusList(await createStatusList());
    }

    return issueStatusListCredential({
      "@context": ["https://www.w3.org/2018/credentials/v1", "https://w3id.org/vc/status-list/2021/v1"],
      id: `${issuerServerName}/credentials/status/${statusListFileId}/${statusListId}`,
      type: ["VerifiableCredential", "StatusList2021Credential"],
      issuer: getEnvVar("HEDERA_DID")!,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `${issuerServerName}/credentials/status/${statusListFileId}/${statusListId}#list`,
        type: "StatusList2021",
        statusPurpose: "revocation",
        encodedList: statusList[statusListId]
      }
    });
  }

  @Post("status/{statusListFileId}/{statusListId}")
  @Security("api_key")
  public async setStatusList(
    @Path() statusListFileId: string,
    @Path() statusListId: number,
    @Body() { credentialId, credentialStatus }: UpdateCredentialStatusParams
  ) {
    let statusList;

    try {
      statusList = await hfsGetStatusList(statusListFileId);
    } catch (e) {
      throw new NotFoundError(`Unable to load file id ${statusListFileId}`);
    }

    const id = Number(credentialId);

    if (id >= STATUS_LIST_LENGTH) {
      throw new ClientError(`credential Id ${id} out of bounds, should be between 0 and ${STATUS_LIST_LENGTH - 1}`);
    }

    if (!statusList[statusListId]) {
      statusList[statusListId] = await encodeStatusList(await createStatusList());
    }

    const revokedStatus = credentialStatus.find(({ type }) => type === "revocation");

    if (revokedStatus && revokedStatus.status === "true") {
      const decodedStatusList = await decodeStatusList(statusList[statusListId]);
      decodedStatusList.setStatus(id, true);
      statusList[statusListId] = await encodeStatusList(decodedStatusList);
      await hfsUpdateStatusList(statusListFileId, statusList);
    }
  }
}
