// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const { AccountBalanceQuery } = require("@hashgraph/sdk");
import { Controller, Get, Route } from "tsoa";

import hederaClient from "../lib/hedera";

@Route("hedera")
export class HederaController extends Controller {
  @Get("balance")
  public getBalance() {
    return new AccountBalanceQuery().setAccountId(process.env.HEDERA_ACCOUNT_ID!).execute(hederaClient);
  }
}
