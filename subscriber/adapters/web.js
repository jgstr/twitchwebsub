import express from "express";
import { uuid } from "uuidv4";

export const createWeb = (
  subscriptionsWaitingForTwitchApproval,
  subscriberManager
) => {
  const app = express();
  app.use(express.json());
  const port = 3000;

  app.get("/", (request, response) => {
    response.status(200).send("Welcome to a Twitch Websub Service.");
  });

  app.get("/status", (request, response) => {
    subscriberManager
      .status()
      .then(() => {
        return response.status(200).send("Running.");
      })
      .catch(() => {
        return response.status(500).send("Not running.");
      });
  });

  app.get("/get-subscription/:subID", (request, response) => {
    const subscriptionID = request.params.subID;

    subscriberManager
      .getSubscription(subscriptionID)
      .then((results) => {
        return response.status(200).json({ subscription: results });
      })
      .catch((error) => {
        return response.status(400).send(error);
      });
  });

  app.get("/get-subscriptions", (request, response) => {
    subscriberManager
      .getAllSubscriptions()
      .then((results) => {
        return response.status(200).json({ list: results });
      })
      .catch((error) => {
        return response.status(500).send(error);
      });
  });

  app.get("/get-events/:subID", (request, response) => {
    const subscriptionID = request.params.subID;

    subscriberManager
      .getAllEvents(subscriptionID)
      .then((results) => {
        return response.status(200).json({ events: results });
      })
      .catch(() => {
        return response
          .status(500)
          .send("There was an error with your request.");
      });
  });

  const createSubscriptionFromRequest = (subscriptionID, request) => {
    return {
      id: subscriptionID,
      topic: request.query.topic,
      toID: request.query.to_id ? request.query.to_id : "",
      fromID: request.query.from_id ? request.query.from_id : "",
      userID: request.query.user_id ? request.query.user_id : "",
      clientID: request.headers["client-id"],
      authorization: request.headers["authorization"],
    };
  };

  app.post("/subscribe", (request, response) => {
    const subId = uuid();
    response.status(200).json({ message: "Received.", subscriptionID: subId });
    // TODO: Instead, extract required info from request object. Pass that info instead.
    const subscription = createSubscriptionFromRequest(subId, request);
    subscriptionsWaitingForTwitchApproval.set(subId, subscription);
    subscriberManager.requestSubscription(subscription);
  });

  app.get("/unsubscribe/:subID", (request, response) => {
    subscriberManager
      .removeSubscription(request.params.subID)
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
    subscriberManager
      .getLatestEvents(request.params.subID)
      .then((results) => {
        return response.status(200).json({ events: results });
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

    subscriberManager.saveApprovedSubscription(
      subscriptionsWaitingForTwitchApproval,
      approvedSubscriptionID
    );
  });

  // TODO: Possibly find better name than "approval".
  // TODO: Must use and check for a secret in next iteration to ensure this request is genuine!
  app.post("/approval/:subID", (request, response) => {
    response.set("Content-Type", "text/html");
    response.status(200).send("Ok");

    // This should go in the subscriber manager.
    const subID = request.params.subID;
    // TODO: MUST VALIDATE THIS --> try joi library.
    // const eventID = uuid();
    const eventData = request.body.data; // Note, this is important. Twitch uses this shape.

    subscriberManager.saveEvent(subID, eventData);
    // subscriberManager.saveEvent(subID, eventID, eventData);
  });

  const server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });

  return {
    stop: server.stop,
  };
};
