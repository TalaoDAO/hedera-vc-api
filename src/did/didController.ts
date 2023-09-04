import { Controller, Get, Path, Route } from "tsoa";
import { getDidById } from "./didService";

@Route("did")
export class AccountsController extends Controller {
  @Get("{didId}")
  public getDid(@Path() didId: string) {
    return getDidById(didId);
  }
}
