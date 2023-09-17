import { Body, Controller, Get, Post, Route } from "tsoa";

import { getApplicationStatus, initApplication } from "./admin";

/**
 * @example {
 *  appnetName: "My Appnet Name",
 *  appnetDidServers: [
 *    "https://appnet.did.server.com/v1/api"
 * ]
 * }
 */
interface AppnetCreationParams {
  appnetName: string;
  appnetDidServers: string[];
}

@Route("admin")
export class AdminController extends Controller {
  @Post("init")
  public async createIdentityNetwork(@Body() { appnetName, appnetDidServers }: AppnetCreationParams) {
    const didNetwork = await initApplication({
      appnetName,
      appnetDidServers
    });

    const addressBook = didNetwork.getAddressBook();

    return String(addressBook.getFileId());
  }

  @Get("status")
  public getVerboseStatus() {
    return getApplicationStatus();
  }
}
