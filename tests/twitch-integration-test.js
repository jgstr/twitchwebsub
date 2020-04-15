import { expect } from "chai";
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const twitch = require("../subscriber/adapters/twitch");
const subscriber = require("../subscriber/subscriber");
import { subscriptionStub } from "../subscriber/doubles/subscriptions";

let twitchApp;

describe("Twitch", function (done) {
  before(function (done) {
    twitchApp = fakeTwitch.start();
    setTimeout(done, 1000);
  });

  const twitchAdapter = twitch.createTwitchAdapter();

  it("should send a subscription request.", function (done) {
    const subscriptionStubWithLocalhost = subscriptionStub;
    subscriptionStubWithLocalhost.hubUrl = "http://localhost:3001/hub-stub";

    subscriber
      .requestSubscription(twitchAdapter, subscriptionStubWithLocalhost)
      .then((response) => {
        expect(response).to.equal("Received.");
        done();
      });
  });

  after(function () {
    fakeTwitch.stop(twitchApp);
  });
});
