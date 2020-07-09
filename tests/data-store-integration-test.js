import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
import {
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  dockerComposeDown,
  createEvents,
  eventsInclude,
  expectOrderOfSavedEventsToMatchRetrievedEvents,
  saveAllEvents,
} from "../utils/test-utils";
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";

describe("Data Store", function () {
  this.timeout(30000);

  before(function (done) {
    dockerComposeUpDatabase();
    checkDatabaseIsRunning().then(() => done());
  });

  it("should return a list of subscriptions.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);

    dataStore
      .saveSubscription(expectedValue)
      .then(() => {
        return dataStore.getAllSubscriptions();
      })
      .then((subscriptions) => {
        for (const sub of subscriptions) {
          if (sub.id === expectedValue.id) {
            expect(sub.id).to.equal(expectedValue.id);
            done();
          }
        }
      });
  });

  it("should return one subscription.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveSubscription(expectedValue)
      .then(() => dataStore.getSubscription(expectedValue.id))
      .then((subscription) => {
        expect(subscription.id).to.equal(expectedValue.id);
        done();
      });
  });

  it("should return a list of events.", function (done) {
    let dataStore;
    const subID = uuid();
    const expectedEvent = createEvents(1, subID)[0];
    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveEvent(
        expectedEvent.subscription_id,
        expectedEvent.id,
        expectedEvent.data
      )
      .then(() => dataStore.getAllEvents(expectedEvent.subscription_id))
      .then((events) => {
        eventsInclude(events, expectedEvent.id, done); // replace with chai.expect.include
        expect(events);
      });
  });

  it("should return a list of current events.", function (done) {
    let dataStore = createDataStore(notificationsDatabaseLocalConfig);
    const subscriptionID = uuid();
    const expectedEvents = createEvents(6, subscriptionID);
    saveAllEvents(dataStore, expectedEvents)
      .then(() => dataStore.getLatestEvents(subscriptionID))
      .then((events) => {
        expectOrderOfSavedEventsToMatchRetrievedEvents(
          events,
          expectedEvents,
          done
        );
      });
  });

  // Note: This does NOT remove all events related to a subscription.
  it("should remove a subscription.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveSubscription(expectedValue)
      .then(() => dataStore.getSubscription(expectedValue.id))
      .then((subscription) =>
        expect(subscription.id).to.equal(expectedValue.id)
      )
      .then(() => dataStore.removeSubscription(expectedValue.id))
      .then((results) => {
        expect(results).to.equal("Removed.");
        done();
      });
  });

  // after(function (done) {
  //   dockerComposeDown(done);
  // });
});
