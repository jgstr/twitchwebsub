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

  const subscriptionStub = {
    id: subscriptionID,
  };
  return response.status(200).json({ subscription: subscriptionStub });

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
  // response.status(200).send("Received.");
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
      // dataStore.saveSubscription(subscriptionRecordStub); // Original used for testing.
      // TODO: saveSubscription will now need to change the subscription object received...
      // to match database needs (or some other utility in anothe layer will).
      dataStore.saveSubscription(subscription);
    }
  }
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
