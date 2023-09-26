import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response, json, urlencoded } from "express";
import { ValidateError } from "tsoa";
import helmet from "helmet";
import { AddressInfo } from "net";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../build/routes";

import { loadIdentityNetwork } from "./services/hedera";
import { APPLICATION_STATUS, getApplicationStatus } from "./admin/admin";
import { getEnvVar } from "./services/envVars";

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
  await loadIdentityNetwork();

  const applicationStatus = getApplicationStatus();

  if (applicationStatus.status === APPLICATION_STATUS.INITIALIZING) {
    console.warn(
      `Warning: application is running in INITIALIZING mode. Please initialize it and restart after setting the HEDERA_ADDRESS_BOOK_FILEID environment variable`
    );
  }

  if (applicationStatus.status === APPLICATION_STATUS.ERROR) {
    console.error(
      `Error: HEDERA_ADDRESS_BOOK_FILEID is invalid. Current value is '${getEnvVar("HEDERA_ADDRESS_BOOK_FILEID")}'`
    );
  }

  RegisterRoutes(app);
}

initApp();

/**
 * Error handling
 */
app.use(function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
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

/**
 * Server init
 */
const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
