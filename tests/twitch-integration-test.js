import { expect } from "chai";
const twitch = require("../subscriber/adapters/twitch");
const subscriber = require("../subscriber/subscriber");
import { subscriptionStub } from "../subscriber/doubles/subscriptions";

describe("Twitch", function () {
  const twitchAdapter = twitch.createTwitchAdapter();

  // TODO: this test might need nock or to run fake-twitch to respond to the twitch adapter axios request.

  it("should send a subscription request.", function () {
    subscriber
      .requestSubscription(twitchAdapter, subscriptionStub)
      .then((response) => {
        expect(response).to.equal("Received");
      });
  });
});
