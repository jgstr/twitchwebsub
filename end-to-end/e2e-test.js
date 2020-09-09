"use strict";
import {
  dockerComposeUp,
  dockerComposeDown,
  pollForSubscription,
  expectZeroSubscriptions,
  expectMessageToMatch,
  expectNo,
  getSubscriptionID,
  expectIDsToMatch,
  expectZeroEvents,
  expectEventsToMatch,
  expectEventToMatchAtLeastOne,
  subscriptionRequestByUserStub,
  eventDataStub,
  eventsDataStubs,
} from "../utils/test-utils";
const fakeTwitch = require("../fake-twitch-websub/fake-twitch-server");
const appUser = require("./subscriber-driver");
let twitchAPI;

describe("Twitch Websub appUser", function () {
  this.timeout(30000);

  before(function (done) {
    twitchAPI = fakeTwitch.start();
    dockerComposeUp();
    appUser.checkServerIsRunning().then(done);
  });

  // This is also the Walking Skeleton test for the entire application.
  it("should return one subscription.", function (done) {
    let subscriptionID;

    appUser
      .getAllSubscriptions()
      .then((results) => expectZeroSubscriptions(results))
      .then(() => appUser.requestSubscription(subscriptionRequestByUserStub))
      .then((results) => {
        expectMessageToMatch(results, "Received.");
        subscriptionID = getSubscriptionID(results);
      })
      .then(() => pollForSubscription(appUser.getSubscription, subscriptionID))
      .then((results) => {
        expectIDsToMatch(results, subscriptionID);
        done();
      });
  });

  // TODO: Move to subscriber-tests.
  it("should receive return at least one event.", function (done) {
    let subscriptionID;

    appUser
      .requestSubscription(subscriptionRequestByUserStub)
      .then((results) => {
        expectMessageToMatch(results, "Received.");
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
      .requestSubscription(subscriptionRequestByUserStub)
      .then((results) => {
        expectMessageToMatch(results, "Received.");
        subscriptionID = getSubscriptionID(results);
      })
      .then(() => pollForSubscription(appUser.getSubscription, subscriptionID))
      .then(() => appUser.removeSubscription(subscriptionID))
      .then((results) => expectMessageToMatch(results, "Unsubscribed."))
      .then(() => appUser.getSubscription(subscriptionID))
      .then((results) => {
        expectNo(results);
        done();
      });
  });

  it("should return a list of the incoming events.", function (done) {
    let subscriptionID;
    let expectedEvents = [eventsDataStubs[0], eventsDataStubs[1]];

    appUser
      .requestSubscription(subscriptionRequestByUserStub)
      .then((results) => {
        expectMessageToMatch(results, "Received.");
        subscriptionID = getSubscriptionID(results);
      })
      .then(() => fakeTwitch.sendEvent(eventsDataStubs[0]))
      .then(() => fakeTwitch.sendEvent(eventsDataStubs[1]))
      .then(() => new Promise((resolve) => setTimeout(resolve, 1000))) // Debugging. Needs a poll.
      .then(() => appUser.getLatestEvents(subscriptionID))
      .then((results) =>
        expectEventToMatchAtLeastOne(results, expectedEvents, done)
      );
  });

  // TODO: The system should handle duplicate events gracefully.

  // TODO: subscription lease should be set to 600 seconds and be renewed before it expires.
  //       This will be a unit test. You will mock time.

  // TODO: basic logging and metrics.
  it("should report a getAllSubscriptions request.", function (done) {
    appUser.getAllSubscriptions().then(() => {
      checkThatSubscriberReportedEvent(); // But how? The logging will be in the subscriber container console.
      done();
    });
  });

  // after(function (done) {
  //   fakeTwitch.stop(twitchAPI);
  //   dockerComposeDown(done);
  // });
});
