"use strict";
import { uuid } from "uuidv4";

const start = (
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
) => {
  const dataStore = createDataStore(notificationsDatabaseDockerConfig);
  const twitchAdapter = createTwitchAdapter(twitchHub, hubCallback);
  const subscriptionsWaitingForTwitchApproval = new Map();

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

  app.get("/get-subscription/:subID", (request, response) => {
    const subscriptionID = request.params.subID;

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

  app.get("/get-events/:subID", (request, response) => {
    const subscriptionID = request.params.subID;

    subscriber
      .getAllEvents(dataStore, subscriptionID)
      .then((results) => {
        return response.status(200).json({ events: results });
      })
      .catch(() => {
        return response
          .status(500)
          .send("There was an error with your request.");
      });
  });

  // TODO: Overall, abstract this logic into another, separate method/module. This code needs unit tests.
  app.post("/subscribe", (request, response) => {
    const subId = uuid();
    response.status(200).json({ message: "Received.", subscriptionID: subId });
    // TODO: Instead, extract required info from request object. Pass that info instead.
    const subscription = createSubscriptionFromRequest(subId, request);
    subscriptionsWaitingForTwitchApproval.set(subId, subscription);
    subscriber.requestSubscription(twitchAdapter, subscription);
  });

  app.get("/unsubscribe/:subID", (request, response) => {
    subscriber
      .removeSubscription(dataStore, request.params.subID)
      .then(() => {
        return response.status(200).json({
          message: "Unsubscribed.",
          subscriptionID: request.params.subID,
        });
      })
      .catch(() => {
        return response
          .status(500)
          .send("There was an error with your request.");
      });
  });

  app.get("/events/:subID", (request, response) => {
    subscriber
      .getCurrentEventsFor(request.params.subID)
      .then((results) => {
        return response.status(200).json(results);
      })
      .catch(() => {
        return response
          .status(500)
          .send("There was an error with your request.");
      });
  });

  app.get("/approval/:subID", (request, response) => {
    const approvedSubscriptionID = request.params.subID;

    if (request.query["hub.challenge"]) {
      response.set("Content-Type", "text/html");
      response.status(200).send(request.query["hub.challenge"]);
    }

    saveApprovedSubscription(
      subscriber,
      dataStore,
      subscriptionsWaitingForTwitchApproval,
      approvedSubscriptionID
    );
  });

  // TODO: Possibly find better name than "approval".
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  app.post("/approval/:subID", (request, response) => {
    response.set("Content-Type", "text/html");
    response.status(200).send("Ok");

    const subID = request.params.subID;
    const eventID = uuid();
    const eventData = request.body.data; // Note, this is important. Twitch uses this shape.

    subscriber.saveEvent(dataStore, subID, eventID, eventData);
  });

  return app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
};

module.exports = { start };
