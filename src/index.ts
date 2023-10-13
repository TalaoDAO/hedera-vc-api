import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response, json, urlencoded } from "express";
import { ValidateError } from "tsoa";
import helmet from "helmet";
import { AddressInfo } from "net";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../build/routes";

import { loadDidDocument } from "./services/did";
import { APPLICATION_STATUS, getApplicationStatus } from "./admin/admin";
import { getEnvVar, hasEnvVar } from "./services/envVars";
import { ClientError, NotFoundError } from "./lib/errors";

const app = express();

/**
 * Security
 */
app.use(helmet());

/**
 * OpenAPI specifications
 */
const swaggerOptions = {
  swaggerOptions: {
    url: "/docs/swagger.json"
  }
};

app.get("/docs/swagger.json", async (_req, res) =>
  res.json((await import("../build/swagger.json", { assert: { type: "json" } })).default)
);
app.use("/docs", swaggerUi.serveFiles(undefined, swaggerOptions), swaggerUi.setup(undefined, swaggerOptions));

/**
 * Routes and application format
 */
app.use(
  urlencoded({
    extended: true
  })
);
app.use(json());

app.get("/", function (_req, res) {
  res.send("Welcome to Hedera VC API!");
});

async function initApp() {
  if (hasEnvVar("HEDERA_DID")) {
    await loadDidDocument(getEnvVar("HEDERA_DID")!);
  }

  const applicationStatus = await getApplicationStatus();

  if (applicationStatus.status === APPLICATION_STATUS.INITIALIZING) {
    console.warn(
      `Warning: application is running in INITIALIZING mode. Please initialize it and restart after setting the HEDERA_DID and STATUS_LIST_FILE_ID environment variables`
    );
  }

  if (applicationStatus.status === APPLICATION_STATUS.ERROR) {
    console.error(`Error: HEDERA_DID is invalid. Current value is '${getEnvVar("HEDERA_DID")}'`);
  }

  RegisterRoutes(app);

  /**
   * Error handling
   */
  app.use(function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
    if (err instanceof NotFoundError) {
      console.warn(`Resource not found ${err.message}`);
      return res.status(404).json({
        message: err.message
      });
    }

    if (err instanceof ClientError) {
      console.warn(`Invalid input!`, err.message);
      return res.status(400).json({
        message: err.message
      });
    }

    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields
      });
    }
    if (err instanceof Error) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }

    next();
  });
}

initApp();

/**
 * Server init
 */
const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
