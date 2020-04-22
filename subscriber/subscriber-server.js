"use strict";
const express = require("express");
import {
  hubCallback,
  notificationsDatabaseDockerConfig,
} from "./authentications";
const subscriber = require("./subscriber");
import { createDataStore } from "./adapters/data-store";
import { createTwitchAdapter } from "./adapters/twitch";
import { hubUrl as twitchHub } from "./authentications";
import { uuid } from "uuidv4";

const port = 3000;
const app = express();
app.use(express.json());

const dataStore = createDataStore(notificationsDatabaseDockerConfig);
const twitchAdapter = createTwitchAdapter(twitchHub, hubCallback);

// TODO: Delete and replace with pending-subscription queue.
const subscriptionRecordStub = {
  id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
  hub_topic: "https://twitch.com",
  lease_start: "2020-03-21 01:01:01",
};

app.get("/", (request, response) => {
  response.status(200).send("Welcome to a Twitch Websub Service.");
});

app.get("/status", (request, response) => {
  dataStore
    .checkStatus()
    .then(() => {
      return response.status(200).send("Running.");
    })
    .catch(() => {
      return response.status(500).send("Not running.");
    });
});

app.get("/get-subscription-*", (request, response) => {
  const subscriptionId = request.url.substring(18);
  return response.status(200).json({ subscription: subscriptionRecordStub });

  // subscriber
  //   .getSubscription(dataStore, subscriptionId)
  //   .then((results) => {
  //     return response.status(200).json({ subscription: results });
  //   })
  //   .catch((error) => {
  //     return response.status(400).send(error);
  //   });
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

app.get("/get-events", (request, response) => {
  // TODO: Create subscriber unit test.
  dataStore
    .getAllEvents()
    .then((results) => {
      return response.status(200).json({ list: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });
});

app.post("/subscribe", (request, response) => {
  const subId = uuid();
  response.status(200).send("Received.");

  const subscription = {
    id: subId,
    topic: request.query.topic,
    toID: request.query.to_id ? request.query.to_id : "",
    fromID: request.query.from_id ? request.query.from_id : "",
    userID: request.query.user_id ? request.query.user_id : "",
    clientID: request.headers["client-id"],
  };

  subscriber.requestSubscription(twitchAdapter, subscription);
});

app.get("/approval*", (request, response) => {
  if (request.query["hub.challenge"]) {
    response.set("Content-Type", "text/html");
    response.status(200).send(request.query["hub.challenge"]);
  }

  dataStore.saveSubscription(subscriptionRecordStub);
});

app.post("/approval*", (request, response) => {
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  response.set("Content-Type", "text/html");
  response.status(200).send("Ok");

  dataStore.saveEvent({ data: { id: 1234, user_id: 4321 } });
});

const start = () => {
  return app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
};

app.listen(port);
console.log(`Running on port: ${port}`);

module.exports = { start };
