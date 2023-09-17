import { Controller, Get, Route } from "tsoa";
import { getDidDocument } from "../services/did";
import { getIdentityNetwork, operatorKey } from "../services/hedera";

// no existing type describes this properly
interface PublicKey {
  id: string;
  type: string;
  publicKeyBase58: string;
}

interface AppDidDocument {
  "@context": string;
  id: string;
  publicKey: PublicKey[];
  authentication: string[];
}

@Route("did")
export class DidController extends Controller {
  @Get("")
  public getDidDocument(): AppDidDocument {
    const didDocument = getDidDocument(getIdentityNetwork()!, operatorKey);

    return JSON.parse(didDocument.toJSON());
  }
}
