import { Controller, Delete, Get, Path, Route, ValidateError } from "tsoa";

import { initIdentityNetworkFromAddressBook, deleteIdentityNetworkFromFileId } from "../services/hedera";

@Route("addressbook")
export class AddressbookController extends Controller {
  /**
   *
   * @param addressBookFileId
   * @example 0.0.1907569
   * @returns
   */
  @Get("{addressBookFileId}")
  public async loadIdentityNetwork(@Path() addressBookFileId: string) {
    try {
      const didNetwork = await initIdentityNetworkFromAddressBook(addressBookFileId);

      return didNetwork.getAddressBook();
    } catch (err) {
      console.error(err);
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

  @Delete("{addressBookFileId}")
  public async deleteIdentityNetwork(@Path() addressBookFileId: string) {
    try {
      const receipt = await deleteIdentityNetworkFromFileId(addressBookFileId);

      return receipt.status;
    } catch (err) {
      console.error(err);
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
}
