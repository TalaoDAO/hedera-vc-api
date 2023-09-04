import * as dotenv from "dotenv";
dotenv.config();

import express, { json, urlencoded } from "express";
import { AddressInfo } from "net";

import { RegisterRoutes } from "../build/routes";

const app = express();

app.use(
  urlencoded({
    extended: true
  })
);
app.use(json());

app.get("/", function (req, res) {
  res.send("Welcome to Solide Network!");
});

RegisterRoutes(app);

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(`App listening on port ${(server.address() as AddressInfo)?.port}`);
});
