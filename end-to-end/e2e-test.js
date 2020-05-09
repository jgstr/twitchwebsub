"use strict";
const {
  dockerComposeUp,
  dockerComposeDown,
  pollForSubscription,
  expectZeroSubscriptions,
  expectRequestConfirmation,
  getSubscriptionID,
  expectIDsToMatch,
  expectZeroEvents,
  expectEventsToMatch,
  subscriptionRequestByUserStub,
  eventDataStub,
} = require("../utils/test-utils");
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const appUser = require("../utils/subscriber-driver");
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
      .then((results) => expectZeroSubscriptions(results))
      .then(() => appUser.requestSubscription(subscriptionRequestByUserStub))
      .then((results) => {
        expectRequestConfirmation(results);
        subscriptionID = getSubscriptionID(results);
      })
      .then(() => pollForSubscription(appUser.getSubscription, subscriptionID))
      .then((results) => {
        expectIDsToMatch(results, subscriptionID);
        done();
      });
  });

  it("should receive return at least one event.", function (done) {
    let subscriptionID;

    appUser
      .requestSubscription(subscriptionRequestByUserStub)
      .then((results) => {
        expectRequestConfirmation(results);
        subscriptionID = getSubscriptionID(results);
      })
      .then(() => appUser.getAllEvents(subscriptionID))
      .then((results) => expectZeroEvents(results))
      .then(() => fakeTwitch.sendEvent(eventDataStub))
      .then(() => new Promise((resolve) => setTimeout(resolve, 1500))) // Debugging. Needs a poll.
      .then(() => appUser.getAllEvents(subscriptionID))
      .then((results) => expectEventsToMatch(results, eventDataStub, done));
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
  // after(function (done) {
  //   fakeTwitch.stop(twitchAPI);
  //   dockerComposeDown(done);
  // });
});
