import { expect } from "chai";
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const twitch = require("../subscriber/adapters/twitch");
import subscriber from "../subscriber/subscriber";
import { subscriptionStub } from "../subscriber/doubles/subscriptions";

let twitchApp;

describe("Twitch", function (done) {
  before(function (done) {
    twitchApp = fakeTwitch.start();
    setTimeout(done, 1000);
  });

  const twitchAdapter = twitch.createTwitchAdapter(
    "http://localhost:3001/hub",
    "/approval"
  );

  it("should send a subscription request.", function (done) {
    const subscriptionStubWithLocalhost = subscriptionStub;
    subscriptionStubWithLocalhost.hubUrl = "http://localhost:3001/hub";

    subscriber
      .requestSubscription(twitchAdapter, subscriptionStubWithLocalhost)
      .then((response) => {
        expect(response).to.equal("Received.");
        done();
      });
    // Note: Fake-twitch tries to call subscriber-server/approval, which is not running.
    // You will notice an error print out reading as such.
  });

  after(function () {
    fakeTwitch.stop(twitchApp);
  });
});
