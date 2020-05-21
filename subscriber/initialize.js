import express from "express";
import subscriber from "./subscriber";
import {
  hubCallback,
  notificationsDatabaseDockerConfig,
} from "./authentications";
import { createDataStore } from "./adapters/data-store";
import { createTwitchAdapter } from "./adapters/twitch";
import { hubUrl as twitchHub } from "./authentications";
import {
  createSubscriptionFromRequest,
  saveApprovedSubscription,
} from "./subscriber-utils";
import { start as createServer } from "./subscriber-server";

const app = express();
app.use(express.json());
const port = 3000;

const activeAppServer = createServer(
  port,
  app,
  subscriber,
  hubCallback,
  notificationsDatabaseDockerConfig,
  createDataStore,
  createTwitchAdapter,
  twitchHub,
  createSubscriptionFromRequest,
  saveApprovedSubscription
);
