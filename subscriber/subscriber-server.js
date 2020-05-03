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

app.get("/get-events*", (request, response) => {
  const subscriptionID = request.url.slice(12);

  // Debugging
  console.log("* /get-events* subID: ", subscriptionID);

  dataStore
    .getAllEvents(subscriptionID)
    .then((results) => {
      // Debugging
      console.log("* From /get-events* results: ", results);
      return response.status(200).json({ events: results });
    })
    .catch((error) => {
      return response.status(500).send(error);
    });
});

app.post("/subscribe", (request, response) => {
  const subId = uuid();
  response.status(200).json({ message: "Received.", subscriptionID: subId });

  // Debugging
  console.log("* From sub-server, subID created and returned: ", subId);

  const subscription = {
    id: subId,
    topic: request.query.topic,
    toID: request.query.to_id ? request.query.to_id : "",
    fromID: request.query.from_id ? request.query.from_id : "",
    userID: request.query.user_id ? request.query.user_id : "",
    clientID: request.headers["client-id"],
  };

  subscriptionsWaitingForTwitchApproval.push(subscription);

  // Debugging
  console.log(
    "* From sub-server /subscribe. Pending subs: ",
    subscriptionsWaitingForTwitchApproval
  );

  subscriber.requestSubscription(twitchAdapter, subscription);
});

app.get("/approval*", (request, response) => {
  const requestSubscriptionId = request.path.slice(10);
  // Debugging
  console.log(
    "* From /approval. Sub from approval url: ",
    requestSubscriptionId
  );

  if (request.query["hub.challenge"]) {
    response.set("Content-Type", "text/html");
    response.status(200).send(request.query["hub.challenge"]);
  }

  for (const subscription of subscriptionsWaitingForTwitchApproval) {
    if (subscription.id === requestSubscriptionId) {
      // Debugging
      console.log("* From /approval. Sub matched: ", subscription.id);
      // TODO: Needs subscriber method instead.
      dataStore.saveSubscription(subscription);
    }
  }
});

// TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
app.post("/approval*", (request, response) => {
  response.set("Content-Type", "text/html");
  response.status(200).send("Ok");

  const subID = request.url.slice(10);
  const eventData = request.body[0];
  const eventID = uuid();

  // TODO: Needs subscriber method instead.
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
