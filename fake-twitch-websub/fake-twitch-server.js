"use strict";
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let subscriptions = [];
let hubCallbackFromRequest;

const start = () => {
  return app.listen(3001, () => {
    console.log("* Fake Twitch Listening on 3001.");
  });
};

const stop = (twitchApp) => {
  twitchApp.close();
};

const sendErrorResponseMessage = (error) => {
  return response.status(400).json({
    status: "error",
    error,
  });
};

app.post("/hub", (request, response) => {
  // Note: request.headers[...] is case sensitive.
  if (!request.headers["client-id"]) {
    return sendErrorResponseMessage("Missing Client-ID");
  }
  if (request.headers["content-type"] !== "application/json") {
    return sendErrorResponseMessage("Incorrect Content-Type");
  }
  if (!request.headers["authorization"]) {
    return sendErrorResponseMessage("Missing OAuth Token");
  }
  if (!request.body["hub.callback"]) {
    return sendErrorResponseMessage("Missing hub.callback");
  }
  if (request.body["hub.mode"] !== "subscribe") {
    return sendErrorResponseMessage("Incorrect hub.mode");
  }
  if (!request.body["hub.topic"]) {
    return sendErrorResponseMessage("Missing hub.topic");
  }
  if (!request.body["hub.lease_seconds"]) {
    return sendErrorResponseMessage("Missing hub.lease_seconds");
  }

  hubCallbackFromRequest = request.body["hub.callback"];
  sendApprovalRequest(hubCallbackFromRequest);

  return response.status(202).send("Subscription Request Received.");
});

const sendApprovalRequest = (hubCallback) => {
  axios({
    method: "GET",
    url:
      hubCallback + "?hub.challenge=97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd",
  })
    .then((response) => {
      if (
        response.status === 200 &&
        response.data === "97jbdwcHVzb_rv7McRfpIHuMMY8UhvUXDYhA1Egd"
      ) {
        subscriptions.push(hubCallback);
      }
    })
    .catch(() => {
      console.error(
        "* Fake twitch called /approval, but received error or no response."
      );
    });
};

const sendEvent = (event) => {
  const eventDataStub = { data: event };
  console.log("* sendEvent hubcallback: ", hubCallbackFromRequest); // Debugging
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: hubCallbackFromRequest,
      headers: {
        "Content-Type": "application/json",
      },
      data: eventDataStub,
    })
      .then((response) => {
        if (response.status === 200) {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};

const has = (subscriptionID) => {
  if (subscriptions.length === 0) return false;

  subscriptions.forEach((sub) => {
    if (sub.includes(subscriptionID)) return true;
  });

  return false;
};

module.exports = {
  app,
  sendApprovalRequest,
  sendEvent,
  start,
  stop,
  subscriptions,
  has,
};
