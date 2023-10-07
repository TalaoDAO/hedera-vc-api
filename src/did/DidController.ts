import { Controller, Get, Route } from "tsoa";
import { loadDidDocument } from "../services/did";
import { getEnvVar } from "../services/envVars";

@Route("did")
export class DidController extends Controller {
  @Get("")
  public getDidDocument() {
    return loadDidDocument(getEnvVar("HEDERA_DID")!);
  }
}
