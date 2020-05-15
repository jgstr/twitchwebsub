// TODO: Question for N: does this server need to be more like a "class" or wrapped in a function?
// Should it use dependencies rather than imports?
"use strict";
const express = require("express");
import { uuid } from "uuidv4";
const subscriber = require("./subscriber");
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
const dataStore = createDataStore(notificationsDatabaseDockerConfig);
const twitchAdapter = createTwitchAdapter(twitchHub, hubCallback);
const subscriptionsWaitingForTwitchApproval = new Map();
const app = express();
app.use(express.json());

const start = (port) => {
  return app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
};

app.get("/", (request, response) => {
  response.status(200).send("Welcome to a Twitch Websub Service.");
});

app.get("/status", (request, response) => {
  subscriber
    .status(dataStore)
    .then(() => {
      return response.status(200).send("Running.");
    })
    .catch(() => {
      return response.status(500).send("Not running.");
    });
});

app.get("/get-subscription-*", (request, response) => {
  const subscriptionID = request.url.slice(18);

  subscriber
    .getSubscription(dataStore, subscriptionID)
    .then((results) => {
      return response.status(200).json({ subscription: results });
    })
    .catch((error) => {
      return response.status(400).send(error);
    });
});

app.get("/get-subscriptions", (request, response) => {
  subscriber
    .getAllSubscriptions(dataStore)
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });
});

app.get("/get-events*", (request, response) => {
  const subscriptionID = request.url.slice(12);

  subscriber
    .getAllEvents(dataStore, subscriptionID)
    .then((results) => {
      return response.status(200).json({ events: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });
});

app.post("/subscribe", (request, response) => {
  const subId = uuid();
  response.status(200).json({ message: "Received.", subscriptionID: subId });
  const subscription = createSubscriptionFromRequest(subId, request);
  subscriptionsWaitingForTwitchApproval.set(subId, subscription);
  subscriber.requestSubscription(twitchAdapter, subscription);
});

app.get("/unsubscribe/:subID", (request, response) => {
  // Stub response.
  response
    .status(200)
    .json({ message: "Unsubscribed.", subscriptionID: request.params.subID });
});

app.get("/approval*", (request, response) => {
  const approvedSubscriptionID = request.path.slice(10);

  if (request.query["hub.challenge"]) {
    response.set("Content-Type", "text/html");
    response.status(200).send(request.query["hub.challenge"]);
  }

  // TODO: check this abstraction with Nimrod.
  saveApprovedSubscription(
    subscriber,
    dataStore,
    subscriptionsWaitingForTwitchApproval,
    approvedSubscriptionID
  );
});

// TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
app.post("/approval*", (request, response) => {
  response.set("Content-Type", "text/html");
  response.status(200).send("Ok");

  const subID = request.url.slice(10);
  const eventID = uuid();
  const eventData = request.body.data; // Note, this is important. Twitch uses this shape.

  subscriber.saveEvent(dataStore, subID, eventID, eventData);
});

module.exports = { start };
