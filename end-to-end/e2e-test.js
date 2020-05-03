"use strict";
const testUtils = require("../utils/test-utils");
import { expect } from "chai";
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const subscriber = require("../utils/subscriber-driver");
import { subscriptionRequestByUserStub } from "./doubles/subscriptions";

let twitchApp;

describe("Twitch Websub Subscriber", function () {
  this.timeout(17000);

  before(function (done) {
    twitchApp = fakeTwitch.start();
    testUtils.dockerComposeUp();
    subscriber.isRunning().then(done);
  });

  // Walking skeleton
  it("should return one subscription.", function (done) {
    let subscriptionID;

    subscriber
      .getAllSubscriptions()
      .then((response) => {
        expect(response.data.list.length).to.equal(0);
      })
      .then(() => subscriber.requestSubscription(subscriptionRequestByUserStub))
      .then((response) => {
        expect(response.data.message).to.equal("Received.");
        subscriptionID = response.data.subscriptionID;
      })
      .then(() =>
        testUtils.pollForSubscription(
          subscriber.getSubscription,
          subscriptionID
        )
      )
      .then((response) => {
        expect(response.id).to.equal(subscriptionID);
        done();
      });
  });

  it("should receive return at least one event.", function (done) {
    let subscriptionID;
    const eventDataStub = [
      {
        from_id: "1336",
        from_name: "userNameFrom",
        to_id: "1337",
        to_name: "userNameTo",
        followed_at: "2017-08-22T22:55:24Z",
      },
    ];

    subscriber
      .requestSubscription(subscriptionRequestByUserStub)
      .then((response) => {
        expect(response.data.message).to.equal("Received.");
        subscriptionID = response.data.subscriptionID;
      })
      .then(() => subscriber.getAllEvents(subscriptionID))
      .then((results) => {
        expect(results.data.events).to.deep.equal({});
      })
      .then(() => fakeTwitch.sendEvent(subscriptionID, eventDataStub))
      .then(() => new Promise((resolve) => setTimeout(resolve, 1500))) // Debugging. Needs a poll.
      .then(() => subscriber.getAllEvents(subscriptionID))
      .then((results) => {
        // Debugging
        console.log("* results.data.events: ", results.data.events);
        expect(results.data.events).to.include.deep.members([eventDataStub[0]]);
        done();
      });
  });

  /*
  it('should remove one subscription from the database.', function (done) {
    const subscription = "12345";
    let originalSubscriptionLength;

    subscriber.requestSubscription()
      .then((response) => { expect(response.status).to.equal(200); })
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(subscriber.getAllSubscriptions)
      .then((response) => {
        originalSubscriptionLength = response.data.list.length;
        expect(originalSubscriptionLength).to.be.at.least(1);
      })
      .then(subscriber.removeSubscription(subscription))
      .then(subscriber.getAllSubscriptions)
      .then((subscriptions) => {
        expect(subscriptions.data.list.length).to.equal(originalSubscriptionLength - 1);
        done();
      })

  });
*/
  // after(function (done) {
  //   fakeTwitch.stop(twitchApp);
  //   testUtils.dockerComposeDown(done);
  // });
});
