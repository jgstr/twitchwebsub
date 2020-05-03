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

const dataStore = createDataStore(notificationsDatabaseDockerConfig);
const twitchAdapter = createTwitchAdapter(twitchHub, hubCallback);
const subscriptionsWaitingForTwitchApproval = [];

const port = 3000;
const app = express();
app.use(express.json());

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
  const subscriptionID = request.url.substring(18);

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

app.get("/get-events-*", (request, response) => {
  return response.status(200).json({ events: {} }); // Stub response.
  // dataStore
  //   .getAllEvents()
  //   .then((results) => {
  //     return response.status(200).json({ events: results });
  //   })
  //   .catch((error) => {
  //     return response.status(500).send(error);
  //   });
});

app.post("/subscribe", (request, response) => {
  const subId = uuid();
  response.status(200).json({ message: "Received.", subscriptionID: subId });

  const subscription = {
    id: subId,
    topic: request.query.topic,
    toID: request.query.to_id ? request.query.to_id : "",
    fromID: request.query.from_id ? request.query.from_id : "",
    userID: request.query.user_id ? request.query.user_id : "",
    clientID: request.headers["client-id"],
  };

  subscriptionsWaitingForTwitchApproval.push(subscription);
  subscriber.requestSubscription(twitchAdapter, subscription);
});

app.get("/approval*", (request, response) => {
  const requestSubscriptionId = request.path.slice(10);

  if (request.query["hub.challenge"]) {
    response.set("Content-Type", "text/html");
    response.status(200).send(request.query["hub.challenge"]);
  }

  for (const subscription of subscriptionsWaitingForTwitchApproval) {
    if (subscription.id === requestSubscriptionId) {
      dataStore.saveSubscription(subscription);
    }
  }
});

// TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
app.post("/approval*", (request, response) => {
  // TODO: Get sub ID from the path URL. Send proper data to saveEvent. Check data-store is formatting and
  // saving event properly.
  response.set("Content-Type", "text/html");
  response.status(200).send("Ok");

  const subID = request.url.slice(10);
  const eventData = request.body;
  const eventID = uuid();

  // Debugging
  console.log("* from post /app subID: ", subID, "\neventData: ", eventData);
  dataStore.saveEvent(subID, eventID, eventData);
});

const start = () => {
  return app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
};

app.listen(port);
console.log(`Running on port: ${port}`);

module.exports = { start };
