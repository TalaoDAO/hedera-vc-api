import { Controller, Post, Route, Body } from "tsoa";
import {
  Presentation,
  SignedPresentation,
  createPresentation,
  signPresentation,
  verifyPresentation
} from "../services/presentation";

interface ProvePresentationParams {
  presentation: Presentation;
  options: {
    challenge: string;
  };
}

interface VerifyPresentationParams {
  verifiablePresentation: SignedPresentation;
  options: {
    challenge: string;
  };
}

@Route("presentations")
export class PresentationsController extends Controller {
  @Post("prove")
  public async provePresentation(
    @Body() { presentation: { id, holder, verifiableCredential }, options: { challenge } }: ProvePresentationParams
  ) {
    const newPresentation = await createPresentation({
      verifiableCredential,
      id,
      holder
    });

    return signPresentation({
      presentation: newPresentation,
      challenge
    });
  }

  @Post("verify")
  public async verifyPresentation(
    @Body() { verifiablePresentation, options: { challenge } }: VerifyPresentationParams
  ) {
    return verifyPresentation(verifiablePresentation, challenge);
  }
}
