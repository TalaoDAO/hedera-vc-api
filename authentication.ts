import * as express from "express";
import { AuthenticationError } from "./src/lib/errors";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[]
): Promise<{}> {
  if (securityName === "api_key") {
    const token= request.headers.access_token;

    if (token === process.env.API_KEY) {
      return Promise.resolve({});
    }
  }

  return Promise.reject(new AuthenticationError("Unauthorized"));
}