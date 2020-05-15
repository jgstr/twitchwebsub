import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
const testUtils = require("../utils/test-utils");
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";

describe("Data Store", function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase();
    testUtils.checkDatabaseIsRunning().then(() => done());
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
    const eventUuid = uuid();
    const eventSubscriptionId = uuid();
    const eventData = { id: 1234, user_id: 4321 };

    const expectedEvent = {
      id: eventUuid,
      subscription_id: eventSubscriptionId,
      data: JSON.stringify(eventData),
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveEvent(eventSubscriptionId, eventUuid, eventData)
      .then(() => dataStore.getAllEvents(eventSubscriptionId))
      .then((events) => {
        expect(events).to.include.deep.members([expectedEvent]);
        done();
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
    testUtils.dockerComposeDown(done);
  });
});
