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

  it("should remove one subscription from the database.", function (done) {
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
      .then(() => appUser.removeSubscription(subscriptionID))
      .then(() => appUser.getSubscription(subscriptionID))
      .then((results) => expect(results.length).to.equal(0));
  });

  /* Unsure whether to include this as a feature.
  
  it("should return a list of live streams.", function (done) {
    appUser.getLiveStreams().then((results) => {
      expect(results).to.equal(liveStreamsStub);
    });
  }); // See get-twitch... helper for code.
*/

  // after(function (done) {
  //   fakeTwitch.stop(twitchAPI);
  //   dockerComposeDown(done);
  // });
});
