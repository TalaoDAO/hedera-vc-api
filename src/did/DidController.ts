import { Controller, Get, Route } from "tsoa";
import { loadDidDocument } from "../services/did";
import { getEnvVar } from "../services/envVars";
import { DidDocument } from "@hashgraph/did-sdk-js";

@Route("did")
export class DidController extends Controller {
  @Get("")
  public getDidDocument(): Promise<DidDocument> {
    return loadDidDocument(getEnvVar("HEDERA_DID")!);
  }
}
