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

app.post("/hub", (request, response) => {
  // Note: request.headers[...] is case sensitive.
  if (!request.headers["client-id"]) {
    return response.status(400).json({
      status: "error",
      error: "Missing Client-ID",
    });
  }
  if (request.headers["content-type"] !== "application/json") {
    return response.status(400).json({
      status: "error",
      error: "Incorrect Content-Type",
    });
  }
  if (!request.body["hub.callback"]) {
    return response.status(400).json({
      status: "error",
      error: "Missing hub.callback",
    });
  }
  if (request.body["hub.mode"] !== "subscribe") {
    return response.status(400).json({
      status: "error",
      error: "Incorrect hub.mode",
    });
  }
  if (!request.body["hub.topic"]) {
    return response.status(400).json({
      status: "error",
      error: "Missing hub.topic",
    });
  }
  if (!request.body["hub.lease_seconds"]) {
    return response.status(400).json({
      status: "error",
      error: "Missing hub.lease_seconds",
    });
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
  const eventDataStub = event;

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
