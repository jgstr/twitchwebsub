import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
import {
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  dockerComposeDown,
  createEvents,
  eventsInclude,
  saveAllEvents,
} from "../utils/test-utils";
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";

describe("Data Store", function () {
  this.timeout(13000);

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
    const expectedEvent = createEvents(1)[0];
    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveEvent(
        expectedEvent.subscription_id,
        expectedEvent.id,
        expectedEvent.data
      )
      .then(() => dataStore.getAllEvents(expectedEvent.subscription_id))
      .then((events) => {
        eventsInclude(events, expectedEvent.id, done);
      });
  });

  // DOING
  it("should return a list of current events.", function () {
    let dataStore;
    const expectedEvents = createEvents(6);
    const subscriptionID = expectedEvents[0].subscription_id;
    saveAllEvents(dataStore, expectedEvents)
      .then(() => dataStore.getCurrentEvents(subscriptionID))
      .then((events) => {
        // Note: this is a temporary/naive test. A better test is one that confirms last-in-first-out.
        expect(events.length).to.equal(5);
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

  after(function (done) {
    dockerComposeDown(done);
  });
});
