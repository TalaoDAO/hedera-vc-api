import { Controller, Get, Route } from "tsoa";
import { getDidDocument } from "../services/did";

@Route("did")
export class DidController extends Controller {
  @Get("")
  public getDidDocument() {
    const didDocument = getDidDocument();

    return didDocument.resolve();
  }
}
