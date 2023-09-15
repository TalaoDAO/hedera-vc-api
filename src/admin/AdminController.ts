import { Body, Controller, Get, Path, Post, Route, ValidateError } from "tsoa";

import { initIdentityNetworkFromAddressBook } from "../services/hedera";
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

  /**
   *
   * @param addressBookFileId
   * @example 0.0.1907569
   * @returns
   */
  @Get("view/{addressBookFileId}")
  public async loadIdentityNetwork(@Path() addressBookFileId: string) {
    try {
      const didNetwork = await initIdentityNetworkFromAddressBook(addressBookFileId);

      return didNetwork.getAddressBook();
    } catch (err) {
      return new ValidateError(
        {
          addressBookFileId: {
            value: addressBookFileId,
            message: "Invalid Address Book File Id"
          }
        },
        "Invalid Address Book File Id"
      );
    }
  }

  @Get("status")
  public getVerboseStatus() {
    return getApplicationStatus();
  }
}
