import { Controller, Get, Post, Route, Security } from "tsoa";

import { getApplicationStatus, initApplication } from "./admin";

@Route("admin")
@Security("api_key")
export class AdminController extends Controller {
  @Post("init")
  public async createIdentityNetwork() {
    const { didDocument, statusListFileId } = await initApplication();

    console.log(`DID Document published ${didDocument.getIdentifier()}`);
    console.log(`Status List Created ${statusListFileId}`);

    return {
      didDocument: String(didDocument.getIdentifier()),
      statusListFileId: String(statusListFileId)
    };
  }

  @Get("status")
  public getVerboseStatus() {
    return getApplicationStatus();
  }
}
