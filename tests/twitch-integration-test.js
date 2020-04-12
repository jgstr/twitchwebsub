import { expect } from "chai";
const twitch = require("../subscriber/adapters/twitch");
const subscriber = require("../subscriber/subscriber");
import { subscriptionRecordStub } from "../subscriber/doubles/subscriptions";

describe("Twitch", function () {
  const twitchAdapter = twitch.createTwitchAdapter();

  it("should send a subscription request.", function () {
    subscriber
      .requestSubscription(twitchAdapter, subscriptionRecordStub)
      .then((response) => {
        expect(response).to.equal("Received");
      });
  });
});
