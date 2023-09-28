import { Controller, Get, Post, Route } from "tsoa";

import { getApplicationStatus, initApplication } from "./admin";

@Route("admin")
export class AdminController extends Controller {
  @Post("init")
  public async createIdentityNetwork() {
    const didDocument = await initApplication();

    console.log(`DID Document published ${didDocument.getIdentifier()}`);

    return String(didDocument.getIdentifier());
  }

  @Get("status")
  public getVerboseStatus() {
    return getApplicationStatus();
  }
}
