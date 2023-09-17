import { Controller, Get, Route } from "tsoa";
import { getDidDocument } from "../services/did";
import { getIdentityNetwork, operatorKey } from "../services/hedera";

@Route("did")
export class DidController extends Controller {
  @Get("")
  public async getDidDocument() {
    const didDocument = getDidDocument(getIdentityNetwork()!, operatorKey);

    return didDocument.toJSON();
  }
}
