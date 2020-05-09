"use strict";
const {
  dockerComposeUp,
  dockerComposeDown,
  pollForSubscription,
} = require("../utils/test-utils");

import { expect } from "chai";
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const appUser = require("../utils/subscriber-driver");
import { subscriptionRequestByUserStub } from "./doubles/subscriptions";

let twitchAPI;

describe("Twitch Websub appUser", function () {
  this.timeout(17000);

  before(function (done) {
    twitchAPI = fakeTwitch.start();
    dockerComposeUp();
    appUser.checkServerIsRunning().then(done);
  });

  // Walking skeleton
  it("should return one subscription.", function (done) {
    let subscriptionID;

    appUser
      .getAllSubscriptions()
      // .then((results) => {
      //   expectZeroSubscriptions(results);
      // })
      .then((response) => {
        expect(response.data.list.length).to.equal(0);
      })
      .then(() => appUser.requestSubscription(subscriptionRequestByUserStub))
      .then((response) => {
        expect(response.data.message).to.equal("Received.");
        subscriptionID = response.data.subscriptionID;
      })
      .then(() => pollForSubscription(appUser.getSubscription, subscriptionID))
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

    appUser
      .requestSubscription(subscriptionRequestByUserStub)
      .then((response) => {
        expect(response.data.message).to.equal("Received.");
        subscriptionID = response.data.subscriptionID;
      })
      .then(() => appUser.getAllEvents(subscriptionID))
      .then((results) => {
        expect(results.data.events.length).to.equal(0);
      })
      .then(() => fakeTwitch.sendEvent(eventDataStub))
      .then(() => new Promise((resolve) => setTimeout(resolve, 1500))) // Debugging. Needs a poll.
      .then(() => appUser.getAllEvents(subscriptionID))
      .then((results) => {
        for (const event of results.data.events) {
          if (event.data === JSON.stringify(eventDataStub)) {
            expect(event.data).to.equal(JSON.stringify(eventDataStub));
            done();
          }
        }
      });
  });

  /*
  it('should remove one subscription from the database.', function (done) {
    const subscription = "12345";
    let originalSubscriptionLength;

    appUser.requestSubscription()
      .then((response) => { expect(response.status).to.equal(200); })
      .then(() => { return fakeTwitch.sendApprovalRequest(hubCallback); })
      .then(appUser.getAllSubscriptions)
      .then((response) => {
        originalSubscriptionLength = response.data.list.length;
        expect(originalSubscriptionLength).to.be.at.least(1);
      })
      .then(appUser.removeSubscription(subscription))
      .then(appUser.getAllSubscriptions)
      .then((subscriptions) => {
        expect(subscriptions.data.list.length).to.equal(originalSubscriptionLength - 1);
        done();
      })

  });
*/
  after(function (done) {
    fakeTwitch.stop(twitchAPI);
    dockerComposeDown(done);
  });
});
